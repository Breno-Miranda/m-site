// core-spa.js - Mini SPA Framework
class CoreSPA {
  constructor(options = {}) {
    this.components = new Map();
    this.loadedHtmlComponents = new Set();
    this.skeleton = null;
    this._currentPath = null;
    this.rootSelector = options.rootSelector || '#root';
    this.skeletonType = options.skeletonType || 'card';
    this.skeletonCount = options.skeletonCount || 3;
    this.init();
  }

  // Registra um componente JS
  registerComponent(name, component) {
    this.components.set(name, component);
  }

  // Inicializa todos os [data-component] dentro do container
  initializeComponents(container) {
    const elements = container.querySelectorAll('[data-component]');
    elements.forEach(async el => {
      const name = el.getAttribute('data-component');
      if (name !== 'skeleton' && !this.loadedHtmlComponents.has(name)) {
        try {
          const res = await fetch(`src/components/${name}.html`);
          if (res.ok) {
            el.innerHTML = await res.text();
            this.loadedHtmlComponents.add(name);
            return;
          }
        } catch {}
      }
      const Comp = this.components.get(name);
      if (Comp) {
        const instance = new Comp();
        if (typeof instance.render === 'function') instance.render(el);
      }
    });
  }

  // Carrega página SPA em root
  async loadPage(path) {
    const root = document.querySelector(this.rootSelector);
    if (!root) return;
    this.showSkeleton(root);
    const isRoot = (path === '/' || path === '');
    const clean = isRoot ? 'home' : path.replace(/^\/+/,'').replace(/\.html$/,'');
    const res = await fetch(`src/pages/${clean}.html`);
    if (!res.ok) {
      root.innerHTML = '<div class="error">Página não encontrada</div>';
      return;
    }
    root.innerHTML = await res.text();
    this.initializeComponents(root);
    if (!isRoot) {
      window.history.pushState({}, '', `/${clean}`);
    }
  }

  // SPA: Navegação e roteamento
  initRouter() {
    window.addEventListener('popstate', () => this.handleRoute(window.location.pathname));
    document.addEventListener('click', e => {
      const link = e.target.closest('a');
      if (link && link.href.startsWith(window.location.origin) && !link.hasAttribute('target')) {
        e.preventDefault();
        this.navigate(link.pathname);
      }
    });
    this.handleRoute(window.location.pathname);
  }

  handleRoute(path) {
    if (this._currentPath === path) return;
    this._currentPath = path;
    this.loadPage(path);
  }

  navigate(path) {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      this.handleRoute(path);
    }
  }

  // Skeleton universal
  showSkeleton(element, type = this.skeletonType, count = this.skeletonCount) {
    if (!this.skeleton) this.skeleton = new Skeleton();
    this.skeleton.setState({ type, count });
    element.innerHTML = this.skeleton.template;
  }

  // Inicialização principal
  init() {
    this.initRouter();
    this.initializeComponents(document.body);
  }
}

// Exporta como UMD/ESM/global
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = CoreSPA;
} else {
  window.CoreSPA = CoreSPA;
} 