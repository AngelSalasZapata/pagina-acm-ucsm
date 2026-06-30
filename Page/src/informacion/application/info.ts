import type { InfoItem } from '../domain/info';

const infoItems: InfoItem[] = [
  {
    id: 'talleres',
    number: '01',
    title: 'Talleres Técnicos',
    description: 'Sesiones prácticas de programación, diseño de algoritmos, desarrollo web, apps móviles y más. Nivel principiante a avanzado.',
  },
  {
    id: 'hackathons',
    number: '02',
    title: 'Hackathons',
    description: 'Competencias de desarrollo intensivas donde equipos crean soluciones tecnológicas en 24 a 48 horas. Con premios y reconocimientos.',
  },
  {
    id: 'charlas',
    number: '03',
    title: 'Charlas & Keynotes',
    description: 'Invitados del sector tech comparten su experiencia, tendencias de la industria y oportunidades de carrera para estudiantes.',
  },
  {
    id: 'proyectos-abiertos',
    number: '04',
    title: 'Proyectos Abiertos',
    description: 'Colaboramos en proyectos open source que impactan a la comunidad universitaria y más allá. Tu código puede cambiar vidas.',
  },
  {
    id: 'membresia',
    number: '05',
    title: 'Membresía ACM',
    description: 'Acceso a recursos académicos exclusivos, biblioteca digital, certificaciones y red global de profesionales.',
  },
  {
    id: 'networking',
    number: '06',
    title: 'Networking',
    description: 'Eventos sociales y profesionales para conocer reclutadores, mentores y futuros cofundadores de startups.',
  },
];

export function getInfoItems(): InfoItem[] {
  return infoItems;
}
