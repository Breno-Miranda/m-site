/**
 * Lightweight content layer that keeps data in localStorage
 * and syncs with the MManage API.
 */
(function (window) {
  const STORAGE_KEY = "framework_cms_content_v2";

  const safeClone = (value) => JSON.parse(JSON.stringify(value ?? null));

  class CMSContentService {
    constructor() {
      this.listeners = new Map();
      this.content = this.loadFromStorage();
      this.apiUrl = (window.config && window.config.api && window.config.api.baseUrl)
        ? window.config.api.baseUrl
        : 'http://localhost:3000';

      // Auto-sync on init
      setTimeout(() => this.init(), 100);
    }

    async init() {
      try {
        if (!window.core || !window.core.fetchAPI) {
          // Fallback if core not loaded yet, though unlikely given script order
          const res = await fetch(`${this.apiUrl}/content/site_config`);
          const json = await res.json();
          if (json.success && json.data) {
            this.content = { ...this.content, ...json.data };
            this.persistLocal();
            this.notify('*');
          }
          return;
        }

        const response = await window.core.fetchAPI('/content/site_config');
        if (response && response.success && response.data) {
          this.content = { ...this.content, ...response.data };
          this.persistLocal();
          this.notify('*');
        }
      } catch (error) {
        console.warn("ContentService: Could not sync with API, using local data.", error);
      }
    }

    loadFromStorage() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (error) {
        console.warn("Não foi possível ler o conteúdo salvo:", error);
      }
      return safeClone(window.defaultCMSContent || {});
    }

    persistLocal() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.content));
      } catch (error) {
        console.warn("Não foi possível salvar o conteúdo:", error);
      }
    }

    getAll() {
      return safeClone(this.content);
    }

    getSection(section) {
      return safeClone(this.content?.[section]);
    }

    async updateSection(section, data) {
      this.content = {
        ...this.content,
        [section]: safeClone(data),
      };
      this.persistLocal();
      this.notify(section);

      // Sync to API
      try {
        const payload = { key: 'site_config', data: this.content };
        if (window.core && window.core.fetchAPI) {
          await window.core.fetchAPI('/content', {
            method: 'POST',
            body: JSON.stringify(payload)
          });
        } else {
          await fetch(`${this.apiUrl}/content`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
      } catch (e) {
        console.error("ContentService: Failed to save to API", e);
      }

      return this.getSection(section);
    }

    reset(section = null) {
      if (section) {
        if (!window.defaultCMSContent?.[section]) return;
        this.content[section] = safeClone(window.defaultCMSContent[section]);
        // Reset enabled state too if it was removed? 
        // defaultCMSContent doesn't have enabled flags usually, so they become undefined (effectively enabled if we check !== false)
        this.persistLocal();
        this.notify(section);
        return this.getSection(section);
      }

      this.content = safeClone(window.defaultCMSContent || {});
      this.persistLocal();
      this.notify("*");

      // Also reset on API
      this.updateSection('reset_all', this.content); // Hacky way to trigger save, or just call updateSection for one key
      // Better:
      const payload = { key: 'site_config', data: this.content };
      fetch(`${this.apiUrl}/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(e => console.error(e));

      return this.getAll();
    }

    subscribe(section, callback) {
      if (!this.listeners.has(section || "*")) {
        this.listeners.set(section || "*", new Set());
      }
      const listener = { section: section || "*", callback };
      this.listeners.get(listener.section).add(callback);

      return () => {
        this.listeners.get(listener.section)?.delete(callback);
      };
    }

    notify(section) {
      if (section !== "*") {
        this.listeners.get(section)?.forEach((cb) => cb(this.getSection(section)));
      }

      const fullPayload = this.getAll();
      this.listeners.get("*")?.forEach((cb) => cb(fullPayload));
    }
  }

  window.ContentService = new CMSContentService();
})(window);
