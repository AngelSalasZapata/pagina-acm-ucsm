import { Table } from 'surrealdb';
import type { GalleryItem } from '../domain/gallery';
import { getDb } from '../../lib/db';

const fallbackItems: GalleryItem[] = [
  { id: 'hackacm-2024', src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', caption: 'HackACM 2024', layout: 'large' },
  { id: 'taller-python', src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80', caption: 'Taller de Python', layout: 'normal' },
  { id: 'tech-talk-2024', src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80', caption: 'Tech Talk 2024', layout: 'normal' },
  { id: 'nuestro-equipo', src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80', caption: 'Nuestro Equipo', layout: 'normal' },
  { id: 'acm-connect', src: 'https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=600&q=80', caption: 'ACM Connect', layout: 'normal' },
  { id: 'demo-day-2024', src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=900&q=80', caption: 'Demo Day 2024', layout: 'wide' },
];

function mapGalleryItem(raw: any): GalleryItem {
  const id = typeof raw.id === 'object' ? raw.id.id || raw.id : raw.id;
  return {
    id: String(id),
    src: raw.img ?? '',
    caption: raw.name ?? '',
    layout: 'normal',
  };
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const db = await getDb();
    const rows = await db.select(new Table('galery')) as any[] | undefined;
    if (!rows || rows.length === 0) return fallbackItems;
    return rows.map(mapGalleryItem);
  } catch {
    console.warn('DB unavailable, using fallback gallery data');
    return fallbackItems;
  }
}
