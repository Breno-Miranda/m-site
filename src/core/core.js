// Core Framework Class
class Core {
  constructor() {
    // Componentes JS registrados
    this.components = new Map();
    // Componentes HTML já carregados via fetch
    this.loadedHtmlComponents = new Set();
    // Estado global
    this.state = {};
    // Parâmetros da URL
    this.params = [];
    // Skeleton universal
    this.skeleton = null;
    // Caminho atual
    this._currentPath = null;
    // Inicialização única
    this._globalComponentsLoaded = false;
    // Lista de páginas válidas
    this.registerPages = config.routes.validPages;
    // inicializa o core
    this.init();
  }

  // Registro de componentes JS
  registerComponent(name, component) {
    this.components.set(name, component);
  }

  getComponent(name) {
    return this.components.get(name);
  }

  // Inicialização principal
  async init() {
    this.initRouter();
    this.initializeComponents(document.body);
  }


  // Inicializa todos os [data-component]
  initializeComponents(container) {
    const elements = container.querySelectorAll('[data-component]');

    elements.forEach(async el => {
      const name = el.getAttribute('data-component');

      // Skip skeleton components
      if (name === 'skeleton') return;

      // Determine skeleton type based on component name
      const skeletonTypeMap = {
        'header': 'header',
        'footer': 'footer',
        'banner': 'hero',
        'cards': 'cards',
        'timeline': 'timeline',
        'contact': 'contact',
        'education': 'education'
      };

      const skeletonType = skeletonTypeMap[name] || 'card';

      // Show skeleton while loading (if Skeleton is available)
      if (typeof Skeleton !== 'undefined' && Skeleton.show) {
        Skeleton.show(el, skeletonType);
      }

      try {
        const res = await fetch(`/src/components/${name}.html`);
        if (res.ok) {
          const content = await res.text();

          // Use smooth transition if Skeleton is available
          if (typeof Skeleton !== 'undefined' && Skeleton.hide) {
            Skeleton.hide(el, content, () => {
              this.loadedHtmlComponents.add(name);
              // Execute any inline scripts
              this.executeScripts(el);
            });
          } else {
            el.innerHTML = content;
            this.loadedHtmlComponents.add(name);
            this.executeScripts(el);
          }
          return;
        }
      } catch (error) {
        console.warn(`Failed to load component: ${name}`, error);
      }

      // Fallback to JS component
      const Comp = this.getComponent(name);
      if (Comp) {
        const instance = new Comp();
        if (typeof instance.render === 'function') {
          if (typeof Skeleton !== 'undefined' && Skeleton.hide) {
            const tempDiv = document.createElement('div');
            instance.render(tempDiv);
            Skeleton.hide(el, tempDiv.innerHTML);
          } else {
            instance.render(el);
          }
        }
      }
    });
  }

  // Execute inline scripts in a container
  executeScripts(container) {
    const scripts = container.querySelectorAll('script');
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }


  // SPA: Carrega página em #root
  async loadPage() {
    const root = document.getElementById('root');
    if (!root) return;
    this.showSkeleton(root);

    // Get segments from pathname
    const segments = window.location.pathname.split('/');
    const pageName = segments[1] || 'home';
    this.params = segments.slice(2);

    console.log(`pageName`, pageName);
    console.log(`params`, this.params);

    // Armazena os parâmetros no estado global
    this.state = { ...this.state, params: this.params };

    // Dispara evento de mudança de parâmetros
    window.dispatchEvent(new CustomEvent('paramsChange', {
      detail: { params: this.params }
    }));

    try {
      // Verifica se o arquivo existe no path
      const filePath = `/src/pages/${pageName}.html`;

      console.log(`filePath`, filePath);

      if (!this.registerPages.includes(pageName)) {
        throw new Error('Page not found');
      }

      const res = await fetch(filePath);
      const html = await res.text();

      // Verifica se a resposta está vazia ou é inválida
      if (!html || html.trim() === '') {
        throw new Error('Page is empty');
      }

      // Check for recursion (SPA fallback returning index.html)
      if (html.includes('<!DOCTYPE html>') || html.includes('<html')) {
        console.error(`[Router] Error: ${filePath} returned full HTML document (likely soft 404).`);
        throw new Error('Page not found (soft 404)');
      }

      // Save reference to this for callback
      const self = this;

      // Function to load content and execute scripts
      const loadContent = () => {
        // Set the HTML content
        root.innerHTML = html;

        // Execute all scripts in the loaded content
        self.executeScripts(root);

        // Initialize any components inside the loaded content
        self.initializeComponents(root);

        // Force scroll to top of page when changing page views
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        });

        // Add fade-in animation
        root.classList.add('content-fade-in');
        setTimeout(() => {
          root.classList.remove('content-fade-in');
        }, 400);
      };

