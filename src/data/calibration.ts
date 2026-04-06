// ── CEO Calibration Data ──
// Source: "Calibracao-IA-CEO-Preenchido FP docx.docx"
// 13 criteria × 7 levels, with grade examples and AI error patterns.

export type CeoLevel = "Estágio" | "Analista" | "Especialista" | "Coordenador" | "Gerente" | "Diretor" | "C-Level";

export interface GradeExamples {
  grade5: string;
  grade4: string;
  grade2: string;
  grade1: string;
}

export interface LevelExpectation {
  level: CeoLevel;
  expectation: string;
  gradeExamples: GradeExamples;
}

export interface CriterionCalibration {
  criterionId: string;
  criterionTitle: string;
  definition: string;
  levelExpectations: LevelExpectation[];
  commonAIErrors: string[];
  alertExpressions: string[];
}

// ── General calibration constants ──

export const DISTRIBUTION_TARGETS: Record<number, number> = {
  5: 0.05, 4: 0.20, 3: 0.60, 2: 0.10, 1: 0.05,
};

export const EVALUATION_TYPE_WEIGHT: Record<string, string> = {
  gestor: "Visibilidade total. Peso máximo.",
  auto: "Autoavaliação tende a inflação. Sem exemplo concreto externo, nota máxima 3.",
  par: "Visibilidade parcial. Pesar apenas o que observou diretamente. 'Não tenho visibilidade' é resposta válida — desconsiderar critério.",
  liderado: "Perspectiva de baixo para cima. Foco em liderança, suporte, feedback e desenvolvimento.",
};

export const GENERAL_ALERT_EXPRESSIONS: Record<string, number> = {
  "sempre dá o seu melhor": 3,
  "é muito dedicado": 3,
  "não tenho nada negativo a dizer": 3,
  "faz tudo que pedem": 3,
  "está sempre disponível": 3,
  "eu acho que": 3,
  "antes era melhor": 2,
  "não é minha área": 2,
  "já tentei mas não deu": 2,
};

// ── 13 Criterion Calibrations ──

