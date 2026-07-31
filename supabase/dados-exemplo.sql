-- =====================================================================
--  DADOS DE EXEMPLO (OPCIONAL)
--
--  Rode no SQL Editor DEPOIS do schema.sql para ver o site preenchido
--  com 8 vagas fictícias e testar a busca, os filtros e a candidatura.
--
--  Para apagar tudo depois, rode a última linha deste arquivo.
-- =====================================================================

insert into public.vagas (
  empresa_nome, titulo, descricao, requisitos, beneficios,
  area, nivel, cidade, estado, modalidade, tipo_contrato,
  salario_min, salario_max, salario_combinar, status, destaque
) values

('Supermercado Bom Preço',
 'Operador de Caixa',
 E'Atendimento aos clientes no caixa, registro de mercadorias, recebimento de pagamentos em dinheiro, cartão e Pix.\n\nEscala 6x1, horário comercial com folgas alternadas aos domingos.',
 E'- Ensino médio completo\n- Experiência com atendimento ao público (desejável)\n- Boa comunicação e organização',
 E'- Vale-transporte\n- Vale-refeição\n- Cesta básica mensal\n- Desconto de 10% nas compras',
 'Atendimento ao cliente', 'Auxiliar', 'Belo Horizonte', 'MG',
 'presencial', 'clt', 1620, 1850, false, 'publicada', true),

('TechNova Sistemas',
 'Desenvolvedor(a) Full Stack Pleno',
 E'Atuar no desenvolvimento e manutenção de aplicações web do nosso produto principal, trabalhando junto ao time de produto e design.\n\nTime remoto, com encontros presenciais trimestrais.',
 E'- 3+ anos com React e Node.js\n- TypeScript e PostgreSQL\n- Git e metodologias ágeis\n- Inglês para leitura técnica',
 E'- Plano de saúde e odontológico\n- Vale-refeição de R$ 1.000/mês\n- Auxílio home office\n- 30 dias de férias + day off no aniversário',
 'Tecnologia da Informação', 'Pleno', null, null,
 'remoto', 'clt', 8000, 12000, false, 'publicada', true),

('Construtora Horizonte',
 'Auxiliar Administrativo',
 E'Apoio à rotina administrativa do escritório de obras: organização de documentos, lançamentos em planilhas, atendimento telefônico e apoio ao setor de compras.',
 E'- Ensino médio completo\n- Pacote Office intermediário (principalmente Excel)\n- Organização e proatividade',
 E'- Vale-transporte\n- Vale-alimentação\n- Plano de saúde após 90 dias',
 'Administração', 'Assistente', 'Contagem', 'MG',
 'presencial', 'clt', 2200, 2600, false, 'publicada', false),

('Clínica Vida Saudável',
 'Recepcionista',
 E'Recepção de pacientes, agendamento de consultas, confirmação de horários por telefone e WhatsApp, organização da sala de espera e apoio ao faturamento.',
 E'- Ensino médio completo\n- Experiência em recepção ou atendimento\n- Boa dicção e simpatia',
 E'- Vale-transporte\n- Vale-refeição\n- Plano de saúde\n- Convênio odontológico',
 'Saúde', 'Assistente', 'Belo Horizonte', 'MG',
 'presencial', 'clt', 1900, 2200, false, 'publicada', false),

('Agência Criativa Pixel',
 'Estágio em Marketing Digital',
 E'Apoio na criação de conteúdo para redes sociais, acompanhamento de métricas, apoio em campanhas de tráfego pago e organização do calendário editorial.\n\nÓtima oportunidade de aprender na prática com um time sênior.',
 E'- Cursando Marketing, Publicidade ou Comunicação\n- A partir do 3º período\n- Conhecimento básico em Canva e redes sociais',
 E'- Bolsa-auxílio\n- Vale-transporte\n- Horário flexível\n- Possibilidade de efetivação',
 'Marketing', 'Estagiário', 'Belo Horizonte', 'MG',
 'hibrido', 'estagio', 1200, 1200, false, 'publicada', false),

('Transportadora Rota Sul',
 'Motorista Carreteiro',
 E'Transporte de cargas em rotas intermunicipais e interestaduais, conferência de mercadorias na carga e descarga, e zelo pelo veículo.',
 E'- CNH categoria E\n- Curso MOPP atualizado\n- Experiência mínima de 2 anos\n- Disponibilidade para viagens',
 E'- Diárias de viagem\n- Plano de saúde\n- Seguro de vida\n- Prêmio por produtividade',
 'Logística / Transporte', 'Pleno', 'Betim', 'MG',
 'presencial', 'clt', 3500, 4500, false, 'publicada', false),

('Escola Aprender Mais',
 'Professor(a) de Matemática — Ensino Fundamental II',
 E'Ministrar aulas de matemática para turmas do 6º ao 9º ano, elaborar planos de aula e avaliações, e participar das reuniões pedagógicas.',
 E'- Licenciatura em Matemática\n- Experiência com ensino fundamental\n- Domínio de metodologias ativas (diferencial)',
 E'- Plano de saúde\n- Vale-transporte\n- Bolsa de estudos para dependentes\n- Recesso escolar remunerado',
 'Educação', 'Pleno', 'Nova Lima', 'MG',
 'presencial', 'clt', null, null, true, 'publicada', false),

('Contabilidade Precisa',
 'Analista Contábil Júnior',
 E'Classificação e conciliação de lançamentos contábeis, apuração de impostos, emissão de guias e apoio no fechamento mensal dos balancetes.',
 E'- Superior completo ou cursando Ciências Contábeis\n- Conhecimento em Domínio/Sage (desejável)\n- Excel intermediário',
 E'- Vale-refeição\n- Plano de saúde\n- Auxílio-educação\n- Horário flexível',
 'Financeiro / Contábil', 'Júnior', 'Belo Horizonte', 'MG',
 'hibrido', 'clt', 2800, 3400, false, 'publicada', false);


-- ---------------------------------------------------------------------
--  PARA APAGAR OS DADOS DE EXEMPLO, rode a linha abaixo:
-- ---------------------------------------------------------------------
-- delete from public.vagas where empresa_id is null and criado_por is null;
