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
      <div className="relative bg-gradient-to-l from-[#225EFF] to-[#0a3adb] px-6 py-5 overflow-hidden">
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

      <div className="p-5 space-y-4">
        {/* ── Items ── */}
        <div className="space-y-1">
          {items.map(({ product, qty }, i) => {
            const price = product.salePrice ?? product.originalPrice ?? product.price;
            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#225EFF]/30 shrink-0" />
                  <span className="text-sm text-gray-600 font-medium truncate">{product.name}</span>
                  {qty > 1 && (
                    <span className="shrink-0 text-[10px] font-extrabold text-white bg-[#225EFF] rounded-full px-1.5 py-0.5">
                      ×{qty}
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-gray-800 shrink-0 mr-2">
                  {fmt(price * qty)} <span className="text-xs text-gray-400 font-normal">ر.س</span>
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* ── Subtotal / Installment info ── */}
        <div className="bg-gray-50/80 rounded-2xl p-4 space-y-2.5 border border-gray-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 font-medium">المجموع الكلي</span>
            <span className="font-bold text-gray-700">{fmt(total)} ر.س</span>
          </div>

          {isInstallment && downPayment > 0 && (
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1.5 text-gray-400">
                <IoLayersOutline size={13} />
                <span className="font-medium">الدفعة الأولى</span>
              </div>
              <span className="font-bold text-[#225EFF]">{fmt(downPayment)} ر.س</span>
            </div>
          )}

          {isInstallment && customer?.months && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-medium">مدة التقسيط</span>
              <span className="font-bold text-gray-700">{customer.months} شهر</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 pt-1 border-t border-gray-100">
            <IoCheckmarkCircle size={13} className="text-emerald-400" />
            <span className="text-[11px] text-gray-400 font-medium">شامل الضريبة والتوصيل</span>
          </div>
        </div>

        {/* ── Amount Due Now ── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#225EFF] via-[#1a4fd4] to-[#0a3adb] p-5 shadow-[0_12px_40px_rgba(34,94,255,0.3)]">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(255,255,255,0.05) 20px,rgba(255,255,255,0.05) 21px)" }} />
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
                {isInstallment ? <IoLayersOutline size={18} className="text-white" /> : <IoCashOutline size={18} className="text-white" />}
              </div>
              <div>
                <p className="text-[11px] text-white/50 font-medium">المطلوب دفعه الآن</p>
                <p className="text-xs text-white/70 font-bold">{isInstallment ? "الدفعة الأولى" : "كامل المبلغ"}</p>
              </div>
            </div>
            <div className="text-left">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white tracking-tight">{fmt(isPaying)}</span>
                <span className="text-sm text-white/50 font-medium">ر.س</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Remaining note ── */}
        {isInstallment && downPayment > 0 && downPayment < total && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-start gap-2.5 bg-[#225EFF]/5 rounded-2xl px-4 py-3 border border-[#225EFF]/10"
          >
            <IoWalletOutline size={15} className="text-[#225EFF]/60 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              المتبقي{" "}
              <span className="font-extrabold text-[#225EFF]">{fmt(total - downPayment)} ر.س</span>{" "}
              يُسدَّد على{" "}
              <span className="font-extrabold text-[#225EFF]">{customer?.months} شهر</span>
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
