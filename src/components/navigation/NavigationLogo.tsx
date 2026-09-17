import { Link } from "react-router-dom";

const NavigationLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="74hrs home">
      <img src="/logo.png" alt="74HRS" className="h-7 w-7 object-contain" />
      <span className="font-display text-sm font-black uppercase">74HRS</span>
    </Link>
  );
};

export default NavigationLogo;
