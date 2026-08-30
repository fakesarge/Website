import Navigation from "@/components/Navigation";
import KifHome from "@/components/home/KifHome";

interface MainLayoutProps {
  showLoading: boolean;
}

const MainLayout = ({ showLoading }: MainLayoutProps) => {
  if (showLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <KifHome booted={!showLoading} />
    </div>
  );
};

export default MainLayout;
