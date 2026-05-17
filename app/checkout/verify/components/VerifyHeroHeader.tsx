"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  IoShieldCheckmarkOutline,
  IoKeyOutline,
  IoChevronBack,
  IoCartOutline,
  IoCardOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";

const steps = [
  { icon: IoCartOutline, label: "السلة", done: true },
  { icon: IoCardOutline, label: "الدفع", done: true },
  { icon: IoCheckmarkCircle, label: "التأكيد", active: true },
];

export default function VerifyHeroHeader() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#225EFF] via-[#1a4fd4] to-[#0a3adb] pt-10 pb-16 px-4 sm:px-8">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full"><defs><pattern id="hvk" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="white" /></pattern></defs><rect width="100%" height="100%" fill="url(#hvk)" /></svg>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#7FA8FF]/20 rounded-full translate-x-20 -translate-y-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#AAD6FF]/15 rounded-full -translate-x-16 translate-y-16 pointer-events-none" />

      <div className="relative max-w-2xl mx-auto">
        <Link href="/checkout" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium mb-6">
          <IoChevronBack size={16} className="rotate-180" />
          العودة للدفع
        </Link>

        <div className="flex items-end justify-between">
          <div>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#AAD6FF] animate-pulse" />
              <span className="text-[11px] text-white/80 font-medium">تأكيد العملية</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl sm:text-4xl font-black text-white leading-tight">
              رمز التحقق
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-white/50 text-sm mt-1 font-medium flex items-center gap-1.5">
              <IoShieldCheckmarkOutline size={14} />
              دفع آمن ومشفر 100%
            </motion.p>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
            className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
            <IoKeyOutline size={28} className="text-white/80" />
            <span className="text-[10px] text-white/50 font-medium mt-1">OTP</span>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center mt-6">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                step.done ? "bg-white/20 text-white border border-white/30" :
                step.active ? "bg-white text-[#225EFF] shadow-[0_4px_16px_rgba(0,0,0,0.15)]" :
                "bg-white/10 text-white/40 border border-white/10"
              }`}>
                {step.done ? <IoCheckmarkCircle size={12} /> : <step.icon size={12} />}
                <span className="hidden xs:inline">{step.label}</span>
              </div>
              {i < steps.length - 1 && <div className="h-px bg-white/20 w-4 sm:w-6 mx-1" />}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
