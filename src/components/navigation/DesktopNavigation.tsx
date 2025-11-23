
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User } from "lucide-react";

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
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
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
      
      {user && profile ? (
        <>
          <Link to="/shop">
            <Button 
              size="sm"
              className="button-gradient"
            >
              Shop Now
            </Button>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative focus:outline-none">
                <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary/40 transition-all">
                  <AvatarImage src={profile.discord_avatar_url || undefined} alt={profile.discord_username || 'User'} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {profile.discord_username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{profile.discord_username || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/orders" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  My Orders
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/settings" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Link to="/login">
            <Button variant="outline" size="sm" className="glass mr-2">
              Login
            </Button>
          </Link>
          
          <Link to="/shop">
            <Button 
              size="sm"
              className="button-gradient"
            >
              Shop Now
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default DesktopNavigation;
