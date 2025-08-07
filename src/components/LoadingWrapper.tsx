
import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import MainLayout from "@/components/home/MainLayout";
import ModernScrollAnimations from "@/components/modern/ModernScrollAnimations";

const LoadingWrapper = () => {
  const [showLoading, setShowLoading] = useState(true);

  return (
    <>
      <ModernScrollAnimations />
      {showLoading && <LoadingScreen onComplete={() => setShowLoading(false)} />}
      <MainLayout showLoading={showLoading} />
    </>
  );
};

export default LoadingWrapper;
