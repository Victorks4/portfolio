# Portfólio (Victor Santos)

Site em React + TypeScript + Vite, Tailwind e efeitos GSAP/Lenis/WebGL.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Deploy no Firebase Hosting

**Pré-requisitos**

1. Conta Google e um projeto no [Firebase Console](https://console.firebase.google.com/) (anote o **Project ID**).
2. Na primeira vez nesta máquina: `npm exec firebase login` (abre o browser para autorizar a CLI).

**Projeto ligado ao repositório**

O ficheiro [`.firebaserc`](.firebaserc) está configurado com o projeto `portfolio-devsant` (coerente com os assets já referenciados em `portfolio-devsant.web.app`). Se o teu Project ID for outro, altera `.firebaserc` ou corre:

```bash
npm exec firebase use --add
```

**Publicar**

```bash
npm run deploy
```

Isto corre `npm run build` (gera `dist/`) e depois `firebase deploy --only hosting`. O site ficará disponível em `https://<project-id>.web.app` (e `.firebaseapp.com`).

---

# React + TypeScript + Vite (template)

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
