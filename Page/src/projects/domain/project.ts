export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  area: string;
  updatedAt: string;
  link: string;
  linkText: string;
}

export interface ProjectLayout {
  w: number;
  h: number;
  x: number;
  y: number;
  rot: number;
  z: number;
}
