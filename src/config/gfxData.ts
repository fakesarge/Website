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
  {id: "blackhole-package",
    title: "Blackhole Package",
    tagline: "Branding Package",
    description:
      "Branding package for Blackhole, a gaming community. The design features a custom logo, a custom discord banner and a custom YouTube thumbnail.",
    image: "images/products/blackhole.png",
    year: "2026", 
    software: ["Photoshop", "Illustrator"],
    attributes: [
      { label: "Typeface", value: "SF Pro Bold" },
      { label: "Palette", value: "Noir", swatches: ["#0a0a1a", "#1a1a1a", "#2a2a2a"] },
      { label: "Mood", value: "Cinematic" },
      { label: "Production Time", value: "4h 45m" },
    ],
  }
  ,{id: "crosshairgg-banner",
    title: "Crosshair.gg Banner",
    tagline: "Discord Banner",
    description:
      "Custom discord banner for Crosshair.gg, a gaming community. The design features a custom environment, cinimatic fighting and clean representation of the brand.",
    image: "images/products/crosshairgg.png",
    year: "2026",
    software: ["Photoshop"],
    attributes: [
      { label: "Typeface", value: "SF Pro Bold" },
      { label: "Palette", value: "Bright Red", swatches: ["#0a0a1a", "#ff0000", "#ff0000e8"] },
      { label: "Mood", value: "Cinematic" },
      { label: "Production Time", value: "3h 25m" },
    ],
  }
  ,{
    id: "titan-banner",
    title: "Titan Banner",
    tagline: "Discord Banner",
    description:
      "Custom discord banner for Titan, a bypass brand. The design features a custom environment, cinimatic fighting and clean representation of the brand.",
    image: "images/products/image (14).png",
    year: "2026",
    software: ["Photoshop"],
    attributes: [
      { label: "Typeface", value: "SF Pro Bold" },
      { label: "Palette", value: "Silver", swatches: ["#0a0a1a", "#9e9e9e", "#a8a8a8e8"] },
      { label: "Mood", value: "Cinematic" },
      { label: "Production Time", value: "1h 25m" },
    ],
  },
  {id: "Lucky-Bypass",
    title: "Lucky Bypass Banner",
    tagline: "Discord Banner",
    description: 
      "Custom discord banner for Lucky Bypass, a bypass brand. The design features a custom environment.",
    image: "images/products/New Project (77).png",
    year: "2026",
    software: ["Photoshop"],
    attributes: [
      { label: "Typeface", value: "SF Pro Bold" },
      { label: "Palette", value: "Green", swatches: ["#0a0a1a", "#7bff00", "#296600e8"] },
      { label: "Mood", value: "Playfull" },
      { label: "Production Time", value: "1h 25m" },
    ],
  }
  ,{
    id: "nexium-banner",
    title: "Nexium Banner",
    tagline: "Discord Banner",
    description:
      "Custom discord banner for Nexium, a gaming community. The design features a custom environment, cinimatic fighting and clean representation of the brand.",
    image: "images/products/image (20).png",
    year: "2026",
    software: ["Photoshop"],
    attributes: [
      { label: "Typeface", value: "SF Pro Bold" },
      { label: "Palette", value: "Golden", swatches: ["#0a0a1a", "#fff9c0", "#ffc774e8"] },
      { label: "Mood", value: "Cinematic" },
      { label: "Production Time", value: "1h 00m" },
    ],
  },
  {id: "titan-banner2",
    title: "Titan Banner 2",
    tagline: "Discord Banner",
    description:
      "Custom discord banner for Titan, a bypass brand. The design features a custom environment, cinimatic fighting and clean representation of the brand.",
    image: "images/products/designtemplate.png",
    year: "2026",
    software: ["Photoshop"],
    attributes: [
      { label: "Typeface", value: "SF Pro Bold" },
      { label: "Palette", value: "Green", swatches: ["#0a0a1a", "#7bff00", "#296600e8"] },
      { label: "Mood", value: "Playfull" },
      { label: "Production Time", value: "1h 25m" },

    ],
  },
  {id: "clubsilent-thumbnail",
    title: "Club Silent Thumbnail",
    tagline: "YouTube Thumbnail",
    description:
      "Custom YouTube thumbnail for Club Silent, a gaming community. The design features a custom environment.",
    image: "images/products/ClubSilent (5).png",
    year: "2026",
    software: ["Photoshop"],
    attributes: [
      { label: "Typeface", value: "SF Pro Bold" },
      { label: "Palette", value: "Blue", swatches: ["#0a0a1a", "#1900ff", "#0267ffe8"] },
      { label: "Mood", value: "Playfull" },
      { label: "Format", value: "1280 × 720" },
      { label: "Production Time", value: "1h 20m" },
    ],
  },
  {
    id: "titan-banner",
    title: "Titan Banner",
    tagline: "Discord Banner",
    description:
      "Custom discord banner for Titan, a bypass brand. The design features a custom environment, cinimatic fighting and clean representation of the brand.",
    image: "images/products/image (21).png",
    year: "2026",
    software: ["Photoshop"],
    attributes: [
      { label: "Typeface", value: "SF Pro Bold" },
      { label: "Palette", value: "Red", swatches: ["#c77878", "#ff0000", "#a8a8a8e8"] },
      { label: "Mood", value: "Cinematic" },
      { label: "Production Time", value: "1h 25m" },
    ],
    }
  ,{
    id: "club44-banner",
    title: "Club 44 Banner",
    tagline: "Discord Banner",
    description: 
      "Custom discord banner for Club 44, a gaming community. The design features a clean representation of the brand, with its prototype.",
    image: "images/products/New Project (52).png",
    year: "2026",
    software: ["Photoshop", "Illustrator"],
    attributes: [
      { label: "Typeface", value: "SF Pro Bold" },
      { label: "Palette", value: "", swatches: ["#3367b6", "#f5f5f7", "#b5d7ff", "#f7faff"] },
      { label: "Mood", value: "Professional" },
      { label: "Format", value: "1920 × 1080" },
      { label: "Production Time", value: "1h 3m" },
    ],
  }
  ,{
    id: "fivemup-thumbnail",
    title: "FiveMUp Thumbnail",
    tagline: "YouTube Thumbnail",
    description:
      "Custom YouTube thumbnail for FiveMUp. The design features their prototype with a custom environment.",
    image: "images/products/New Project (53).png",
    year: "2026",
    software: ["Photoshop"],
    attributes: [
      { label: "Typeface", value: "SF Pro Bold" },
      { label: "Palette", value: "Bright Cinema", swatches: ["#0a0a1a", "#ff0000", "#ff0000e8"] },
      { label: "Format", value: "1280 × 720" },
      { label: "Production Time", value: "1h" },
    ],
  }
  ,{
    id: "74hrs-banner",
    title: "74hrs Banner",
    tagline: "Discord Banner",
    description:
      "Custom discord banner for 74hrs, a gaming community. The design features a custom environment, cinimatic fighting and clean representation of the brand.",
    image: "images/products/New Project (54).png",
    year: "2026",
    software: ["Blender", "Photoshop"],
    attributes: [
      { label: "Typeface", value: "SF Pro Bold" },
      { label: "Palette", value: "Silver", swatches: ["#0a0a1a", "#9e9e9e", "#a8a8a8e8"] },
      { label: "Mood", value: "Cinematic" },
      { label: "Format", value: "1920 × 1080" },
      { label: "Production Time", value: "4h 20m" },
    ],
    },
  {
    id: "club-silent",
    title: "Club Silent Banner",
    tagline: "Discord Banner",
    description:
      "GTA 5 themed custom discord banner for Club Silent, a gaming community. The design features a clean representation of the brand, with its prototype.",
    image: "images/products/New Project (72).png",
    year: "2026",
    software: ["Photoshop", "Illustrator"],
    attributes: [
      { label: "Typeface", value: "SF Pro Bold" },
      { label: "Palette", value: "", swatches: ["#3367b6", "#f5f5f7", "#0004ff", "#00133b"] },
      { label: "Mood", value: "Professional" },
      { label: "Format", value: "1920 × 1080" },
      { label: "Production Time", value: "1h 02m" },
    ],
  },
  {
    id: "havoc-banner",
    title: "Havoc Banner",
    tagline: "Discord Banner",
    description:
      "Neon punk custom discord banner for Havoc, a gaming community. The design features a bold representation of the brand, with its prototype.",
    image: "images/products/New Project (63).png",
    year: "2025",
    software: ["Illustrator", "Photoshop"],
    attributes: [
      { label: "Typeface", value: "Monsterrat" },
      { label: "Palette", value: "Purple Heat", swatches: ["#670086", "#d4d4d8"] },
      { label: "Format", value: "1920 × 1080" },
      { label: "Production Time", value: "3h 15m" },
    ],
  },
  {
    id: "rety-design-banner",
    title: "Rety Design Banner",
    tagline: "Discord branding",
    description:
      "Custom discord banner for Rety Design, a creative agency. The design features a custom scene fully creating a cinematic environment.",
    image: "images/products/New Project (56).png",
    year: "2026",
    software: ["Illustrator", "Photoshop"],
    attributes: [
      { label: "Palette", value: "Bright Cinema", swatches: ["#0a0a1a", "#ffe7b4", "#ffeebfe8"] },
      { label: "Mood", value: "Cinematic" },
      { label: "Format", value: "1920 × 1080" },
      { label: "Production Time", value: "4h 20m" },
    ],
  },
  {
    id: "koda-banner",
    title: "Koda Banner",
    tagline: "Discord Banner",
    description:
      "Custom discord banner for Koda, a streaming community. The design features a custom character made from her face. The character is placed in a cinematic environment, with a color palette inspired by the brand.",
    image: "images/products/New Project (55).png",
    year: "2026",
    software: ["Illustrator", "Photoshop"],
    attributes: [
      { label: "Palette", value: "Cinematic Glow", swatches: ["#0a0a1a", "#ae00ff", "#c688ffe8"] },
      { label: "Mood", value: "Galaxy" },
      { label: "Format", value: "1920 × 1080" },
      { label: "Production Time", value: "1h 20m" },
    ],
  }
];
