"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoCartOutline, IoChevronBack, IoRocketOutline,
  IoShieldCheckmarkOutline, IoStorefrontOutline
} from "react-icons/io5";
import { useCartStore } from "../store/cartStore";
import type { CustomerInfo } from "../store/cartStore";
import CartItem from "./components/CartItem";
import CustomerForm from "./components/CustomerForm";

const fmt = (n: number) => n.toLocaleString("en-US");

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQty, totalPrice, totalItems, setCustomer, customer } = useCartStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); window.scrollTo(0, 0); }, []);

  const total = mounted ? totalPrice() : 0;
  const count = mounted ? totalItems() : 0;
  const installmentMonths = mounted
    ? Math.max(...items.map((i) => i.product.installment?.months ?? 0)) || undefined
    : undefined;

  if (!mounted) return null;

  /* ── Empty State ── */
  if (items.length === 0)
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-white" />
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.12 }}>
          <defs><pattern id="ed" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#225EFF" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#ed)" />
        </svg>
        {[
          { size: 500, x: "-8%", y: "-15%", color: "#225EFF", opacity: 0.25, d: 14 },
          { size: 400, x: "65%", y: "-5%", color: "#7FA8FF", opacity: 0.22, d: 18 },
          { size: 350, x: "35%", y: "40%", color: "#AAD6FF", opacity: 0.28, d: 12 },
        ].map((b, i) => (
          <div key={i} className="absolute rounded-full" style={{ width: b.size, height: b.size, left: b.x, top: b.y, background: `radial-gradient(circle at 40% 40%, ${b.color} 0%, transparent 65%)`, opacity: b.opacity, filter: "blur(55px)", animation: `blob-move ${b.d}s ease-in-out infinite` }} />
        ))}
        <main className="min-h-screen flex flex-col items-center justify-center gap-8 px-4" dir="rtl">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 180, damping: 15 }}
            className="relative w-36 h-36 rounded-3xl bg-gradient-to-br from-[#225EFF]/10 to-[#AAD6FF]/20 border border-[#225EFF]/15 flex items-center justify-center shadow-[0_20px_60px_rgba(34,94,255,0.15)]">
            <IoCartOutline size={56} className="text-[#225EFF]/50" />
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-[#225EFF] to-[#7FA8FF] flex items-center justify-center shadow-[0_4px_12px_rgba(34,94,255,0.4)]">
              <span className="text-white text-[10px] font-black">0</span>
            </div>
          </motion.div>
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-center space-y-2">
            <h2 className="text-2xl font-black text-gray-800">سلتك فارغة!</h2>
            <p className="text-gray-400 text-sm">أضف منتجات وابدأ تسوقك الآن</p>
          </motion.div>
          <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
            whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
            onClick={() => router.push("/")}
            className="flex items-center gap-2 bg-gradient-to-r from-[#225EFF] to-[#7FA8FF] text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-[0_8px_30px_rgba(34,94,255,0.4)]">
            <IoStorefrontOutline size={18} />
            تصفح المنتجات
          </motion.button>
        </main>
      </div>
    );

  return (
    <main className="min-h-screen" dir="rtl">
      {/* ── Background (same as home) ── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-white" />
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.12 }}>
          <defs><pattern id="cdots" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#225EFF" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#cdots)" />
        </svg>
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.06 }}>
          <defs><pattern id="cgrid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M 80 0 L 0 0 0 80" fill="none" stroke="#225EFF" strokeWidth="1" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#cgrid)" />
        </svg>
        <style>{`
          @keyframes blob-move {
            0%,100%{transform:translate(0,0) scale(1)}
            25%{transform:translate(50px,-40px) scale(1.2)}
            50%{transform:translate(-40px,50px) scale(0.85)}
            75%{transform:translate(30px,-25px) scale(1.15)}
          }
          @keyframes pfloat {
            0%,100%{transform:translate(0,0) scale(1);opacity:.35}
            50%{transform:translate(10px,-28px) scale(1.6);opacity:1}
          }
          @keyframes spulse {
            0%,100%{opacity:0;transform:scaleY(.5)}
            50%{opacity:.7;transform:scaleY(1.3)}
          }
        `}</style>
        {[
          { size: 600, x: "-8%",  y: "-15%", color: "#225EFF", opacity: 0.28, d: 14 },
          { size: 500, x: "68%",  y: "-5%",  color: "#7FA8FF", opacity: 0.25, d: 18 },
          { size: 420, x: "40%",  y: "35%",  color: "#AAD6FF", opacity: 0.3,  d: 12 },
          { size: 380, x: "-5%",  y: "60%",  color: "#225EFF", opacity: 0.22, d: 20 },
          { size: 340, x: "78%",  y: "58%",  color: "#7FA8FF", opacity: 0.26, d: 16 },
          { size: 280, x: "30%",  y: "75%",  color: "#AAD6FF", opacity: 0.28, d: 10 },
        ].map((b, i) => (
          <div key={i} className="absolute rounded-full" style={{ width: b.size, height: b.size, left: b.x, top: b.y, background: `radial-gradient(circle at 40% 40%, ${b.color} 0%, transparent 65%)`, opacity: b.opacity, filter: "blur(55px)", animation: `blob-move ${b.d}s ease-in-out infinite`, willChange: "transform" }} />
        ))}
        {Array.from({ length: 12 }, (_, i) => ({ x: `${(i*62+8)%92}%`, y: `${(i*94+12)%88}%`, size: i%3===0?7:i%3===1?5:3, d: 2.5+(i%3), delay: i*0.5, color: i%3===0?"#225EFF":i%3===1?"#7FA8FF":"#AAD6FF" })).map((p, i) => (
          <div key={i} className="absolute rounded-full" style={{ width: p.size, height: p.size, left: p.x, top: p.y, background: p.color, boxShadow: `0 0 ${p.size*4}px ${p.color}88`, animation: `pfloat ${p.d}s ease-in-out infinite`, animationDelay: `${p.delay}s`, willChange: "transform,opacity" }} />
        ))}
        {[
          { left: "22%", top: "5%",  height: "40%", color: "#225EFF", d: 3.5, delay: 0 },
          { left: "65%", top: "20%", height: "30%", color: "#7FA8FF", d: 4.5, delay: 1.5 },
          { left: "45%", top: "55%", height: "25%", color: "#AAD6FF", d: 3,   delay: 0.8 },
        ].map((s, i) => (
          <div key={i} className="absolute" style={{ width: "2px", height: s.height, left: s.left, top: s.top, background: `linear-gradient(180deg,transparent,${s.color}99,transparent)`, filter: "blur(1px)", animation: `spulse ${s.d}s ease-in-out infinite`, animationDelay: `${s.delay}s` }} />
        ))}
      </div>

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#225EFF] via-[#1a4fd4] to-[#0a3adb] pt-10 pb-16 px-4 sm:px-8">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full"><defs><pattern id="hd" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="white" /></pattern></defs><rect width="100%" height="100%" fill="url(#hd)" /></svg>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7FA8FF]/20 rounded-full translate-x-20 -translate-y-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#AAD6FF]/15 rounded-full -translate-x-16 translate-y-16 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium mb-6">
            <IoChevronBack size={16} className="rotate-180" />
            العودة للتسوق
          </Link>

          <div className="flex items-end justify-between">
            <div>
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#AAD6FF] animate-pulse" />
                <span className="text-[11px] text-white/80 font-medium">مراجعة طلبك</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl sm:text-4xl font-black text-white leading-tight">
                سلة التسوق
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-white/50 text-sm mt-1 font-medium">
                {count} منتج في سلتك
              </motion.p>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
              className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
              <span className="text-2xl sm:text-3xl font-black text-white">{count}</span>
              <span className="text-[10px] text-white/50 font-medium">منتج</span>
            </motion.div>
          </div>


        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 -mt-6 pb-16 space-y-3">
        {/* Items */}
        <AnimatePresence>
          {items.map(({ product, qty }, i) => (
            <CartItem key={product._id} product={product} qty={qty} index={i} onUpdateQty={updateQty} onRemove={removeItem} />
          ))}
        </AnimatePresence>

        {/* Summary Card */}
        {/* <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: items.length * 0.08 + 0.1 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#225EFF] to-[#0a3adb] p-5 text-white shadow-[0_16px_48px_rgba(34,94,255,0.3)]">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#7FA8FF]/20 rounded-full translate-x-16 -translate-y-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#AAD6FF]/10 rounded-full -translate-x-10 translate-y-10 pointer-events-none" />
          <div className="relative">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-white/60">المجموع الفرعي</span>
              <span className="font-bold">{fmt(total)} ر.س</span>
            </div>
            <div className="flex justify-between items-center text-sm mb-3">
              <span className="text-white/60">التوصيل</span>
              <span className="text-[#AAD6FF] font-bold flex items-center gap-1 text-xs"><IoRocketOutline size={13} /> مجاني</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between items-center">
              <span className="font-bold">الإجمالي الكلي</span>
              <span className="text-2xl font-black">{fmt(total)} <span className="text-sm font-medium text-white/50">ر.س</span></span>
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 pt-3 border-t border-white/10">
              <div className="flex items-center gap-1.5 text-white/40 text-[11px]"><IoShieldCheckmarkOutline size={13} /> دفع آمن 100%</div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1.5 text-white/40 text-[11px]"><IoRocketOutline size={13} /> توصيل سريع</div>
            </div>
          </div>
        </motion.div> */}

        {/* Customer Form + Payment */}
        <CustomerForm
          total={total}
          itemCount={count}
          initialData={customer}
          installmentMonths={installmentMonths}
          onSubmit={(info: CustomerInfo) => {
            setCustomer(info);
            router.push("/checkout");
          }}
        />
      </div>
    </main>
  );
}
