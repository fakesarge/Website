export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: string;
  priceNote?: string;
  features: string[];
  popular?: boolean;
  badge?: string;
  icon: "palette" | "code" | "video" | "box" | "headphones" | "star" | "gift" | "shield" | "zap" | "image" | "layers" | "monitor" | "music" | "sparkles" | "crown";
  image?: string;
  rating?: number;
  reviews?: number;
  originalPrice?: string;
}

export interface ShopCategory {
  id: string;
  label: string;
  description: string;
  items: ShopItem[];
  layout: "services" | "grid";
}

export const shopCategories: ShopCategory[] = [
  {
    id: "services",
    label: "Services",
    description: "Professional creative services tailored to your vision",
    layout: "services",
    items: [
      {
        id: "s1",
        name: "Brand Identity",
        description: "Complete brand identity design with logo, colors, and typography guidelines.",
        price: "$149",
        features: ["Custom Logo Design", "Brand Guidelines PDF", "Color Palette", "Typography System", "3 Revision Rounds"],
        icon: "palette",
        badge: "Best Value",
      },
      {
        id: "s2",
        name: "Web Development",
        description: "Custom-built, responsive websites with modern frameworks and clean code.",
        price: "$499",
        priceNote: "Starting at",
        features: ["Responsive Design", "SEO Optimized", "Performance Tuned", "CMS Integration", "Analytics Setup", "30-Day Support"],
        popular: true,
        icon: "code",
      },
      {
        id: "s3",
        name: "Motion & VFX",
        description: "Cinematic animations, intros, and visual effects for your content.",
        price: "$299",
        priceNote: "Per project",
        features: ["4K Rendering", "Custom Animations", "Sound Design", "Unlimited Revisions", "Source Files Included"],
        icon: "video",
      },
    ],
  },
  {
    id: "products",
    label: "Products",
    description: "Ready-to-use digital assets crafted with precision",
    layout: "grid",
    items: [
      {
        id: "p1",
        name: "UI Kit Pro",
        description: "500+ meticulously designed components for modern web applications.",
        price: "$79",
        originalPrice: "$129",
        features: ["500+ Components", "Figma & Sketch", "Dark & Light Modes"],
        icon: "box",
        badge: "New",
        rating: 4.8,
        reviews: 124,
      },
      {
        id: "p2",
        name: "VFX Template Pack",
        description: "Professional-grade visual effects templates for video production.",
        price: "$129",
        originalPrice: "$199",
        features: ["50+ VFX Templates", "4K Resolution", "After Effects"],
        popular: true,
        icon: "star",
        rating: 4.9,
        reviews: 287,
      },
      {
        id: "p3",
        name: "Sound Design Bundle",
        description: "Curated cinematic sound effects and ambient tracks.",
        price: "$59",
        features: ["200+ Sound Effects", "Royalty Free", "WAV & MP3"],
        icon: "headphones",
        rating: 4.7,
        reviews: 93,
      },
      {
        id: "p4",
        name: "3D Asset Collection",
        description: "High-poly 3D models ready for game engines and renders.",
        price: "$189",
        originalPrice: "$249",
        features: ["100+ Models", "PBR Textures", "FBX & OBJ"],
        icon: "layers",
        badge: "Hot",
        rating: 4.6,
        reviews: 58,
      },
      {
        id: "p5",
        name: "Icon Pack Premium",
        description: "2000+ pixel-perfect icons in multiple styles and formats.",
        price: "$39",
        features: ["2000+ Icons", "SVG & PNG", "6 Styles"],
        icon: "sparkles",
        rating: 4.5,
        reviews: 312,
      },
      {
        id: "p6",
        name: "Motion Presets Pro",
        description: "Drag-and-drop animation presets for After Effects & Premiere.",
        price: "$99",
        originalPrice: "$149",
        features: ["150+ Presets", "One-Click Apply", "Tutorials"],
        icon: "video",
        rating: 4.8,
        reviews: 176,
      },
    ],
  },
  {
    id: "others",
    label: "Others",
    description: "Exclusive extras and special offerings",
    layout: "grid",
    items: [
      {
        id: "o1",
        name: "Priority Support",
        description: "Dedicated fast-track support with guaranteed response times.",
        price: "$29",
        priceNote: "/month",
        features: ["1-Hour Response", "Dedicated Agent", "Screen Sharing"],
        icon: "headphones",
        rating: 4.9,
        reviews: 64,
      },
      {
        id: "o2",
        name: "Gift Card",
        description: "Give the gift of premium creative assets to someone special.",
        price: "$50",
        priceNote: "and up",
        features: ["Custom Amount", "Digital Delivery", "Never Expires"],
        popular: true,
        icon: "gift",
        badge: "Popular Gift",
        rating: 5.0,
        reviews: 203,
      },
      {
        id: "o3",
        name: "Lifetime Access Pass",
        description: "Unlimited access to all current and future products forever.",
        price: "$999",
        features: ["All Products", "Future Releases", "Priority Support"],
        icon: "shield",
        badge: "Limited",
        rating: 4.9,
        reviews: 41,
      },
      {
        id: "o4",
        name: "Creator Membership",
        description: "Monthly access to exclusive tools, assets, and community perks.",
        price: "$19",
        priceNote: "/month",
        features: ["Monthly Credits", "Early Access", "Community"],
        icon: "crown",
        badge: "New",
        rating: 4.7,
        reviews: 88,
      },
    ],
  },
];
