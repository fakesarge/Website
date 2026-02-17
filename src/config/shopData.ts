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
  hoverPreview?: string;
  glowColor?: string;
}

export interface ShopCategory {
  id: string;
  label: string;
  description: string;
  items: ShopItem[];
  layout: "services" | "grid";
}

const defaultReviews: ShopReview[] = [];

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
        description: "Complete brand identity design with logo, banner, and VFX",
        fullDescription: "Transform your brand with a comprehensive identity package. We craft distinctive logos, define harmonious color palettes, establish typography systems, and deliver a complete brand guidelines document that ensures consistency across all touchpoints. Our process includes in-depth discovery sessions to understand your vision and competitive landscape.",
        price: "$150",
        features: ["Custom Logo Design", "Custom VFX", "Custom Banner", "1 to 1 Mettings", "3 Revision Rounds"],
        icon: "palette",
        badge: "Best Value",
        rating: 5,
        reviews: 8,
        userReviews: [
          { username: "twoods5m", rating: 5, text: "Exactly what I wanted, Was so good I hired the guy", date: "2025-10-5", helpful: true },
          { username: "Xyroz", rating: 5, text: "Incredibly thoughtful design process. Our logo gets compliments everywhere.", date: "2025-11-15" },
        ],
      },
          {
        id: "s2",
        name: "Motion & VFX",
        description: "Cinematic animations, intros, and visual effects for your content.",
        fullDescription: "Elevate your content with studio-quality motion graphics and visual effects. From cinematic intros and logo animations to complex compositing and particle effects — we bring your vision to life in stunning 4K. Every project includes custom sound design and unlimited revisions until you're 100% satisfied.",
        price: "$80-$500+",
        priceNote: "Per project",
        features: ["4K Rendering", "Custom Animations", "Sound Design", "Best in the Industry", "Best quality", "Unlimited Revisions"],
        icon: "video",
        popular: true,
        rating: 4.9,
        reviews: 198,
        userReviews: [],
      },
      {
        id: "s3",
        name: "Web Development",
        description: "Custom built, responsive websites with modern frameworks and clean code.",
        fullDescription: "Get a blazing fast, perfect website built. We use modern frameworks like React and Next.js to deliver responsive, SEO-optimized sites that perform flawlessly on every device. Includes CMS integration, analytics setup, and 30 days of post-launch support to ensure everything runs smoothly.",
        price: "$200-$500",
        priceNote: "Starting at",
        features: ["Responsive Design", "SEO Optimized", "Performance Tuned", "CMS Integration", "Analytics Setup", "30-Day Support"],
        icon: "code",
        rating: 4.9,
        reviews: 4,
        userReviews: [
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
        id: "blender-optimization-pack",
        name: "Blender Optimization Pack",
        description: "PDF with proven techniques to optimize Blender performance and workflow.",
        fullDescription: "Easy to follow PDF guide packed with proven techniques to optimize Blender performance and workflow. Learn how to speed up your projects, reduce render times, and enhance your creative process with tips on viewport optimization, render settings, asset management, and more. Perfect for artists of all levels looking to get the most out of Blender.",
        price: "$21",
        originalPrice: "$30",
        features: ["Render Time Reduction by 50-80%", "Viewport Optimization", "Cool tips and tricks", "Workflow Enhancements", "Proven Techniques"],
        icon: "box",
        badge: "New",
        image: "/images/products/sdfsdfntitle.png",
        images: ["/images/products/sdfsdfntitle.png","/images/products/blender.png"],
        rating: 5,
        reviews: 2,
        userReviews: [
         ],
        purchaseUrl: "https://buy.stripe.com/00w3co3g9eTB80k45h6Ri05?prefilled_promo_code=SAVE30",

      },
      {
        id: "social-pop-ups",
        name: "Social Pop Ups",
        description: "ZIP File with After Effect + Premier Pro + Photoshop Templates",
        fullDescription: "Easy to use social media pop-up templates for After Effects, Premiere Pro, and Photoshop. Each template is fully customizable with intuitive controls, allowing you to quickly create eye-catching pop-ups for YouTube, Twitch, Instagram, and more. Perfect for streamers and content creators looking to enhance their videos with professional-quality graphics.",
        price: "$25",
        originalPrice: "$40",
        features: ["Kick Template", " Youtube Template", "Twitch Template", "TikTok Template", "Instagram Template", "Facebook Template"],
        icon: "box",
        badge: "New",
        image: "/images/products/dowiuefiowejf.png",
        images: ["/images/products/dowiuefiowejf.png"],
        rating: 5,
        reviews: 23,
        userReviews: [
         ],
        purchaseUrl: "https://buy.stripe.com/5kQdR26sleTBfsMbxJ6Ri02?prefilled_promo_code=SALE",

      },
      {
        id: "ghetto-room-template",
        name: "Ghetto Room Template",
        description: "Blender File with a fully customizable 3D room scene, perfect for resellers and people who want to learn how to make loading screens.",
        fullDescription: "[PREVIEW IN PORTFOLIO] \n A fully customizable 3D room scene created in Blender, perfect for resellers and aspiring loading screen creators. This template includes a detailed interior with dynamic lighting, animated elements, and modular components that can be easily modified to fit your unique style. Ideal for learning the art of loading screen design or for creating high-quality assets to sell.",
        price: "$170",
        originalPrice: "$200",
        features: ["Animated Rigged Character", "High Quality", ".blend file", "Drag & Drop Ready", "Priority Support"],
        popular: true,
        icon: "star",
        image: "/images/products/ghetto.png",
        images: ["/images/products/ghetto.png","/images/products/djwoijfeoiwjf.png","/images/products/djwoijfeoiwjf2.png","/images/products/djwoijfeoiwjf3.png"],
        rating: 4.9,
        reviews: 29,
        purchaseUrl: "https://buy.stripe.com/8x28wI9Ex8vd1BWdFR6Ri04?prefilled_promo_code=SAVE15",
      },
            {
        id: "christmas-room-template",
        name: "Christmas Room Template",
        description: "Blender File with a fully customizable 3D room scene, perfect for resellers and people who want to learn how to make loading screens.",
        fullDescription: "[PREVIEW IN PORTFOLIO] \n A fully customizable 3D room scene created in Blender, perfect for resellers and aspiring loading screen creators. This template includes a detailed interior with dynamic lighting, animated elements, and modular components that can be easily modified to fit your unique style. Ideal for learning the art of loading screen design or for creating high-quality assets to sell.",
        price: "$200",
        features: ["Very High Demand", "High Quality", ".blend file", "Drag & Drop Ready", "Priority Support"],
        popular: true,
        icon: "star",
        image: "/images/products/gamingcabin.png",
        images: ["/images/products/gamingcabin.png","/images/products/oifjrioejfr.png","/images/products/oifjrioejfr2.png","/images/products/oifjrioejfr3.png","/images/products/oifjrioejfr4.png"],
        rating: 5,
        reviews: 3,
        purchaseUrl: "https://buy.stripe.com/bJeaEQaIB9zh5Sc9pB6Ri03",
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
        description: "Dedicated fast track support with guaranteed response times.",
        fullDescription: "Get the attention you deserve with our Priority Support plan. Enjoy guaranteed 1-hour response times, a dedicated support agent who knows your project inside out, and screen-sharing sessions for complex issues. Available 7 days a week with direct Slack/Discord access.",
        price: "$5",
        priceNote: "/month",
        features: ["1 Hour Response", "Dedicated VC Support", "Screen Sharing", "7 Day Availability", "Discord Access", "Monthly Reports"],
        icon: "headphones",
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
