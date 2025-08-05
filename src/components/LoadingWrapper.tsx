
import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import MainLayout from "@/components/home/MainLayout";
import ScrollTransitions from "@/components/ScrollTransitions";

const LoadingWrapper = () => {
  const [showLoading, setShowLoading] = useState(true);

  return (
    <>
      <ScrollTransitions />
      {showLoading && <LoadingScreen onComplete={() => setShowLoading(false)} />}
      <MainLayout showLoading={showLoading} />
    </>
  );
};

export default LoadingWrapper;
