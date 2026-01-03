/**
 * Lightweight content layer that keeps data in localStorage
 * and exposes helper methods for the public site + CMS.
 */
(function (window) {
  const STORAGE_KEY = "framework_cms_content_v2";

  const safeClone = (value) => JSON.parse(JSON.stringify(value ?? null));

  class CMSContentService {
    constructor() {
      this.listeners = new Map();
      this.content = this.loadFromStorage();
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

    persist() {
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

    updateSection(section, data) {
      this.content = {
        ...this.content,
        [section]: safeClone(data),
      };
      this.persist();
      this.notify(section);
      return this.getSection(section);
    }

    reset(section = null) {
      if (section) {
        if (!window.defaultCMSContent?.[section]) return;
        this.content[section] = safeClone(window.defaultCMSContent[section]);
        this.persist();
        this.notify(section);
        return this.getSection(section);
      }

      this.content = safeClone(window.defaultCMSContent || {});
      this.persist();
      this.notify("*");
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
