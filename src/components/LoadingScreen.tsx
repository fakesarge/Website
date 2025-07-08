
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade out animation
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`loading-overlay ${!isVisible ? 'fade-out' : ''}`}>
      <div className="loading-logo opium-glow">
        <img
          src="/logo.png"
          alt="74hrs Logo"
          className="h-24 w-auto"
          onError={(e) => {
            // Fallback if logo.png doesn't exist
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.innerHTML = '<div class="text-4xl font-bold text-primary">74hrs</div>';
          }}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
