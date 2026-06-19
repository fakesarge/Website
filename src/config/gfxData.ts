export interface GfxAttribute {
  label: string;       // e.g. "Font"
  value: string;       // e.g. "Neue Haas Grotesk"
  swatches?: string[]; // hex colors when label is "Palette"
}

export interface GfxProject {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;             // main hero image
  attributes: GfxAttribute[]; // floating attribute chips
  software?: string[];
  year?: string;
}

export const gfxProjects: GfxProject[] = [
  {
    id: "midnight-thumbnail",
    title: "Midnight Drive",
    tagline: "Cinematic YouTube thumbnail",
    description:
      "Moody automotive composition built around a single hero light source. Designed for instant readability at 320px while still looking like a poster at full size.",
    image: "https://images.unsplash.com/photo-1517232117076-b8a4d5c1b6f5?auto=format&fit=crop&w=1600&q=80",
    year: "2025",
    software: ["Photoshop", "Blender"],
    attributes: [
      { label: "Typeface", value: "Druk Wide Bold" },
      { label: "Palette", value: "Neon Noir", swatches: ["#0b0d10", "#f5f5f7", "#ff2a4d", "#5d6cff"] },
      { label: "Mood", value: "Cinematic / High Contrast" },
      { label: "Format", value: "1920 × 1080" },
      { label: "Render Time", value: "4h 22m" },
    ],
  },
  {
    id: "shop-banner",
    title: "Vault Drop Banner",
    tagline: "E-commerce hero artwork",
    description:
      "Editorial-style shop banner combining 3D product render with brutalist typography. Layered grain, soft chromatic aberration, and a single accent color carry the entire piece.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80",
    year: "2025",
    software: ["Illustrator", "After Effects"],
    attributes: [
      { label: "Typeface", value: "PP Neue Montreal" },
      { label: "Palette", value: "Silver Heat", swatches: ["#111111", "#d4d4d8", "#ff5b1f", "#ffffff"] },
      { label: "Grid", value: "12 col / 96px gutter" },
      { label: "Texture", value: "35mm grain · 6%" },
    ],
  },
  {
    id: "discord-banner",
    title: "Server Identity Pack",
    tagline: "Discord branding suite",
    description:
      "A full identity drop: server banner, role icons, and announcement cards. Built around one geometric mark that scales from 16px favicon to 1920px hero.",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1600&q=80",
    year: "2024",
    software: ["Figma", "Photoshop"],
    attributes: [
      { label: "Typeface", value: "Space Grotesk" },
      { label: "Palette", value: "Deep Indigo", swatches: ["#0a0a1a", "#4f46e5", "#a78bfa", "#f1f5f9"] },
      { label: "Pieces", value: "12 assets" },
      { label: "Format", value: "SVG + PNG" },
    ],
  },
];
