import Banner from "./components/banner/Banner";
import BrowseCategories from "./components/BrowseCategories";
import PromoBanners from "./components/PromoBanners";
import ProductGrid from "./components/products/ProductGrid";
import CustomerReviews from "./components/CustomerReviews";
import HomeBackground from "./components/HomeBackground";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <HomeBackground />
      <Banner />
      <BrowseCategories />
      <ProductGrid />
      <PromoBanners />
      <CustomerReviews />
    </main>
  );
}
