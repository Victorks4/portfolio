# Contexto do projeto — Portfólio Victor Santos

Documento de referência com informações importantes alinhadas ao desenvolvimento deste repositório e às decisões tomadas ao longo das conversas.

---

## Visão geral

- **Objetivo:** portfólio pessoal moderno, focado em UI/UX, performance e responsividade.
- **Stack principal:** React 19, TypeScript, Vite 8, Tailwind CSS v4 (via `@tailwindcss/vite`), `react-router-dom`, HTML semântico.
- **Conteúdo estático centralizado:** [`src/data/portfolio.ts`](src/data/portfolio.ts) — projetos, skills, navegação, meta SEO, hero, about, timeline, contact.
- **Case studies dos projetos:** [`src/data/projectDetails.ts`](src/data/projectDetails.ts) — texto longo separado para não inflar o ficheiro principal.
- **Tipos:** [`src/types/portfolio.ts`](src/types/portfolio.ts).

---

## Rotas

| Rota | Componente | Notas |
|------|-----------|-------|
| `/` | [`src/routes/HomePage.tsx`](src/routes/HomePage.tsx) | As 6 secções + `usePortfolioAnimations` |
| `/projetos/:slug` | [`src/routes/ProjectDetailPage.tsx`](src/routes/ProjectDetailPage.tsx) | Case study; slug inválido redireciona para `/#projects` |

Slugs válidos: `bellabot`, `smart-key`, `pontify`, `origyn`.

O layout partilhado ([`SiteLayout.tsx`](src/components/layout/SiteLayout.tsx)) segura Navbar, WebGL, cursor, overlays e preloader — tudo o que deve sobreviver à troca de rota.

Pontos a lembrar:

- **Preloader** só corre na home e apenas uma vez por sessão (flag `devsantos:preloader-done` em `sessionStorage`). Link direto para um projeto não passa pela abertura.
- **Reset de scroll** em [`useRouteScrollReset.ts`](src/hooks/useRouteScrollReset.ts): topo na troca de rota, ou o elemento do hash quando se volta para `/#seccao`, seguido de `ScrollTrigger.refresh()`.
- **Ponte Lenis ↔ GSAP** vive em [`useLenisGsapBridge.ts`](src/hooks/useLenisGsapBridge.ts), no layout. Se voltar para dentro de uma rota, o smooth scroll morre ao navegar.
- `firebase.json` já tem rewrite SPA, então as rotas funcionam em produção sem configuração extra.

---

## Arquitetura de pastas (resumo)

- **`src/routes`** — HomePage, ProjectDetailPage.
- **`src/components/layout`** — SiteLayout, Navbar.
- **`src/components/sections`** — Hero, About, Skills, Timeline, ContactSection.
- **`src/components/projects`** — ProjectGallery (carrossel), ProjectCard, ProjectDetailHero, ProjectGalleryGrid.
- **`src/components/effects`** — Preloader, CustomCursor.
- **`src/contexts`** — Lenis (smooth scroll).
- **`src/hooks`** — `usePortfolioAnimations`, `useProjectDetailAnimations`, `useLenisGsapBridge`, `useRouteScrollReset`, `useShellContext`, `useLenisContext`, `useMediaQuery` / `useBreakpoint` / `useIsTouch`.
- **`src/effects/webgl`** — Three.js (lazy): WebGLBackground, WebGLCore, ParticleSystem, shaders, particleMath.
- **`src/utils`** — `performanceTier`, `siteUrl` (URLs absolutas), `color` (hex → rgb).
- **`src/styles/portfolio.css`** — Estilos globais e da marca (além do Tailwind em [`src/index.css`](src/index.css)).

---

## Comportamentos e decisões de UX

### Projetos (`ProjectGallery`)

- Substituído o layout antigo com **pin horizontal / scroll bloqueado** por um **carrossel**:
  - Setas anterior/próximo, **autoplay 5 s**, pausa em hover/focus.
  - Teclado ←/→ quando o carrossel está focado; atributos de acessibilidade (carousel/tablist/tabpanel).
- **Navegação por nomes** (`.projects-tabs`) em vez de dots anónimos — o visitante lê "BELLABOT · SMART KEY · PONTIFY · ORIGYN" de relance. Em ≤480px vira faixa horizontal com `scroll-snap`.
- O autoplay **para em definitivo** depois da primeira escolha manual: continuar a deslizar depois de a pessoa escolher um projeto é atrapalho, não conveniência.
- GSAP: reveal simples do carrossel em vez de pin + scrub horizontal.

### Página de detalhe do projeto

- Estrutura: hero (nome gigante, tagline, ano, status, stack) → contexto e problema → solução → galeria → funcionalidades → arquitetura → desafios → resultados → navegação para o próximo projeto.
- O **título acende na cor do projeto**, não no ciano fixo: `registerTextOutlineReveals` lê `--outline-accent-rgb` do elemento, que a página define a partir de `project.color`.
- **Galeria vazia não quebra a página** — [`ProjectGalleryGrid`](src/components/projects/ProjectGalleryGrid.tsx) mostra um placeholder com a forma e a cor do projeto. Basta pôr ficheiros nas pastas de `public/` (`bellabot`, `smartkey`, `pointfy`, `origyn`) e listar em `gallery`.
- Os textos dos case studies são **rascunho a rever** — números e detalhes técnicos precisam da tua validação.

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

