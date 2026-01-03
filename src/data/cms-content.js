/**
 * Default content used by the CMS and public pages.
 * Acts as a seed for localStorage so the site keeps working offline.
 */
(function (window) {
  const defaultCMSContent = {
    hero: {
      eyebrow: "Framework Frontend",
      title: "SPAs em minutos",
      subtitle: "Vanilla JS • Zero build • 100% HTML",
      description:
        "Um micro framework pensado para landing pages, dashboards e MVPs que precisam nascer rápido sem abrir mão de organização e reuso.",
      primaryAction: {
        label: "Ver documentação",
        href: "https://github.com/your-repo/framework-frontend",
        icon: "bi-journal-code",
      },
      secondaryAction: {
        label: "Explorar CMS",
        href: "/cms",
        icon: "bi-sliders",
      },
      badgeIcon: "bi-braces-asterisk",
    },
    features: [
      {
        title: "Router nativo",
        description: "SPA com history API, 404 automático e parâmetros na URL.",
        href: "/#features-section",
        icon: "bi-signpost-split",
        theme: "primary",
        ctaLabel: "Ver detalhes",
      },
      {
        title: "Componentes HTML",
        description: "Use snippets ou classes JS para montar qualquer bloco reutilizável.",
        href: "/#features-section",
        icon: "bi-boxes",
        theme: "success",
        ctaLabel: "Exemplos",
      },
      {
        title: "CMS instantâneo",
        description: "Painel embutido em /cms com export/import JSON via localStorage.",
        href: "/cms",
        icon: "bi-sliders",
        theme: "info",
        ctaLabel: "Abrir CMS",
      },
      {
        title: "API Ready",
        description: "Fetch helper com proxy, tokens e toasts prontos para uso.",
        href: "/#cta-section",
        icon: "bi-plug",
        theme: "warning",
        ctaLabel: "Conhecer",
      },
    ],
    about: {
      title: "Arquitetura pensada para execução rápida",
      description:
        "Todo o framework cabe em arquivos estáticos: um router leve, helpers e um núcleo de componentes que rodam direto no navegador sem dependências externas.",
      bullets: [
        "Carrega páginas HTML via fetch + cache local",
        "Componentes JS registráveis com ciclo de vida simples",
        "Helpers para storage, validações e formatação",
        "Skeleton global para UX enquanto o conteúdo chega",
      ],
      supportTitle: "Feito para times ágeis",
      supportDescription:
        "Desenvolvedores conseguem prototipar em minutos, designers editam conteúdo pelo CMS e o deploy é só subir arquivos estáticos.",
      supportColumns: [
        ["Zero configuração", "Compatível com qualquer host", "Funciona offline"],
        ["Hot reload via navegador", "Integração com APIs REST", "Documentação em Markdown"],
      ],
    },
    testimonials: [
      {
        name: "Bruna Peixoto",
        relation: "Head de Produto - LoopDev",
        quote:
          "Usamos o Framework Frontend para validar ideias em tempo recorde. Em 3 dias entregamos um MVP completo, sem build e sem servidores extras.",
        icon: "bi-person-circle",
        tone: "primary",
      },
      {
        name: "Rafael Nóbrega",
        relation: "Tech Lead - SprintLab",
        quote:
          "A arquitetura em HTML puro facilita muito. Designers conseguem editar conteúdo sozinhos e os devs focam apenas na lógica.",
        icon: "bi-person-circle",
        tone: "success",
      },
      {
        name: "Juliana Prado",
        relation: "CTO - Protofy",
        quote:
          "O CMS em localStorage é perfeito para demos offline. Levo tudo no notebook e apresento o produto mesmo sem internet.",
        icon: "bi-person-circle",
        tone: "info",
      },
    ],
    cta: {
      title: "Abra o index.html e já esteja produzindo",
      description:
        "Clone o repositório, personalize o conteúdo pelo CMS e publique em qualquer hospedagem estática. Sem CLIs, sem bundlers.",
      action: {
        label: "Baixar agora",
        href: "https://github.com/your-repo/framework-frontend/archive/refs/heads/main.zip",
        icon: "bi-download",
      },
    },
    seo: {
      updatedAt: new Date().toISOString(),
      author: "Equipe Framework Frontend",
    },
  };

  window.defaultCMSContent = Object.freeze(defaultCMSContent);
})(window);
