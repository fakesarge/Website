export interface GalleryProject {
  id: string;
  title: string;
  tagline: string;
  description: string;
  youtubeId: string;
  features: string[];
  productUrl?: string;
  size: "tall" | "wide" | "large" | "normal";
}

export const galleryProjects: GalleryProject[] = [
  {
    id: "treches-wl",
    title: "Treches WL Loading Screen",
    tagline: "Cinematic entry. Unforgettable first impression.",
    description:
      "A fully custom Blender-rendered loading screen built for Treches WL FiveM server. Features two bespoke characters across two dynamically lit scenes, with smooth camera transitions and atmospheric VFX. Designed to immerse players from the very first frame.",
    youtubeId: "dQw4w9WcXcQ",
    features: [
      "2 Custom 3D Characters",
      "2 Cinematic Scenes",
      "Blender Rendered",
      "60fps Smooth Playback",
      "Custom Lighting & VFX",
    ],
    productUrl: "/shop",
    size: "tall",
  },
  {
    id: "stream-intro",
    title: "Stream Intro Animation",
    tagline: "Go live with impact.",
    description:
      "A high-energy Blender animation crafted for Twitch streamers. Dynamic VFX elements, kinetic typography, and fluid camera work create a broadcast-ready intro that sets the tone for every stream.",
    youtubeId: "dQw4w9WcXcQ",
    features: [
      "Broadcast Ready",
      "Dynamic VFX Elements",
      "Kinetic Typography",
      "Custom Color Grading",
    ],
    productUrl: "/shop",
    size: "wide",
  },
  {
    id: "vfx-transitions",
    title: "FiveM Loading Screen",
    tagline: "Seamless. Invisible. Professional.",
    description:
      "A premium FiveM Blender loading screen with a fully custom character and one meticulously crafted scene. Smooth transitions, volumetric lighting, and cinematic depth make this a standout piece for any serious server.",
    youtubeId: "dQw4w9WcXcQ",
    features: [
      "1 Custom Character",
      "Volumetric Lighting",
      "Cinematic Camera Work",
      "Performance Optimized",
    ],
    productUrl: "/shop",
    size: "large",
  },
  {
    id: "logo-reveal",
    title: "3D Logo Reveal",
    tagline: "Your brand, amplified.",
    description:
      "A stunning 3D logo reveal animation with particle effects, dramatic lighting, and smooth camera orbits. Perfect for server intros, YouTube intros, or brand presentations.",
    youtubeId: "dQw4w9WcXcQ",
    features: [
      "3D Logo Animation",
      "Particle Effects",
      "Dramatic Lighting",
      "Multiple Export Formats",
    ],
    productUrl: "/shop",
    size: "normal",
  },
  {
    id: "server-trailer",
    title: "Server Cinematic Trailer",
    tagline: "Tell your server's story.",
    description:
      "A full cinematic trailer for FiveM servers. In-game footage blended with custom VFX overlays, color grading, and a professional soundtrack to create a trailer that rivals AAA game marketing.",
    youtubeId: "dQw4w9WcXcQ",
    features: [
      "In-Game Footage Integration",
      "Custom VFX Overlays",
      "Professional Color Grading",
      "Sound Design Included",
    ],
    productUrl: "/shop",
    size: "normal",
  },
];
