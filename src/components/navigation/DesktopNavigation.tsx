
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavItem {
  name: string;
  href: string;
  onClick?: () => void;
  isLink?: boolean;
}

interface DesktopNavigationProps {
  navItems: NavItem[];
  scrollToSection: (sectionId: string) => void;
}

const DesktopNavigation = ({ navItems, scrollToSection }: DesktopNavigationProps) => {
  const handleShopNowClick = () => {
    window.open('https://discord.gg/VFX', '_blank');
  };

  return (
    <div className="hidden md:flex items-center gap-6">
      {navItems.map((item) => (
        item.isLink ? (
          <Link
            key={item.name}
            to={item.href}
            className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300"
          >
            {item.name}
          </Link>
        ) : (
          <a
            key={item.name}
            href={item.href}
            onClick={(e) => {
              e.preventDefault();
              if (item.onClick) {
                item.onClick();
              }
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300"
          >
            {item.name}
          </a>
        )
      ))}
      
      <Link to="/login">
        <Button variant="outline" size="sm" className="glass mr-2">
          Login
        </Button>
      </Link>
      
      <Button 
        onClick={handleShopNowClick}
        size="sm"
        className="button-gradient"
      >
        Shop Now
      </Button>
    </div>
  );
};

export default DesktopNavigation;
