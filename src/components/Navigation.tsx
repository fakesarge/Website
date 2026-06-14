import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useNavigationScroll } from "@/hooks/useNavigationScroll";
import { useNavigationUtils } from "@/utils/navigationUtils";
import NavigationLogo from "@/components/navigation/NavigationLogo";
import DesktopNavigation from "@/components/navigation/DesktopNavigation";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import AnnouncementBar from "@/components/AnnouncementBar";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isScrolled } = useNavigationScroll();
  const { scrollToSection } = useNavigationUtils();

  const navItems = [
    { name: "Home", href: "/", isLink: true },
    { name: "Shop", href: "/shop", isLink: true },
    { name: "Portfolio", href: "/portfolio", isLink: true },
    { name: "Queue", href: "/queue", isLink: true },
    { name: "VIP", href: "/vip", isLink: true },
  ];

  return (
    <>
      <AnnouncementBar />
      <header
        className={`fixed top-10 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          isScrolled ? "scale-95" : ""
        }`}
      >
        <div
          className="flex items-center gap-2 rounded-full border border-border/40 bg-[#0a0a0a]/85 backdrop-blur-xl px-2 py-2"
          style={{
            boxShadow:
              "0 8px 40px -8px hsl(0 0% 0% / 0.8), 0 0 0 1px hsl(var(--accent-glow) / 0.08), 0 0 32px hsl(var(--accent-glow) / 0.12)",
          }}
        >
          <NavigationLogo />

          <DesktopNavigation navItems={navItems} scrollToSection={scrollToSection} />

          {/* Cart pill */}
          <Link
            to="/orders"
            className="hidden md:flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 hover:scale-105"
            style={{
              background: "radial-gradient(circle at 30% 30%, hsl(var(--accent-glow) / 0.9), hsl(var(--accent-glow) / 0.3) 60%, transparent 75%)",
              boxShadow: "0 0 22px hsl(var(--accent-glow) / 0.5)",
            }}
            aria-label="Orders"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background ring-1 ring-[hsl(var(--accent-glow)/0.4)]">
              <ShoppingCart className="h-4 w-4 text-foreground" />
            </div>
          </Link>

          <MobileNavigation
            navItems={navItems}
            scrollToSection={scrollToSection}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        </div>
      </header>
    </>
  );
};

export default Navigation;
