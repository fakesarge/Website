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
      "A fully custom Blender rendered loading screen built for Treches WL FiveM server. Features two characters across two dynamically lit scenes, with smooth camera transitions and atmospheric VFX. Designed to immerse players from the very first frame.",
    youtubeId: "tPed8y9NxnE",
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
    id: "restrict-rp",
    title: "Restrict RP Intro",
    tagline: "High Quality Custom Loading Screen",
    description:
      "A high energy Blender animation crafted fora a 100k die fivem server. Dynamic VFX elements and fluid camera work create a broadcast ready intro that sets the tone for every play.",
    youtubeId: "zpxFhY2z7mQ",
    features: [
      "Custom Character Animation",
      "Dynamic Camera Work",
      "Custom Assets & VFX",
      "Custom Color Grading",
    ],
    productUrl: "/shop",
    size: "wide",
  },
  {
    id: "MotionWorldRP",
    title: "Motion World RP Loading Screen",
    tagline: "Seamless. Professional.",
    description:
      "A premium FiveM Blender loading screen with a fully custom character and one meticulously crafted scene. Smooth transitions, volumetric lighting, and cinematic depth make this a standout piece for any serious server.",
    youtubeId: "Zw9qeW1_H2g",
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
    id: "youtube-promo",
    title: "74hrs YouTube Promo",
    tagline: "Your brand, amplified.",
    description:
      "A dynamic promotional video created for the 74hrs YouTube channel. Combines high quality Blender animation with custom VFX and a professional edit to create a compelling showcase of the channel's content and style.",
    youtubeId: "sBm2Ip0WN1o",
    features: [
      "3D Animations & VFX",
      "Particle Effects",
      "Dramatic Lighting",
      
    ],
    productUrl: "/shop",
    size: "normal",
  },
  {
    id: "christmas-promo2",
    title: "Five Star RP Server Christmas Loading Screen",
    tagline: "A cinematic trailer for FiveM servers.",
    description:
      "A cinematic trailer created for the Five Star RP server. Features custom Blender animations, dynamic VFX, and professional editing to create an engaging promotional video that highlights the server's unique features and community.",
    youtubeId: "e2NGc1GzFiY",
    features: [
      "Fully Custom Blender Animation",
      "Custom VFX Overlays",
      "Professional Color Grading",
      "Sound Design Included",
    ],
    productUrl: "/shop",
    size: "large",
  },
    {
    id: "christmas-promo",
    title: "Limit RP Christmas Promo",
    tagline: "A festive promotional video for Limit RP.",
    description:
      "A holiday-themed promotional video created for the Limit RP server. Combines festive Blender animations, custom VFX, and a cheerful soundtrack to capture the spirit of the season and promote the server's holiday events.",
    youtubeId: "UcO6FMZPC9k",
    features: [
      "In-Game Footage Integration",
      "Custom VFX Overlays",
      "Professional Color Grading",
      "Sound Design Included",
    ],
    productUrl: "/shop",
    size: "tall",
  },
];
