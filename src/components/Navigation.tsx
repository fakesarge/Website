
import { useState } from "react";
import { useNavigationScroll } from "@/hooks/useNavigationScroll";
import { useNavigationUtils } from "@/utils/navigationUtils";
import NavigationLogo from "@/components/navigation/NavigationLogo";
import DesktopNavigation from "@/components/navigation/DesktopNavigation";
import MobileNavigation from "@/components/navigation/MobileNavigation";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isScrolled } = useNavigationScroll();
  const { scrollToSection } = useNavigationUtils();

  const navItems = [
    { name: "Services", href: "#features", onClick: () => scrollToSection('features') },
    { name: "Portfolio", href: "/portfolio", isLink: true },
    { name: "Pricing", href: "#pricing", onClick: () => scrollToSection('pricing') },
    { name: "Partners", href: "/partners", isLink: true },
    { name: "Orders", href: "/orders", isLink: true },
  ];

  return (
    <header
      className={`fixed top-3.5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 rounded-full ${
        isScrolled 
          ? "h-14 bg-[#1B1B1B]/40 backdrop-blur-xl border border-white/10 scale-95 w-[90%] max-w-2xl" 
          : "h-14 bg-[#1B1B1B] w-[95%] max-w-3xl"
      }`}
    >
      <div className="mx-auto h-full px-6">
        <nav className="flex items-center justify-between h-full">
          <NavigationLogo />

          <DesktopNavigation 
            navItems={navItems} 
            scrollToSection={scrollToSection} 
          />

          <MobileNavigation 
            navItems={navItems}
            scrollToSection={scrollToSection}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
