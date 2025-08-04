
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
      <div className="loading-logo ">
        <img
          src="/logo.png"
          alt="74hrs Logo"
          className="h-24 w-auto"
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
