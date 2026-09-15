import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
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
      <header className={`fixed left-0 right-0 top-8 z-50 border-b border-border bg-background/85 backdrop-blur-xl transition-all duration-300 ${isScrolled ? "shadow-sm" : ""}`}>
        <div
          className="mx-auto flex h-20 max-w-[1440px] items-center gap-3 border-x border-border px-5 md:px-8"
        >
          <NavigationLogo />

          <DesktopNavigation navItems={navItems} scrollToSection={scrollToSection} />

          {/* Cart pill */}
          <Link
            to="/orders"
            className="ml-auto hidden h-10 w-10 items-center justify-center border border-border bg-secondary transition-colors hover:bg-accent md:flex"
            aria-label="Orders"
          >
            <ShoppingBag className="h-4 w-4 text-foreground" />
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
