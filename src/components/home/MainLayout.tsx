import { useRef } from "react";
import Navigation from "@/components/Navigation";
import VideoHero from "@/components/home/VideoHero";
import ContentSection from "@/components/home/ContentSection";
import SalePopup from "@/components/SalePopup";
import AmbientBackground from "@/components/AmbientBackground";

interface MainLayoutProps {
  showLoading: boolean;
}

const MainLayout = ({ showLoading }: MainLayoutProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (showLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AmbientBackground />
      <Navigation />
      
      {/* Full-screen YouTube Video Hero Section */}
      <VideoHero scrollToContent={scrollToContent} />

      {/* Main Content Section with Reveal Animation */}
      <ContentSection contentRef={contentRef} />
      <SalePopup />
    </div>
  );
};

export default MainLayout;
