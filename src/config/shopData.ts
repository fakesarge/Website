export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: string;
  priceNote?: string;
  features: string[];
  popular?: boolean;
  badge?: string;
  icon: "palette" | "code" | "video" | "box" | "headphones" | "star" | "gift" | "shield" | "zap";
}

export interface ShopCategory {
  id: string;
  label: string;
  description: string;
  items: ShopItem[];
}

export const shopCategories: ShopCategory[] = [
  {
    id: "services",
    label: "Services",
    description: "Professional creative services tailored to your vision",
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
    items: [
      {
        id: "p1",
        name: "UI Kit Pro",
        description: "500+ meticulously designed components for modern web applications.",
        price: "$79",
        features: ["500+ Components", "Figma & Sketch Files", "Dark & Light Modes", "Regular Updates", "Commercial License"],
        icon: "box",
        badge: "New",
      },
      {
        id: "p2",
        name: "VFX Template Pack",
        description: "Professional-grade visual effects templates for video production.",
        price: "$129",
        features: ["50+ VFX Templates", "4K Resolution", "After Effects & Premiere", "Drag & Drop Ready", "Tutorial Included"],
        popular: true,
        icon: "star",
      },
      {
        id: "p3",
        name: "Sound Design Bundle",
        description: "Curated collection of cinematic sound effects and ambient tracks.",
        price: "$59",
        features: ["200+ Sound Effects", "Royalty Free", "WAV & MP3 Formats", "Categorized Library", "Lifetime Access"],
        icon: "headphones",
      },
    ],
  },
  {
    id: "others",
    label: "Others",
    description: "Exclusive extras and special offerings",
    items: [
      {
        id: "o1",
        name: "Priority Support",
        description: "Get dedicated, fast-track support with guaranteed response times.",
        price: "$29",
        priceNote: "/month",
        features: ["1-Hour Response Time", "Dedicated Agent", "Screen Sharing Sessions", "Priority Queue"],
        icon: "headphones",
      },
      {
        id: "o2",
        name: "Gift Card",
        description: "Give the gift of premium creative assets to someone special.",
        price: "$50",
        priceNote: "and up",
        features: ["Custom Amount", "Digital Delivery", "Personal Message", "Never Expires", "Redeemable on All Items"],
        popular: true,
        icon: "gift",
        badge: "Popular Gift",
      },
      {
        id: "o3",
        name: "Lifetime Access Pass",
        description: "One-time payment for unlimited access to all current and future products.",
        price: "$999",
        features: ["All Current Products", "All Future Releases", "Priority Support", "Exclusive Community", "Early Access to Betas"],
        icon: "shield",
        badge: "Limited",
      },
    ],
  },
];
