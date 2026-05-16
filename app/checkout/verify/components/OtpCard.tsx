"use client";

import { RefObject } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoShieldCheckmarkOutline,
  IoKeyOutline,
  IoTimeOutline,
  IoRefreshOutline,
  IoArrowBack,
} from "react-icons/io5";

interface OtpCardProps {
  otp: string;
  setOtp: (v: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  codeError: boolean;
  setCodeError: (v: boolean) => void;
  lengthError: boolean;
  setLengthError: (v: boolean) => void;
  resent: boolean;
  cooldown: number;
  submitCooldown: number;
  onSubmit: (e: React.FormEvent) => void;
  onResend: () => void;
}

export default function OtpCard({
  otp, setOtp, inputRef,
  codeError, setCodeError,
  lengthError, setLengthError,
  resent, cooldown, submitCooldown,
  onSubmit, onResend,
}: OtpCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, type: "spring", stiffness: 120 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#225EFF]/10 shadow-[0_4px_20px_rgba(34,94,255,0.07)] overflow-hidden"
    >
      <div className="p-6 space-y-5">

        {/* Icon + Title */}
        <div className="flex flex-col items-center gap-3 pt-1">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#225EFF]/10 to-[#7FA8FF]/10 border border-[#225EFF]/15 flex items-center justify-center">
            <IoKeyOutline size={26} className="text-[#225EFF]" />
          </div>
          <div className="text-center">
            <p className="text-base font-black text-gray-800">رمز التحقق OTP</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">أدخل الرمز المرسل إلى هاتفك</p>
          </div>
        </div>

        {/* Info */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <IoTimeOutline size={15} className="text-amber-400 shrink-0" />
          <p className="text-amber-600/80 text-[11px] font-medium leading-relaxed">
            أحياناً يصل الرمز متأخراً بعد بضع دقائق، يرجى الانتظار قليلاً
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div dir="ltr">
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="أدخل الرمز"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                setCodeError(false);
                setLengthError(false);
              }}
              className={`w-full py-4 text-center text-2xl font-extrabold rounded-xl border-2 outline-none transition-all duration-200 tracking-[0.4em] ${
                codeError
                  ? "border-red-300 bg-red-50/50 text-red-500"
                  : otp
                  ? "border-[#225EFF] bg-[#225EFF]/5 text-[#225EFF]"
                  : "border-gray-200 bg-gray-50 text-gray-800 focus:border-[#225EFF] focus:bg-white focus:shadow-[0_0_0_3px_rgba(34,94,255,0.1)]"
              }`}
            />
          </div>

          <AnimatePresence>
            {lengthError && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-amber-500 text-xs font-bold text-center">
                يجب إدخال 4 أو 6 أرقام
              </motion.p>
            )}
            {codeError && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-xs font-bold text-center">
                الرمز غير صحيح، حاول مرة أخرى
              </motion.p>
            )}
            {resent && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[#225EFF] text-xs font-bold text-center">
                ✓ تم إعادة إرسال الرمز
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={submitCooldown > 0}
            whileHover={submitCooldown > 0 ? {} : { scale: 1.01 }}
            whileTap={submitCooldown > 0 ? {} : { scale: 0.98 }}
            className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
              submitCooldown > 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#225EFF] via-[#1a4fd4] to-[#0a3adb] text-white shadow-[0_8px_24px_rgba(34,94,255,0.3)] hover:shadow-[0_12px_32px_rgba(34,94,255,0.4)]"
            }`}
          >
            {submitCooldown > 0 ? (
              <>انتظر ({submitCooldown}s)</>
            ) : (
              <>
                <IoShieldCheckmarkOutline size={18} />
                تأكيد الرمز
              </>
            )}
          </motion.button>

          <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400 text-xs font-medium">لم يصلك الرمز؟</span>
              <button
                type="button"
                disabled={cooldown > 0}
                onClick={onResend}
                className={`font-bold transition-all select-none flex items-center gap-1 text-xs ${
                  cooldown > 0 ? "text-gray-300 cursor-not-allowed" : "text-[#225EFF] hover:text-[#1a4fd4]"
                }`}
              >
                <IoRefreshOutline size={13} className={cooldown > 0 ? "" : "hover:rotate-180 transition-transform duration-500"} />
                {cooldown > 0 ? `${cooldown}s` : "إعادة الإرسال"}
              </button>
            </div>
            <Link href="/checkout" className="flex items-center gap-1.5 text-gray-400 text-xs font-medium hover:text-[#225EFF] transition-colors">
              <IoArrowBack size={12} className="rotate-180" />
              العودة للدفع
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
