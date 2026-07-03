-- ------------------------------
-- OPTION
-- ------------------------------

OPTION IMPORT;

-- ------------------------------
-- FUNCTIONS
-- ------------------------------

DEFINE FUNCTION fn::can_manage_events() -> bool { RETURN $auth.role INSIDE ['admin', 'logistPartner', 'mktPartner'] } PERMISSIONS FULL;
DEFINE FUNCTION fn::can_manage_projects() -> bool { RETURN $auth.role INSIDE ['admin', 'proyPartner', 'devPartner'] } PERMISSIONS FULL;

-- ------------------------------
-- TABLE: events
-- ------------------------------

DEFINE TABLE events TYPE NORMAL SCHEMAFULL PERMISSIONS FOR select FULL, FOR create, update, delete WHERE fn::can_manage_events();

DEFINE FIELD OVERWRITE description ON events TYPE none | string PERMISSIONS FULL;
DEFINE FIELD OVERWRITE hourBeg ON events TYPE none | datetime PERMISSIONS FULL;
DEFINE FIELD OVERWRITE hourEnd ON events TYPE none | datetime PERMISSIONS FULL;
DEFINE FIELD OVERWRITE link ON events TYPE none | string PERMISSIONS FULL;
DEFINE FIELD OVERWRITE modality ON events TYPE none | string PERMISSIONS FULL;
DEFINE FIELD OVERWRITE nParticipants ON events TYPE none | int PERMISSIONS FULL;
DEFINE FIELD OVERWRITE name ON events TYPE none | string PERMISSIONS FULL;
DEFINE FIELD OVERWRITE organizators ON events TYPE none | array<string> PERMISSIONS FULL;
DEFINE FIELD OVERWRITE organizators.* ON events TYPE string PERMISSIONS FULL;
DEFINE FIELD OVERWRITE place ON events TYPE none | string PERMISSIONS FULL;
DEFINE FIELD OVERWRITE ponents ON events TYPE none | array<string> PERMISSIONS FULL;
DEFINE FIELD OVERWRITE ponents.* ON events TYPE string PERMISSIONS FULL;



-- ------------------------------
-- TABLE DATA: events
-- ------------------------------

INSERT [ { description: 'Este viernes 3 de julio, desmantelamos los silos en una sesión técnica de alto nivel. Exploraremos la anatomía de los pipelines de CI/CD y cómo el Cloud Engineering está redefiniendo los límites de la entrega continua. No es solo código; es orquestación pura y arquitectura de sistemas críticos. 🌐\n', hourBeg: d'2026-07-03T21:00:00Z', hourEnd: d'2026-07-03T22:00:00Z', id: events:deployingTheFuture, link: 'https://luma.com/419irb6v?tk=HpqwHL', modality: 'Presencial', name: 'Deploying the Future: DevOps y la Era de la Automatización', organizators: ['partner:ar3lyx1'], place: 'Auditorio Santa María, UCSM', ponents: [] }, { description: '🚀 ¿El futuro de la computación? ¡Es cuántico! ⚛️\n¿Quieres saber cómo la Computación Cuántica y la Inteligencia Artificial están cambiando el mundo? 🧠💻\nTe invitamos a una charla exclusiva junto a María Julia Pareja Abarca.\nConoce su trayectoria, su experiencia en el CERN y cómo puedes ser parte de la nueva era tecnológica. Además, ¡tenemos una sorpresa especial al final! 🎁✨', hourBeg: d'2026-07-03T22:00:00Z', hourEnd: d'2026-07-03T23:30:00Z', id: events:masAllaDeLosBits, link: 'https://luma.com/hljkqvbm?tk=DBBOqZ', modality: 'Presencial / Virtual', name: 'Más Allá de los Bits: Conferencia Quantum Computing', organizators: ['partner:ar3lyx1'], place: 'Auditorio Santa María, UCSM', ponents: [] } ];

-- ------------------------------
-- TABLE: galery
-- ------------------------------

DEFINE TABLE galery TYPE NORMAL SCHEMAFULL PERMISSIONS FOR select FULL, FOR create, update, delete WHERE fn::can_manage_events();

