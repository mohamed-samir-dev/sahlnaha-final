"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    image: "/uuuuuu.png",
    title: "سهلناها",
    subtitle: "التقنية للأجهزة الإلكترونية",
    description: "أحدث الأجهزة • أفضل الأسعار • تجربة تسوق سهلة وآمنة",
    primaryHref: "/smartphones",
    secondaryHref: "/smartphones",
  },
  {
    image: "/hero2.webp",
    title: "iPhone 17 Pro Max",
    subtitle: "قوة لا حدود لها",
    description: "أداء خارق وكاميرا ثورية بتصميم تيتانيوم فاخر",
    primaryHref: "/smartphones/iphone-17-pro-max",
    secondaryHref: "/smartphones/iphone-17-pro-max",
  },
  {
    image: "/hero3.webp",
    title: "Samsung Galaxy",
    subtitle: "ابتكار المستقبل",
    description: "شاشة مذهلة وذكاء اصطناعي متقدم في جهاز واحد",
    primaryHref: "/smartphones/samsung-galaxy-s26-ultra",
    secondaryHref: "/smartphones/samsung-galaxy-s26-ultra",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-5 mt-4" dir="rtl">
      <section className="relative w-full min-h-fit rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(6,57,155,0.25)]">
        {/* Background Image */}
        {/* Preload all images */}
        {slides.map((slide, i) => (
          <Image
            key={slide.image}
            src={slide.image}
            alt=""
            fill
            priority={i === 0}
            className="object-cover opacity-0 pointer-events-none"
          />
        ))}

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={slides[current].image}
              alt={slides[current].title}
              fill
              priority={current === 0}
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>



        {/* Content */}
        <div className="relative z-10 flex items-center py-8 sm:py-10 md:py-14 lg:py-16 px-4 sm:px-8 md:px-10 lg:px-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="max-w-[300px] sm:max-w-[380px] md:max-w-lg lg:max-w-xl"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-3 sm:mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <span className="w-2 h-2 rounded-full bg-[#D9E4F5] animate-pulse" />
                <span className="text-[10px] sm:text-xs text-white/90 font-medium">عروض حصرية</span>
              </motion.div>

              <motion.h1
                className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <span className="text-[#0B3FA5] drop-shadow-md">
                  {slides[current].title}
                </span>
                <br />
                <span className="inline-block px-2 py-0.5 rounded  text-[#061046] text-xl sm:text-xl md:text-xl lg:text-3xl xl:text-5xl font-bold">
                  {slides[current].subtitle}
                </span>
              </motion.h1>

              <motion.p
                className="mt-2 sm:mt-3 md:mt-5 inline-block px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm text-base sm:text-base md:text-lg lg:text-xl text-[#041943] font-medium leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {slides[current].description}
              </motion.p>

              <motion.div
                className="mt-3 sm:mt-5 md:mt-7 flex items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={slides[current].primaryHref}
                    className="block px-5 py-2 sm:px-7 sm:py-2.5 md:px-9 md:py-3.5 bg-gradient-to-r from-[#06399B] to-[#3258B1] text-white font-bold rounded-full text-xs sm:text-sm md:text-base shadow-[0_4px_25px_rgba(6,57,155,0.5)] hover:shadow-[0_8px_35px_rgba(6,57,155,0.7)] transition-all border border-white/10"
                  >
                    تسوّق الآن
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={slides[current].secondaryHref}
                    className="block px-4 py-2 sm:px-6 sm:py-2.5 md:px-7 md:py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full text-xs sm:text-sm md:text-base border border-white/20 hover:bg-white/20 transition-all"
                  >
                    اكتشف المزيد
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 sm:gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="relative"
            >
              <motion.div
                className={`h-2 rounded-full transition-colors duration-300 ${
                  i === current ? "bg-[#3258B1]" : "bg-white/40"
                }`}
                animate={{ width: i === current ? 32 : 8 }}
                transition={{ duration: 0.3 }}
              />
              {i === current && (
                <motion.div
                  className="absolute inset-0 h-2 rounded-full bg-[#3258B1]/40"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Slide Counter */}
        <div className="absolute top-3 sm:top-5 left-3 sm:left-5 z-10">
          <motion.div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span className="text-white/90 text-[10px] sm:text-xs font-bold">{current + 1}</span>
            <span className="text-white/50 text-[10px] sm:text-xs">/</span>
            <span className="text-white/50 text-[10px] sm:text-xs">{slides.length}</span>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
