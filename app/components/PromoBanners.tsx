"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const banners = [
  {
    image: "/pay.webp",
    title: "ادفع بكل أمان",
    description: "طرق دفع متعددة وآمنة\nتجربة تسوق بدون قلق",
    button: "تعرّف على طرق الدفع",
    href: "/about",
  },
  {
    image: "/offer.webp",
    title: "عروض حصرية",
    description: "خصومات تصل إلى 30%\nعلى منتجات مختارة لفترة محدودة",
    button: "تسوّق العروض",
    href: "/search?q=عروض",
  },
];

function BannerCard({ banner, index }: { banner: typeof banners[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative h-[220px] sm:h-[260px] rounded-2xl overflow-hidden group"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url(${banner.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60" />
      <div className="relative z-10 h-full flex flex-col justify-center items-end text-right p-6 sm:p-8 mr-auto max-w-[65%]" style={{ fontFamily: "'Cairo', sans-serif" }}>
        <h3 className="text-3xl sm:text-4xl font-black text-[#06399B] leading-tight">
          {banner.title}
        </h3>
        <p className="text-base sm:text-lg font-bold text-white mt-3 leading-relaxed whitespace-pre-line">
          {banner.description}
        </p>
        <Link href={banner.href} className="mt-4 w-fit">
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#06399B] text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {banner.button}
            <ArrowLeft size={14} />
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
}

export default function PromoBanners() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-5 mt-12" dir="rtl">
      {/* Desktop: Grid */}
      <div className="hidden lg:grid grid-cols-2 gap-5">
        {banners.map((banner, i) => (
          <BannerCard key={i} banner={banner} index={i} />
        ))}
      </div>

      {/* Mobile/Tablet: Slider */}
      <div className="lg:hidden relative">
        <div className="relative h-[280px] sm:h-[260px] rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${banners[current].image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60" />
              <div className="relative z-10 h-full flex flex-col justify-center items-end text-right p-4 sm:p-8 mr-auto max-w-[60%] sm:max-w-[75%]" style={{ fontFamily: "'Cairo', sans-serif" }}>
                <h3 className="text-3xl sm:text-4xl font-black text-[#06399B] leading-tight">
                  {banners[current].title}
                </h3>
                <p className="text-base sm:text-lg font-bold text-white mt-3 leading-relaxed whitespace-pre-line">
                  {banners[current].description}
                </p>
                <Link href={banners[current].href} className="mt-4 w-fit">
                  <motion.div
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#06399B] text-xs sm:text-sm font-bold shadow-lg"
                    whileTap={{ scale: 0.95 }}
                  >
                    {banners[current].button}
                    <ArrowLeft size={14} />
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-3">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}>
              <motion.div
                className={`h-2 rounded-full ${i === current ? "bg-[#06399B]" : "bg-[#D9E4F5]"}`}
                animate={{ width: i === current ? 24 : 8 }}
                transition={{ duration: 0.3 }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