DEFINE FIELD OVERWRITE event ON galery TYPE none | record<events> PERMISSIONS FULL;
DEFINE FIELD OVERWRITE img ON galery TYPE none | string PERMISSIONS FULL;
DEFINE FIELD OVERWRITE name ON galery TYPE none | string PERMISSIONS FULL;



-- ------------------------------
-- TABLE DATA: galery
-- ------------------------------


-- ------------------------------
-- TABLE: organizes
-- ------------------------------

DEFINE TABLE organizes TYPE RELATION IN partner OUT events SCHEMAFULL PERMISSIONS FOR select FULL, FOR create, update, delete WHERE fn::can_manage_events();

DEFINE FIELD OVERWRITE in ON organizes TYPE record<partner> PERMISSIONS FULL;
DEFINE FIELD OVERWRITE out ON organizes TYPE record<events> PERMISSIONS FULL;



-- ------------------------------
-- TABLE DATA: organizes
-- ------------------------------

INSERT RELATION [ { id: organizes:icpktsyn803l9vabugwx, in: partner:ar3lyx1, out: events:deployingTheFuture }, { id: organizes:o13hgt4rp0lbt0ry3hg6, in: partner:ar3lyx1, out: events:masAllaDeLosBits } ];

-- ------------------------------
-- TABLE: participatesOn
-- ------------------------------

DEFINE TABLE participatesOn TYPE RELATION IN partner OUT events SCHEMAFULL PERMISSIONS FOR select FULL, FOR create, update, delete NONE;

DEFINE FIELD OVERWRITE in ON participatesOn TYPE record<partner> PERMISSIONS FULL;
DEFINE FIELD OVERWRITE out ON participatesOn TYPE record<events> PERMISSIONS FULL;



-- ------------------------------
-- TABLE DATA: participatesOn
-- ------------------------------


-- ------------------------------
-- TABLE: partner
-- ------------------------------

DEFINE TABLE partner TYPE NORMAL SCHEMAFULL PERMISSIONS FOR select FULL, FOR create, update, delete WHERE $auth.role = 'admin';

DEFINE FIELD OVERWRITE afilDate ON partner TYPE none | datetime PERMISSIONS FULL;
DEFINE FIELD OVERWRITE github ON partner TYPE none | string PERMISSIONS FULL;
DEFINE FIELD OVERWRITE ig ON partner TYPE none | string PERMISSIONS FULL;
DEFINE FIELD OVERWRITE linkedin ON partner TYPE none | string PERMISSIONS FULL;
DEFINE FIELD OVERWRITE mail ON partner TYPE none | string PERMISSIONS FULL;
DEFINE FIELD OVERWRITE name ON partner TYPE none | string PERMISSIONS FULL;
DEFINE FIELD OVERWRITE nick ON partner TYPE none | string PERMISSIONS FULL;
DEFINE FIELD OVERWRITE role ON partner TYPE none | string PERMISSIONS FULL;



-- ------------------------------
-- TABLE DATA: partner
-- ------------------------------

INSERT [ { afilDate: d'2026-06-26T00:00:00Z', id: partner:ar3lyx1, name: 'Andry Caceres', nick: 'AR3LYX1', role: 'admin' }, { afilDate: d'2026-06-29T00:00:00Z', id: partner:mchi, name: 'Marcelo Sebasthian Ramos Aro', nick: 'mchi', role: 'devPartner' } ];

-- ------------------------------
-- TABLE: project
-- ------------------------------

DEFINE TABLE project TYPE NORMAL SCHEMAFULL PERMISSIONS FOR select FULL, FOR create, update, delete WHERE fn::can_manage_projects();

DEFINE FIELD OVERWRITE dateEnd ON project TYPE none | datetime PERMISSIONS FULL;
DEFINE FIELD OVERWRITE dateOri ON project TYPE none | datetime PERMISSIONS FULL;
DEFINE FIELD OVERWRITE description ON project TYPE none | string PERMISSIONS FULL;
DEFINE FIELD OVERWRITE image ON project TYPE none | string PERMISSIONS FULL;
DEFINE FIELD OVERWRITE nMembers ON project TYPE none | int PERMISSIONS FULL;
DEFINE FIELD OVERWRITE name ON project TYPE none | string PERMISSIONS FULL;
DEFINE FIELD OVERWRITE technologies ON project TYPE none | array<string> PERMISSIONS FULL;
DEFINE FIELD OVERWRITE technologies.* ON project TYPE string PERMISSIONS FULL;



