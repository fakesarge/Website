
import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import MainLayout from "@/components/home/MainLayout";

const LoadingWrapper = () => {
  const [showLoading, setShowLoading] = useState(true);

  return (
    <>
      {showLoading && <LoadingScreen onComplete={() => setShowLoading(false)} />}
      <MainLayout showLoading={showLoading} />
    </>
  );
};

export default LoadingWrapper;
