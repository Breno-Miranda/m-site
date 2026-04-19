// Configurações do Framework
/**
 * API local: http://127.0.0.1:3000. O site não deve rodar na mesma porta (use 8082 etc.).
 * Override: window.__MSOFT_API_BASE__
 */
function resolveApiBaseUrl() {
  if (typeof window === 'undefined') return 'https://api.mirandasoft.com.br';
  const custom = window.__MSOFT_API_BASE__;
  if (typeof custom === 'string' && custom.trim()) {
    return custom.replace(/\/+$/, '');
  }
  const h = window.location.hostname;
  const isLocal = h === 'localhost' || h === '127.0.0.1';
  if (!isLocal) return 'https://api.mirandasoft.com.br';
  return 'http://127.0.0.1:3000';
}

const config = {
  app: {
    name: "Miranda Soft",
    version: "0.10.44",
    environment: "production",
    debug: false,
    token: "9f3c8b1a-2d7e-4a4d-91e3-c9f621f7dcb1"
  },
  api: {
    baseUrl: resolveApiBaseUrl(),
    fallbackUrl: "https://api.mirandasoft.com.br",
    timeout: 30000,
    retryAttempts: 3,
    useProxy: false,
    proxyUrl: "",
    token: "b2247aa5e3c3e54254c81a05cdc7dc44f3493ae0e24de14cffdd959c928696466056ff6cc07969dc8c0808b2eed328bc84c58a6a800bb6a9eb01f6422f3b9d40bb93a86bbf3867f762f3d6a7b567b7056c698d4c39c12af913b5bb53bafb79f5592c8e43d8b1565eeca078588539a0ffe118900d6b3e5b87b7bef214511186f7"
  },
  routes: {
    defaultPage: "home",
    page404: "404",
    validPages: [
      'home',
      'blog',
      'apps',
      'login',
      'premium',
      'admin',
      'blog-ads',
      'blog-review',
      'blogs',
      'blog-custom',
      'games',
      'about',
      'contact',
      'materials',
      'privacy',
      'terms',
      'lgpd',
      'cookies',
      '404',
      'healthtech-dashboard',
      'healthtech-patients',
      'healthtech-formulas',
      'marketplace',
      'expertise',
      'mcredential',
      'profile',
      'support',
    ]
  },
  components: {
    path: "/src/components",
    defaultSkeleton: true,
    skeletonDelay: 400
  },
  assets: {
    images: "/assets/images",
    css: "/assets/css",
    js: "/assets/js"
  },
  cdn: [
    "/src/assets/vendor/marked/marked.min.js",
    "/src/assets/vendor/bootstrap/js/bootstrap.bundle.min.js",
    "/src/assets/vendor/bootstrap/css/bootstrap.min.css",
    "/src/assets/vendor/swiper/swiper-bundle.min.js",
    "/src/assets/vendor/swiper/swiper-bundle.min.css",
    "/src/assets/vendor/jquery/jquery-3.7.1.min.js",
    "/src/assets/vendor/papaparse/papaparse.min.js",
    "/src/assets/vendor/animate/animate.min.css",
    "/src/assets/vendor/bootstrap-icons/font/bootstrap-icons.css"
  ],
  analytics: {
    enabled: false,
    trackingId: "UA-XXXXXXXXX-X"
  },
  cache: {
    enabled: true,
    duration: 3600
  },
  security: {
    cors: {
      enabled: true,
      allowedOrigins: ["*"]
    },
    headers: {
      "X-Frame-Options": "SAMEORIGIN",
      "X-Content-Type-Options": "nosniff"
    }
  },
  performance: {
    lazyLoad: true,
    preload: true,
    minify: false
  },
  theme: {
    primary: "#000000",
    secondary: "#6c757d",
    success: "#28a745",
    danger: "#dc3545",
    warning: "#ffc107",
    info: "#17a2b8"
  }
};

if (typeof window !== 'undefined') {
  window.config = config;
}
