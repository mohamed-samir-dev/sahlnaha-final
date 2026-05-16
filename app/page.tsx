import HeroSection from "./components/HeroSection";
import BrowseCategories from "./components/BrowseCategories";
import PromoBanners from "./components/PromoBanners";
import ProductGrid from "./components/products/ProductGrid";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <BrowseCategories />
      <ProductGrid />
      <PromoBanners />
      
    </main>
  );
}
