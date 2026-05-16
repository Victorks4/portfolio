import type { Portfolio } from '../types/portfolio'

export const portfolio: Portfolio = {
  meta: {
    title: 'Victor Santos | Desenvolvedor Full Stack & Engenheiro de Software',
    description:
      'Portfólio de Victor Santos (Dev Santos). Apaixonado por criar soluções que fazem a diferença, focado em IA, Chatbots, Automação e experiências WebGL.',
    author: 'Victor Santos',
    themeColor: '#030305',
    robots: 'index, follow',
    ogType: 'website',
    ogTitle: 'Victor Santos | Desenvolvedor Full Stack & IA',
    ogDescription:
      'Acredita em código limpo, design intuitivo e tecnologia de ponta. Especialista em assistentes virtuais e sistemas de automação.',
  },
  brand: {
    navLogo: 'V.Santos',
    footerWatermark: 'DEV.SANTOS',
    loaderBrand: 'DEV.SANTOS',
  },
  navigation: [
    { label: 'Sobre', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projetos', href: '#projects' },
    { label: 'Trajetória', href: '#timeline' },
    { label: 'Contato', href: '#contact' },
  ],
  hero: {
    greeting: 'System.out.println("Hello World");',
    nameLines: ['Victor', 'Santos'],
    subtitle: 'Desenvolvedor Full Stack & Estudante de Engenharia de Software.',
    description:
      'Construindo o futuro através de código limpo, inteligência artificial e interfaces 3D imersivas. Foco no desenvolvimento de assistentes virtuais e sistemas de automação.',
    portraitSrc: '/minhafoto.png',
    portraitAlt: 'Victor Santos',
    portraitFallbackSrc:
      'https://placehold.co/450x560/030305/00ffcc?text=V.Santos',
    primaryCta: { label: 'Ver Projetos', href: '#projects' },
    secondaryCta: { label: 'Iniciar Conexão', href: '#contact' },
  },
  about: {
    sectionNumber: '01 // INIT',
    sectionTitle: 'Sobre Mim',
    codeLines: [
      '<span class="code-keyword">const</span> developer = {',
      '  name: <span class="code-string">"Victor Santos"</span>,',
      '  alias: <span class="code-string">"Dev Santos"</span>,',
      '  role: <span class="code-string">"Full Stack & Eng. Software"</span>,',
      '  focus: [<span class="code-string">"IA"</span>, <span class="code-string">"Automação"</span>, <span class="code-string">"WebGL"</span>],',
      '  <span class="code-comment">// Acredita em código limpo e design intuitivo</span>',
      '  execute: <span class="code-keyword">function</span>() {',
      '    <span class="code-keyword">return</span> <span class="code-function">buildRobustSystems</span>();',
      '  }',
      '};',
      '',
      '<span class="code-keyword">import</span> { passion, innovation } <span class="code-keyword">from</span> <span class="code-string">\'@core/mindset\'</span>;',
      '<span class="code-function">initiateSequence</span>(developer);',
    ],
    paragraphs: [
      {
        text: 'Olá, sou o Victor Santos. Sou um desenvolvedor apaixonado por criar soluções que fazem a diferença real no dia a dia das pessoas e empresas. Acredito firmemente na interseção entre código limpo, design intuitivo e tecnologia de ponta.',
        highlights: ['Victor Santos'],
      },
      {
        text: 'Minha jornada é focada no desenvolvimento de sistemas robustos, assistentes virtuais impulsionados por IA e plataformas de automação que otimizam processos reais.',
        highlights: ['assistentes virtuais impulsionados por IA'],
      },
      {
        text: 'Como estudante de Engenharia de Software, busco constantemente integrar os fundamentos matemáticos e lógicos da computação com as inovações mais recentes do mercado, criando arquiteturas escaláveis.',
      },
    ],
    stats: [
      { value: 10, label: 'Sistemas Entregues' },
      { value: 3, label: 'Anos de Imersão' },
    ],
  },
  skills: {
    sectionNumber: '02 // CONFIG',
    sectionTitle: 'Tech Stack',
    categories: [
      {
        category: 'Frontend',
        items: [
          {
            name: 'HTML/CSS',
            iconD:
              'M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z',
          },
          {
            name: 'React',
            iconD:
              'M12 22.65C4.78 22.65-.6 18.06-.6 12S4.78 1.35 12 1.35 24.6 5.94 24.6 12s-5.38 10.65-12.6 10.65zm0-19.8C5.83 2.85 1.4 6.85 1.4 12s4.43 9.15 10.6 9.15 10.6-4 10.6-9.15S18.17 2.85 12 2.85zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-4.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z',
          },
          {
            name: 'Tailwind CSS',
            iconD:
              'M12.001,4.8c-3.208,0-5.455,1.561-6.741,4.684c1.286-2.141,3.048-2.81,5.286-2.007c1.428,0.512,2.447,1.554,3.585,2.718 C15.864,11.977,17.845,14,22.001,14c3.208,0,5.455-1.561,6.741-4.684c-1.286,2.141-3.048,2.81-5.286,2.007 c-1.428-0.512-2.447-1.554-3.585-2.718C18.138,6.823,16.157,4.8,12.001,4.8z M5.26,14c-3.208,0-5.455,1.561-6.741,4.684 c1.286-2.141,3.048-2.81,5.286-2.007c1.428,0.512,2.447,1.554,3.585,2.718C9.123,21.177,11.104,23,15.26,23 c3.208,0,5.455-1.561,6.741-4.684c-1.286,2.141-3.048,2.81-5.286,2.007c-1.428-0.512-2.447-1.554-3.585-2.718 C11.397,16.023,9.416,14,5.26,14z',
          },
          {
            name: 'TypeScript',
            iconD:
              'M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zM12.9 16.733c0 1.838-1.503 3.34-3.34 3.34-1.838 0-3.34-1.502-3.34-3.34V9.658h2.39v7.075c0 .524.426.95.95.95.524 0 .95-.426.95-.95V9.658h2.39v7.075zm7.747-3.791c0 2.302-1.868 4.17-4.17 4.17-2.302 0-4.17-1.868-4.17-4.17v-.15h2.39v.15c0 .983.797 1.78 1.78 1.78.983 0 1.78-.797 1.78-1.78 0-.983-.797-1.78-1.78-1.78-.501 0-.953.208-1.278.544l-1.688-1.688c.783-.783 1.865-1.267 3.055-1.267 2.302 0 4.17 1.868 4.17 4.17v.021z',
          },
        ],
      },
      {
        category: 'Backend',
        items: [
          {
            name: 'Node.js',
            iconD:
              'M11.859 1.144L1.314 7.218v12.148l10.545 6.074 10.546-6.074V7.218L11.859 1.144zm0 2.29l8.557 4.93-8.557 4.928-8.556-4.928 8.556-4.93zm-9.546 6.643l8.556 4.928v9.858l-8.556-4.929V10.077zm10.536 14.786v-9.858l8.557-4.928v9.858l-8.557 4.929z',
          },
          {
            name: 'NestJS',
            iconD:
              'M12 0L1.608 6.002v11.996L12 24l10.392-5.998V6.002L12 0zm0 2.308l8.396 4.847-8.396 4.848-8.396-4.848L12 2.308zm-9.396 6.579l8.396 4.848v9.695l-8.396-4.847v-9.696zm10.396 14.543v-9.695l8.396-4.848v9.696l-8.396 4.847z',
          },
          {
            name: 'Express',
            iconD: 'M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2z',
          },
          {
            name: 'APIs RESTful',
            iconD: 'M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z',
          },
          {
            name: 'SQLite/SQL',
            iconD:
              'M12 2C6.48 2 2 4.24 2 7c0 2.37 3.32 4.35 7.76 4.88l-.68 1.67C5.17 12.87 2 11.11 2 9v3c0 2.76 4.48 5 10 5s10-2.24 10-5V9c0 2.11-3.17 3.87-7.08 4.55l-.68-1.67C18.68 11.35 22 9.37 22 7c0-2.76-4.48-5-10-5zm0 8.5c-4.42 0-8-1.79-8-4s3.58-4 8-4 8 1.79 8 4-3.58 4-8 4zm0 8.5c-4.42 0-8-1.79-8-4v-1.74c1.9.99 4.75 1.62 8 1.62s6.1-.63 8-1.62V15c0 2.21-3.58 4-8 4z',
          },
          {
            name: 'Python',
            iconD:
              'M12.01 1.703c-2.732 0-5.112.227-6.52.682-1.643.53-2.126 1.63-2.126 3.197v2.85h8.847v1.27H3.85c-2.31 0-3.593 1.528-3.593 3.84v3.13c0 2.457 1.488 3.567 3.655 3.567h1.493v-3.23c0-2.07 1.737-3.758 3.87-3.758h5.275c1.47 0 2.668-1.16 2.668-2.585V5.55c0-1.426-1.198-2.586-2.668-2.586H9.197V1.808c.594-.055 1.528-.105 2.813-.105 2.73 0 5.11.226 6.52.68 1.642.53 2.125 1.63 2.125 3.198v2.85h-8.846v1.27h8.36c2.31 0 3.594 1.527 3.594 3.84v3.13c0 2.456-1.488 3.566-3.655 3.566h-1.492v-3.23c0-2.07-1.738-3.757-3.87-3.757H9.467c-1.47 0-2.668 1.16-2.668 2.586v5.116c0 1.425 1.198 2.585 2.668 2.585h5.353v1.156c-.594.055-1.528.105-2.813.105z',
          },
        ],
      },
      {
        category: 'IA & Automação',
        items: [
          {
            name: 'Chatbots',
            iconD:
              'M12 2C6.48 2 2 6.48 2 12c0 2.31.79 4.44 2.11 6.11L3 22l3.89-1.11C8.56 21.21 10.25 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-3 11c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z',
          },
          {
            name: 'Automação',
            iconD:
              'M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z',
          },
          {
            name: 'Gemini API',
            iconD:
              'M12 0c-.3 6.6-5.4 11.7-12 12 6.6.3 11.7 5.4 12 12 .3-6.6 5.4-11.7 12-12-6.6-.3-11.7-5.4-12-12z',
          },
          {
            name: 'WhatsApp API',
            iconD:
              'M12.031 0C5.394 0 0 5.394 0 12.031c0 2.128.552 4.195 1.603 6.015L.17 24l6.115-1.603c1.766.953 3.754 1.455 5.746 1.455 6.637 0 12.031-5.394 12.031-12.031C24.062 5.394 18.668 0 12.031 0zm6.27 17.15c-.266.75-1.531 1.438-2.125 1.5-.578.063-1.344.188-3.906-.875-3.094-1.281-5.062-4.438-5.219-4.656-.156-.219-1.25-1.656-1.25-3.156s.781-2.219 1.062-2.531c.281-.312.625-.375.844-.375.219 0 .438 0 .625.031.219.031.5.094.781.781.312.781 1.062 2.594 1.156 2.781.094.188.156.406.031.656-.125.25-.188.406-.375.625-.188.219-.406.469-.562.625-.188.188-.375.406-.156.781.219.375.969 1.594 2.062 2.562 1.406 1.25 2.594 1.625 2.969 1.812.375.188.594.156.812-.094.219-.25.938-1.094 1.188-1.469.25-.375.5-.312.844-.188.344.125 2.188 1.031 2.562 1.219.375.188.625.281.719.438.094.156.094.906-.188 1.656z',
          },
        ],
      },
    ],
  },
  projects: {
    sectionNumber: '03 // EXECUTE',
    sectionTitle: 'Projetos Destaque',
    items: [
      {
        title: 'BellaBot',
        role: 'IA & Automação',
        description:
          'Chatbot inteligente via WhatsApp utilizando a API do Google Gemini para processamento de linguagem natural e SQLite para persistência de dados e contexto conversacional.',
        tech: ['WhatsApp API', 'Gemini API', 'Node.js', 'SQLite'],
        link: 'https://github.com/Victorks4',
        color: '#00ffcc',
        shapeClass: 'shape-bellabot',
      },
      {
        title: 'Smart Key',
        role: 'Full Stack Web',
        description:
          'Plataforma web completa para gestão, monitoramento e retirada de chaves em ambientes corporativos, garantindo rastreabilidade e segurança com autenticação em tempo real.',
        tech: ['Node.js', 'Firebase', 'React', 'Tailwind'],
        link: 'https://github.com/Victorks4',
        color: '#ffca28',
        shapeClass: 'shape-smartkey',
      },
      {
        title: 'MecNexa',
        role: 'Enterprise Architecture',
        description:
          'Hub centralizado composto por 10 sistemas personalizados desenvolvidos para a gestão de manutenção industrial e acadêmica no SENAI. Arquitetura escalável e banco de dados relacional complexo.',
        tech: ['React', 'NestJS', 'Supabase', 'Prisma'],
        link: 'https://github.com/Victorks4',
        color: '#0088ff',
        shapeClass: 'shape-mecnexa',
      },
      {
        title: 'PontiFy',
        role: 'SaaS Platform',
        description:
          'Sistema robusto de gestão de ponto corporativo. Implementa multi-níveis de acesso (Admin, RH, Colaborador), relatórios dinâmicos e interface altamente responsiva.',
        tech: ['Next.js', 'Tailwind CSS', 'NestJS', 'PostgreSQL'],
        link: 'https://github.com/Victorks4',
        color: '#00E676',
        shapeClass: 'shape-pontify',
      },
    ],
  },
  timeline: {
    sectionNumber: '04 // HISTORY',
    sectionTitle: 'Minha Jornada',
    entries: [
      {
        year: '2024',
        title: 'O Início',
        description:
          'Início na programação, mergulhando nos fundamentos da computação e desenvolvimento de primeiros projetos baseados na linguagem Java. Estabelecimento da base lógica e orientação a objetos.',
      },
      {
        year: '2025',
        title: 'Evolução & Academia',
        description:
          'Ingresso na faculdade de Engenharia de Software com foco em IA e automação. Conclusão do curso técnico, expandindo o stack para tecnologias web modernas (React, Node.js) e início do desenvolvimento de APIs.',
      },
      {
        year: '2026',
        title: 'Atuação Profissional',
        description:
          'Atuação no desenvolvimento de sistemas robustos e arquiteturas escaláveis no SENAI como estagiário. Liderança técnica em projetos internos, integrando IA (Gemini) e frameworks enterprise (NestJS).',
      },
    ],
  },
  contact: {
    sectionNumber: '05 // EOF',
    titleLine1: 'Vamos criar algo',
    titleLine2Outline: 'incrível juntos.',
    email: 'devsantjs.tech@gmail.com',
    socials: [
      {
        label: 'GitHub',
        href: 'https://github.com/Victorks4',
        network: 'github',
      },
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/victor-santos-barbosa-985390274',
        network: 'linkedin',
      },
    ],
    footerCopyright: '© 2026 Victor Santos. Todos os direitos reservados.',
    footerTechNote: 'Arquitetura em WebGL, Three.js & Custom GLSL Shaders.',
  },
  preloaderLogs: [
    '> INITIALIZING DEV.SANTOS KERNEL...',
    '> LOADING WEBGL MODULES [THREE.JS]',
    '> COMPILING GPGPU SHADERS...',
    '> MOUNTING VIRTUAL DOM...',
    '> ESTABLISHING NEURAL LINK...',
    '> SYSTEM READY.',
  ],
}