- **Altura fixa** por breakpoint (`--project-card-height`), viewport do carrossel com mesma altura, título e descrição com **line-clamp**, tech tags com área limitada, CTA "Ver Projeto" com **`margin-top: auto`**.
- Slide ativo usa classe **`.is-active`** (animações das formas só no card visível).
- O CTA passou de link externo para **rota interna** (`/projetos/<slug>`). O link acessível é o do título; o card inteiro é clicável por um overlay `.project-card-hitbox` que fica fora da ordem de tabulação e da árvore de acessibilidade, para não duplicar o mesmo destino para leitores de ecrã.
- Campo opcional **`imageSrc`** no tipo `Project` para screenshots futuros.

### Projetos em destaque

Quatro projetos: **BellaBot**, **Smart Key**, **PontiFy** e **Origyn**. O MecNexa foi removido nesta rodada e substituído pelo Origyn (loja de moda com provador virtual 3D, cor `#ff2d78`, forma `shape-origyn` em silhueta de vestido).

### Performance adaptativa

- **`src/utils/performanceTier.ts`** — tiers `low` | `medium` | `high` (partículas, bloom, post-shader, pixel ratio, Lenis).
- WebGL pausa RAF quando tab oculta ou fora da viewport (`IntersectionObserver`).
- Classe `body.perf-low` reduz `backdrop-filter` e overlays.

### Textos outline (GSAP)

- **`.text-outline`** acende no scroll via `registerTextOutlineReveals` em [`useTextOutlineReveal.ts`](src/hooks/useTextOutlineReveal.ts) — sem depender de hover.
- `prefers-reduced-motion`: estado aceso imediato.

### Conversão

- **Hero:** selo de disponibilidade com dot pulsante, localização e terceiro CTA "Baixar CV". O indicador de scroll diz "Rolar" (o site é PT-BR).
- **Contacto:** WhatsApp, botão de CV, selo de disponibilidade e tempo de resposta. Formulário de contacto ficou fora do escopo (exige serviço externo).
- **Navbar:** scroll spy via `ScrollTrigger` (`onToggle`, que também dispara no refresh) e CTA destacado. Fora da home os links de secção navegam para `/#seccao`.

### SEO

- JSON-LD `Person` + `WebSite` na home; `CreativeWork` por projeto na página de detalhe.
- Meta essenciais **duplicadas estaticamente** em [`index.html`](index.html): crawlers de preview do WhatsApp e LinkedIn muitas vezes não executam o JS do Helmet.
- `og:image` com **URL absoluta** via [`absoluteUrl()`](src/utils/siteUrl.ts) — caminho relativo quebra a pré-visualização ao partilhar.
- OG image dedicada em `public/og-image.jpg` (1200×630, ~96 KB).
- [`public/robots.txt`](public/robots.txt) e [`public/sitemap.xml`](public/sitemap.xml) com a home e as 4 rotas de projeto.
- Canonical por rota.

### Acessibilidade

- Skip link "Pular para o conteúdo" apontando para `main#conteudo`.
- `:focus-visible` com anel ciano, compensando o `outline: none` global em botões.
- Skill cards são focáveis por teclado e revelam em que projetos a tecnologia foi usada (`usedIn`).

### Hero — foto

- Imagem principal: **`/minhafoto.png`** → ficheiro em [`public/minhafoto.png`](public/minhafoto.png).
- Overlay glitch usa **`--hero-portrait-url`** ligado ao mesmo `src` da imagem em [`Hero.tsx`](src/components/sections/Hero.tsx).
- CSS: `object-fit: cover`, `object-position: center 22%` para retrato.

---

## Performance e SEO

- **`react-helmet-async`** para título e meta, por rota (HomePage e ProjectDetailPage).
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

## Pendências (placeholders no código)

Estes valores estão marcados com `TODO` em [`src/data/portfolio.ts`](src/data/portfolio.ts) e precisam de dados reais:

| Item | Onde | Estado |
|------|------|--------|
| Número de WhatsApp | `contact.whatsappHref` | Placeholder `5511999999999` |
| Cidade | `hero.location` | Placeholder "São Paulo, Brasil" |
| CV em PDF | `public/cv-victor-santos.pdf` | Ficheiro ainda não existe (os botões apontam para ele) |
| Screenshots dos projetos | `public/<projeto>/` | Pastas criadas e vazias; galeria mostra placeholder |
| Textos dos case studies | `src/data/projectDetails.ts` | Rascunho a rever |
| `minhafoto.png` (~2 MB) | `public/` | Por comprimir; só reintroduzir `<picture>`/WebP **depois** de o ficheiro existir |

---

## Manutenção deste ficheiro

Atualiza este **`contexto.md`** quando houver mudanças relevantes de stack, deploy, estrutura de dados ou decisões de UX que queiras preservar para ti ou para quem continuar o projeto.
