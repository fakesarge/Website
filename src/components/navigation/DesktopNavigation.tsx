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
    <div className="hidden md:flex items-center gap-1 px-4">
      {navItems.map((item) => (
        item.isLink ? (
          <Link
            key={item.name}
            to={item.href}
            className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            {item.name}
          </Link>
        ) : (
          <a
            key={item.name}
            href={item.href}
            onClick={(e) => {
              e.preventDefault();
              if (item.onClick) item.onClick();
            }}
            className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            {item.name}
          </a>
        )
      ))}

      {!loading && (
        user ? (
          <Link to="/dashboard" className="ml-2">
            <Avatar className="h-8 w-8 ring-1 ring-[hsl(var(--accent-glow)/0.3)] hover:ring-[hsl(var(--accent-glow)/0.6)] transition-all duration-300 cursor-pointer">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="bg-secondary text-foreground text-xs">
                {profile?.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <Link to="/login" className="ml-1">
            <Button variant="ghost" size="sm" className="gap-2 text-xs uppercase tracking-wider">
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
