export interface ShopReview {
  username: string;
  rating: number;
  text: string;
  date: string;
  helpful?: boolean;
}

export interface MediaItem {
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  label?: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  price: string;
  priceNote?: string;
  features: string[];
  popular?: boolean;
  badge?: string;
  icon: "palette" | "code" | "video" | "box" | "headphones" | "star" | "gift" | "shield" | "zap" | "image" | "layers" | "monitor" | "music" | "sparkles" | "crown";
  image?: string;
  images?: string[];
  media?: MediaItem[];
  rating?: number;
  reviews?: number;
  originalPrice?: string;
  userReviews?: ShopReview[];
  purchaseUrl?: string;
}

export interface ShopCategory {
  id: string;
  label: string;
  description: string;
  items: ShopItem[];
  layout: "services" | "grid";
}

const defaultReviews: ShopReview[] = [
  { username: "Alex M.", rating: 5, text: "Absolutely incredible quality. Exceeded all expectations and the turnaround was lightning fast.", date: "2025-12-15", helpful: true },
  { username: "Jordan K.", rating: 4, text: "Great product overall. Very professional and polished. Would recommend to anyone.", date: "2025-11-28" },
  { username: "Taylor R.", rating: 5, text: "Best purchase I've made this year. The attention to detail is remarkable.", date: "2025-11-10", helpful: true },
  { username: "Casey W.", rating: 5, text: "Stunning results. Communication was smooth and delivery was on time.", date: "2025-10-22" },
];

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
        fullDescription: "Transform your brand with a comprehensive identity package. We craft distinctive logos, define harmonious color palettes, establish typography systems, and deliver a complete brand guidelines document that ensures consistency across all touchpoints. Our process includes in-depth discovery sessions to understand your vision and competitive landscape.",
        price: "$149",
        features: ["Custom Logo Design", "Brand Guidelines PDF", "Color Palette", "Typography System", "3 Revision Rounds"],
        icon: "palette",
        badge: "Best Value",
        rating: 4.9,
        reviews: 147,
        userReviews: [
          { username: "Morgan D.", rating: 5, text: "They completely transformed our brand. The guidelines document alone was worth the investment.", date: "2025-12-20", helpful: true },
          { username: "Riley S.", rating: 5, text: "Incredibly thoughtful design process. Our logo gets compliments everywhere.", date: "2025-11-15" },
          { username: "Avery P.", rating: 4, text: "Great work on the color palette and typography. Very professional deliverables.", date: "2025-10-30", helpful: true },
          { username: "Quinn L.", rating: 5, text: "Three revision rounds was more than enough. They nailed it on the second try!", date: "2025-10-12" },
        ],
      },
      {
        id: "s2",
        name: "Web Development",
        description: "Custom-built, responsive websites with modern frameworks and clean code.",
        fullDescription: "Get a blazing-fast, pixel-perfect website built with cutting-edge technology. We use modern frameworks like React and Next.js to deliver responsive, SEO-optimized sites that perform flawlessly on every device. Includes CMS integration, analytics setup, and 30 days of post-launch support to ensure everything runs smoothly.",
        price: "$499",
        priceNote: "Starting at",
        features: ["Responsive Design", "SEO Optimized", "Performance Tuned", "CMS Integration", "Analytics Setup", "30-Day Support"],
        popular: true,
        icon: "code",
        rating: 4.9,
        reviews: 312,
        userReviews: [
          { username: "Blake T.", rating: 5, text: "Our site loads in under 2 seconds now. The performance optimization was incredible.", date: "2025-12-18", helpful: true },
          { username: "Drew H.", rating: 5, text: "Best web dev team I've worked with. Clean code, great communication, on-time delivery.", date: "2025-11-22", helpful: true },
          { username: "Sam F.", rating: 4, text: "Really solid work. The CMS integration made content management a breeze for our team.", date: "2025-11-05" },
          { username: "Jamie C.", rating: 5, text: "The 30-day support was a lifesaver. They helped us fine-tune everything post-launch.", date: "2025-10-15" },
        ],
      },
      {
        id: "s3",
        name: "Motion & VFX",
        description: "Cinematic animations, intros, and visual effects for your content.",
        fullDescription: "Elevate your content with studio-quality motion graphics and visual effects. From cinematic intros and logo animations to complex compositing and particle effects — we bring your vision to life in stunning 4K. Every project includes custom sound design and unlimited revisions until you're 100% satisfied.",
        price: "$299",
        priceNote: "Per project",
        features: ["4K Rendering", "Custom Animations", "Sound Design", "Unlimited Revisions", "Source Files Included"],
        icon: "video",
        rating: 4.8,
        reviews: 198,
        userReviews: [
          { username: "Chris B.", rating: 5, text: "The VFX quality rivals what I've seen from major studios. Absolutely blown away.", date: "2025-12-10", helpful: true },
          { username: "Pat N.", rating: 5, text: "Unlimited revisions was key for us. They were patient and delivered exactly what we envisioned.", date: "2025-11-18" },
          { username: "Robin G.", rating: 4, text: "Excellent 4K rendering quality. Sound design added that extra layer of professionalism.", date: "2025-10-28", helpful: true },
          { username: "Lee V.", rating: 5, text: "Source files included was a huge bonus. Great for future iterations of our content.", date: "2025-10-05" },
        ],
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
        fullDescription: "Accelerate your design workflow with over 500 beautifully crafted UI components. Includes buttons, forms, navigation elements, data tables, cards, modals, and more — all available in both Figma and Sketch formats with dark and light mode variants. Pixel-perfect and ready to integrate into any project.",
        price: "$79",
        originalPrice: "$129",
        features: ["500+ Components", "Figma & Sketch", "Dark & Light Modes", "Auto Layout", "Design Tokens", "Regular Updates"],
        icon: "box",
        badge: "New",
        image: "/images/products/ui-kit-pro.jpg",
        images: ["/images/products/ui-kit-pro.jpg"],
        rating: 4.8,
        reviews: 124,
        userReviews: [
          { username: "Skyler M.", rating: 5, text: "This UI kit saved me weeks of design work. Components are incredibly well-organized.", date: "2025-12-14", helpful: true },
          { username: "Dana R.", rating: 4, text: "Great variety of components. Dark mode implementation is particularly well done.", date: "2025-11-20" },
          ...defaultReviews.slice(2),
        ],
      },
      {
        id: "p2",
        name: "VFX Template Pack",
        description: "Professional-grade visual effects templates for video production.",
        fullDescription: "Take your video production to the next level with 50+ professionally crafted VFX templates. Each template is rendered in 4K resolution and fully customizable in After Effects. Includes explosions, smoke, fire, lens flares, glitch effects, and cinematic transitions — all drag-and-drop ready.",
        price: "$129",
        originalPrice: "$199",
        features: ["50+ VFX Templates", "4K Resolution", "After Effects", "Drag & Drop", "Tutorial Videos", "Commercial License"],
        popular: true,
        icon: "star",
        image: "/images/products/vfx-template-pack.jpg",
        images: ["/images/products/vfx-template-pack.jpg"],
        rating: 4.9,
        reviews: 287,
        userReviews: defaultReviews,
      },
      {
        id: "p3",
        name: "Sound Design Bundle",
        description: "Curated cinematic sound effects and ambient tracks.",
        fullDescription: "A comprehensive collection of 200+ royalty-free sound effects and ambient tracks perfect for film, games, and content creation. Includes cinematic impacts, transitions, atmospheres, UI sounds, and musical stingers — all professionally mastered and delivered in high-quality WAV and MP3 formats.",
        price: "$59",
        features: ["200+ Sound Effects", "Royalty Free", "WAV & MP3", "Cinematic Quality", "Game-Ready", "Stems Included"],
        icon: "headphones",
        image: "/images/products/sound-design.jpg",
        images: ["/images/products/sound-design.jpg"],
        rating: 4.7,
        reviews: 93,
        userReviews: defaultReviews,
      },
      {
        id: "p4",
        name: "3D Asset Collection",
        description: "High-poly 3D models ready for game engines and renders.",
        fullDescription: "Jumpstart your 3D projects with 100+ high-poly models featuring PBR textures. Optimized for Unreal Engine, Unity, and Blender. Includes characters, environments, props, and vehicles — each with multiple LOD levels and clean topology for easy customization.",
        price: "$189",
        originalPrice: "$249",
        features: ["100+ Models", "PBR Textures", "FBX & OBJ", "Multiple LODs", "Clean Topology", "Engine Ready"],
        icon: "layers",
        badge: "Hot",
        image: "/images/products/3d-assets.jpg",
        images: ["/images/products/3d-assets.jpg"],
        rating: 4.6,
        reviews: 58,
        userReviews: defaultReviews,
      },
      {
        id: "p5",
        name: "Icon Pack Premium",
        description: "2000+ pixel-perfect icons in multiple styles and formats.",
        fullDescription: "The ultimate icon collection with 2000+ meticulously crafted icons across 6 distinct styles: outline, solid, duotone, gradient, flat, and 3D. Available in SVG and PNG formats at multiple sizes. Perfect for web apps, mobile apps, presentations, and print materials.",
        price: "$39",
        features: ["2000+ Icons", "SVG & PNG", "6 Styles", "Multiple Sizes", "Figma Plugin", "Weekly Updates"],
        icon: "sparkles",
        image: "/images/products/icon-pack.jpg",
        images: ["/images/products/icon-pack.jpg"],
        rating: 4.5,
        reviews: 312,
        userReviews: defaultReviews,
      },
      {
        id: "p6",
        name: "Motion Presets Pro",
        description: "Drag-and-drop animation presets for After Effects & Premiere.",
        fullDescription: "Transform your editing workflow with 150+ one-click animation presets for After Effects and Premiere Pro. Includes text animations, transitions, lower thirds, social media templates, and kinetic typography — all fully customizable with intuitive controls and video tutorials.",
        price: "$99",
        originalPrice: "$149",
        features: ["150+ Presets", "One-Click Apply", "Tutorials", "AE & Premiere", "Customizable", "Free Updates"],
        icon: "video",
        image: "/images/products/motion-presets.jpg",
        images: ["/images/products/motion-presets.jpg"],
        rating: 4.8,
        reviews: 176,
        userReviews: defaultReviews,
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
        fullDescription: "Get the attention you deserve with our Priority Support plan. Enjoy guaranteed 1-hour response times, a dedicated support agent who knows your project inside out, and screen-sharing sessions for complex issues. Available 7 days a week with direct Slack/Discord access.",
        price: "$29",
        priceNote: "/month",
        features: ["1-Hour Response", "Dedicated Agent", "Screen Sharing", "7-Day Availability", "Slack/Discord Access", "Monthly Reports"],
        icon: "headphones",
        rating: 4.9,
        reviews: 64,
        userReviews: defaultReviews,
      },
      {
        id: "o2",
        name: "Gift Card",
        description: "Give the gift of premium creative assets to someone special.",
        fullDescription: "The perfect gift for any creator. Choose any amount from $50 and up, and we'll deliver a beautifully designed digital gift card directly to the recipient's inbox. Never expires, works on all products and services, and can be combined with other promotions.",
        price: "$50",
        priceNote: "and up",
        features: ["Custom Amount", "Digital Delivery", "Never Expires", "All Products", "Instant Delivery", "Gift Message"],
        popular: true,
        icon: "gift",
        badge: "Popular Gift",
        rating: 5.0,
        reviews: 203,
        userReviews: defaultReviews,
      },
      {
        id: "o3",
        name: "Lifetime Access Pass",
        description: "Unlimited access to all current and future products forever.",
        fullDescription: "The ultimate investment for serious creators. Get unlimited access to every product in our catalog — plus everything we release in the future. Includes priority support, early access to new releases, and exclusive member-only content. One payment, lifetime value.",
        price: "$999",
        features: ["All Products", "Future Releases", "Priority Support", "Early Access", "Exclusive Content", "Member Community"],
        icon: "shield",
        badge: "Limited",
        rating: 4.9,
        reviews: 41,
        userReviews: defaultReviews,
      },
      {
        id: "o4",
        name: "Creator Membership",
        description: "Monthly access to exclusive tools, assets, and community perks.",
        fullDescription: "Join an elite community of creators with our monthly membership. Get monthly credits to spend on any product, early access to new releases, exclusive community channels, and special member-only pricing on all services. Cancel anytime.",
        price: "$19",
        priceNote: "/month",
        features: ["Monthly Credits", "Early Access", "Community", "Member Pricing", "Cancel Anytime", "Exclusive Events"],
        icon: "crown",
        badge: "New",
        rating: 4.7,
        reviews: 88,
        userReviews: defaultReviews,
      },
    ],
  },
];

export function getItemById(id: string): ShopItem | undefined {
  for (const cat of shopCategories) {
    const found = cat.items.find((item) => item.id === id);
    if (found) return found;
  }
  return undefined;
}

export function getCategoryByItemId(id: string): ShopCategory | undefined {
  return shopCategories.find((cat) => cat.items.some((item) => item.id === id));
}

export function getRelatedItems(id: string, count = 4): ShopItem[] {
  const category = getCategoryByItemId(id);
  if (!category) return [];
  return category.items.filter((item) => item.id !== id).slice(0, count);
}
