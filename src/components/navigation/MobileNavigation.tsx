import { Link } from "react-router-dom";
import { Menu, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface NavItem {
  name: string;
  href: string;
  onClick?: () => void;
  isLink?: boolean;
}

interface MobileNavigationProps {
  navItems: NavItem[];
  scrollToSection: (sectionId: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const MobileNavigation = ({ 
  navItems, 
  scrollToSection, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen 
}: MobileNavigationProps) => {
  const { user, profile, loading } = useAuth();

  return (
    <div className="md:hidden">
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="glass">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-[#1B1B1B]">
          <div className="flex flex-col gap-4 mt-8">
            {navItems.map((item) => (
              item.isLink ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    if (item.onClick) {
                      item.onClick();
                    }
                  }}
                >
                  {item.name}
                </a>
              )
            ))}
            
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="button-gradient w-full">
                Shop Now
              </Button>
            </Link>

            {!loading && (
              user ? (
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Avatar className="h-7 w-7 ring-1 ring-border/20">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {profile?.username?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  Dashboard
                </Link>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full gap-2 glass">
                    <LogIn className="h-4 w-4" />
                    Login with Discord
                  </Button>
                </Link>
              )
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
