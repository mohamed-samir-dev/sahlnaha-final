"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoArrowForward, IoShareSocialOutline, IoHomeOutline, IoChevronBack } from "react-icons/io5";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Product } from "../../components/products/types";
import { useCartStore } from "../../store/cartStore";
import ProductImages from "./components/ProductImages";
import ProductInfo from "./components/ProductInfo";
import ProductDetails from "./components/ProductDetails";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProductPageClient({ id, initialProduct }: { id: string; initialProduct: Product | null }) {
  const router = useRouter();
  const [product] = useState<Product | null>(initialProduct);
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { scrollY } = useScroll();
  const headerBg = useTransform(scrollY, [0, 60], ["rgba(255,255,255,0.7)", "rgba(255,255,255,0.97)"]);

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#D9E4F5]/30 to-white">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#06399B]/10 to-[#3258B1]/10 flex items-center justify-center">
            <span className="text-3xl">📦</span>
          </div>
          <p className="text-gray-400 text-lg">المنتج غير موجود</p>
        </div>
      </div>
    );

  const resolveImg = (src: string) =>
    src.startsWith("http") ? src : src.startsWith("/uploads") ? src : `${API}${src}`;

  const allImages = (product.images?.length ? product.images : product.image ? [product.image] : []).map(resolveImg);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: product.name, url }); } catch {}
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F4F7FF] via-white to-[#F4F7FF] pb-24" dir="rtl">
      {/* Header */}
      <motion.div style={{ backgroundColor: headerBg }} className="sticky top-0 z-40 backdrop-blur-xl border-b border-[#D9E4F5]/40 shadow-[0_1px_12px_rgba(6,57,155,0.06)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between py-2.5 sm:py-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <motion.button
                onClick={() => router.back()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#06399B] to-[#3258B1] text-white shadow-md shadow-[#06399B]/20 shrink-0 cursor-pointer"
              >
                <IoArrowForward size={18} />
              </motion.button>
              <div className="min-w-0">
                <h1 className="text-xs sm:text-sm font-bold text-gray-900 truncate">{product.name}</h1>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400 mt-0.5">
                  <button onClick={() => router.push("/")} className="hover:text-[#06399B] transition flex items-center gap-0.5 cursor-pointer">
                    <IoHomeOutline size={10} />
                    <span>الرئيسية</span>
                  </button>
                  <IoChevronBack size={8} />
                  {product.brand && (
                    <>
                      <span className="text-gray-400">{product.brand}</span>
                      <IoChevronBack size={8} />
                    </>
                  )}
                  <span className="text-[#06399B] font-semibold truncate max-w-[120px] sm:max-w-[200px]">{product.name}</span>
                </div>
              </div>
            </div>
            <motion.button
              onClick={handleShare}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border border-[#D9E4F5] hover:border-[#06399B]/30 hover:bg-[#06399B]/5 transition text-gray-500 hover:text-[#06399B] shrink-0 cursor-pointer"
            >
              <IoShareSocialOutline size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-3 sm:px-5 md:px-8 pt-6 sm:pt-8 md:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-10">
          {/* Images */}
          <div className="lg:col-span-7">
            <ProductImages images={allImages} name={product.name} discountPercent={product.discountPercent} />
          </div>
          {/* Info */}
          <div className="lg:col-span-5">
            <ProductInfo
              product={product}
              addedToCart={addedToCart}
              onAddToCart={() => { addItem(product); setAddedToCart(true); }}
            />
          </div>
        </div>
        <ProductDetails product={product} />
      </div>
    </main>
  );
}
