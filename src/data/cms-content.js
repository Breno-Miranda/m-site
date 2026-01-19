/**
 * Default content used by the CMS and public pages.
 * Acts as a seed for localStorage so the site keeps working offline.
 */
(function (window) {
  const defaultCMSContent = {
    hero: {
      eyebrow: "Tecnologia & Inovação",
      title: "Soluções digitais que transformam o seu negócio",
      subtitle: "Miranda Soft",
      description:
        "Somos uma empresa líder em desenvolvimento de software e soluções tecnológicas inovadoras. Transformamos ideias complexas em produtos digitais de alta performance, focados em resultados reais para sua empresa.",
      primaryAction: {
        label: "Conheça Nossas Soluções",
        href: "#solucoes",
        icon: "bi-grid-fill",
      },
      secondaryAction: {
        label: "Fale com um Especialista",
        href: "#contact",
        icon: "bi-chat-text-fill",
      },
      badgeIcon: "bi-rocket-takeoff-fill",
    },
    features: [
      {
        title: "Fábrica de Software",
        description: "Desenvolvimento de software sob medida para atender as necessidades específicas do seu negócio.",
        href: "/#solucoes",
        icon: "bi-code-square",
        theme: "primary",
        ctaLabel: "Saber mais",
        bullets: ["Sistemas Web", "Plataformas SaaS", "APIs RESTful", "Dashboards & BI"]
      },
      {
        title: "Aplicativos Mobile",
        description: "Apps nativos e híbridos com a melhor experiência de usuário para iOS e Android.",
        href: "/#solucoes",
        icon: "bi-phone",
        theme: "secondary",
        ctaLabel: "Ver detalhes",
        bullets: ["React Native", "Flutter", "Apps Corporativos", "Marketplaces"]
      },
      {
        title: "Consultoria Tech",
        description: "Assessoria especializada para modernização tecnológica e transformação digital.",
        href: "/#solucoes",
        icon: "bi-diagram-3",
        theme: "info",
        ctaLabel: "Consultar",
        bullets: ["Arquitetura de Software", "DevOps & Cloud", "Gestão de Projetos Ágeis", "Segurança da Informação"]
      },
    ],
    about: {
      title: "Sobre a Miranda Soft",
      description:
        "Fundada com a missão de democratizar o acesso à tecnologia de alta qualidade, a Miranda Soft (MSoft) se estabeleceu como referência em desenvolvimento de soluções digitais no Rio Grande do Norte e para todo o Brasil.",
      bullets: [
        "10+ Anos de Experiência",
        "100% Foco no Cliente",
        "Equipe Especializada",
        "Projetos de Alta Complexidade",
      ],
      supportTitle: "Por que escolher a MSoft?",
      supportDescription: "Nossa essência é entregar qualidade técnica superior com agilidade e parceria real.",
      supportColumns: [
        ["Qualidade Técnica Superior", "Tecnologias Modernas (React, Node.js)", "Longevidade do Projeto"],
        ["Entregas Ágeis (Scrum)", "Parceria Estratégica", "Feedback Constante"],
      ],
    },
    testimonials: [
      {
        name: "Carlos Eduardo",
        relation: "CEO - TechSolutions RN",
        quote:
          "A Miranda Soft transformou nossa operação. O sistema desenvolvido por eles automatizou processos que levavam dias em poucos minutos.",
        icon: "bi-person-circle",
        tone: "primary",
      },
      {
        name: "Ana Clara",
        relation: "Diretora de Marketing - Inova",
        quote:
          "Excelente parceiro tecnológico. A equipe é muito atenta aos detalhes e o aplicativo ficou com uma usabilidade incrível.",
        icon: "bi-person-circle",
        tone: "success",
      },
      {
        name: "Roberto Campos",
        relation: "Gerente de Projetos",
        quote:
          "Comprometimento e qualidade técnica. Entregaram o projeto antes do prazo e com qualidade superior ao esperado.",
        icon: "bi-person-circle",
        tone: "info",
      },
    ],
    cta: {
      title: "Conheça o nosso Super App",
      description:
        "Explore nossa suíte de ferramentas e utilitários desenvolvidos para facilitar o dia a dia de desenvolvedores e empresas.",
      action: {
        label: "Acessar Ferramentas",
        href: "/apps",
        icon: "bi-arrow-right",
      },
    },
    seo: {
      updatedAt: new Date().toISOString(),
      author: "Miranda Soft",
    },
  };

  window.defaultCMSContent = Object.freeze(defaultCMSContent);
})(window);
