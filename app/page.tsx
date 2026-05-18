import HeroSection from "./components/HeroSection";
import BrowseCategories from "./components/BrowseCategories";
import PromoBanners from "./components/PromoBanners";
import ProductGrid from "./components/products/ProductGrid";
import CustomerReviews from "./components/CustomerReviews";
import HomeBackground from "./components/HomeBackground";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <HomeBackground />
      <HeroSection />
      <BrowseCategories />
      <div className="mb-8 md:mb-0" />
      <ProductGrid />
      <PromoBanners />
      <CustomerReviews />
    </main>
  );
}
