import HeroSection from "./components/HeroSection";
import BrowseCategories from "./components/BrowseCategories";
import PromoBanners from "./components/PromoBanners";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <BrowseCategories />
      <PromoBanners />
    </main>
  );
}
