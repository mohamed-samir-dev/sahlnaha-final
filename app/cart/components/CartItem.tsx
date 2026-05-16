"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { IoAddCircle, IoRemoveCircle, IoTrashOutline } from "react-icons/io5";

const fmt = (n: number) => n.toLocaleString("ar-SA");

interface CartItemProps {
  product: {
    _id: string;
    name: string;
    price: number;
    salePrice?: number;
    originalPrice?: number;
    images?: string[];
    image?: string;
  };
  qty: number;
  index: number;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const resolveImg = (src: string) =>
  src.startsWith("http") ? src : src.startsWith("/uploads") ? src : `${API}${src}`;

export default function CartItem({ product, qty, index, onUpdateQty, onRemove }: CartItemProps) {
  const price = product.salePrice ?? product.originalPrice ?? product.price;
  const rawImg = product.images?.[0] || product.image;
  const img = rawImg ? resolveImg(rawImg) : undefined;
  const lineTotal = price * qty;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80, scale: 0.95 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: "easeOut" }}
      className="group relative bg-white/75 backdrop-blur-sm rounded-2xl border border-[#225EFF]/10 shadow-[0_4px_20px_rgba(34,94,255,0.06)] hover:shadow-[0_8px_36px_rgba(34,94,255,0.13)] hover:border-[#225EFF]/20 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
    >
      {/* top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#225EFF]/0 via-[#225EFF]/40 to-[#225EFF]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
        {/* Image */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-[#225EFF]/5 to-[#AAD6FF]/10 border border-[#225EFF]/8">
          {img ? (
            <Image src={img} alt={product.name} fill className="object-contain p-2 group-hover:scale-108 transition-transform duration-500" />
          ) : (
            <span className="text-3xl flex items-center justify-center w-full h-full">📱</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <h3 className="text-sm sm:text-[15px] font-bold text-gray-800 leading-snug line-clamp-2 mb-1.5">{product.name}</h3>
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] sm:text-sm font-extrabold text-[#225EFF]">{fmt(price)}</span>
              <span className="text-[11px] font-medium text-gray-400">ر.س</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            {/* Qty */}
            <div className="flex items-center gap-1 bg-gradient-to-r from-[#225EFF]/5 to-[#7FA8FF]/5 rounded-full px-2 py-1 border border-[#225EFF]/10">
              <button onClick={() => onUpdateQty(product._id, qty - 1)} className="hover:scale-110 active:scale-90 transition-transform">
                <IoRemoveCircle size={22} className="text-[#225EFF]/40 hover:text-[#225EFF]/80 transition-colors" />
              </button>
              <span className="text-sm font-black w-7 text-center text-gray-800 tabular-nums">{qty}</span>
              <button onClick={() => onUpdateQty(product._id, qty + 1)} className="hover:scale-110 active:scale-90 transition-transform">
                <IoAddCircle size={22} className="text-[#225EFF] hover:text-[#0a3adb] transition-colors" />
              </button>
            </div>

            {/* Total */}
            <div className="text-left bg-[#225EFF]/5 rounded-xl px-3 py-1.5 border border-[#225EFF]/8">
              <p className="text-[10px] text-[#225EFF]/50 font-medium">الإجمالي</p>
              <p className="text-sm font-extrabold text-[#225EFF]">{fmt(lineTotal)} <span className="text-[10px] text-gray-400 font-medium">ر.س</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={() => onRemove(product._id)}
        className="absolute top-3 left-3 w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:bg-red-100 hover:scale-110 transition-all duration-200"
      >
        <IoTrashOutline size={13} className="text-red-400" />
      </button>
    </motion.div>
  );
}
