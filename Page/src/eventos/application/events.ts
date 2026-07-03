import { Table } from 'surrealdb';
import type { Event } from '../domain/event';
import { getDb } from '../../lib/db';

const monthNames = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SET', 'OCT', 'NOV', 'DIC'];

const fallbackImages = [
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
  'https://images.unsplash.com/photo-1558346547-4439467bd1d5?w=600&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80',
];

const fallbackEvents: Event[] = [
  { id: 'hackacm-2025', day: '12', month: 'ABR 2025', title: 'HackACM 2025', description: 'Nuestro hackathon anual de 24 horas. Equipos de hasta 4 personas compitiendo por premios en categorías de IA, sostenibilidad y salud digital.', image: fallbackImages[0], tag: 'Hackathon', location: 'Auditorio Principal', duration: '24h', capacity: 'Equipos de 4', link: '#', buttonText: 'Registrarse' },
  { id: 'intro-ml', day: '24', month: 'ABR 2025', title: 'Introducción a Machine Learning', description: 'Aprende los fundamentos de ML con Python y scikit-learn. Taller práctico con datasets reales y casos de uso de la industria.', image: fallbackImages[1], tag: 'Taller', location: 'Lab de Cómputo 3', duration: '3h', capacity: '30 cupos', link: '#', buttonText: 'Registrarse' },
  { id: 'tech-talk-ciberseguridad', day: '08', month: 'MAY 2025', title: 'Tech Talk: Ciberseguridad en 2025', description: 'Especialista en seguridad informática de una firma multinacional comparte las tendencias, amenazas y oportunidades del sector.', image: fallbackImages[2], tag: 'Keynote', location: 'Sala de Conferencias B', duration: '2h', capacity: 'Abierto', link: '#', buttonText: 'Ver detalles' },
  { id: 'fullstack-workshop', day: '20', month: 'MAY 2025', title: 'Desarrollo Web Full Stack', description: 'Workshop intensivo de React + Node.js + bases de datos. Construirás una aplicación completa desde cero con guía de mentores.', image: fallbackImages[3], tag: 'Workshop', location: 'Lab de Innovación', duration: '6h', capacity: '20 cupos', link: '#', buttonText: 'Registrarse' },
  { id: 'acm-connect', day: '05', month: 'JUN 2025', title: 'ACM Connect: Empresas & Estudiantes', description: 'Feria de conexiones profesionales con representantes de empresas tech. Trae tu CV y prepárate para presentarte en 60 segundos.', image: fallbackImages[4], tag: 'Networking', location: 'Hall Universitario', duration: '4h', capacity: 'Abierto', link: '#', buttonText: 'Ver detalles' },
];

function mapEvent(raw: any, idx: number): Event {
  const id = typeof raw.id === 'object' ? raw.id.id || raw.id : raw.id;
  const hourBeg = raw.hourBeg ? new Date(raw.hourBeg) : null;
  const day = hourBeg ? String(hourBeg.getDate()).padStart(2, '0') : '--';
  const month = hourBeg ? `${monthNames[hourBeg.getMonth()]} ${hourBeg.getFullYear()}` : '---';
  return {
    id: String(id),
    day,
    month,
    title: raw.name ?? '',
    description: raw.description ?? '',
    image: raw.image || fallbackImages[idx % fallbackImages.length],
    tag: raw.modality ?? 'Evento',
    location: raw.place ?? '',
    duration: '',
    capacity: raw.nParticipants ? `${raw.nParticipants} participantes` : 'Abierto',
    link: raw.link ?? '#',
    buttonText: 'Ver evento →',
  };
}

export async function getEvents(): Promise<Event[]> {
  try {
    const db = await getDb();
    const rows = await db.select(new Table('events')) as any[] | undefined;
    if (!rows || rows.length === 0) return fallbackEvents;
    return rows.map((raw, i) => mapEvent(raw, i));
  } catch {
    console.warn('DB unavailable, using fallback event data');
    return fallbackEvents;
  }
}
