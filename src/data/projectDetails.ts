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
      'Automatiza o atendimento do Bella Beauty no WhatsApp — 24/7, com contexto e escalonamento para humano.',
    year: '2025',
    status: 'Em produção',
    context:
      'Projeto real desenvolvido para o salão Bella Beauty: clientes mandavam mensagem no WhatsApp fora do horário e ficavam sem resposta até o dia seguinte. Contratar plantão humano não fazia sentido para o volume, mas perder o contato custava agendamento. Construí a BellaBot para automatizar esse canal com IA.',
    problem:
      'Mensagens chegavam à noite e no fim de semana e ficavam sem retorno até o dia seguinte. Chatbots de menu numerado não entendiam texto livre e a conversa morria na primeira resposta fora do script. Cada nova mensagem começava do zero, sem lembrar o que o cliente já tinha perguntado.',
    solution:
      'Construí a BellaBot conectando a API do WhatsApp ao Google Gemini, com histórico persistido em SQLite por contato. O assistente interpreta linguagem natural, mantém o fio da conversa entre mensagens e escala para atendimento humano quando a solicitação sai do escopo seguro.',
    features: [
      {
        title: 'Resposta em linguagem natural',
        description:
          'O cliente escreve como falaria com uma pessoa. O Gemini interpreta a intenção sem menus numerados ou palavras-chave exatas.',
      },
      {
        title: 'Memória por contato',
        description:
          'Cada conversa fica salva em SQLite, então o assistente entende referências a mensagens anteriores na mesma thread.',
      },
      {
        title: 'Disponibilidade contínua',
        description:
          'Atendimento ativo 24 horas por dia, incluindo fins de semana e feriados, sem custo de plantão humano.',
      },
      {
        title: 'Escalonamento para humano',
        description:
          'Quando a solicitação sai do escopo seguro, a conversa é encaminhada para atendimento humano em vez de arriscar resposta errada.',
      },
    ],
    results: [
      {
        value: '24/7',
        label: 'atendimento no WhatsApp, inclusive fora do horário do salão',
      },
      {
        value: '0',
        label: 'menus numerados — o cliente escreve em linguagem natural',
      },
      {
        value: '100%',
        label: 'das conversas com histórico persistido por contato',
      },
      {
        value: 'Auto',
        label: 'escalonamento para humano quando a IA não deve decidir sozinha',
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
      'Automatiza a retirada de chaves no SENAI — histórico, status em tempo real e fim da fila no papel.',
    year: '2025',
    status: 'Em produção',
    context:
      'Projeto real desenvolvido durante meu estágio no SENAI: a retirada de chaves dependia de uma folha impressa na portaria — fila, caça ao nome, assinatura à mão e ninguém sabia em tempo real quem estava com qual chave. No horário de troca de aula, o gargalo era visível. Propus e desenvolvi o Smart Key para digitalizar esse fluxo. É uma iniciativa de estágio, não um produto oficial da instituição.',
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
    results: [
      {
        value: '0',
        label: 'folhas de papel na portaria — cada movimentação fica no sistema',
      },
      {
        value: '100%',
        label: 'das retiradas e devoluções com responsável, sala e horário registrados',
      },
      {
        value: 'Tempo real',
        label: 'status de cada chave visível em todos os postos sem refresh',
      },
      {
        value: '2',
        label: 'perfis operacionais (administração e professor) com escopo separado',
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
      'Automatiza o ponto de estagiários no SENAI — registros, saldo, ausências e relatórios sem planilha.',
    year: '2026',
    status: 'Em desenvolvimento',
    context:
      'Projeto real desenvolvido durante meu estágio no SENAI: o controle de frequência de estagiários dependia de planilhas compartilhadas — cada marcação copiada manualmente, saldo conferido na mão e fechamento mensal consumindo tempo de gestores e RH. Propus e desenvolvi o PontiFy para automatizar registros, cálculo de saldo e geração de relatórios. É uma iniciativa de estágio, não um produto oficial da instituição.',
    problem:
      'A planilha não dá visibilidade em tempo real: o gestor não sabe quem está devendo horas sem abrir o arquivo, o estagiário não consulta o próprio saldo sozinho e qualquer correção vira caça ao erro entre versões. Ausências e compensações dependiam de mensagem ou e-mail, sem trilha única. Fechar o mês era trabalho repetitivo e sujeito a inconsistência.',
    solution:
      'Desenvolvi um sistema de ponto com quatro perfis — Administrador, Gestor, Colaborador e RH — cada um com o que precisa ver e fazer. O estagiário registra a jornada e acompanha o saldo; o gestor aprova ausências e compensações do time; o RH audita e corrige com rastro; a administração consolida relatórios por período direto do PostgreSQL, sem exportar planilha.',
    features: [
      {
        title: 'Registro e saldo em tempo real',
        description:
          'O estagiário marca entrada, saída e intervalos e vê o saldo de horas na hora, sem depender do gestor para uma planilha atualizada.',
      },
      {
        title: 'Aprovação de ausências e compensações',
        description:
          'O gestor recebe solicitações do time e aprova ou recusa em um fluxo único, substituindo troca de mensagem e anotação solta.',
      },
      {
        title: 'Auditoria pelo RH',
        description:
          'Correções de marcação passam pelo RH e ficam registradas, com histórico de quem alterou o quê e quando.',
      },
      {
        title: 'Relatórios por período',
        description:
          'Consolidação por colaborador e por mês gerada do banco, eliminando o fechamento manual em planilha.',
      },
    ],
    results: [
      {
        value: '4',
        label: 'perfis com permissão separada (Admin, Gestor, Colaborador, RH)',
      },
      {
        value: '0',
        label: 'planilhas no fechamento mensal — dados centralizados no banco',
      },
      {
        value: '100%',
        label: 'das correções de ponto com rastro auditável pelo RH',
      },
      {
        value: '24/7',
        label: 'consulta de saldo de horas pelo próprio estagiário',
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
      'Automatiza a escolha de tamanho no e-commerce — provador 3D com caimento real antes da compra.',
    year: '2026',
    status: 'Em desenvolvimento',
    context:
      'Loja de roupas femininas e unissex criada para resolver a maior dor de comprar moda online: não dá para experimentar antes. A tabela de medidas em texto não responde à pergunta real do cliente — como a peça vai ficar no corpo dele.',
    problem:
      'No e-commerce de moda, devolução por caimento é o principal motivo de perda. O cliente escolhe o tamanho no chute a partir de uma tabela genérica, recebe a peça, não serve e devolve. A logística reversa custa caro para a loja e a experiência ruim afasta a recompra.',
    solution:
      'Estou construindo uma loja completa onde o cliente informa suas medidas e um avatar 3D é gerado com aquele corpo. A peça é vestida nesse avatar, permitindo girar, aproximar e ver o caimento real antes de comprar — trocando a tabela de medidas por uma resposta visual concreta.',
    features: [
      {
        title: 'Avatar 3D personalizado',
        description:
          'O cliente informa as medidas e o manequim é parametrizado com aquele corpo, mostrando caimento no corpo real e não num modelo padrão.',
      },
      {
        title: 'Visualização interativa do caimento',
        description:
          'A peça vestida pode ser girada e aproximada, revelando comprimento, folga e caimento de ângulos que a foto de catálogo não mostra.',
      },
      {
        title: 'Recomendação de tamanho',
        description:
          'A partir das medidas informadas, a loja indica o tamanho com melhor caimento em vez de deixar a decisão no chute.',
      },
      {
        title: 'Compra sem quebrar o fluxo',
        description:
          'Carrinho, checkout e gestão de pedidos integrados ao provador, da experimentação até a finalização.',
      },
    ],
    results: [
      {
        value: '3D',
        label: 'visualização do caimento antes de adicionar ao carrinho',
      },
      {
        value: '1',
        label: 'avatar parametrizado pelas medidas reais do cliente',
      },
      {
        value: '360°',
        label: 'rotação da peça vestida para inspecionar folga e comprimento',
      },
      {
        value: 'Meta',
        label: 'reduzir devoluções por caimento errado antes de fechar a compra',
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
