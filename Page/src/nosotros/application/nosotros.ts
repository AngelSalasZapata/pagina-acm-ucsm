import type { Stat, TeamMember, TeamRole } from '../domain/team';

export const stats: Stat[] = [
  { value: '120+', label: 'MIEMBROS ACTIVOS' },
  { value: '1°', label: 'AÑO INICIANDO' },
  { value: '40+', label: 'EVENTOS AL AÑO' },
  { value: '8', label: 'PROYECTOS ACTIVOS' },
];

export const badges: string[] = [
  'Programación', 'IA & ML', 'Ciberseguridad', 'Open Source', 'Redes', 'Robótica', 'Computación Cuántica',
];

export const teamMembers: TeamMember[] = [
  { name: 'Andry Caceres', email: 'andry@ucsm.edu.pe', image: '/arelyx.jpg' },
  { name: 'Santiago Cusirramos', email: 'santiago@ucsm.edu.pe' },
  { name: 'Fernando Pacheco', email: 'fernando@ucsm.edu.pe' },
  { name: 'Christian Revilla', email: 'christian@ucsm.edu.pe' },
  { name: 'Miembro 5', email: 'm5@ucsm.edu.pe' },
  { name: 'Miembro 6', email: 'm6@ucsm.edu.pe' },
  { name: 'Miembro 7', email: 'm7@ucsm.edu.pe' },
  { name: 'Miembro 8', email: 'm8@ucsm.edu.pe' },
];

export const teamRoles: TeamRole[] = [
  { name: 'Christian Revilla', role: 'Sponsor', color: 'green' },
  { name: 'Fernando Pacheco', role: 'Tesorero', color: 'blue' },
  { name: 'Santiago Cusirramos', role: 'Vicepresidente', color: 'red' },
];
