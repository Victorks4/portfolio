# Contexto do projeto — Portfólio Victor Santos

Documento de referência com informações importantes alinhadas ao desenvolvimento deste repositório e às decisões tomadas ao longo das conversas.

---

## Visão geral

- **Objetivo:** portfólio pessoal moderno, focado em UI/UX, performance e responsividade.
- **Stack principal:** React 19, TypeScript, Vite 8, Tailwind CSS v4 (via `@tailwindcss/vite`), HTML semântico.
- **Conteúdo estático centralizado:** [`src/data/portfolio.ts`](src/data/portfolio.ts) — projetos, skills, navegação, meta SEO, hero, about, timeline, contact.
- **Tipos:** [`src/types/portfolio.ts`](src/types/portfolio.ts).

---

## Arquitetura de pastas (resumo)

- **`src/components/layout`** — Navbar.
- **`src/components/sections`** — Hero, About, Skills, Timeline, ContactSection.
- **`src/components/projects`** — ProjectGallery (carrossel), ProjectCard.
- **`src/components/effects`** — Preloader, CustomCursor.
- **`src/contexts`** — Lenis (smooth scroll).
- **`src/hooks`** — `usePortfolioAnimations` (GSAP + ScrollTrigger), `useLenisContext`, `useMediaQuery` / `useBreakpoint` / `useIsTouch`.
- **`src/effects/webgl`** — Three.js (lazy): WebGLBackground, WebGLCore, ParticleSystem, shaders, particleMath.
- **`src/styles/portfolio.css`** — Estilos globais e da marca (além do Tailwind em [`src/index.css`](src/index.css)).

---

## Comportamentos e decisões de UX

### Projetos (`ProjectGallery`)

- Substituído o layout antigo com **pin horizontal / scroll bloqueado** por um **carrossel**:
  - Setas anterior/próximo, **autoplay ~3 s**, pausa em hover/focus.
  - Teclado ←/→ quando o carrossel está focado; dots e atributos de acessibilidade (carousel/slide).
- GSAP: reveal simples do carrossel em vez de pin + scrub horizontal.

### About / Skills

- Cards “Sobre” repactados (menos altura, mais largura útil).
- Espaçamento entre **títulos de categoria** (Frontend / Backend / IA) e **grids** ajustado; depois reduzido o gap **entre categorias** para não alongar demais a página.
- Removidas **linhas decorativas horizontais** (“traveções”) dos números de secção e do hero greeting; removida também a linha ao lado dos títulos de skills.

### Secção Projetos (visual)

- Painel `#projects` com **border-radius**, borda/sombra e **padding-top** extra para alinhar selo “03 // EXECUTE” e título ao interior do cartão.
- Selo `03` em **pill** com `min-height: calc(1lh + 3px)` e fundo vidro.

### Tech stack / animações

- Reveals GSAP refeitos com **`ScrollTrigger.create` + `onEnter` + `fromTo` + `clearProps`** para não deixar elementos presos em `opacity: 0` se o trigger falhar (problema anterior com skills invisíveis).
- **Hero:** `min-height: 100vh` + altura automática para evitar sobreposição com a secção seguinte em viewports baixos.
- **Mobile:** classes no `body` (`.is-mobile`, `.is-touch`, etc.) via [`src/App.tsx`](src/App.tsx) para ajustes de padding e layout.

### Cards de projeto

- **Altura fixa** por breakpoint (`--project-card-height`), título e descrição com **line-clamp**, tech tags com área limitada, link “Ver Repositório” com **`margin-top: auto`**.

### Hero — foto

- Imagem principal: **`/minhafoto.png`** → ficheiro em [`public/minhafoto.png`](public/minhafoto.png).
- Overlay glitch usa **`--hero-portrait-url`** ligado ao mesmo `src` da imagem em [`Hero.tsx`](src/components/sections/Hero.tsx).
- CSS: `object-fit: cover`, `object-position: center 22%` para retrato.

---

## Performance e SEO

- **`react-helmet-async`** para título e meta no [`App.tsx`](src/App.tsx).
- **`index.html`:** `lang="pt-BR"`, viewport acessível (sem `user-scalable=no`), `theme-color`, preconnect fonts.
- WebGL carregado com **`lazy`** / `Suspense` para não bloquear o primeiro paint.
- Cursor customizado apenas quando faz sentido (`pointer: fine`, sem reduced motion, não touch).

---

## Firebase Hosting

- Config: [`firebase.json`](firebase.json) — `public: dist`, `rewrites` SPA (`**` → `/index.html`).
- Projeto Firebase default: **`portfolio-devsant`** em [`.firebaserc`](.firebaserc).
- **Deploy:** `npm run deploy` (build + `firebase deploy --only hosting`).
- CLI: **`firebase-tools`** em devDependencies; login: `npm exec firebase login`.
- Detalhes extra no [`README.md`](README.md).

---

## Git e GitHub

- Repositório remoto utilizado: **`https://github.com/Victorks4/portfolio`** (branch `main`).
- O HTML monológico antigo em **`legacy/`** foi **removido** do projeto (não faz parte do bundle Vite).

---

## Legado removido

- Pasta **`legacy/`** com `index.html` original deixou de existir no repo (apenas referência histórica nas conversas).

---

## Comandos úteis

```bash
npm install
npm run dev
npm run build
npm run lint
npm run deploy    # build + Firebase Hosting
```

---

## Manutenção deste ficheiro

Atualiza este **`contexto.md`** quando houver mudanças relevantes de stack, deploy, estrutura de dados ou decisões de UX que queiras preservar para ti ou para quem continuar o projeto.
