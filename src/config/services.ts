// Editable service catalog used by the Contact / Booking flow.
// Prices are USD ranges. Tweak freely.
export interface BookableService {
  id: string;
  name: string;
  description: string;
  priceMin: number;
  priceMax: number;
  category: "vfx" | "gfx" | "other";
}

export const bookableServices: BookableService[] = [
  {
    id: "loading-screen",
    name: "Custom Loading Screen",
    description: "Fully custom Blender-rendered FiveM loading screen.",
    priceMin: 200,
    priceMax: 500,
    category: "vfx",
  },
  {
    id: "intro-animation",
    name: "Cinematic Intro / Trailer",
    description: "High-energy VFX intro or server trailer.",
    priceMin: 150,
    priceMax: 400,
    category: "vfx",
  },
  {
    id: "discord-banner",
    name: "Discord Banner",
    description: "Custom Photoshop / Blender banner.",
    priceMin: 40,
    priceMax: 120,
    category: "gfx",
  },
  {
    id: "youtube-thumbnail",
    name: "YouTube Thumbnail",
    description: "Click-optimized 1280×720 thumbnail.",
    priceMin: 30,
    priceMax: 90,
    category: "gfx",
  },
  {
    id: "branding-package",
    name: "Full Branding Package",
    description: "Logo + banner + thumbnail bundle.",
    priceMin: 250,
    priceMax: 600,
    category: "gfx",
  },
  {
    id: "custom",
    name: "Something Else / Custom",
    description: "Describe your project — we'll estimate.",
    priceMin: 50,
    priceMax: 1000,
    category: "other",
  },
];
