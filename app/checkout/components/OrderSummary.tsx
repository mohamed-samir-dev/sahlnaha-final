"use client";

import { motion } from "framer-motion";
import {
  IoReceiptOutline, IoRocketOutline, IoLayersOutline,
  IoCashOutline, IoWalletOutline, IoCheckmarkCircle,
} from "react-icons/io5";
import { useCartStore } from "../../store/cartStore";

const fmt = (n: number) => n.toLocaleString("en-US");

export default function OrderSummary({ total, downPayment }: { total: number; downPayment: number }) {
  const { items, customer } = useCartStore();
  const isPaying = downPayment > 0 ? downPayment : total;
  const isInstallment = customer?.installmentType === "installment";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, type: "spring", stiffness: 120 }}
      className="rounded-3xl overflow-hidden border border-[#225EFF]/10 shadow-[0_8px_40px_rgba(34,94,255,0.1)] bg-white"
    >
      {/* ── Header ── */}
      <div className="relative bg-gradient-to-l from-[#225EFF] to-[#0a3adb] px-4 py-3.5 overflow-hidden">
        <div className="absolute -top-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#7FA8FF]/20 rounded-full translate-x-8 translate-y-8 pointer-events-none" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <IoReceiptOutline size={19} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">ملخص الطلب</h3>
              <p className="text-[11px] text-white/50 font-medium">{items.length} منتج</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1.5">
            <IoRocketOutline size={12} className="text-[#AAD6FF]" />
            <span className="text-[11px] text-white/80 font-bold">توصيل مجاني</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* ── Items ── */}
        <div>
          {items.map(({ product, qty }, i) => {
            const price = product.salePrice ?? product.originalPrice ?? product.price;
            return (
              <div key={product._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#225EFF]/30 shrink-0" />
                  <span className="text-xs text-gray-600 font-medium truncate">{product.name}</span>
                  {qty > 1 && <span className="shrink-0 text-[10px] font-extrabold text-white bg-[#225EFF] rounded-full px-1.5 py-0.5">×{qty}</span>}
                </div>
                <span className="text-xs font-bold text-gray-800 shrink-0 mr-2">{fmt(price * qty)} <span className="text-[10px] text-gray-400 font-normal">ر.س</span></span>
              </div>
            );
          })}
        </div>

        {/* ── Summary + Amount ── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#225EFF] via-[#1a4fd4] to-[#0a3adb] p-4 shadow-[0_8px_28px_rgba(34,94,255,0.3)]">
          <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/50">المجموع الكلي</span>
              <span className="font-bold text-white/80">{fmt(total)} ر.س</span>
            </div>
            {isInstallment && downPayment > 0 && (
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1 text-white/50"><IoLayersOutline size={11} /><span>الدفعة الأولى</span></div>
                <span className="font-bold text-[#AAD6FF]">{fmt(downPayment)} ر.س</span>
              </div>
            )}
            {isInstallment && customer?.months && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/50">مدة التقسيط</span>
                <span className="font-bold text-white/80">{customer.months} شهر</span>
              </div>
            )}
            <div className="border-t border-white/10 pt-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {isInstallment ? <IoLayersOutline size={14} className="text-white/60" /> : <IoCashOutline size={14} className="text-white/60" />}
                <span className="text-[11px] text-white/60 font-medium">المطلوب دفعه الآن</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-white">{fmt(isPaying)}</span>
                <span className="text-xs text-white/50">ر.س</span>
              </div>
            </div>
            {isInstallment && downPayment > 0 && downPayment < total && (
              <div className="flex items-center gap-1.5 pt-2 border-t border-white/10">
                <IoWalletOutline size={13} className="text-[#AAD6FF] shrink-0" />
                <p className="text-xs text-white/80 font-medium">المتبقي <span className="font-black text-white">{fmt(total - downPayment)} ر.س</span> يُسدَّد على <span className="font-black text-white">{customer?.months} شهر</span></p>
              </div>
            )}
            <div className="flex items-center gap-1 pt-1 border-t border-white/10">
              <IoCheckmarkCircle size={11} className="text-emerald-400" />
              <span className="text-[10px] text-white/30">شامل الضريبة والتوصيل</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
