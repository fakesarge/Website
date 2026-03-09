import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogIn } from "lucide-react";

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
  const { user, profile, loading } = useAuth();

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
      
      <Link to="/shop">
        <Button size="sm" className="button-gradient">
          Shop Now
        </Button>
      </Link>

      {!loading && (
        user ? (
          <Link to="/dashboard">
            <Avatar className="h-8 w-8 ring-1 ring-border/20 hover:ring-primary/40 transition-all duration-300 cursor-pointer">
              <AvatarImage src={profile?.discord_avatar_url || ''} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {profile?.discord_username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <Link to="/login">
            <Button variant="outline" size="sm" className="gap-2 glass">
              <LogIn className="h-3.5 w-3.5" />
              Login
            </Button>
          </Link>
        )
      )}
    </div>
  );
};

export default DesktopNavigation;
