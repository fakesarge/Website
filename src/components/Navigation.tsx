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
    { name: "Shop", href: "/shop", isLink: true },
    { name: "VFX", href: "/portfolio", isLink: true },
    { name: "GFX", href: "/gfx", isLink: true },
    { name: "Book", href: "/contact", isLink: true },
    { name: "Queue", href: "/queue", isLink: true },
    { name: "VIP", href: "/vip", isLink: true },
  ];

  return (
    <>
      <AnnouncementBar />
      <header
        className={`fixed top-7 inset-x-0 z-50 border-b border-border/70 bg-background/75 backdrop-blur-xl transition-all duration-300 ${
          isScrolled ? "bg-background/95" : ""
        }`}
      >
        <div
          className="container flex h-16 items-center gap-2 px-4"
        >
          <NavigationLogo />

          <DesktopNavigation navItems={navItems} scrollToSection={scrollToSection} />

          {/* Cart pill */}
          <Link
            to="/orders"
            className="hidden md:flex h-10 w-10 items-center justify-center border border-border bg-card transition-colors duration-200 hover:border-foreground/60"
            aria-label="Orders"
          >
            <div className="flex h-8 w-8 items-center justify-center">
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
