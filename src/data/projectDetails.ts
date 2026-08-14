import type { ProjectDetail, ProjectSlug } from '../types/portfolio'

/**
 * Conteúdo longo dos case studies, separado de `portfolio.ts` para manter os dois legíveis.
 *
 * Imagens: coloque os arquivos nas pastas já existentes em `public/` (bellabot,
 * smartkey, pointfy, origyn) e liste os caminhos em `gallery`, por exemplo
 * `{ src: '/bellabot/conversa.png', alt: '...' }`.
 * Enquanto `gallery` estiver vazio, a página renderiza um placeholder com a cor do projeto.
 */
export const projectDetails: Record<ProjectSlug, ProjectDetail> = {
  bellabot: {
    tagline:
      'Assistente virtual no WhatsApp que entende contexto e responde como gente.',
    year: '2025',
    status: 'Em produção',
    context:
      'Nasceu da necessidade de atender clientes no WhatsApp fora do horário comercial, sem contratar um time de plantão. O WhatsApp é o canal onde o cliente brasileiro realmente está, mas responder manualmente não escala.',
    problem:
      'Os atendimentos chegavam a qualquer hora e ficavam sem resposta até o dia seguinte. Chatbots de árvore de decisão resolviam mal: o cliente escrevia livremente, o bot não entendia, e a conversa morria. Além disso, cada nova mensagem começava do zero, sem lembrar do que já tinha sido dito.',
    solution:
      'Construí um assistente que conecta a API do WhatsApp ao Google Gemini para interpretar linguagem natural, com uma camada de persistência em SQLite que guarda o histórico de cada conversa. O bot lembra do contexto anterior, mantém o fio da conversa entre mensagens e escala o atendimento para um humano quando detecta que não deve decidir sozinho.',
    features: [
      {
        title: 'Compreensão de linguagem natural',
        description:
          'O cliente escreve como falaria com uma pessoa. A intenção é interpretada pelo Gemini, sem menus numerados ou palavras-chave exatas.',
      },
      {
        title: 'Memória de conversa',
        description:
          'Cada contato tem seu histórico persistido em SQLite, então o assistente entende referências a mensagens anteriores dentro da mesma conversa.',
      },
      {
        title: 'Disponibilidade contínua',
        description:
          'Atendimento ativo 24 horas por dia, incluindo fins de semana e feriados, sem custo por hora de plantão.',
      },
      {
        title: 'Escalonamento para humano',
        description:
          'Quando a solicitação sai do escopo seguro, a conversa é encaminhada para atendimento humano em vez de arriscar uma resposta errada.',
      },
    ],
    architecture: [
      'Python puro no backend, sem framework pesado: script direto para integrar WhatsApp, Gemini e persistência',
      'API do Google Gemini para processamento de linguagem natural e geração de resposta',
      'SQLite para persistir histórico por contato: banco embarcado, zero infraestrutura extra',
      'Camada de contexto que monta o prompt com as últimas mensagens antes de cada chamada ao modelo',
      'Tratamento de rate limit e retry para as chamadas de API externa',
    ],
    challenges: [
      {
        title: 'Controlar o custo das chamadas ao modelo',
        description:
          'Enviar todo o histórico a cada mensagem fica caro rápido. Resolvi limitando a janela de contexto às mensagens mais recentes e relevantes, em vez de mandar a conversa inteira.',
      },
      {
        title: 'Evitar respostas inventadas',
        description:
          'Modelos de linguagem respondem com confiança mesmo quando não sabem. Delimitei o escopo por prompt e defini gatilhos de escalonamento para humano quando a pergunta sai do domínio conhecido.',
      },
      {
        title: 'Manter estado numa API sem sessão',
        description:
          'O WhatsApp entrega mensagens avulsas, sem noção de sessão. A identidade do contato virou a chave de persistência, o que permitiu reconstruir o contexto a cada mensagem recebida.',
      },
    ],
    gallery: [
      {
        src: '/bellabot/Blue%20Yellow%20Modern%20Future%20Technology%20Video.jpg',
        alt: 'Banner da Bella Bot, assistente virtual do Bella Beauty com identidade em tons vinho',
        caption: 'Identidade visual da assistente virtual no WhatsApp do salão Bella Beauty',
      },
    ],
    stack: [
      { category: 'Backend', items: ['Python'] },
      { category: 'IA', items: ['Google Gemini API'] },
      { category: 'Dados', items: ['SQLite'] },
      { category: 'Integração', items: ['WhatsApp API'] },
    ],
    repoUrl: 'https://github.com/Victorks4',
  },

  'smart-key': {
    tagline:
      'Iniciativa de estágio: controle de chaves sem fila na folha de papel.',
    year: '2025',
    status: 'Em produção',
    context:
      'Durante meu estágio no SENAI, vi de perto como a retirada de chaves funcionava: uma folha impressa na mesa, fila na portaria, cada pessoa procurando o próprio nome, conferindo turma e disciplina e assinando à mão. No horário de troca de aula, o gargalo era visível. Propus e desenvolvi o Smart Key por conta própria, como solução para substituir esse ritual no papel. Não é um produto oficial da instituição.',
    problem:
      'O papel não aguenta o pico: cada retirada dependia de caça ao nome, a fila crescia e ninguém enxergava em tempo real quem estava com qual chave. Assinatura ilegível, linha errada e devolução esquecida viravam problema sem dono claro. Reconstituir o que aconteceu no dia exigia folhear a folha e adivinhar.',
    solution:
      'Construí uma plataforma web com painéis de administração e professor, turnos organizados e sincronização em tempo real. Cada retirada e devolução fica registrada com responsável, sala, turma e horário. Terceiros têm fluxo próprio de cadastro, e o painel mostra na hora o que está disponível e o que está em uso, sem fila procurando nome em papel.',
    features: [
      {
        title: 'Painel de status em tempo real',
        description:
          'Visão imediata de quais chaves estão disponíveis, em uso ou devolvidas, com sala, turma e responsável atual.',
      },
      {
        title: 'Histórico auditável',
        description:
          'Toda movimentação fica registrada com responsável e horário, permitindo reconstruir o caminho de qualquer chave.',
      },
      {
        title: 'Perfis de administração e professor',
        description:
          'Cada perfil acessa o que precisa: o administra o acervo e as alocações; o professor retira e devolve no próprio turno.',
      },
      {
        title: 'Fluxo pensado para o balcão',
        description:
          'Retirada, devolução e registro de terceiros em poucos toques, porque o uso real acontece com gente esperando na fila.',
      },
    ],
    architecture: [
      'React no front-end, com Tailwind para montar a interface operacional rapidamente',
      'Firebase como backend: autenticação e banco em tempo real sem manter servidor próprio',
      'Sincronização em tempo real: a mudança feita numa portaria aparece na outra sem refresh',
      'Node.js para rotinas de apoio e scripts de carga inicial do acervo de chaves',
    ],
    challenges: [
      {
        title: 'Modelar histórico sem perder o estado atual',
        description:
          'Precisava responder "onde está a chave agora" e "por onde ela passou" com a mesma base. Separei o estado corrente do log de movimentações, evitando varrer todo o histórico a cada consulta.',
      },
      {
        title: 'Velocidade de uso no balcão',
        description:
          'Um formulário longo trava a fila. Reduzi o fluxo de retirada ao mínimo de campos, deixando o resto derivado do usuário autenticado e do horário.',
      },
      {
        title: 'Concorrência entre postos',
        description:
          'Dois atendentes podiam registrar a mesma chave ao mesmo tempo. O tempo real do Firebase resolveu a propagação, mas exigiu cuidado para a interface refletir o estado do servidor e não o local.',
      },
    ],
    gallery: [
      {
        src: '/smartkey/Captura%20de%20tela%202026-08-13%20215427.png',
        alt: 'Tela inicial do Smart Key com acesso ao painel administrativo e do professor',
        caption: 'Entrada do sistema com perfis separados para administração e professor',
      },
      {
        src: '/smartkey/ChatGPT%20Image%2013%20de%20ago.%20de%202026,%2022_01_55.png',
        alt: 'Dashboard administrativo com alocações por turno, horários e retirada por sala',
        caption: 'Painel do administrador com visão do turno, cadastros e retirada por sala',
      },
      {
        src: '/smartkey/ChatGPT%20Image%2013%20de%20ago.%20de%202026,%2021_58_10.png',
        alt: 'Dashboard do professor com status de chaves em uso e devolvidas por disciplina',
        caption: 'Painel do professor com retirada e devolução em tempo real',
      },
      {
        src: '/smartkey/Captura%20de%20tela%202026-08-13%20215847.png',
        alt: 'Formulário de registro de terceiros com seleção de bloco e sala',
        caption: 'Fluxo de terceiros sem passar pela folha de papel na portaria',
      },
    ],
    stack: [
      { category: 'Frontend', items: ['React', 'Tailwind CSS'] },
      { category: 'Backend', items: ['Firebase', 'Node.js'] },
      { category: 'Auth', items: ['Firebase Authentication'] },
    ],
    repoUrl: 'https://github.com/Victorks4',
  },

  pontify: {
    tagline:
      'Iniciativa de estágio: controle de ponto com quatro níveis de acesso.',
    year: '2026',
    status: 'Em desenvolvimento',
    context:
      'Durante meu estágio no SENAI, o controle de ponto passava por planilhas: abrir arquivo, copiar linha, conferir horário, corrigir na mão e repetir no fim do mês. Funcionava, mas consumia tempo de quem deveria estar cuidando de outras coisas. Propus e desenvolvi o PontiFy por conta própria para substituir esse fluxo manual. Não é um produto oficial da instituição.',
    problem:
      'A planilha não escala e não protege dado: qualquer um com acesso ao arquivo enxerga todo mundo, correção vira caça ao erro, e o gestor não tem um fluxo claro para aprovar compensação ou ausência. Fechar o mês era trabalho repetitivo que dependia de memória e de fórmula bem montada.',
    solution:
      'Construí um sistema de ponto com quatro perfis (Administrador, Gestor, Colaborador e RH), cada um com o que precisa ver e fazer. O colaborador registra e acompanha o próprio saldo, o gestor aprova solicitações do time, o RH audita e corrige com rastro, e a administração consolida tudo sem voltar para planilha.',
    features: [
      {
        title: 'Quatro níveis de acesso',
        description:
          'Administrador, Gestor, Colaborador e RH com permissões separadas. Cada perfil enxerga apenas o escopo que lhe cabe.',
      },
      {
        title: 'Registro de jornada',
        description:
          'Marcação de entrada, saída e intervalos, com o histórico individual disponível para o próprio colaborador.',
      },
      {
        title: 'Relatórios dinâmicos',
        description:
          'Consolidação por período e por colaborador, gerada direto do banco em vez de exportação manual.',
      },
      {
        title: 'Correção auditável pelo RH',
        description:
          'Ajustes de marcação passam pelo RH e ficam registrados, preservando o rastro do que foi alterado.',
      },
    ],
    architecture: [
      'Next.js no front-end, aproveitando renderização no servidor para as telas de relatório',
      'NestJS na API, com módulos separados por domínio e guards para o controle de permissão por perfil',
      'PostgreSQL como banco relacional. Jornada de trabalho é dado relacional e exige integridade',
      'Tailwind CSS para o design system das interfaces sem multiplicar CSS à toa',
      'Autorização baseada em papel aplicada na API, não só na interface',
    ],
    challenges: [
      {
        title: 'Permissão que não pode vazar',
        description:
          'Esconder um botão na interface não é controle de acesso. Toda regra de permissão foi aplicada na camada da API com guards do NestJS, de forma que a interface apenas reflete o que o servidor já garante.',
      },
      {
        title: 'Modelar jornada com casos de exceção',
        description:
          'Turno que vira o dia, intervalo não registrado e correção retroativa quebram um modelo ingênuo. O schema precisou tratar marcação como evento com timestamp, e não como campos fixos de entrada e saída.',
      },
      {
        title: 'Relatório rápido sobre volume crescente',
        description:
          'Consulta de fechamento varre muitos registros. Resolvi com índices nos campos de filtro mais usados (colaborador e período), em vez de agregar em memória na aplicação.',
      },
    ],
    gallery: [
      {
        src: '/pointfy/Captura%20de%20tela%202026-08-13%20202229.png',
        alt: 'Tela de login do PontiFy com ilustração 3D e formulário de acesso',
        caption: 'Login com identidade visual e onboarding do assistente Fy',
      },
      {
        src: '/pointfy/pont.png',
        alt: 'Dashboard do colaborador com presença, saldo de horas e desafios da semana',
        caption: 'Painel do estagiário com métricas do dia e gamificação',
      },
      {
        src: '/pointfy/Captura%20de%20tela%202026-08-13%20213441.png',
        alt: 'Formulário de registro de presença com períodos e meta diária',
        caption: 'Registro de jornada com validação de horários e progresso da meta',
      },
      {
        src: '/pointfy/saldo.png',
        alt: 'Tela de saldo de horas com solicitação de compensação integral e parcial',
        caption: 'Saldo do colaborador e fluxo de compensação com aprovação do gestor',
      },
      {
        src: '/pointfy/1ecc2560-e919-4ec3-bc16-f8e4bb311893.png',
        alt: 'Painel administrativo com resumo por usuário e filtros por período',
        caption: 'Visão do administrador com horas, saldo e lotação por estagiário',
      },
      {
        src: '/pointfy/Captura%20de%20tela%202026-08-13%20203600.png',
        alt: 'Tour guiado do assistente Fy explicando módulos do sistema',
        caption: 'Assistente Fy com tour contextual no painel',
      },
    ],
    stack: [
      { category: 'Frontend', items: ['Next.js', 'React', 'Tailwind CSS'] },
      { category: 'Backend', items: ['NestJS', 'Node.js'] },
      { category: 'Dados', items: ['PostgreSQL'] },
    ],
    repoUrl: 'https://github.com/Victorks4',
  },

  origyn: {
    tagline:
      'E-commerce de moda com provador virtual em 3D ajustado às suas medidas.',
    year: '2026',
    status: 'Em desenvolvimento',
    context:
      'Loja de roupas femininas e unissex nascida para resolver a maior dor de comprar moda online: não dá para experimentar antes. A tabela de medidas em texto não responde a pergunta que o cliente realmente faz, que é como a peça vai ficar nele.',
    problem:
      'No e-commerce de moda, a devolução por caimento é o principal motivo de perda. O cliente escolhe o tamanho no chute a partir de uma tabela genérica, recebe a peça, não serve, e devolve. O custo da logística reversa recai sobre a loja, e a experiência ruim afasta a recompra.',
    solution:
      'Estou construindo uma loja completa onde o cliente informa suas medidas e um avatar 3D é gerado com aquele corpo. A peça é vestida nesse avatar, permitindo girar, aproximar e ver o caimento real antes de comprar, trocando a tabela de medidas por uma resposta visual concreta.',
    features: [
      {
        title: 'Provador virtual com avatar 3D',
        description:
          'O cliente informa suas medidas e o avatar é parametrizado com aquele corpo, mostrando como a peça veste naquele manequim específico e não num modelo padrão.',
      },
      {
        title: 'Visualização interativa',
        description:
          'A peça vestida pode ser girada e aproximada, revelando comprimento, folga e caimento de ângulos que a foto de catálogo não mostra.',
      },
      {
        title: 'Catálogo feminino e unissex',
        description:
          'Navegação por categoria e coleção, com as peças modeladas para funcionar no provador em diferentes tipos de corpo.',
      },
      {
        title: 'Recomendação de tamanho',
        description:
          'A partir das medidas informadas, a loja indica o tamanho com melhor caimento em vez de deixar a decisão inteiramente no chute do cliente.',
      },
      {
        title: 'Fluxo de compra completo',
        description:
          'Carrinho, checkout e gestão de pedidos integrados à experiência do provador, sem quebrar o fluxo até a finalização.',
      },
    ],
    architecture: [
      'Renderização 3D em tempo real no navegador, com o avatar parametrizado pelas medidas do cliente',
      'Modelo de manequim ajustável por parâmetros corporais em vez de um mesh fixo por tamanho',
      'Carregamento sob demanda dos modelos 3D para não pesar o primeiro acesso ao catálogo',
      'Níveis de qualidade adaptativos: dispositivos mais fracos recebem geometria simplificada',
      'Catálogo e pedidos em banco relacional, separados da camada de apresentação 3D',
    ],
    challenges: [
      {
        title: 'Fazer 3D rodar em celular',
        description:
          'Renderização 3D é o oposto de leve, e a maior parte do tráfego de moda vem do celular. A saída foi detectar a capacidade do dispositivo e servir geometria e texturas em níveis diferentes, mantendo o provador utilizável em aparelhos modestos.',
      },
      {
        title: 'Traduzir medidas em um corpo crível',
        description:
          'Transformar números de fita métrica em um avatar que pareça o corpo da pessoa exige interpolar entre formas, não trocar de modelo. O manequim é parametrizado para deformar de maneira contínua conforme as medidas informadas.',
      },
      {
        title: 'Caimento que não engana o cliente',
        description:
          'Um provador que mostra tudo servindo perfeitamente destrói a confiança e não reduz devolução. A representação precisa evidenciar quando a peça fica justa ou folgada, porque o valor está justamente em antecipar o problema.',
      },
      {
        title: 'Não sacrificar o tempo de carregamento',
        description:
          'Loja lenta perde venda antes de chegar no provador. O catálogo carrega primeiro em HTML e imagem convencional, e a camada 3D entra depois, sob demanda, apenas quando o cliente abre o provador.',
      },
    ],
    gallery: [],
    stack: [
      { category: 'Frontend', items: ['React', 'TypeScript', 'Tailwind CSS'] },
      { category: '3D', items: ['Three.js', 'WebGL', 'GLSL'] },
      { category: 'Backend', items: ['Node.js', 'NestJS'] },
      { category: 'Dados', items: ['PostgreSQL'] },
    ],
    repoUrl: 'https://github.com/Victorks4',
  },
}
