"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Receipt, X } from "lucide-react";

export default function ConfirmedPopup({ confirmedId }: { confirmedId: string }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 px-4"
        dir="rtl"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative bg-white rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.15)] w-full max-w-md overflow-hidden"
        >
          <Link href="/" className="absolute top-4 left-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 transition-all z-10">
            <X className="w-4 h-4" />
          </Link>
          <div className="relative bg-gradient-to-br from-[#225EFF]/10 to-[#7FA8FF]/5 pt-8 pb-6 flex flex-col items-center">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#225EFF]/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#7FA8FF]/10 rounded-full blur-2xl" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="relative"
            >
              <img src="/sucess.webp" alt="success" className="w-32 h-32 sm:w-40 sm:h-40 object-contain" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-3 bg-[#225EFF] text-white text-sm font-bold px-5 py-1.5 rounded-full shadow-[0_4px_12px_rgba(34,94,255,0.3)]"
            >
              نجحت عملية الدفع ✓
            </motion.span>
          </div>
          <div className="px-5 sm:px-6 py-5 space-y-4 text-center">
            <div>
              <p className="text-gray-800 font-extrabold text-lg">تمت العملية بنجاح</p>
              <p className="text-gray-400 text-sm leading-7 mt-2">
                شكراً لك لثقتك، نشكرك على كونك واحداً من عملائنا الكرام. يرجى التواصل مع خدمة العملاء لاستكمال إجراءات شحن الطلب.
              </p>
            </div>
            <div className="flex gap-3 pt-1">
              <a
                href={`/invoice/${confirmedId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#225EFF] to-[#1a4fd4] text-white font-bold text-sm shadow-[0_4px_16px_rgba(34,94,255,0.3)] hover:shadow-[0_8px_24px_rgba(34,94,255,0.4)] transition-shadow"
              >
                <FileText className="w-4 h-4" /> الفاتورة
              </a>
              <a
                href={`/invoice/${confirmedId}/receipt`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#7FA8FF] to-[#225EFF] text-white font-bold text-sm shadow-[0_4px_16px_rgba(127,168,255,0.3)] hover:shadow-[0_8px_24px_rgba(127,168,255,0.4)] transition-shadow"
              >
                <Receipt className="w-4 h-4" /> سند القبض
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
