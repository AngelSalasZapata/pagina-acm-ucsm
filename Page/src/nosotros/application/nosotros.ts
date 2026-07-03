import { Table } from 'surrealdb';
import type { Stat, TeamMember, TeamRole } from '../domain/team';
import { getDb } from '../../lib/db';

export const stats: Stat[] = [
  { value: '120+', label: 'MIEMBROS ACTIVOS' },
  { value: '1°', label: 'AÑO INICIANDO' },
  { value: '40+', label: 'EVENTOS AL AÑO' },
  { value: '8', label: 'PROYECTOS ACTIVOS' },
];

export const badges: string[] = [
  'Programación', 'IA & ML', 'Ciberseguridad', 'Open Source', 'Redes', 'Robótica', 'Computación Cuántica',
];

const fallbackTeam: TeamMember[] = [
  { name: 'Andry Caceres', email: 'andry@ucsm.edu.pe', image: '/arelyx.jpg' },
  { name: 'Santiago Cusirramos', email: 'santiago@ucsm.edu.pe' },
  { name: 'Fernando Pacheco', email: 'fernando@ucsm.edu.pe' },
  { name: 'Christian Revilla', email: 'christian@ucsm.edu.pe' },
  { name: 'Miembro 5', email: 'm5@ucsm.edu.pe' },
  { name: 'Miembro 6', email: 'm6@ucsm.edu.pe' },
  { name: 'Miembro 7', email: 'm7@ucsm.edu.pe' },
  { name: 'Miembro 8', email: 'm8@ucsm.edu.pe' },
];

const fallbackRoles: TeamRole[] = [
  { name: 'Christian Revilla', role: 'Sponsor', color: 'green' },
  { name: 'Fernando Pacheco', role: 'Tesorero', color: 'blue' },
  { name: 'Santiago Cusirramos', role: 'Vicepresidente', color: 'red' },
];

function mapTeamMember(raw: any): TeamMember {
  return {
    name: raw.name ?? '',
    email: raw.mail ?? '',
    image: raw.nick ? `https://github.com/${raw.nick}.png` : undefined,
  };
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const db = await getDb();
    const rows = await db.select(new Table('partner')) as any[] | undefined;
    if (!rows || rows.length === 0) return fallbackTeam;
    return rows.map(mapTeamMember);
  } catch {
    return fallbackTeam;
  }
}

export async function getTeamRoles(): Promise<TeamRole[]> {
  try {
    const db = await getDb();
    const rows = await db.select(new Table('partner')) as any[] | undefined;
    if (!rows || rows.length === 0) return fallbackRoles;
    return rows.map((raw, i) => ({
      name: raw.name ?? '',
      role: raw.role ?? 'Miembro',
      color: ['green', 'blue', 'red', 'yellow', 'purple', 'orange'][i % 6],
    }));
  } catch {
    return fallbackRoles;
  }
}
