import type { GalleryItem } from '../domain/gallery';

const galleryItems: GalleryItem[] = [
  { id: 'hackacm-2024', src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', caption: 'HackACM 2024', layout: 'large' },
  { id: 'taller-python', src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80', caption: 'Taller de Python', layout: 'normal' },
  { id: 'tech-talk-2024', src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80', caption: 'Tech Talk 2024', layout: 'normal' },
  { id: 'nuestro-equipo', src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80', caption: 'Nuestro Equipo', layout: 'normal' },
  { id: 'acm-connect', src: 'https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=600&q=80', caption: 'ACM Connect', layout: 'normal' },
  { id: 'demo-day-2024', src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=900&q=80', caption: 'Demo Day 2024', layout: 'wide' },
];

export function getGalleryItems(): GalleryItem[] {
  return galleryItems;
}
