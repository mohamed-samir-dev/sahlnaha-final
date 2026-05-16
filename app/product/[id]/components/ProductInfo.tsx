"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoCartOutline,
  IoCheckmarkCircle,
  IoShieldCheckmark,
  IoCarOutline,
  IoCheckmarkDoneCircle,
  IoFlashOutline,
  IoStorefrontOutline,
} from "react-icons/io5";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import type { Product } from "../../../components/products/types";

const fmt = (n: number) => n.toLocaleString("en-US");

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: "easeOut" as const },
});

interface ProductInfoProps {
  product: Product;
  addedToCart: boolean;
  onAddToCart: () => void;
}

export default function ProductInfo({ product, addedToCart, onAddToCart }: ProductInfoProps) {
  const router = useRouter();
  const { name, brand, color, storage, network, salePrice, taxIncluded, installment, freeDelivery, deliveryTime, inStock } = product;
  const originalPrice = product.originalPrice ?? 0;
  const hasDiscount = salePrice != null && salePrice !== originalPrice;
  const savedAmount = hasDiscount ? originalPrice - (salePrice ?? 0) : 0;
  const discountPercent = hasDiscount ? Math.round((savedAmount / originalPrice) * 100) : 0;
  const displayPrice = hasDiscount ? salePrice! : originalPrice;

  const renderStars = (avg: number) =>
    [...Array(5)].map((_, i) => {
      if (avg >= i + 1) return <FaStar key={i} className="text-amber-400" size={12} />;
      if (avg >= i + 0.5) return <FaStarHalfAlt key={i} className="text-amber-400" size={12} />;
      return <FaRegStar key={i} className="text-gray-300" size={12} />;
    });

  const chips = [
    { label: "اللون", val: color },
    { label: "التخزين", val: storage },
    { label: "الشبكة", val: network },
  ].filter((c) => c.val);

  return (
    <div className="flex flex-col gap-4 lg:sticky lg:top-16">

      {/* ── Header card ── */}
      <motion.div {...fadeUp(0)} className="relative overflow-hidden rounded-2xl bg-white border border-[#E8EFFE] shadow-[0_2px_20px_rgba(6,57,155,0.06)]">
        {/* top accent line */}
        <div className="h-1 w-full bg-gradient-to-r from-[#06399B] via-[#3258B1] to-[#476CB7]" />

        <div className="p-4 sm:p-5">
          {/* Brand + stock */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {brand && (
                <span className="text-[11px] font-bold text-[#06399B] bg-[#EEF3FF] px-3 py-1 rounded-full border border-[#D9E4F5]">
                  {brand}
                </span>
              )}
            </div>
            {inStock ? (
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                متوفر
              </motion.span>
            ) : (
              <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
                نفذت الكمية
              </span>
            )}
          </div>

          {/* Name */}
          <h2 className="text-[15px] sm:text-lg font-extrabold text-gray-900 leading-[1.65] mb-2.5">{name}</h2>

          {/* Rating */}
          {product.rating && product.rating.average > 0 && (
            <div className="flex items-center gap-2 mb-2.5">
              <div className="flex items-center gap-0.5">{renderStars(product.rating.average)}</div>
              <span className="text-xs font-black text-[#06399B]">{product.rating.average}</span>
              <span className="text-[11px] text-gray-400">({product.rating.count} تقييم)</span>
            </div>
          )}

          {/* Brief */}
          {product.brief && (
            <p className="text-[12px] sm:text-[13px] text-gray-500 leading-relaxed">{product.brief}</p>
          )}
        </div>

        {/* Chips row */}
        {chips.length > 0 && (
          <div className="flex border-t border-[#EEF3FF]">
            {chips.map((c, i) => (
              <div
                key={i}
                className={`flex-1 text-center py-3 ${i < chips.length - 1 ? "border-l border-[#EEF3FF]" : ""}`}
              >
                <p className="text-[9px] text-gray-400 font-medium mb-0.5">{c.label}</p>
                <p className="text-[11px] sm:text-xs font-black text-[#06399B]">{c.val}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── Price card ── */}
      <motion.div {...fadeUp(0.07)} className="relative overflow-hidden rounded-2xl">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[#06399B]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-60" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#3258B1]/40 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative p-5 sm:p-6">
          {hasDiscount && (
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-[10px] sm:text-xs font-bold bg-white/15 text-white/90 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                خصم {discountPercent}%
              </span>
              <span className="text-xs text-white/40 line-through">{fmt(originalPrice)} ر.س</span>
            </div>
          )}

          <div className="flex items-end gap-2 mb-1">
            <motion.span
              key={displayPrice}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none"
            >
              {fmt(displayPrice)}
            </motion.span>
            <span className="text-base font-bold text-white/60 mb-1">ر.س</span>
          </div>

          {hasDiscount && (
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-white/50">نسبة التوفير</span>
                <span className="text-white/80 font-bold">وفّرت {fmt(savedAmount)} ر.س</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-white/60 to-white/90"
                  initial={{ width: 0 }}
                  animate={{ width: `${discountPercent}%` }}
                  transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            {taxIncluded && (
              <span className="text-[10px] text-white/50 bg-white/8 px-2.5 py-1 rounded-full border border-white/10">
                ✓ شامل الضريبة
              </span>
            )}
            {installment?.available && (
              <span className="text-[10px] text-white/70 bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                💳 تقسيط متاح
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Services ── */}
      <motion.div {...fadeUp(0.14)} className="grid grid-cols-2 gap-2">
        {[
          { icon: <IoCarOutline size={18} />, label: freeDelivery ? "توصيل مجاني" : "توصيل", sub: deliveryTime, color: "#06399B", bg: "#EEF3FF" },
          { icon: <IoShieldCheckmark size={18} />, label: `ضمان ${product.warrantyYears} سنة`, sub: "ضمان معتمد", color: "#3258B1", bg: "#EEF3FF" },
          { icon: <IoFlashOutline size={18} />, label: "شحن سريع", sub: "توصيل فوري", color: "#476CB7", bg: "#EEF3FF" },
          { icon: <IoStorefrontOutline size={18} />, label: "متجر موثوق", sub: "100% أصلي", color: "#10b981", bg: "#ECFDF5" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.18 + i * 0.05, duration: 0.3 }}
            className="flex items-center gap-2.5 bg-white rounded-xl border border-[#EEF3FF] p-3 shadow-[0_1px_8px_rgba(6,57,155,0.04)]"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: item.bg, color: item.color }}
            >
              {item.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold text-gray-800 truncate">{item.label}</p>
              <p className="text-[10px] text-gray-400 truncate">{item.sub}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Colors ── */}
      {product.colors && product.colors.length > 0 && (
        <motion.div {...fadeUp(0.22)} className="bg-white rounded-2xl border border-[#EEF3FF] shadow-[0_2px_12px_rgba(6,57,155,0.04)] p-4">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">الألوان المتاحة</p>
          <div className="flex items-center gap-2.5 flex-wrap">
            {product.colors.map((c, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-[#F7F9FF] border border-[#E8EFFE] px-3 py-2 rounded-xl"
              >
                <span
                  className="w-5 h-5 rounded-full border-2 border-white shadow-md ring-1 ring-black/10"
                  style={{ backgroundColor: c.code }}
                />
                <span className="text-[11px] font-semibold text-gray-700">{c.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── CTA ── */}
      <AnimatePresence mode="wait">
        {!addedToCart ? (
          <motion.button
            key="add"
            onClick={onAddToCart}
            disabled={!inStock}
            {...fadeUp(0.28)}
            whileHover={inStock ? { scale: 1.02, y: -2 } : {}}
            whileTap={inStock ? { scale: 0.97 } : {}}
            className={`relative w-full overflow-hidden font-black text-sm sm:text-base py-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer ${
              inStock
                ? "bg-gradient-to-r from-[#06399B] to-[#3258B1] text-white shadow-xl shadow-[#06399B]/25"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {inStock && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
              />
            )}
            <IoCartOutline size={22} />
            {inStock ? "أضف للسلة" : "غير متوفر"}
          </motion.button>
        ) : (
          <motion.div
            key="added"
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 18 }}
            className="flex flex-col gap-2.5"
          >
            <div className="flex items-center justify-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 py-3.5 rounded-2xl">
              <IoCheckmarkDoneCircle size={20} />
              <span className="text-sm font-bold">تمت الإضافة للسلة ✓</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => router.back()}
                className="bg-[#F0F4FF] hover:bg-[#E4ECFF] text-[#06399B] font-bold text-xs sm:text-sm py-3.5 rounded-xl transition-colors cursor-pointer border border-[#D9E4F5]"
              >
                متابعة التسوق
              </button>
              <button
                onClick={() => router.push("/cart")}
                className="bg-gradient-to-r from-[#06399B] to-[#3258B1] text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#06399B]/20 cursor-pointer"
              >
                <IoCartOutline size={16} />
                عرض السلة
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Installment teaser ── */}
      {installment?.available && installment.downPayment && (
        <motion.div
          {...fadeUp(0.34)}
          className="flex items-center gap-3 bg-gradient-to-r from-[#FFF8EC] to-[#FFF3DC] border border-amber-100 rounded-2xl p-3.5"
        >
          <span className="text-2xl">💳</span>
          <div>
            <p className="text-xs font-bold text-amber-800">تقسيط مريح</p>
            <p className="text-[11px] text-amber-600">
              دفعة أولى <span className="font-black">{fmt(installment.downPayment)} ر.س</span> فقط
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
