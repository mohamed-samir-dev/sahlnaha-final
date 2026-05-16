import HeroSection from "./components/HeroSection";
import BrowseCategories from "./components/BrowseCategories";
import PromoBanners from "./components/PromoBanners";
import ProductGrid from "./components/products/ProductGrid";
import CustomerReviews from "./components/CustomerReviews";
import AnimatedBackground from "./components/AnimatedBackground";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />
      <div className="relative" style={{ zIndex: 1 }}>
        <HeroSection />
        <BrowseCategories />
        <ProductGrid />
        <PromoBanners />
        <CustomerReviews />
      </div>
    </main>
  );
}
