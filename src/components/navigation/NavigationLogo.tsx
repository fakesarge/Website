import { Link } from "react-router-dom";

const NavigationLogo = () => {
  return (
    <Link to="/" className="flex items-center" aria-label="74hrs home">
      <div
        className="relative flex h-11 w-11 items-center justify-center rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 30%, hsl(var(--accent-glow) / 0.9), hsl(var(--accent-glow) / 0.3) 60%, transparent 75%)",
          boxShadow: "0 0 24px hsl(var(--accent-glow) / 0.55), inset 0 0 12px hsl(var(--accent-glow) / 0.3)",
        }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background ring-1 ring-[hsl(var(--accent-glow)/0.4)]">
          <img
            src="/logo.png"
            alt=""
            className="h-5 w-5 object-contain"
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              t.style.display = "none";
            }}
          />
        </div>
      </div>
    </Link>
  );
};

export default NavigationLogo;
