
import { useRef } from "react";
import Navigation from "@/components/Navigation";
import VideoHero from "@/components/home/VideoHero";
import ContentSection from "@/components/home/ContentSection";

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
    <div className="min-h-screen bg-black text-foreground">
      <Navigation />
      
      {/* Full-screen YouTube Video Hero Section */}
      <VideoHero scrollToContent={scrollToContent} />

      {/* Main Content Section with Reveal Animation */}
      <ContentSection contentRef={contentRef} />
    </div>
  );
};

export default MainLayout;