export const criterionCalibrations: CriterionCalibration[] = [
  // ═══ 1. SANGUE NO OLHO ═══
  {
    criterionId: "c1_sangue",
    criterionTitle: "Sangue no Olho",
    definition: "Ir além do que é pedido, não aceitar o 'bom o suficiente', não parar até resolver. Intensidade e comprometimento real com o resultado — não é trabalhar mais horas. É a diferença entre 'fiz minha parte' e 'garanti que o resultado aconteceu'.",
    levelExpectations: [
      {
        level: "Estágio",
        expectation: "Mostra disposição. Não fica esperando tarefa — pergunta, busca, se oferece. Implementa feedback rápido.",
        gradeExamples: {
          grade5: "Estagiário que, usando IA, construiu solução que ninguém imaginou ser possível — sem nunca ter programado na vida.",
          grade4: "Além de executar, identificou problema no processo e propôs melhoria por conta própria, documentando a mudança.",
          grade2: "Faz o que é pedido, mas só o mínimo. Quando dá problema, comunica mas não propõe solução.",
          grade1: "Recebe tarefa, encontra obstáculo e para. Não comunica que travou, não busca alternativa. Fica esperando alguém resolver.",
        },
      },
      {
        level: "Analista",
        expectation: "Resolve problemas dentro do escopo sem precisar de mão. Se o dado não bate, investiga. Se o processo trava, escala rápido. Traz solução junto com o problema.",
        gradeExamples: {
          grade5: "Resolveu problema crítico que bloqueava o time inteiro, fora do escopo, com impacto mensurável.",
          grade4: "Além de fazer a integração pedida, percebeu falha no fluxo anterior que causava retrabalho e corrigiu por conta própria.",
          grade2: "Entrega o relatório no prazo, mas com dados incompletos, e quando questionada diz 'não achei os dados' sem ter buscado alternativa.",
          grade1: "Recebeu bug para investigar, olhou 5 minutos, não achou a causa e deixou parado sem avisar ninguém por 3 dias.",
        },
      },
      {
        level: "Especialista",
        expectation: "Domina a área e puxa a régua técnica. Não aceita entrega meia-boca de si mesmo. Documenta, melhora processos, ensina quem está abaixo. Referência de qualidade.",
        gradeExamples: {
          grade5: "Transformou a área inteira com nova abordagem técnica que elevou o padrão de qualidade de todo o time.",
          grade4: "Referência técnica que identifica e corrige falhas proativamente. Eleva o nível de quem trabalha ao lado.",
          grade2: "Tem o conhecimento mas não puxa o nível do time. Faz o próprio trabalho adequadamente mas sem ir além.",
          grade1: "Não demonstra domínio técnico esperado para o nível. Entregas com qualidade abaixo do padrão.",
        },
      },
      {
        level: "Coordenador",
        expectation: "Garante que o time entrega, não só a própria tarefa. Quando um membro trava, entra junto pra destravar. Não usa 'o time não fez' como desculpa — assume responsabilidade pelo resultado coletivo.",
        gradeExamples: {
          grade5: "Líder que garantiu operação funcionando perfeitamente durante reestruturação — enquanto tudo mudava, a área dele entregou como se nada tivesse acontecido.",
          grade4: "Antecipa problemas do time e resolve antes de virarem crise. Todo mês entrega resultado E melhora um processo.",
          grade2: "Tenta resolver mas precisa de ajuda constante do gestor para manter o time em movimento.",
          grade1: "Delegou sem acompanhar. Quando o time falhou, reportou sem agir. Usa 'não tive tempo' como desculpa.",
        },
      },
      {
        level: "Gerente",
        expectation: "Antecipa problemas antes de virarem crise. Cobra resultado com dados, não com pressão vazia. Constrói rituais que mantêm o time no trilho. Reorganiza prioridades quando a meta aperta.",
        gradeExamples: {
          grade5: "Reestruturou toda a operação da área mantendo ou aumentando output, gerando economia significativa.",
          grade4: "Construiu rituais que mantêm o time performando consistentemente, sem precisar de intervenção constante.",
          grade2: "Gerencia tarefas mas evita conversas difíceis. Não demite quando deveria, não dá feedback duro.",
          grade1: "Define meta no 'feeling' sem olhar histórico. Não acompanha resultado, só cobra quando já é tarde.",
        },
      },
      {
        level: "Diretor",
        expectation: "Puxa transformações que ninguém pediu mas que a empresa precisa. Toma decisões impopulares quando necessário. Não protege a própria área em detrimento do resultado da empresa. Lidera pelo exemplo.",
        gradeExamples: {
          grade5: "Propôs e liderou transformação estrutural que a empresa inteira adotou. Impacto duradouro no negócio.",
          grade4: "Toma decisões difíceis com velocidade. Corta orçamento quando necessário sem drama. Prioriza resultado da empresa.",
          grade2: "Aceita mudanças mas não lidera. Espera que as decisões 'desçam' ao invés de propor.",
          grade1: "Protege a própria área em detrimento do resultado da empresa. Resiste a mudanças necessárias.",
        },
      },
      {
        level: "C-Level",
        expectation: "Define o padrão de intensidade da empresa. Se o C-Level não tem sangue no olho, ninguém abaixo vai ter. Resolve, não delega infinitamente.",
        gradeExamples: {
          grade5: "CEO que fez em 1 dia o dashboard que TI não entregou em 2 anos. Sangue no olho no máximo: resolve pessoalmente quando precisa.",
          grade4: "Define padrão alto e cobra consistentemente. Time inteiro opera com intensidade por influência direta.",
          grade2: "Delega tudo sem acompanhar resultado. Aceita 'bom o suficiente' sem questionar.",
          grade1: "Ausente da operação. Não dá exemplo de intensidade. Time opera no piloto automático.",
        },
      },
    ],
    commonAIErrors: [
      "Não confundir 'trabalhar muitas horas' com Sangue no Olho — se fica até tarde mas entrega pouco, é problema de produtividade",
      "Não confundir 'ser intenso em reunião' com resultado — Sangue no Olho se mede por resultado, não por discurso",
      "Autoavaliações que dizem 'sempre dou meu melhor' sem exemplo concreto são nota 3, no máximo",
    ],
    alertExpressions: ["sempre dou meu melhor", "me dedico muito", "trabalho até tarde", "dou o meu máximo"],
  },

  // ═══ 2. ATITUDE DE DONO ═══
  {
    criterionId: "c2_atitude_dono",
    criterionTitle: "Atitude de Dono",
    definition: "Tratar o problema da empresa como se fosse seu. Não é 'isso não é da minha área'. É olhar pro resultado final, não só pro pedaço que te cabe. Incompatível com 'eu fiz a minha parte'.",
    levelExpectations: [
      { level: "Estágio", expectation: "Cuida do que recebe como se fosse seu. Não desperdiça recurso, não deixa tarefa pela metade. Se vê algo errado fora do escopo, avisa.", gradeExamples: { grade5: "Identificou problema sistêmico que impactava múltiplas áreas e mobilizou ação para resolver.", grade4: "Viu algo errado fora do escopo e não só avisou — propôs solução e ajudou a implementar.", grade2: "Faz a parte dele mas não olha pro todo. Se o processo quebra depois da entrega, não é problema dele.", grade1: "Faz só o que mandam e, quando dá errado, diz 'mas eu fiz o que pediram'." } },
      { level: "Analista", expectation: "Resolve problemas sem esperar que mandem. Se percebe retrabalho no processo, levanta a mão e propõe melhoria. Não joga a bola pro colega.", gradeExamples: { grade5: "Identificou perda financeira, montou solução, implementou e treinou o time — tudo sem ninguém pedir.", grade4: "Percebeu que processo de onboarding gerava churn e propôs redesenho, mesmo não sendo da área de CS.", grade2: "Dev que entrega feature mas não testa em produção — 'QA é com outro time'.", grade1: "Vendedor que perde deal e culpa o lead ruim, sem ter feito follow-up adequado." } },
      { level: "Especialista", expectation: "Guardião da qualidade da área. Se algo vai sair errado, barra — mesmo que o prazo aperte. Pensa em custo e eficiência.", gradeExamples: { grade5: "Redesenhou processo inteiro da área pensando em custo e eficiência, gerando economia mensurável.", grade4: "Barra entregas de baixa qualidade mesmo sob pressão de prazo. Pensa no impacto de longo prazo.", grade2: "Faz o trabalho técnico bem mas não questiona o processo. Se algo está errado fora do escopo, ignora.", grade1: "Não se posiciona quando vê problemas. Deixa passar entregas ruins sem questionar." } },
      { level: "Coordenador", expectation: "Assume resultado do time, não só o próprio. Se alguém errou, não culpa — corrige e previne. Toma decisões operacionais sem escalar tudo.", gradeExamples: { grade5: "Assumiu responsabilidade por resultado cross-funcional e liderou solução que beneficiou múltiplas áreas.", grade4: "Resolve problemas do time sem escalar tudo. Quando alguém erra, corrige e implementa prevenção.", grade2: "Assume resultado individual mas transfere responsabilidade quando o time falha. Escala tudo pro gestor.", grade1: "Não assume resultado do time. Culpa membros individuais quando algo dá errado." } },
      { level: "Gerente", expectation: "Pensa no P&L da área. Não pede recurso sem justificativa de retorno. Demite quando precisa, promove com critério. Age como CEO da área.", gradeExamples: { grade5: "Muda a trajetória da empresa por agir como dono — identifica e resolve problemas milionários sem pedir.", grade4: "Gerencia P&L com rigor. Corta onde precisa, investe onde dá retorno. Decisões difíceis sem drama.", grade2: "Gerencia tarefas mas não P&L. Não demite quando deveria. Evita decisões impopulares.", grade1: "Pede recurso sem justificativa. Não acompanha resultado financeiro. Delega sem accountability." } },
      { level: "Diretor", expectation: "Toma decisão impopular quando é o certo pro negócio. Coloca resultado da empresa acima do conforto da própria diretoria.", gradeExamples: { grade5: "Cortou orçamento da própria área voluntariamente porque viu que outra área precisava mais — visão de empresa.", grade4: "Toma decisões impopulares rapidamente. Não protege a área quando o resultado da empresa exige sacrifício.", grade2: "Aceita decisões de cima mas não toma as próprias. Espera validação para tudo.", grade1: "Protege a própria diretoria em detrimento da empresa. Resiste a cortes necessários." } },
      { level: "C-Level", expectation: "É literalmente dono ou age como tal. Cuida do caixa, do custo, da reputação. Não terceiriza decisão difícil. Quando a governança tá quebrada, reseta.", gradeExamples: { grade5: "Reseta governança inteira da empresa quando necessário — sem esperar que alguém peça, porque é o dono.", grade4: "Cuida de cada real como se fosse do próprio bolso. Toma decisões difíceis com velocidade.", grade2: "Delega demais sem acompanhar resultado. Terceiriza decisões que deveriam ser suas.", grade1: "Ausente das decisões críticas. Não cuida do caixa. Permite desperdício." } },
    ],
    commonAIErrors: [
      "Não confundir 'faz tudo sozinho' com Atitude de Dono — dono delega e confia, mas não larga",
      "Não confundir com 'trabalha no que quer' — é sobre responsabilidade, não autonomia sem alinhamento",
      "Quem diz 'eu resolvo tudo' mas centraliza e vira gargalo NÃO tem atitude de dono",
    ],
    alertExpressions: ["eu fiz a minha parte", "isso não é da minha área", "eu resolvo tudo"],
  },

  // ═══ 3. FOCO EM FATOS E DADOS ═══
  {
    criterionId: "c3_fatos_dados",
    criterionTitle: "Foco em Fatos e Dados",
    definition: "Decidir com base no mensurável, não no que 'parece'. Se alguém diz 'tá indo bem', a resposta é 'mostra o KPI'. Quem não mede, não gerencia.",
    levelExpectations: [
      { level: "Estágio", expectation: "Quando questionado, traz o dado. Não inventa número. Se não sabe, diz que não sabe e vai buscar.", gradeExamples: { grade5: "Criou sistema de coleta de dados que a área não tinha, por iniciativa própria.", grade4: "Traz dados consistentemente sem ser pedido. Sabe onde buscar e apresenta com clareza.", grade2: "Usa dados quando cobrado, mas não espontaneamente. Traz relatório porque foi pedido.", grade1: "Toma decisão sem dado nenhum. Quando questionado, responde com 'eu acho'." } },
      { level: "Analista", expectation: "Fundamenta toda recomendação com dados. Não traz opinião sem evidência. Sabe onde buscar os dados da área.", gradeExamples: { grade5: "Implementou sistema que transformou gestão baseada em opinião para gestão baseada em dados.", grade4: "Criou dashboard que substituiu relatório manual — dado sempre atualizado e acessível em tempo real.", grade2: "Traz relatório na reunião só porque foi pedido. Não sabe explicar variações nos números.", grade1: "Propõe sem dados. Conclusões precipitadas. Ignora dados disponíveis." } },
      { level: "Especialista", expectation: "Questiona dados inconsistentes. Constrói e mantém dashboards da área. Detecta quando o dado não bate com a realidade.", gradeExamples: { grade5: "Redesenhou toda a infraestrutura de dados da área — agora qualquer pessoa acessa em tempo real.", grade4: "Constrói indicadores novos que a área não tinha. Automatiza coleta de dados.", grade2: "Conhece os dados mas não questiona inconsistências. Aceita o que o sistema mostra.", grade1: "Não constrói nem mantém indicadores. Área opera sem métricas sob sua responsabilidade." } },
      { level: "Coordenador", expectation: "Time usa dados no dia a dia por influência dele. Rituais incluem revisão de métricas. Decisões rastreáveis por dados.", gradeExamples: { grade5: "Time inteiro opera com dados em tempo real por cultura que ele criou. Zero decisão por achismo.", grade4: "Rituais da equipe incluem revisão de métricas semanais. Decisões são documentadas com dados.", grade2: "Usa dados próprios mas time ainda decide por achismo. Não cascateia cultura de dados.", grade1: "Não usa dados na gestão do time. Decisões do time são baseadas em opinião." } },
      { level: "Gerente", expectation: "KPIs da área sempre atualizados e acessíveis. Apresenta com números, orçamento, projetos — sem achismo. Usa dados para antecipar problemas.", gradeExamples: { grade5: "Usa IA para cruzar informações e detectar inconsistências automaticamente. Dados governam a área.", grade4: "Monthly sempre com planilha detalhada. Antecipa problemas por tendência de dados antes de acontecerem.", grade2: "KPIs existem mas não são atualizados regularmente. Usa dados para reportar passado, não antecipar.", grade1: "Gerente que define meta no feeling sem olhar histórico. Apresenta sem números." } },
      { level: "Diretor", expectation: "Define quais métricas importam para a empresa. Olha dashboard e em segundos sabe se está on-track.", gradeExamples: { grade5: "Mission Control com dados reais atualizados a cada 2h. Decide com velocidade porque dado está sempre disponível.", grade4: "Define métricas certas e garante que toda a diretoria opera com os mesmos dados.", grade2: "Olha dados quando cobrado mas não lidera cultura de dados na diretoria.", grade1: "Não define métricas. Diretoria opera sem indicadores claros." } },
      { level: "C-Level", expectation: "Toma decisões de milhões com base em dados. Usa IA para cruzar informações e gerar flags automaticamente.", gradeExamples: { grade5: "Cruza planilha de promoções/desligamentos com organograma via IA para gerar flags de defasagem automaticamente.", grade4: "Toda decisão estratégica é fundamentada em dados. Demissão, promoção, investimento — tudo com número.", grade2: "Usa dados pontualmente mas ainda toma decisões importantes por intuição.", grade1: "Decide por intuição. Não monitora KPIs da empresa. Surpreso por resultados ruins." } },
    ],
    commonAIErrors: [
      "Não confundir 'cita números' com 'usa dados' — número solto sem contexto não é usar dados",
      "Cuidado com viés de confirmação — o critério é: o dado influenciou a decisão ou foi enfeite?",
      "Justificativa 'eu acho que...' sem dado = nota máxima 3 em Foco em Fatos e Dados",
    ],
    alertExpressions: ["eu acho que", "na minha percepção", "parece que", "baseado na minha experiência"],
  },

  // ═══ 4. PRIORIZE E SIMPLIFIQUE ═══
  {
    criterionId: "c4_priorize",
    criterionTitle: "Priorize e Simplifique",
    definition: "Fazer primeiro o que importa mais e do jeito mais simples que funcione. 'Mínimo viável é um'. Entrega V1 de todos, depois V2. Quem complica o simples não dura aqui.",
    levelExpectations: [
      { level: "Estágio", expectation: "Entende urgente vs importante quando explicado. Não fica preso em tarefa de baixo impacto sem perguntar.", gradeExamples: { grade5: "Propôs simplificação de processo que ninguém questionava e reduziu tempo de execução significativamente.", grade4: "Identifica sozinho o que é prioridade e reorganiza sua pauta por impacto.", grade2: "Prioriza quando cobrado, mas sozinho se perde. Gasta tempo no que não importa.", grade1: "Não consegue priorizar. Faz tudo ao mesmo tempo e não termina nada." } },
      { level: "Analista", expectation: "Organiza a própria pauta por impacto. Quando tem 5 demandas, sabe qual atacar primeiro. Entrega o essencial sem overengineering.", gradeExamples: { grade5: "Migrou time inteiro de processo manual para automação com IA — o que levava equipe de 5 agora roda com 1.", grade4: "Eliminou 3 etapas de processo de aprovação que ninguém questionava — reduziu de 5 dias para 1.", grade2: "Gastou 3 dias formatando apresentação bonita enquanto o dado crítico não estava pronto.", grade1: "Recebe tarefa de 2 horas e transforma em projeto de 2 semanas com escopo inflado." } },
      { level: "Especialista", expectation: "Simplifica processos que herdou. Não aceita 'sempre foi assim'. Reduz etapas desnecessárias.", gradeExamples: { grade5: "Redesenhou processo inteiro — eliminou etapas, utilizado por todo o time, impacto mensurável.", grade4: "Revisou fluxo existente e reduziu retrabalho significativamente.", grade2: "Reconhece complexidade mas não age para simplificar. 'Sei que é complicado mas...'", grade1: "Propõe soluções complexas demais que aumentam tempo de execução." } },
      { level: "Coordenador", expectation: "Prioriza o backlog do time com critério claro. Sabe dizer não para demandas que não movem o ponteiro. Protege o time de interrupções.", gradeExamples: { grade5: "Estruturou plano que redistribuiu recursos com visão estratégica — time entrega o dobro com mesma equipe.", grade4: "Usa critérios objetivos (impacto, prazo) para priorizar. Protege o time de demandas sem retorno.", grade2: "Tenta priorizar mas precisa do líder para definir o que é importante.", grade1: "Backlog caótico. 50 itens sem prioridade, sem responsável, sem prazo." } },
      { level: "Gerente", expectation: "Corta projetos que não entregam resultado. Não mantém 10 frentes abertas — fecha 3 e faz bem feito. Simplifica rituais.", gradeExamples: { grade5: "Cortou metade dos projetos, focou nos 3 que importam. Resultado da área dobrou.", grade4: "Corta projetos sem retorno com velocidade. Simplifica rituais que viraram burocracia.", grade2: "Mantém muitas frentes abertas. Não consegue cortar projetos por medo de desagradar.", grade1: "10 frentes abertas, nenhuma entregue. Rituais desnecessários consomem tempo do time." } },
      { level: "Diretor", expectation: "Define P0 para a empresa. Simplifica processos inteiros quando o contexto muda.", gradeExamples: { grade5: "Transição de Scrum para Kanban porque sprints ficaram artificiais com IA — simplificou processo inteiro.", grade4: "Define prioridade zero clara e alinha toda a diretoria. Corta o que não é P0.", grade2: "Aceita prioridades de cima mas não simplifica ativamente. Mantém processos por inércia.", grade1: "Não define prioridades. Tudo é urgente, nada é resolvido." } },
      { level: "C-Level", expectation: "Corta pela metade quando necessário. Decide descontinuar ferramentas que complicam mais do que resolvem.", gradeExamples: { grade5: "Meta cortada de 'cento e tantas' para 65 vendas — priorização baseada em realidade, não desejo. Descontinuou ferramentas.", grade4: "Corta com velocidade. Prioriza baseado em dados e impacto. Não mantém ferramentas por inércia.", grade2: "Mantém muitas iniciativas por não conseguir priorizar. Empresa dispersa.", grade1: "Não prioriza. Tudo é prioridade, logo nada é." } },
    ],
    commonAIErrors: [
      "Não confundir 'faz pouco' com 'simplifica' — simplificar é mesmo resultado com menos esforço",
      "Não confundir 'ser rápido' com 'priorizar' — fazer tudo correndo sem critério é desorganização",
    ],
    alertExpressions: ["sempre foi assim", "é complexo demais para mudar", "não dá pra simplificar"],
  },

  // ═══ 5. ESCOPO DA FUNÇÃO ═══
  {
    criterionId: "c5_escopo",
    criterionTitle: "Escopo da Função",
    definition: "Entender o que se espera de você no nível em que está — e entregar nesse nível. Estagiário que quer decidir como diretor é problemático; diretor que faz trabalho de analista também.",
    levelExpectations: [
      { level: "Estágio", expectation: "Foca em aprender e executar. Não tenta decidir o que não entende. Pergunta antes de agir. Aceita feedback sem defensividade.", gradeExamples: { grade5: "Domina o escopo do estágio completamente e já contribui com insights do nível acima de forma madura.", grade4: "Executa com qualidade e já demonstra maturidade para o próximo nível em algumas situações.", grade2: "Precisa ser lembrado toda semana do que deveria estar fazendo.", grade1: "Não entrega o básico do estágio. Precisa de microgerenciamento constante." } },
      { level: "Analista", expectation: "Executa com autonomia dentro do escopo. Sabe quando escalar. Não espera aprovação pra tudo mas não toma decisões que não são suas.", gradeExamples: { grade5: "Já atua com maturidade do nível acima — pensa em impacto de negócio, não só execução.", grade4: "Autônomo no escopo e já influencia decisões pela qualidade das entregas.", grade2: "Executa parcialmente. Precisa de acompanhamento constante para entregar o básico.", grade1: "Não executa o escopo do cargo. Coordenador que não coordena — fica fazendo tarefa operacional." } },
      { level: "Especialista", expectation: "Referência técnica. Influencia decisões pela expertise. Sabe que seu papel é recomendar, não decidir por cima do gestor.", gradeExamples: { grade5: "Define o padrão do que o cargo deveria ser. Referência para toda a empresa.", grade4: "Influencia decisões técnicas e já contribui com visão de negócio.", grade2: "Domina a técnica mas não influencia decisões. Fica isolado no próprio trabalho.", grade1: "Não demonstra expertise esperada. Entregas técnicas abaixo do padrão do cargo." } },
      { level: "Coordenador", expectation: "Gestão de pessoas começa aqui. Resultado é do time, não só dele. Coordena, desobstrui, orienta — não volta a fazer trabalho operacional.", gradeExamples: { grade5: "Já pensa em orçamento e impacto de negócio — se preparando naturalmente para gerência.", grade4: "Gestão de time madura. Time entrega bem, pessoas se desenvolvem sob sua coordenação.", grade2: "Coordena tarefas mas não coordena pessoas. Evita feedback, não desenvolve o time.", grade1: "Faz trabalho operacional e o time fica sem direção. Não coordena." } },
      { level: "Gerente", expectation: "Pensa tático e começa a pensar estratégico. Entrega resultado da área, gerencia orçamento, toma decisões de pessoas. Resolve 80% sem precisar do diretor.", gradeExamples: { grade5: "Já atua como diretor da área — visão estratégica, decisões de estrutura, autonomia total.", grade4: "Gerencia P&L, toma decisões de pessoas com critério, entrega resultado da área consistentemente.", grade2: "Gerencia tarefas mas não gerencia pessoas — evita feedback difícil, não demite quando deveria.", grade1: "Não gerencia. Escala tudo, não toma decisões, time sem direção." } },
      { level: "Diretor", expectation: "Visão estratégica. Decide sobre estrutura, headcount, investimento. Participa de decisões cross-empresa. Prepara Canvas, KPIs, apresenta na monthly.", gradeExamples: { grade5: "Líder promovida a CEO de BU porque já atuava com atitude de dono da unidade — adoção forte de IA, domínio total.", grade4: "Visão estratégica clara, contribui cross-empresa, mantém governança impecável.", grade2: "Fica na dele sem escalar problemas. Não participa de decisões cross-empresa.", grade1: "Não tem visão estratégica. Não apresenta na monthly. Canvas desatualizado." } },
      { level: "C-Level", expectation: "Dono da estratégia. Responde pelo P&L. Contrata, demite, reestrutura. Age com velocidade — ouve, decide, delega, segue.", gradeExamples: { grade5: "Redefine o que a empresa é. Transforma cultura e modelo de operação.", grade4: "Estratégia clara, P&L gerenciado, decisões rápidas e fundamentadas.", grade2: "Delega estratégia. Não responde pelo P&L com profundidade.", grade1: "Ausente das decisões estratégicas. Empresa opera sem dono." } },
    ],
    commonAIErrors: [
      "Não penalizar quem 'faz mais do que o cargo pede' — pode ser sinal de potencial de promoção",
      "O problema é quando faz o que não é dele E deixa de fazer o que é",
      "Não confundir senioridade (tempo) com maturidade de escopo",
    ],
    alertExpressions: ["ele tem muitos anos de empresa", "é sênior"],
  },

  // ═══ 6. ENTREGAS DE VALOR ═══
  {
    criterionId: "c6_entregas",
    criterionTitle: "Entregas de Valor",
    definition: "Resultado que move o ponteiro do negócio. Não é 'fiz muita coisa' — é 'o que eu fiz gerou impacto'. Reunião não é entrega. Slide não é entrega. Entrega é quando algo sai do plano e vai pra produção.",
    levelExpectations: [
      { level: "Estágio", expectation: "Entrega tarefas operacionais com qualidade e prazo. Valor = liberar tempo do time para coisas mais complexas.", gradeExamples: { grade5: "Entrega que transformou a operação do time — muito além do esperado para o nível.", grade4: "Entregas consistentes que geram impacto visível além do operacional.", grade2: "Entrega, mas abaixo do esperado. Volume ok mas impacto zero.", grade1: "Não entrega ou entrega sem impacto. Participa de reuniões mas nada muda." } },
      { level: "Analista", expectation: "Entrega análises e outputs que informam decisões. Relatórios que geram ação, não que ficam na gaveta.", gradeExamples: { grade5: "Análise que mudou a estratégia da área e gerou resultado mensurável.", grade4: "Entregas que superam expectativa — além do pedido, gera insights que ninguém pediu.", grade2: "Entrega relatórios mas não são usados para decisão. Output sem impacto.", grade1: "Não entrega. Participa de reuniões, faz follow-ups, mas resultado concreto é zero." } },
      { level: "Especialista", expectation: "Entrega soluções técnicas que resolvem problemas reais. Automações, integrações, processos novos que funcionam.", gradeExamples: { grade5: "Construiu sistema automatizado que eliminou horas de trabalho manual e garantiu dados atualizados.", grade4: "3 automações no trimestre que economizaram X horas/semana do time.", grade2: "Entrega técnica ok mas sem impacto no negócio. Solução funciona mas ninguém usa.", grade1: "Não entrega soluções técnicas. Conhecimento alto mas output baixo." } },
      { level: "Coordenador", expectation: "Entrega resultado do time. KPIs da equipe melhorando. Projetos no prazo. Pessoas desenvolvidas.", gradeExamples: { grade5: "Além dos projetos do quarter, identificou e implementou melhoria que reduziu churn em X%.", grade4: "KPIs do time melhorando consistentemente. Projetos no prazo, pessoas evoluindo.", grade2: "Time entrega mas resultado da área não evolui. Entregas individuais, não coletivas.", grade1: "Time sem resultado. Projetos atrasados. Pessoas estagnadas." } },
      { level: "Gerente", expectation: "Entrega resultado da área. P&L melhorando. Projetos estratégicos concluídos. Pessoas certas nos lugares certos.", gradeExamples: { grade5: "Migrou de 360 para 150 funcionários mantendo ou aumentando output — entrega de valor no nível máximo.", grade4: "P&L da área melhorando. Projetos estratégicos concluídos. Equipe otimizada.", grade2: "Entrega tarefas individuais mas resultado da área não evolui.", grade1: "Área sem resultado. P&L deteriorando. Projetos atrasados." } },
      { level: "Diretor", expectation: "Entrega transformações. Reestruturações, novos modelos, economias significativas.", gradeExamples: { grade5: "Reestruturação que gerou economia ou receita significativa para a empresa.", grade4: "Transformações na diretoria com resultado mensurável.", grade2: "Mantém a operação mas não transforma. Sem impacto estratégico.", grade1: "Diretoria sem resultado. Não entrega transformações." } },
      { level: "C-Level", expectation: "Entrega o futuro da empresa. Novos mercados, novas linhas de receita, cultura que escala.", gradeExamples: { grade5: "Implementou AI-First como cultura operacional — não como projeto, como DNA da empresa.", grade4: "Novos mercados, novas receitas, cultura evoluindo sob sua liderança.", grade2: "Mantém a empresa funcionando mas sem visão de futuro.", grade1: "Empresa estagnada. Sem novos mercados, sem inovação." } },
    ],
    commonAIErrors: [
      "Não confundir 'estar ocupado' com 'entregar valor' — volume de tarefas ≠ impacto",
      "Para cargos de gestão, a entrega é o resultado do time, não a tarefa pessoal",
    ],
    alertExpressions: ["faz muita coisa", "está sempre ocupado", "trabalha muito"],
  },

  // ═══ 7. CONSISTÊNCIA ═══
  {
    criterionId: "c7_consistencia",
    criterionTitle: "Consistência",
    definition: "Entregar sempre, não só quando motivado ou quando o chefe tá olhando. Prefiro nota 3 consistente do que alternância entre 5 e 1. A empresa cresce com previsibilidade.",
    levelExpectations: [
      { level: "Estágio", expectation: "Chega no horário, entrega no prazo, mantém qualidade padrão. Sem semana incrível seguida de semana fantasma.", gradeExamples: { grade5: "Mantém performance excepcional mês após mês, mesmo em cenários adversos.", grade4: "Consistente e melhora gradualmente. Curva ascendente estável.", grade2: "Oscila. Semanas boas e semanas ruins sem causa externa.", grade1: "Desempenho imprevisível. Faltou em 3 das 5 dailies sem justificativa." } },
      { level: "Analista", expectation: "Output estável. Relatórios saem com a mesma qualidade toda semana. Não precisa de cobrança.", gradeExamples: { grade5: "6+ meses de entregas impecáveis. Time sabe que pode contar 100% das vezes.", grade4: "Entrega consistente e melhora processo todo mês — curva ascendente.", grade2: "Vendedor que bate meta num mês e no seguinte entrega 30% — sem causa externa.", grade1: "Não mantém compromissos recorrentes. Desaparece por dias." } },
      { level: "Especialista", expectation: "Referência estável. Time sabe que pode contar com essa pessoa. Mesma qualidade no dia 1 e no dia 30.", gradeExamples: { grade5: "Referência absoluta de estabilidade. Qualidade técnica impecável por meses.", grade4: "Estável e melhora gradualmente. Puxa o padrão do time para cima.", grade2: "Qualidade varia. Às vezes entrega excelente, às vezes abaixo.", grade1: "Imprevisível. Time não pode contar com entregas consistentes." } },
      { level: "Coordenador", expectation: "Time entrega de forma previsível. Rituais acontecem sempre. Indicadores atualizados sem falha.", gradeExamples: { grade5: "Manteve operação perfeita durante reestruturação — tudo ao redor mudava, área dele entregou normalmente.", grade4: "Time previsível. Rituais funcionam. Indicadores sempre atualizados.", grade2: "Rituais existem mas falham frequentemente. Indicadores atrasados.", grade1: "Time imprevisível. Sem rituais. Sem indicadores." } },
      { level: "Gerente", expectation: "Área performa de forma estável. Sem mês excepcional seguido de catastrófico. KPIs têm tendência, não montanha-russa.", gradeExamples: { grade5: "Área performa consistentemente trimestre após trimestre. KPIs só sobem.", grade4: "Área estável com tendência positiva. Sem surpresas negativas.", grade2: "Meses bons seguidos de meses ruins. KPIs são montanha-russa.", grade1: "Área desorganizada. Resultado imprevisível." } },
      { level: "Diretor", expectation: "Sustenta resultados trimestre após trimestre. Canvas atualizado, weeklies funcionando, monthly com dados prontos.", gradeExamples: { grade5: "Governança impecável por meses. Resultados consistentes que sustentam crescimento.", grade4: "Rituais de governança funcionando. Canvas atualizado. Monthly sem surpresas.", grade2: "Rituais existem mas não são mantidos. Canvas desatualizado.", grade1: "Sem rituais. Governança quebrada. Resultados imprevisíveis." } },
      { level: "C-Level", expectation: "Mantém a cadência da empresa. Daily todo dia, monthly todo mês, talks na data certa. Se o C-Level não é consistente, a empresa oscila.", gradeExamples: { grade5: "Cadência da empresa funciona como relógio por influência direta do C-Level.", grade4: "Mantém rituais da empresa consistentemente. Exemplo de disciplina.", grade2: "Rituais existem mas o C-Level mesmo não segue consistentemente.", grade1: "Sem cadência. Rituais cancelados frequentemente." } },
    ],
    commonAIErrors: [
      "Não confundir 'tempo de empresa' com consistência — 5 anos fazendo o básico por inércia é acomodação, não consistência",
      "Não penalizar oscilações causadas por fatores externos legítimos (reestruturação, mudança de escopo)",
    ],
    alertExpressions: ["tem muitos anos de empresa", "sempre fez assim"],
  },

  // ═══ 8. PENSAR FORA DA CAIXA ═══
  {
    criterionId: "c8_fora_caixa",
    criterionTitle: "Pensar Fora da Caixa",
    definition: "Não aceitar que as coisas precisam ser feitas do jeito que sempre foram. Na Seazone, está ligado a usar IA e tecnologia pra resolver o que parecia impossível.",
    levelExpectations: [
      { level: "Estágio", expectation: "Questiona 'por que faz assim?' de forma construtiva. Traz ideias de eficiência.", gradeExamples: { grade5: "Criou algo que ninguém imaginava possível para o nível.", grade4: "Propõe e implementa soluções criativas que mudam o jogo da equipe.", grade2: "Tenta pensar diferente mas de forma superficial — 'vamos usar IA' sem proposta concreta.", grade1: "Nunca questiona. Faz do jeito que mandaram." } },
      { level: "Analista", expectation: "Propõe abordagens alternativas. Usa ferramentas novas por conta própria. Testa soluções inéditas.", gradeExamples: { grade5: "Criou agente de IA que avalia transcrições de calls automaticamente — substituiu processo manual.", grade4: "Sugeriu trocar relatório manual por dashboard automático e apresentou protótipo.", grade2: "Propõe 'vamos usar IA' sem saber como, sem testar, sem proposta concreta.", grade1: "Faz do jeito que mandaram. Quando trava, para e espera instrução." } },
      { level: "Especialista", expectation: "Traz inovação técnica. Nova ferramenta, framework, abordagem. Não repete solução do ano passado.", gradeExamples: { grade5: "Introduziu tecnologia que mudou completamente como a área opera.", grade4: "Trouxe nova ferramenta/abordagem que o time adotou e gerou resultado.", grade2: "Repete soluções antigas. Não testa abordagens novas.", grade1: "Faz tudo como sempre fez. Resiste a ferramentas novas." } },
      { level: "Coordenador", expectation: "Cria ambiente seguro pra propor ideias. Implementa boas ideias do time, não só as próprias.", gradeExamples: { grade5: "Time inteiro propõe e implementa inovações por cultura que ele criou.", grade4: "Implementa ideias do time e cria espaço seguro para experimentação.", grade2: "Aceita ideias quando forçado mas não estimula criatividade no time.", grade1: "Não aceita ideias diferentes. Time não propõe nada por medo." } },
      { level: "Gerente", expectation: "Reestrutura processos. Questiona rituais por inércia. Substitui Scrum por Kanban quando o contexto muda.", gradeExamples: { grade5: "Reestruturou operação inteira com nova abordagem — resultado dobrou.", grade4: "Substituiu processos por inércia por alternativas mais eficientes.", grade2: "Mantém processos antigos. Não questiona rituais.", grade1: "Resiste ativamente a mudanças de processo." } },
      { level: "Diretor", expectation: "Propõe modelos de negócio ou operação novos. Reorganiza BUs por linhas de receita.", gradeExamples: { grade5: "Reorganizou BUs por linhas de receita — mudança estrutural que ninguém propôs.", grade4: "Propõe novos modelos de operação com visão de negócio.", grade2: "Aceita inovações mas não propõe. Segue o que o C-Level decide.", grade1: "Bloqueia inovação. Mantém modelo antigo por conforto." } },
      { level: "C-Level", expectation: "Redefine o que a empresa é. De 'gestora de imóveis com TI' para 'empresa AI-First'.", gradeExamples: { grade5: "Transformou DNA da empresa — de empresa tradicional para AI-First.", grade4: "Propõe e lidera transformações estruturais com visão de futuro.", grade2: "Aceita inovações pontuais mas não lidera transformação.", grade1: "Resiste a mudar o modelo da empresa." } },
    ],
    commonAIErrors: [
      "Não confundir 'ter ideias' com 'pensar fora da caixa' — ideia sem execução é conversa",
      "Criatividade sem fundamento operacional é distração, não inovação",
      "Pessoa quieta que automatizou metade do trabalho merece nota 4-5 mesmo sem 'evangelizar'",
    ],
    alertExpressions: ["tem boas ideias", "é criativo", "sugere coisas"],
  },

  // ═══ 9. ORGANIZAÇÃO ═══
  {
    criterionId: "c9_organizacao",
    criterionTitle: "Organização",
    definition: "Saber o que precisa fazer, quando, e estar no controle. Zero tolerância com 'esqueci', 'não sabia que era pra hoje'. Se não tem sistema, não tem controle.",
    levelExpectations: [
      { level: "Estágio", expectation: "Lista de tarefas atualizada. Não esquece compromissos. Sabe o que tem pra fazer hoje e amanhã.", gradeExamples: { grade5: "Criou infraestrutura de organização que o time adotou.", grade4: "Organiza a si e ao entorno. Implementou sistema que reduziu reuniões.", grade2: "Se organiza parcialmente. Algumas coisas no sistema, outras na cabeça.", grade1: "Desorganizado. Perde prazo, esquece tarefa, não sabe o que fazer." } },
      { level: "Analista", expectation: "Gerencia próprio tempo com autonomia. Entrega no prazo sem lembrete. Documenta de forma rastreável.", gradeExamples: { grade5: "Sistema de organização pessoal tão bom que virou referência pra área.", grade4: "Raramente precisa de lembrete. Documenta tudo de forma rastreável.", grade2: "Entrega no prazo quando cobrado. Sem cobrança, coisas ficam pendentes.", grade1: "Precisa de lembrete constante. Prazos perdidos. Nada documentado." } },
      { level: "Especialista", expectation: "Além de se organizar, organiza informação da área. Documentação atualizada, processos mapeados.", gradeExamples: { grade5: "Criou sistema automatizado de auditoria de governança com alertas automáticos.", grade4: "Documentação da área impecável. Processos mapeados e atualizados.", grade2: "Se organiza mas não organiza informação da área. Documentação desatualizada.", grade1: "Área sem documentação. Processos na cabeça das pessoas." } },
      { level: "Coordenador", expectation: "Time organizado. Backlog limpo, rituais rodando, nada no limbo.", gradeExamples: { grade5: "Implementou sistema de backlog priorizado com status automático — reduziu reuniões de 3x/semana para 1x.", grade4: "Backlog limpo. Rituais consistentes. Nada cai no limbo.", grade2: "Backlog existe mas é caótico. Rituais existem mas falham.", grade1: "Backlog com 50 itens sem prioridade. Ninguém sabe o que é urgente." } },
      { level: "Gerente", expectation: "Área com governança clara. Canvas atualizado, KPIs acessíveis, projetos rastreáveis. Sem furo de informação.", gradeExamples: { grade5: "Governança da área é referência pra empresa. Tudo documentado, acessível, atualizado.", grade4: "Canvas atualizado. KPIs acessíveis. Sem furos de informação.", grade2: "Governança parcial. Alguns KPIs atualizados, outros não. Furos de informação.", grade1: "Sem governança. Canvas inexistente. KPIs desatualizados." } },
      { level: "Diretor", expectation: "Governança cross-área. Rituais entre diretorias funcionando. Informação flui sem depender de pergunta.", gradeExamples: { grade5: "Governança cross-área impecável. Informação flui automaticamente entre áreas.", grade4: "Rituais entre diretorias funcionando. Informação acessível.", grade2: "Governança da própria área ok mas não cross-área.", grade1: "Sem rituais entre diretorias. Informação em silos." } },
      { level: "C-Level", expectation: "Organização da empresa. Canvas obrigatório, dailies padronizadas, weeklies gravadas, monthly com template.", gradeExamples: { grade5: "Sistema de Canvas obrigatório por liderança, dailies padronizadas, weeklies gravadas — tudo funcionando como relógio.", grade4: "Rituais da empresa padronizados e funcionando. Quando desalinha, reseta com prazo.", grade2: "Rituais existem mas não são mantidos com rigor.", grade1: "Sem padrão de rituais. Cada área faz diferente." } },
    ],
    commonAIErrors: [
      "Não confundir 'ter muitas ferramentas' com 'ser organizado' — 5 apps e não sabe a prioridade",
      "Não penalizar estilo diferente de organização — o critério é: está no controle do que precisa entregar?",
    ],
    alertExpressions: ["usa muitas ferramentas", "tem Notion organizado"],
  },

  // ═══ 10. ADAPTABILIDADE ═══
  {
    criterionId: "c10_adaptabilidade",
    criterionTitle: "Adaptabilidade",
    definition: "Na Seazone de 2026, adaptabilidade é sobrevivência. Não é 'aceitar mudança com boa cara' — é adotar a nova realidade e performar nela. Quem não se adapta, sai.",
    levelExpectations: [
      { level: "Estágio", expectation: "Aceita mudança sem drama. Aprende o novo. Não reclama 'antes era melhor'.", gradeExamples: { grade5: "Transformou mudança em vantagem — propôs novo modelo que a empresa adotou.", grade4: "Se adapta rápido e ajuda outros a se adaptarem. Vira referência.", grade2: "Aceita calada mas não muda comportamento. Passiva, não adaptável.", grade1: "Resiste ativamente. Sabota novas diretrizes. 'Eu não preciso disso'." } },
      { level: "Analista", expectation: "Adapta o próprio trabalho rapidamente. Se a prioridade muda na quarta, até sexta reorientou.", gradeExamples: { grade5: "Diante de reestruturação, não só se adaptou mas propôs novo modelo de operação.", grade4: "Quando a empresa adotou nova ferramenta, aprendeu sozinho, criou tutorial pro time.", grade2: "Abre a ferramenta nova às vezes mas não integrou no trabalho real.", grade1: "Recebeu orientação de usar IA e continua tudo manual. 'Eu não preciso disso'." } },
      { level: "Especialista", expectation: "Quando a área muda de direção, traz melhores práticas do novo contexto. Aprende o novo com profundidade.", gradeExamples: { grade5: "Trouxe expertise do novo contexto que acelerou a transição da área inteira.", grade4: "Aprendeu novo contexto rapidamente e virou referência técnica nele.", grade2: "Aceita mudança mas fica preso ao que dominava. Não aprende o novo.", grade1: "Resiste à nova direção. Tenta manter a forma antiga de trabalhar." } },
      { level: "Coordenador", expectation: "Guia o time na transição. Implementa mudanças sem queda de produtividade.", gradeExamples: { grade5: "Liderou transição do time com resultado melhor que antes da mudança.", grade4: "Implementou mudança no time sem perda de produtividade.", grade2: "Aceita mudança pessoalmente mas não guia o time. Time fica perdido.", grade1: "Resiste e o time resiste junto por influência." } },
      { level: "Gerente", expectation: "Reestrutura a área quando necessário. Reorganiza time, processos e metas sem esperar instrução detalhada.", gradeExamples: { grade5: "Proativamente propôs novo modelo que IA vai reduzir headcount e executou.", grade4: "Reestruturou área rapidamente quando contexto mudou.", grade2: "Implementa mudanças quando mandado mas não propõe.", grade1: "Resiste a reestruturações. Protege modelo antigo." } },
      { level: "Diretor", expectation: "Lidera mudanças. É quem faz a mudança acontecer, não quem espera ela 'descer'.", gradeExamples: { grade5: "Aceitou que IA vai reduzir headcount e proativamente propôs novo modelo.", grade4: "Lidera mudanças estruturais com velocidade.", grade2: "Aceita mas não lidera. Espera que mudança 'desça'.", grade1: "Diretor que não se adaptou foi demitido. Resistência no topo é inaceitável." } },
      { level: "C-Level", expectation: "Define a mudança. AI-First como cultura, descontinuar ferramentas, reestruturar de 360 pra 150 — e executar em semanas.", gradeExamples: { grade5: "Decretou AI-First, descontinuou ferramentas, reestruturou empresa inteira em semanas.", grade4: "Define e executa mudanças com velocidade. Empresa se adapta por influência direta.", grade2: "Aceita necessidade de mudança mas demora meses para executar.", grade1: "Não muda. Empresa estagnada enquanto mercado evolui." } },
    ],
    commonAIErrors: [
      "Não confundir 'não reclamar' com 'ser adaptável' — aceitar calada mas não mudar comportamento é passividade",
      "Não confundir 'entusiasmo vazio' com adaptação real — 'só curioso' sem testar é nota 2, não 3",
    ],
    alertExpressions: ["antes era melhor", "eu já tentei", "não funciona pra mim", "só curioso"],
  },

  // ═══ 11. COMUNICAÇÃO ═══
  {
    criterionId: "c11_comunicacao",
    criterionTitle: "Comunicação",
    definition: "Direta, clara e sem rodeio. Não é falar bonito — é ser entendido. Bad news rápida > good news tardia. Traz problema com solução proposta. Saber quando falar e quando calar.",
    levelExpectations: [
      { level: "Estágio", expectation: "Comunica status quando pedido. Avisa quando trava. Não fica 3 dias em silêncio com tarefa parada.", gradeExamples: { grade5: "Implementou sistema de comunicação que eliminou reuniões de alinhamento.", grade4: "Comunica proativamente. Antecipa necessidade de informação.", grade2: "Manda Slack de 20 linhas sem conclusão clara. Leitor precisa perguntar 'o que você precisa?'.", grade1: "Não comunica. Sabia que projeto ia atrasar há 2 semanas e não falou até a data de entrega." } },
      { level: "Analista", expectation: "Comunica proativamente. Quando termina, avisa. Quando trava, escala. Relatórios claros e objetivos.", gradeExamples: { grade5: "Comunicação tão boa que mudou a cultura de status da equipe.", grade4: "Antecipa necessidade de informação. Preview dos resultados antes da reunião.", grade2: "Comunica quando cobrado. Sem cobrança, fica em silêncio.", grade1: "Silêncio sobre bloqueios. Equipe descobre problemas tarde." } },
      { level: "Especialista", expectation: "Comunica para público técnico e não-técnico com mesma eficácia. Adapta mensagem ao interlocutor.", gradeExamples: { grade5: "Referência de comunicação na empresa. Treina outros a comunicar melhor.", grade4: "Adapta mensagem perfeitamente ao público. Técnico e negócio entendem.", grade2: "Comunica bem tecnicamente mas não para não-técnicos.", grade1: "Comunicação confusa. Tanto técnicos quanto negócio não entendem." } },
      { level: "Coordenador", expectation: "Garante comunicação do time. Status claros, bloqueios visíveis, decisões documentadas. Informação não fica na cabeça de alguém.", gradeExamples: { grade5: "Implementou sistema de status assíncrono que eliminou 80% das reuniões de alinhamento.", grade4: "Status do time sempre visível. Bloqueios aparecem no sistema antes de virarem problema.", grade2: "Informação fica na cabeça das pessoas. Alinhamento depende de reuniões.", grade1: "Time sem visibilidade. Ninguém sabe o status de nada." } },
      { level: "Gerente", expectation: "Comunica pra cima e pra baixo com fluidez. Resume a situação em 3 min pro C-Level. Desdobra estratégia pro time.", gradeExamples: { grade5: "Comunicação que transforma cultura da área — todos comunicam melhor por influência.", grade4: "Resume área em 3 min. Desdobra estratégia de forma que todo mundo entende o porquê.", grade2: "Comunica pra cima ok mas não desdobra pro time. Time não entende a estratégia.", grade1: "Não comunica para nenhum dos lados. Área isolada." } },
      { level: "Diretor", expectation: "Comunicação como ferramenta de alinhamento. Usa rituais para garantir que a mensagem chega. Feedback direto sem ser desnecessariamente duro.", gradeExamples: { grade5: "Comunicou reestruturação em 6 fases — individual → equipe → geral — com mensagem clara em cada etapa.", grade4: "Usa rituais efetivamente para alinhar. Feedback direto e respeitoso.", grade2: "Comunica decisões mas não alinha. Cada um interpreta diferente.", grade1: "Não comunica decisões importantes. Equipe descobre por terceiros." } },
      { level: "C-Level", expectation: "Define o tom de comunicação da empresa. Comunicação é ação, não cerimônia.", gradeExamples: { grade5: "Tom de comunicação da empresa é referência por influência direta do C-Level.", grade4: "Define padrão claro de comunicação. Empresa alinhada.", grade2: "Comunica quando necessário mas não define padrão.", grade1: "Comunicação ausente ou confusa. Empresa desalinhada." } },
    ],
    commonAIErrors: [
      "Não confundir 'fala muito' com 'comunica bem' — verbosidade não é comunicação",
      "Não penalizar estilo informal — na Seazone importa clareza, não formalidade",
      "Silêncio sobre bloqueios é nota 1, não 'discreto'",
    ],
    alertExpressions: ["fala bastante", "participa de muitas reuniões", "é bem articulado"],
  },

  // ═══ 12. COLABORAÇÃO ═══
  {
    criterionId: "c12_colaboracao",
    criterionTitle: "Colaboração",
    definition: "Trabalhar pelo resultado da empresa, não da caixinha. Ajudar outra área sem ordem formal. Não criar feudos. Aceitar e dar feedback construtivo.",
    levelExpectations: [
      { level: "Estágio", expectation: "Ajuda colegas quando pode. Não protege informação. Participa ativamente.", gradeExamples: { grade5: "Construiu pontes entre áreas que geraram resultado significativo.", grade4: "Percebeu erro em outra área e ajudou a corrigir sem ninguém pedir.", grade2: "Colabora quando obrigado, com má vontade.", grade1: "Não colabora ou sabota. Protege informação. Cria atrito." } },
      { level: "Analista", expectation: "Colabora entre áreas quando solicitado. Compartilha conhecimento. Sem 'isso não é comigo'.", gradeExamples: { grade5: "Criou ritual cross-área de compartilhamento que reduziu retrabalho significativamente.", grade4: "Colabora proativamente. Percebeu que outra área usava dado errado e foi ajudar.", grade2: "Entrega o que pedem de outra área, mas sempre tarde e com qualidade inferior.", grade1: "Recusa ajudar outras áreas. 'Isso não é comigo'." } },
      { level: "Especialista", expectation: "Procurado por outras áreas como referência. Contribui para projetos cross-team. Ensina sem arrogância.", gradeExamples: { grade5: "Referência que múltiplas áreas procuram. Contribuição cross-team gera impacto mensurável.", grade4: "Referência técnica que outras áreas procuram. Ensina generosamente.", grade2: "Colabora tecnicamente mas é arrogante ou difícil de abordar.", grade1: "Isolado. Não compartilha conhecimento. Não contribui cross-team." } },
      { level: "Coordenador", expectation: "Facilita colaboração entre times. Quando duas áreas precisam trabalhar juntas, coordena a interface. Não cria silos.", gradeExamples: { grade5: "Times colaboram fluentemente por cultura que ele criou. Zero silos.", grade4: "Facilita interfaces entre times. Projetos cross-team fluem bem.", grade2: "Coordena dentro do time mas cria silos com outras áreas.", grade1: "Cria feudos. Protege informação do time." } },
      { level: "Gerente", expectation: "Colabora com outros gerentes proativamente. Conversa direto com o par, não escala pro diretor.", gradeExamples: { grade5: "Colaboração entre gerências gera resultado que nenhuma área conseguiria sozinha.", grade4: "Resolve conflitos entre áreas direto com o par. Não escala desnecessariamente.", grade2: "Escala conflitos com outras áreas pro diretor ao invés de resolver.", grade1: "Em conflito com outras gerências. Escala tudo." } },
      { level: "Diretor", expectation: "Prioriza resultado da empresa sobre resultado da área. Cede recurso quando outra diretoria precisa mais.", gradeExamples: { grade5: "Cede recurso voluntariamente porque outra área precisa mais. Visão de empresa total.", grade4: "Participa de comitês cross-empresa com postura construtiva.", grade2: "Colabora quando cobrado mas prioriza a própria diretoria.", grade1: "Protege a diretoria. Não cede recurso. Postura defensiva." } },
      { level: "C-Level", expectation: "Colaboração é parte do modelo mental. Debate aberto onde o resultado é melhor do que qualquer um teria sozinho.", gradeExamples: { grade5: "Debate aberto entre CEO e CTO onde ambos discordam mas resultado é superior. Cultura de discordância saudável.", grade4: "Promove cultura onde discordar é saudável e concordar é alinhamento real.", grade2: "Colabora com outros C-Level mas não promove cultura de colaboração.", grade1: "Não colabora com outros C-Level. Decisões em silo." } },
    ],
    commonAIErrors: [
      "Não confundir 'ser simpático' com 'colaborar' — pessoa agradável que não ajuda é sociável, não colaborativa",
      "Não penalizar quem discorda ou dá feedback duro — discordância construtiva é mais valiosa que concordância passiva",
    ],
    alertExpressions: ["é muito querido", "todo mundo gosta", "é simpático"],
  },

  // ═══ 13. USO DE IA ═══
  {
    criterionId: "c13_ia",
    criterionTitle: "Uso de IA",
    definition: "IA não é opcional na Seazone. É AI-First. Quem não adotar, não permanece. Demiti CTO por isso. Promovi duas líderes a CEO de BU por isso. Uso do Claude Cloud é métrica objetiva.",
    levelExpectations: [
      { level: "Estágio", expectation: "Usa IA para todas as tarefas onde faz sentido: rascunhar textos, organizar dados, pesquisar. Não faz manual o que pode fazer com IA.", gradeExamples: { grade5: "Usa IA de forma multiplicadora — compartilha e ensina colegas a usar.", grade4: "Criou automação que substituiu processo manual de horas/semana.", grade2: "Abre a ferramenta às vezes mas não integrou no trabalho real.", grade1: "Não usa IA. Recebeu licença, treinamento, e uso é zero. Deal breaker." } },
      { level: "Analista", expectation: "Integra IA no fluxo diário. Análise de dados, relatórios, automação de repetitivo. Sabe qual ferramenta usar.", gradeExamples: { grade5: "Construiu agente que roda sozinho e entrega resultado. Transformou o processo.", grade4: "Construiu automação que substituiu processo manual. Economiza horas/semana.", grade2: "Usa ChatGPT pra reescrever email esporadicamente. Trabalho real continua manual.", grade1: "Não usa. Tudo manual. Após 3 meses de licença, uso é zero." } },
      { level: "Especialista", expectation: "Constrói com IA. Automações, agentes, prompts especializados. Referência de uso. Compartilha descobertas.", gradeExamples: { grade5: "Referência que criou múltiplos agentes/automações adotados por toda a área.", grade4: "Constrói soluções com IA e compartilha com o time. Referência técnica.", grade2: "Usa IA pessoalmente mas não compartilha nem constrói para o time.", grade1: "Especialista que não usa IA em 2026 é inadmissível." } },
      { level: "Coordenador", expectation: "Time inteiro usa IA por influência e exigência dele. Cria padrões, compartilha práticas. Monitora adoção.", gradeExamples: { grade5: "Time com maior adoção de IA da empresa por cultura que ele criou.", grade4: "Time usa IA no dia a dia. Padrões de uso estabelecidos. Cobra quem não adota.", grade2: "Usa IA pessoalmente mas time não usa. Não cobra adoção.", grade1: "Nem usa nem cobra. Time inteiro no manual." } },
      { level: "Gerente", expectation: "IA está integrada nos processos da área. Não é ferramenta individual — é infraestrutura.", gradeExamples: { grade5: "Avaliação de calls automatizada, dashboards auto-atualizados, relatórios por agentes. IA é infraestrutura.", grade4: "Processos da área integrados com IA. Eficiência mensurável.", grade2: "Alguns processos com IA mas não é infraestrutura. Uso pontual.", grade1: "Área sem IA. Processos 100% manuais." } },
      { level: "Diretor", expectation: "Define estratégia de IA para a diretoria. Sabe onde substitui headcount, onde potencializa, onde não faz sentido.", gradeExamples: { grade5: "Estratégia de IA da diretoria é referência. ROI claro em cada implementação.", grade4: "Define onde IA entra e onde não. Propõe investimento baseado em ROI.", grade2: "Aceita IA quando mandado mas não define estratégia.", grade1: "Não usa IA na diretoria. Resiste à adoção." } },
      { level: "C-Level", expectation: "IA é parte do DNA estratégico. Plano Max de Claude para todos, monitora uso como KPI, constrói automações pessoalmente.", gradeExamples: { grade5: "CEO que dá plano Max, monitora uso como KPI, demite quem não adota, e pessoalmente constrói automações.", grade4: "IA como parte do DNA. Monitora adoção e cobra resultado.", grade2: "Apoia IA mas não monitora adoção nem cobra resultado.", grade1: "Não adota IA pessoalmente. Empresa não é AI-First." } },
    ],
    commonAIErrors: [
      "Não aceitar 'uso ChatGPT' como evidência — perguntar: 'o que mudou no seu processo?'. Se vago, é nota 2",
      "Não confundir 'saber falar sobre IA' com 'usar IA' — entusiasmo sem implementação é nota 2",
      "Pessoa quieta que automatizou metade do trabalho merece nota 4-5 mesmo sem evangelizar",
    ],
    alertExpressions: ["uso chatgpt", "tenho interesse em IA", "estou aprendendo", "só curioso"],
  },
];
