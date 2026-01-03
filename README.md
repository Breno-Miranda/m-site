# 🚀 Breno Miranda - Developer Landing Page

> Landing page pessoal e profissional de desenvolvedor Full-Stack, construída com um micro-framework vanilla JavaScript moderno e performático.

![Full-Stack Developer](https://img.shields.io/badge/Full--Stack-Developer-6366f1?style=for-the-badge&logo=code&logoColor=white)
![10+ Years](https://img.shields.io/badge/Experience-10%2B%20Years-10b981?style=for-the-badge)
![MIT License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

## 🌐 Live Demo

**[brenossan.com.br](https://brenossan.com.br)**

## ✨ Features

### 🎨 Design Premium
- **Dark Theme Moderno** - Design elegante com gradientes e glassmorphism
- **Animações Suaves** - Transições e micro-interações fluidas
- **100% Responsivo** - Mobile-first design
- **Sistema de Skeleton** - Loading states animados durante carregamento

### ⚡ Performance
- **Zero Dependencies Runtime** - Vanilla JavaScript puro
- **Sem Build Process** - Arquivos estáticos prontos para deploy
- **Carregamento Otimizado** - Lazy loading de componentes
- **SPA Native** - Navegação sem recarregamento de página

### 🛠️ Tech Stack Exibidas
- React / React Native
- Angular / AngularJS
- Vue.js / Svelte
- PHP Laravel / CodeIgniter / Lumen
- Node.js / NestJS
- Java EE
- MySQL / MongoDB
- Docker / DevOps

## 📁 Estrutura do Projeto

```
brenossan/
├── index.html              # Entry point com meta tags SEO
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── style.css       # Estilos base
│   │   │   └── developer.css   # Tema dark para dev
│   │   ├── favicon/
│   │   └── vendor/             # Bootstrap, Swiper, etc.
│   ├── components/
│   │   ├── header.html         # Navbar moderna
│   │   └── footer.html         # Footer com links
│   ├── pages/
│   │   ├── home.html           # Landing page principal
│   │   ├── 404.html
│   │   └── ...
│   ├── core/
│   │   ├── core.js             # Framework core (SPA router)
│   │   ├── skeleton.js         # Sistema de loading states
│   │   ├── component.js        # Base class para componentes
│   │   └── helpers.js          # Utilidades
│   ├── config/
│   │   └── config.js           # Configurações do app
│   └── services/
│       └── content-service.js  # CMS service
├── .htaccess                   # Config Apache para SPA
└── README.md
```

## 🚀 Quick Start

### Opção 1: Servidor Local (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/Breno-Miranda/brenossan.git

# Entre na pasta
cd brenossan

# Inicie um servidor local
npx serve
# ou
python -m http.server 3000
# ou
php -S localhost:3000
```

### Opção 2: Abrir Diretamente

Abra o `index.html` diretamente no navegador (algumas features de SPA podem não funcionar).

## 🎨 Seções da Landing Page

| Seção | Descrição |
|-------|-----------|
| **Hero** | Apresentação com nome, título e tech stack |
| **Skills** | Cards com Frontend, Backend e Databases & Tools |
| **Experience** | Timeline com experiências profissionais |
| **Education** | Grid com formação acadêmica |
| **Contact** | CTA com links para contato |

## 🔧 Sistema de Skeleton

O projeto inclui um sistema de skeleton loading premium:

```javascript
// Mostrar skeleton
Skeleton.show(element, 'page');

// Tipos disponíveis:
// 'page', 'hero', 'cards', 'timeline', 'education', 'contact', 'header', 'footer'

// Esconder com transição suave
Skeleton.hide(element, novoConteudo, callback);
```

### Características:
- ✅ Animação shimmer
- ✅ Múltiplos layouts pré-definidos
- ✅ Transições fade in/out
- ✅ Tema dark integrado

## 📱 Responsividade

| Breakpoint | Layout |
|------------|--------|
| < 576px | Mobile - Stack vertical |
| 576px - 768px | Tablet - 2 colunas |
| 768px - 992px | Desktop pequeno |
| > 992px | Desktop - Layout completo |

## 🎯 SEO

- ✅ Meta tags completas
- ✅ Open Graph para redes sociais
- ✅ Twitter Cards
- ✅ Estrutura semântica HTML5
- ✅ URLs amigáveis (SPA)

## 📞 Contato

- **Telefone:** (84) 98833-0532
- **Email:** contato@brenossan.com.br
- **LinkedIn:** [breno-miranda-7047b161](https://www.linkedin.com/in/breno-miranda-7047b161)
- **Website:** [brenossan.com.br](https://brenossan.com.br)

## 🚀 Deploy

### GitHub Pages
```bash
# Configurar GitHub Pages para branch master
# Acessar: Settings > Pages > Source: master
```

### Hospedagem Tradicional
```bash
# Upload via FTP/SFTP todos os arquivos
# Configurar .htaccess para Apache
```

### Vercel / Netlify
```bash
# Conectar repositório
# Deploy automático a cada push
```

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<p align="center">
  <b>Desenvolvido com ☕ e 💜 por Breno Miranda</b>
</p>

<p align="center">
  <a href="https://brenossan.com.br">Website</a> •
  <a href="https://linkedin.com/in/breno-miranda-7047b161">LinkedIn</a>
</p>
