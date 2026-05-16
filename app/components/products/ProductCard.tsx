"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { IoCartOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { GoShieldCheck } from "react-icons/go";
import { FaStar } from "react-icons/fa";
import type { Product } from "./types";
import { useCartStore } from "../../store/cartStore";

const fmt = (n: number) => n.toLocaleString("en-US");

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const resolveImg = (src: string) => {
  const clean = src.replace(/&amp;/g, "&");
  return clean.startsWith("http") ? clean : `${API}${clean.startsWith("/") ? clean : "/" + clean}`;
};

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { name, salePrice, discountPercent = 0, freeDelivery, warrantyYears, inStock } = product;
  const image = product.images?.[0] || product.image;
  const resolvedImage = image ? resolveImg(image) : undefined;
  const originalPrice = product.originalPrice ?? product.price ?? 0;
  const hasDiscount = salePrice != null && salePrice !== originalPrice;
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [toast, setToast] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addItem(product);
    setAdded(true);
    setToast(true);
    setTimeout(() => {
      setToast(false);
      setAdded(false);
      window.scrollTo(0, 0);
      router.push("/cart");
    }, 1000);
  };

  return (
    <>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 text-base font-medium animate-fade-in-down">
          <IoCheckmarkCircleOutline size={18} />
          تمت إضافة المنتج للسلة
        </div>
      )}

      <Link
        href={`/product/${product._id}`}
        className="group relative flex flex-col h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-[#D9E4F5]/60 hover:border-[#06399B]/20 shadow-[0_2px_12px_rgba(6,57,155,0.05)] hover:shadow-[0_12px_40px_rgba(6,57,155,0.12)] transition-all duration-400 hover:-translate-y-1"
        dir="rtl"
      >
        {/* Top gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#06399B] via-[#3258B1] to-[#476CB7] opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Image Section */}
        <div className="relative w-full bg-gradient-to-b from-[#f8faff] to-white" style={{ paddingBottom: "75%" }}>
          <div className="absolute inset-0">
            {resolvedImage ? (
              <Image
                src={resolvedImage}
                alt={name}
                fill
                className="object-contain p-3 sm:p-5 group-hover:scale-105 transition-transform duration-500 ease-out"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={priority}
                loading={priority ? "eager" : "lazy"}
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">📱</div>
            )}
          </div>

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3">
              <span className="relative flex items-center gap-0.5 bg-gradient-to-l from-[#06399B] to-[#3258B1] text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1.5 rounded-lg shadow-[0_3px_12px_rgba(6,57,155,0.3)]">
                {discountPercent}%-
              </span>
            </div>
          )}

          {/* Stock Badge */}
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3">
            {inStock ? (
              <span className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-emerald-600 text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                متوفر
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-500 text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border border-gray-200">
                غير متوفر
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="px-3 sm:px-4 pt-3 pb-2 flex flex-col gap-2 flex-1">
          {/* Product Name */}
          <h3 className="text-[12px] sm:text-[13px] md:text-sm font-bold text-gray-800 leading-[1.7] line-clamp-2 group-hover:text-[#06399B] transition-colors duration-300">
            {name}
          </h3>

          {/* Rating */}
          {product.rating && product.rating.average > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={10}
                    className={i < Math.round(product.rating!.average) ? "text-amber-400" : "text-gray-200"}
                  />
                ))}
              </div>
              <span className="text-[10px] text-gray-400">({product.rating.count})</span>
            </div>
          )}

          {/* Delivery & Warranty Tags */}
          {(freeDelivery || warrantyYears > 0) && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {freeDelivery && (
                <span className="flex items-center gap-1 text-[9px] sm:text-[10px] text-[#06399B] bg-[#D9E4F5]/50 px-2 py-0.5 rounded-full font-semibold">
                  <TbTruckDelivery size={11} />
                  توصيل مجاني
                </span>
              )}
              {warrantyYears > 0 && (
                <span className="flex items-center gap-1 text-[9px] sm:text-[10px] text-[#06399B] bg-[#D9E4F5]/50 px-2 py-0.5 rounded-full font-semibold">
                  <GoShieldCheck size={10} />
                  ضمان {warrantyYears}س
                </span>
              )}
            </div>
          )}

          {/* Price Section */}
          <div className="mt-auto pt-2.5">
            {hasDiscount ? (
              <div className="flex flex-col gap-0.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base sm:text-lg md:text-xl font-extrabold text-[#06399B]">{fmt(salePrice)}</span>
                  <span className="text-[10px] sm:text-xs text-[#476CB7] font-medium">ر.س</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs text-gray-400 line-through">{fmt(originalPrice)}</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-white bg-gradient-to-l from-[#06399B] to-[#3258B1] px-1.5 py-0.5 rounded">
                    وفّر {fmt(originalPrice - salePrice!)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg md:text-xl font-extrabold text-[#06399B]">{fmt(originalPrice)}</span>
                <span className="text-[10px] sm:text-xs text-[#476CB7] font-medium">ر.س</span>
              </div>
            )}
          </div>
        </div>

        {/* Cart Button */}
        <div className="px-2 sm:px-4 pb-2 sm:pb-4 pt-1">
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`cart-btn ${added ? "added" : ""} ${!inStock ? "!bg-gray-300 !shadow-none cursor-not-allowed" : ""}`}
          >
            {added ? (
              <><IoCheckmarkCircleOutline size={15} />تمت الإضافة</>
            ) : (
              <><IoCartOutline size={15} />{inStock ? "أضف للسلة" : "غير متوفر"}</>
            )}
          </button>
        </div>
      </Link>
    </>
  );
}
