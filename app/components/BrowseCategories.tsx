"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Smartphone, Laptop, Tablet, Watch, Headphones, Cable, ArrowLeft } from "lucide-react";

const categories = [
  { name: "الهواتف", description: "أحدث الهواتف الذكية", image: "/phone.webp", href: "/smartphones", icon: Smartphone },
  { name: "اللابتوب", description: "لابتوبات بأداء عالي", image: "/lap.webp", href: "/laptops", icon: Laptop },
  { name: "التابلت", description: "تابلتات لكل الاستخدامات", image: "/tap.webp", href: "/tablets", icon: Tablet },
  { name: "الساعات الذكية", description: "ساعات ذكية أنيقة", image: "/watch.webp", href: "/smart-watches", icon: Watch },
  { name: "السماعات", description: "سماعات بجودة صوت عالية", image: "/ear.webp", href: "/audio", icon: Headphones },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function BrowseCategories() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollTo = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / categories.length;
    el.scrollTo({ left: -(cardWidth * index), behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const cardWidth = el.scrollWidth / categories.length;
      const scrollPos = Math.abs(el.scrollLeft);
      const index = Math.round(scrollPos / cardWidth);
      setActiveIndex(Math.min(index, categories.length - 1));
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % categories.length;
        scrollTo(next);
        return next;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [scrollTo]);

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-5 mt-20 mb-8" dir="rtl">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D9E4F5] mb-3">
          <span className="w-2 h-2 rounded-full bg-[#06399B] animate-pulse" />
          <span className="text-xs font-semibold text-[#06399B]">أقسامنا المميزة</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#06399B]">تصفح الأقسام</h2>
        <p className="text-sm sm:text-base text-gray-500 mt-2">اختر القسم اللي يناسبك وابدأ التسوق</p>
      </motion.div>

      {/* Cards */}
      <motion.div
        ref={scrollRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 scrollbar-hide"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.name}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="min-w-[210px] sm:min-w-[240px] flex-shrink-0 relative group flex flex-col items-center gap-3 p-5 sm:p-6 rounded-3xl bg-white border border-[#D9E4F5]/80 shadow-[0_2px_20px_rgba(6,57,155,0.06)] hover:shadow-[0_12px_40px_rgba(6,57,155,0.15)] hover:border-[#3258B1]/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#D9E4F5]/0 to-[#D9E4F5]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

              <div className="absolute top-3 left-3 z-10">
                <div className="w-8 h-8 rounded-lg bg-[#D9E4F5] flex items-center justify-center">
                  <Icon size={16} className="text-[#06399B]" />
                </div>
              </div>

              <div className="relative z-10 w-36 h-36 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br from-[#D9E4F5]/50 to-[#D9E4F5]/20 flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full">
                  <Image src={cat.image} alt={cat.name} fill className="object-contain p-4" />
                </div>
              </div>

              <div className="relative z-10 text-center">
                <h3 className="text-base sm:text-lg font-bold text-[#06399B]">{cat.name}</h3>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-1">{cat.description}</p>
              </div>

              <Link href={cat.href} className="relative z-10 mt-auto w-full">
                <motion.div
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#06399B] to-[#3258B1] text-white text-xs sm:text-sm font-bold shadow-[0_4px_16px_rgba(6,57,155,0.3)] hover:shadow-[0_6px_24px_rgba(6,57,155,0.45)] transition-shadow duration-200"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  تسوّق الآن
                  <ArrowLeft size={14} />
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {categories.map((_, i) => (
          <button key={i} onClick={() => scrollTo(i)}>
            <motion.div
              className={`h-2 rounded-full transition-colors duration-300 ${
                i === activeIndex ? "bg-[#06399B]" : "bg-[#D9E4F5]"
              }`}
              animate={{ width: i === activeIndex ? 24 : 8 }}
              transition={{ duration: 0.3 }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
