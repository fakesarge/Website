
import { Command } from "lucide-react";
import { Link } from "react-router-dom";

const NavigationLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img
        src="/logo.png"
        alt="74hrs Logo"
        className="w-6 h-6"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
      <Command className="w-5 h-5 text-primary" />
      <span className="font-bold text-base">74hrs</span>
    </Link>
  );
};

export default NavigationLogo;