      // Use smooth transition with skeleton if available
      if (typeof Skeleton !== 'undefined' && Skeleton.hide) {
        // Check if skeleton wrapper exists
        const hasSkeletonWrapper = root.querySelector('.skeleton-wrapper');
        if (hasSkeletonWrapper) {
          hasSkeletonWrapper.classList.add('skeleton-fade-out');
          setTimeout(loadContent, 300);
        } else {
          loadContent();
        }
      } else {
        loadContent();
      }

      console.log(`Page loaded: ${pageName}`);

      // Atualiza a URL mantendo os parâmetros
      const paramsString = this.params.length > 0 ? `/${this.params.join('/')}` : '';
      const newPath = pageName === 'home' ? '/' : `/${pageName}${paramsString}`;
      window.history.replaceState({}, '', newPath);
    } catch (error) {
      // Redireciona para 404
      try {
        const errorRes = await fetch('/src/pages/404.html');
        if (errorRes.ok) {
          const errorHtml = await errorRes.text();
          if (errorHtml && errorHtml.trim() !== '') {
            root.innerHTML = errorHtml;
            // Atualiza a URL para 404
            window.history.replaceState({}, '', '/404');
            this.initializeComponents(root);
            return;
          }
        }
      } catch (error) {
        console.error('Erro ao carregar página 404:', error);
      }
      // Fallback se não conseguir carregar a página 404
      root.innerHTML = '<div class="error">Página não encontrada</div>';
    }
  }

  // SPA: Navegação e roteamento
  initRouter() {
    window.addEventListener('popstate', () => this.handleRoute(window.location.pathname));
    document.addEventListener('click', e => {
      const link = e.target.closest('a');
      if (link && link.href.startsWith(window.location.origin) && !link.hasAttribute('target')) {
        if (link.hash && link.pathname === window.location.pathname) {
          return; // allow default anchor scroll for same-page links
        }
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

  // Skeleton universal - Enhanced version
  showSkeleton(element, type = 'page', options = {}) {
    const { count = 1, animated = true } = options;

    // Use the static method if Skeleton is available
    if (typeof Skeleton !== 'undefined' && Skeleton.show) {
      return Skeleton.show(element, type, { count, animated });
    }

    // Fallback to instance method
    if (!this.skeleton) this.skeleton = new Skeleton({ type, count, animated });
    else this.skeleton.setState({ type, count, animated });

    this.skeleton.render(element);
    return this.skeleton;
  }

  // Hide skeleton with smooth transition
  hideSkeleton(element, newContent = '', callback) {
    if (typeof Skeleton !== 'undefined' && Skeleton.hide) {
      Skeleton.hide(element, newContent, callback);
    } else {
      element.innerHTML = newContent;
      if (callback) callback();
    }
  }

  // FetchAPI
  async fetchAPI(url, verb = 'GET', data = {}, customOptions = {}) {
    console.time('fetchAPI');
    try {
      // Verifica se a URL base está definida
      if (!config?.api?.baseUrl) {
        throw new Error('API base URL não está configurada');
      }

      // Verifica se há configuração de proxy
      const useProxy = config?.api?.useProxy || false;
      const proxyUrl = config?.api?.proxyUrl || '';

      // Constrói a URL base
      let baseUrl = config.api.baseUrl;

      // Se proxy estiver ativo, usa a URL do proxy
      if (useProxy && proxyUrl) {
        // Remove trailing slashes and clean the URL
        const cleanProxyUrl = proxyUrl.replace(/\/+$/, '');
        const cleanUrl = url.replace(/^\/+/, '');

        // Constrói a URL completa para o proxy
        const fullUrl = `${cleanProxyUrl}/api/${cleanUrl}`;
        console.log(`[API Request] ${verb} ${fullUrl}`, data);

        const options = {
          method: verb,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('msoft_auth_token') || config?.api?.token || '____STANDBY____'}`,
            'X-CSRF-TOKEN': localStorage.getItem('csrf_token') || '____STANDBY____'
          },
          mode: 'cors',
          credentials: 'include'
        };

        // Só adiciona o body se não for GET
        if (verb !== 'GET') {
          options.body = JSON.stringify(data);
        }

        const res = await fetch(fullUrl, options);

        // Verifica se a resposta está ok
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(`API Error: ${res.status} ${res.statusText} - ${JSON.stringify(errorData)}`);
        }

        const responseData = await res.json();
        console.log(`[API Response] ${verb} ${url}:`, responseData);
        console.timeEnd('fetchAPI');
        return responseData;
      }

      // Request Direto (Sem Proxy)
      const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
      const cleanUrl = url.replace(/^\/+/, '');
      const fullUrl = `${cleanBaseUrl}/${cleanUrl}`;

      console.log(`[API Request] ${verb} ${fullUrl}`, data);

      const options = {
        method: verb,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('msoft_auth_token') || config?.api?.token || '____STANDBY____'}`,
        },
        mode: 'cors',
        credentials: 'include'
      };

      // Só adiciona o body se não for GET
      if (verb !== 'GET') {
        options.body = JSON.stringify(data);
      }

      const res = await fetch(fullUrl, options);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        // Se for 404, retorna o erro do backend se existir
        if (errorData.error) {
          return errorData;
        }
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }

      const responseData = await res.json();
      console.log(`[API Response] ${verb} ${url}:`, responseData);
      console.timeEnd('fetchAPI');
      return responseData;
    } catch (error) {
      // Mensagens de erro mais específicas baseadas no tipo de erro
      let errorMessage = 'Erro ao acessar o servidor. Por favor, tente novamente mais tarde.';

      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
      } else if (error.message.includes('API base URL')) {
        errorMessage = 'Configuração da API está incompleta. Contate o suporte.';
      }

      if (!customOptions.silent) {
        // Notifica o usuário sobre o erro
        this.toast(errorMessage, 'error');

        // Log do erro para debugging
        console.error(`[API Error] ${verb} ${url}:`, {
          error: error.message,
          stack: error.stack,
          url: url,
          verb: verb
        });
      }

      // Propaga o erro para ser tratado pelo chamador
      throw error;
    }
  }

  // get data global  
  getData(key) {
    return window.document.getElementById(key).value;
  }

  // set data global 
  setData(key, value, isValue = null, isAfter = false) {
    if (isValue) {
      window.document.getElementById(key).value = value;
    } else {
      if (isAfter) {
        window.document.getElementById(key).insertAdjacentHTML('afterend', value);
      } else {
        window.document.getElementById(key).innerHTML = value;
      }
    }
  }

  // event listener
  eventListener(event, callback) {
    return window.document.addEventListener(event, callback).then(data => {
      console.log(`data`, data);
      return data;
    }).catch(error => {
      console.error(`error`, error);
      return error;
    });
  }

  // notifiction toast
  toast(message, type = 'success') {
    // Cria o container de toasts se não existir
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'position-fixed top-0 end-0 p-3';
      toastContainer.style.zIndex = '9999';
      document.body.appendChild(toastContainer);
    }

    // Define as cores e ícones baseados no tipo
    const toastConfig = {
      success: {
        icon: 'bi-check-circle-fill text-success',
        borderColor: 'border-success',
        bgStyle: 'background: rgba(20, 20, 25, 0.95); backdrop-filter: blur(10px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);'
      },
      error: {
        icon: 'bi-x-circle-fill text-danger',
        borderColor: 'border-danger',
        bgStyle: 'background: rgba(20, 20, 25, 0.95); backdrop-filter: blur(10px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);'
      },
      warning: {
        icon: 'bi-exclamation-triangle-fill text-warning',
        borderColor: 'border-warning',
        bgStyle: 'background: rgba(20, 20, 25, 0.95); backdrop-filter: blur(10px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);'
      },
      info: {
        icon: 'bi-info-circle-fill text-info',
        borderColor: 'border-info',
        bgStyle: 'background: rgba(20, 20, 25, 0.95); backdrop-filter: blur(10px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);'
      }
    };

    const config = toastConfig[type] || toastConfig.info;

    // Cria o toast
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white border-0 border-start border-4 ${config.borderColor} mb-3`;
    toast.style.cssText = config.bgStyle;

    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body d-flex align-items-center gap-3">
          <i class="bi ${config.icon} fs-4"></i>
          <div>${message}</div>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    // Adiciona o toast ao container
    toastContainer.appendChild(toast);

    // Inicializa o toast do Bootstrap
    const bsToast = new bootstrap.Toast(toast, {
      animation: true,
      autohide: true,
      delay: 5000
    });

    // Mostra o toast
    bsToast.show();

    // Remove o toast do DOM quando escondido
    toast.addEventListener('hidden.bs.toast', () => {
      toast.remove();
    });
  }
}
// Instancia global
window.core = new Core();