-- ------------------------------
-- TABLE DATA: project
-- ------------------------------

INSERT [ { dateOri: d'2026-05-01T00:00:00Z', description: 'Backend unificado de servicios REST y GraphQL para todas las plataformas del capítulo ACM.', id: project:acm_api, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80', name: 'ACM API', technologies: ['Node.js', 'GraphQL', 'PostgreSQL'] }, { dateOri: d'2026-06-12T00:00:00Z', description: 'Blog del capítulo con artículos técnicos, tutoriales y experiencias de miembros de la comunidad.', id: project:acm_blog, image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80', name: 'ACM Blog', technologies: ['Astro', 'MDX', 'RSS'] }, { dateOri: d'2026-03-10T00:00:00Z', description: 'Asistente virtual para resolver dudas sobre el capítulo, eventos, horarios y recursos académicos.', id: project:acm_bot, image: 'https://images.unsplash.com/photo-1537432376144-e84978a2925d?w=600&q=80', name: 'ACM Bot', technologies: ['Python', 'LLM', 'Discord'] }, { dateOri: d'2026-06-10T00:00:00Z', description: 'Herramientas de línea de comandos para gestionar membresías, eventos y automatizar tareas del capítulo.', id: project:acm_cli, image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&q=80', name: 'ACM CLI', technologies: ['Go', 'Cobra', 'Terminal'] }, { dateOri: d'2026-04-15T00:00:00Z', description: 'Sistema de diseño y componentes reutilizables para mantener consistencia visual en todos los proyectos.', id: project:acm_design, image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80', name: 'ACM Design', technologies: ['React', 'Storybook', 'Figma'] }, { dateOri: d'2026-01-20T00:00:00Z', description: 'Juegos educativos interactivos para aprender programación y algoritmos de forma divertida.', id: project:acm_games, image: 'https://images.unsplash.com/photo-1556438064-2d76447b76f0?w=600&q=80', name: 'ACM Games', technologies: ['Phaser', 'TypeScript', 'Canvas'] }, { dateOri: d'2026-02-28T00:00:00Z', description: 'Plataforma de aprendizaje colaborativo con cursos, talleres interactivos y rutas de estudio.', id: project:acm_learn, image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80', name: 'ACM Learn', technologies: ['Next.js', 'MongoDB', 'WebSockets'] }, { dateEnd: d'2026-07-03T00:00:00Z', dateOri: d'2026-06-28T00:00:00Z', description: 'Plataforma oficial del capítulo estudiantil de la UCSM', id: project:acm_page, image: '', nMembers: 5, name: 'Sitio Web UCSM ACM', technologies: ['Astro', 'React', 'Three.js', 'SurrealDB', 'Cloudflare', 'VPN Tunnel'] }, { dateOri: d'2026-04-20T00:00:00Z', description: 'Panel de visualización con métricas del capítulo, asistencia a eventos y estadísticas de membresía.', id: project:dashboard_acm, image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80', name: 'Dashboard ACM', technologies: ['Python', 'React', 'D3'] } ];

-- ------------------------------
-- TABLE: worksOn
-- ------------------------------

DEFINE TABLE worksOn TYPE RELATION IN partner OUT project SCHEMAFULL PERMISSIONS FOR select FULL, FOR create, update, delete WHERE fn::can_manage_projects();

DEFINE FIELD OVERWRITE in ON worksOn TYPE record<partner> PERMISSIONS FULL;
DEFINE FIELD OVERWRITE out ON worksOn TYPE record<project> PERMISSIONS FULL;
DEFINE FIELD OVERWRITE role ON worksOn TYPE none | string PERMISSIONS FULL;
DEFINE FIELD OVERWRITE since ON worksOn TYPE none | datetime PERMISSIONS FULL;



-- ------------------------------
-- TABLE DATA: worksOn
-- ------------------------------

INSERT RELATION [ { id: worksOn:k8y0zbg8hduvxtiekys0, in: partner:mchi, out: project:acm_page, role: 'dev' }, { id: worksOn:yy8gc13e3ud4gcgcpgjs, in: partner:ar3lyx1, out: project:acm_page, role: 'admin' } ];

