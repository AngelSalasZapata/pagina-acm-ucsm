import { Table } from 'surrealdb';
import type { Project } from '../domain/project';
import { getDb } from '../../lib/db';

const fallbackProjects: Project[] = [
  { id: 'sitio-web-acm', title: 'Sitio Web UCSM ACM', description: 'Plataforma oficial del capítulo estudiantil de la UCSM', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80', tags: ['Astro', 'Three.js', 'CSS', 'React'], area: 'Web', updatedAt: '2026-06-01', link: 'https://github.com/AngelSalasZapata/pagina-acm-ucsm', linkText: 'Repositorio →' },
  { id: 'app-acm', title: 'App ACM', description: 'Aplicación móvil con eventos, horarios, foros y notificaciones en tiempo real para estudiantes.', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80', tags: ['React Native', 'Firebase'], area: 'Mobile', updatedAt: '2026-05-15', link: '#', linkText: 'Próximamente →' },
  { id: 'dashboard-acm', title: 'Dashboard ACM', description: 'Panel de visualización con métricas del capítulo, asistencia a eventos y estadísticas de membresía.', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80', tags: ['Python', 'React', 'D3'], area: 'Data', updatedAt: '2026-04-20', link: '#', linkText: 'En desarrollo →' },
  { id: 'acm-bot', title: 'ACM Bot', description: 'Asistente virtual para resolver dudas sobre el capítulo, eventos, horarios y recursos académicos.', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80', tags: ['Python', 'LLM', 'Discord'], area: 'IA', updatedAt: '2026-03-10', link: '#', linkText: 'En desarrollo →' },
  { id: 'acm-cli', title: 'ACM CLI', description: 'Herramientas de línea de comandos para gestionar membresías, eventos y automatizar tareas del capítulo.', image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&q=80', tags: ['Go', 'Cobra', 'Terminal'], area: 'CLI', updatedAt: '2026-06-10', link: '#', linkText: 'Explorar →' },
  { id: 'acm-learn', title: 'ACM Learn', description: 'Plataforma de aprendizaje colaborativo con cursos, talleres interactivos y rutas de estudio.', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80', tags: ['Next.js', 'MongoDB', 'WebSockets'], area: 'Educación', updatedAt: '2026-02-28', link: '#', linkText: 'Explorar →' },
  { id: 'acm-api', title: 'ACM API', description: 'Backend unificado de servicios REST y GraphQL para todas las plataformas del capítulo ACM.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80', tags: ['Node.js', 'GraphQL', 'PostgreSQL'], area: 'Backend', updatedAt: '2026-05-01', link: '#', linkText: 'Explorar →' },
  { id: 'acm-design', title: 'ACM Design', description: 'Sistema de diseño y componentes reutilizables para mantener consistencia visual en todos los proyectos.', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80', tags: ['React', 'Storybook', 'Figma'], area: 'Diseño', updatedAt: '2026-04-15', link: '#', linkText: 'Explorar →' },
  { id: 'acm-games', title: 'ACM Games', description: 'Juegos educativos interactivos para aprender programación y algoritmos de forma divertida.', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80', tags: ['Phaser', 'TypeScript', 'Canvas'], area: 'Juegos', updatedAt: '2026-01-20', link: '#', linkText: 'Jugar →' },
  { id: 'acm-blog', title: 'ACM Blog', description: 'Blog del capítulo con artículos técnicos, tutoriales y experiencias de miembros de la comunidad.', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80', tags: ['Astro', 'MDX', 'RSS'], area: 'Contenido', updatedAt: '2026-06-12', link: '#', linkText: 'Leer →' },
];

const fallbackByTitle: Record<string, string> = {};
for (const p of fallbackProjects) {
  fallbackByTitle[p.title.toLowerCase()] = p.image;
}

function mapProject(raw: any): Project {
  const id = typeof raw.id === 'object' ? raw.id.id || raw.id : raw.id;
  const title = raw.name ?? '';
  return {
    id: String(id),
    title,
    description: raw.description ?? '',
    image: fallbackByTitle[title.toLowerCase()] || raw.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
    tags: raw.technologies ?? [],
    area: 'Web',
    updatedAt: raw.dateOri ?? '',
    link: raw.link ?? '#',
    linkText: 'Ver proyecto →',
  };
}

export async function getProjects(): Promise<Project[]> {
  try {
    const db = await getDb();
    const rows = await db.select(new Table('project')) as any[] | undefined;
    if (!rows || rows.length === 0) return fallbackProjects;
    return rows.map(raw => mapProject(raw));
  } catch {
    console.warn('DB unavailable, using fallback project data');
    return fallbackProjects;
  }
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  try {
    const db = await getDb();
    const rows = await db.select(new Table('project')) as any[] | undefined;
    const record = rows?.find((r: any) => {
      const rid = typeof r.id === 'object' ? r.id.id || r.id : r.id;
      return String(rid) === id;
    });
    if (record) return mapProject(record);
  } catch {
    return fallbackProjects.find(p => p.id === id);
  }
  return undefined;
}
