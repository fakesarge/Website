
import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import MainLayout from "@/components/home/MainLayout";
import StarBackground from "@/components/StarBackground";
import SalePopup from "@/components/SalePopup";

const LoadingWrapper = () => {
  const [showLoading, setShowLoading] = useState(true);

  return (
    <>
      <StarBackground />
      {showLoading && <LoadingScreen onComplete={() => setShowLoading(false)} />}
      <MainLayout showLoading={showLoading} />
      <SalePopup />
    </>
  );
};

export default LoadingWrapper;
