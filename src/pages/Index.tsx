
import { useEffect, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import VideoHero from "@/components/home/VideoHero";
import ContentSection from "@/components/home/ContentSection";
import LoadingScreen from "@/components/LoadingScreen";

const Index = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setHasScrolled(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-foreground">
      {showLoading && <LoadingScreen onComplete={() => setShowLoading(false)} />}
      
      <Navigation />
      
      {/* Full-screen YouTube Video Hero Section */}
      <VideoHero scrollToContent={scrollToContent} />

      {/* Main Content Section with Reveal Animation */}
      <ContentSection contentRef={contentRef} />
    </div>
  );
};

export default Index;
