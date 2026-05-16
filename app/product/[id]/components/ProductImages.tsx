"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IoExpandOutline, IoChevronBack, IoChevronForward } from "react-icons/io5";

interface ProductImagesProps {
  images: string[];
  name: string;
  discountPercent?: number;
}

export default function ProductImages({ images, name, discountPercent = 0 }: ProductImagesProps) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });
  const [lightbox, setLightbox] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  const prev = () => setSelected((s) => (s - 1 + images.length) % images.length);
  const next = () => setSelected((s) => (s + 1) % images.length);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    setLensPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-3"
      >
        {/* Main image */}
        <div className="relative">

          <div
            ref={imgRef}
            className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-white cursor-crosshair group border border-white shadow-[0_8px_40px_rgba(6,57,155,0.12)]"
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            {/* Discount badge */}
            {discountPercent > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute z-20 top-4 right-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/30 rounded-2xl blur-md" />
                  <span className="relative bg-gradient-to-br from-red-500 to-rose-600 text-white text-[11px] sm:text-xs font-black px-3 py-1.5 rounded-2xl shadow-lg flex items-center gap-1">
                    🔥 {discountPercent}% خصم
                  </span>
                </div>
              </motion.div>
            )}

            {/* Expand button */}
            <motion.button
              onClick={() => setLightbox(true)}
              className="absolute z-20 top-4 left-4 w-9 h-9 rounded-xl bg-white/80 backdrop-blur-md border border-white/60 flex items-center justify-center text-[#06399B] shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IoExpandOutline size={16} />
            </motion.button>

            {/* Counter pill */}
            {images.length > 1 && (
              <div className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-medium tracking-wide">
                {selected + 1} / {images.length}
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.06 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <div
                  className="w-full h-full transition-transform duration-200 ease-out"
                  style={{
                    transform: zoomed ? "scale(2)" : "scale(1)",
                    transformOrigin: `${lensPos.x}% ${lensPos.y}%`,
                  }}
                >
                  <Image
                    src={images[selected]}
                    alt={name}
                    fill
                    className="object-contain p-8 sm:p-10"
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    unoptimized
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Mobile arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-xl bg-white/80 backdrop-blur-sm border border-white/60 flex items-center justify-center shadow-md sm:hidden active:scale-90 transition"
                >
                  <IoChevronBack size={16} className="text-[#06399B]" />
                </button>
                <button
                  onClick={next}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-xl bg-white/80 backdrop-blur-sm border border-white/60 flex items-center justify-center shadow-md sm:hidden active:scale-90 transition"
                >
                  <IoChevronForward size={16} className="text-[#06399B]" />
                </button>
              </>
            )}

            {/* Zoom hint */}
            <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden sm:block">
              <span className="bg-black/30 backdrop-blur-md text-white text-[9px] px-2.5 py-1 rounded-full">
                🔍 للتكبير
              </span>
            </div>
          </div>
        </div>

        {/* Thumbnails strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {images.map((img, i) => (
              <motion.button
                key={i}
                onClick={() => setSelected(i)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.93 }}
                className={`relative shrink-0 w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-xl overflow-hidden border-2 transition-all duration-200 bg-white ${
                  i === selected
                    ? "border-[#06399B] shadow-lg shadow-[#06399B]/20"
                    : "border-[#D9E4F5]/60 hover:border-[#3258B1]/40 opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img} alt="" fill className="object-contain p-2" sizes="72px" unoptimized />
                {i === selected && (
                  <motion.div
                    layoutId="thumb-indicator"
                    className="absolute inset-0 bg-[#06399B]/5"
                  />
                )}
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative w-full max-w-2xl aspect-square"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={images[selected]} alt={name} fill className="object-contain" unoptimized />
              {images.length > 1 && (
                <>
                  <button onClick={prev} className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition cursor-pointer">
                    <IoChevronBack size={20} />
                  </button>
                  <button onClick={next} className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition cursor-pointer">
                    <IoChevronForward size={20} />
                  </button>
                </>
              )}
            </motion.div>
            <button onClick={() => setLightbox(false)} className="absolute top-5 left-5 text-white/60 hover:text-white text-3xl leading-none cursor-pointer">✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
