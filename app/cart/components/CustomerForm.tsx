"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoPersonOutline, IoCardOutline, IoCallOutline, IoLocationOutline,
  IoCalendarOutline, IoWalletOutline, IoChevronDown, IoCashOutline,
  IoLayersOutline, IoCheckmarkCircle
} from "react-icons/io5";
import type { CustomerInfo } from "../../store/cartStore";

const fmt = (n: number) => n.toLocaleString("en-US");

function Field({ label, icon, error, children }: { label: string; icon: React.ReactNode; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#225EFF]/60 uppercase tracking-wider">
        {icon}{label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-xs font-bold">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

interface CustomerFormProps {
  total: number;
  itemCount: number;
  initialData?: CustomerInfo | null;
  installmentMonths?: number;
  onSubmit: (info: CustomerInfo) => void;
}

export default function CustomerForm({ total, itemCount, initialData, installmentMonths, onSubmit }: CustomerFormProps) {
  const maxMonths = installmentMonths ?? 24;
  const MONTHS_OPTIONS = Array.from({ length: maxMonths }, (_, i) => i + 1);
  const minDownPayment = 1000 * itemCount;
  const DOWN_PAYMENT_OPTIONS = [minDownPayment, minDownPayment + 500, minDownPayment + 1000];

  const [name, setName] = useState(initialData?.name ?? "");
  const [nationalId, setNationalId] = useState(initialData?.nationalId ?? "");
  const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp ?? "");
  const [address, setAddress] = useState(initialData?.address ?? "");
  const [installmentType, setInstallmentType] = useState<"full" | "installment">(initialData?.installmentType ?? "installment");
  const [months, setMonths] = useState(initialData?.months ?? maxMonths);
  const [downPaymentExtra, setDownPaymentExtra] = useState<number>(0);
  const downPayment = minDownPayment + downPaymentExtra;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const monthlyPayment = useMemo(() => {
    if (installmentType === "full") return 0;
    const remaining = total - downPayment;
    return remaining > 0 ? Math.ceil(remaining / months) : 0;
  }, [total, months, installmentType, downPayment]);

  const schedule = useMemo(() => {
    const now = new Date();
    return Array.from({ length: months }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() + i + 1, now.getDate());
      return { index: i + 1, date: `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`, amount: monthlyPayment };
    });
  }, [months, monthlyPayment]);

  const inputClass = (field: string) =>
    `w-full rounded-xl px-4 py-3 text-sm text-gray-800 bg-white/60 backdrop-blur-sm border focus:outline-none transition-all duration-200 placeholder:text-gray-300 font-medium ${
      errors[field]
        ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-[#225EFF]/12 focus:border-[#225EFF] focus:ring-2 focus:ring-[#225EFF]/10 focus:bg-white"
    }`;

  const selectClass = "w-full rounded-xl px-4 py-3 text-sm font-bold text-gray-800 bg-white/60 backdrop-blur-sm border border-[#225EFF]/12 focus:outline-none focus:border-[#225EFF] focus:ring-2 focus:ring-[#225EFF]/10 focus:bg-white transition-all duration-200 cursor-pointer appearance-none";

  const handleSubmit = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "مطلوب";
    if (!nationalId.trim()) e.nationalId = "مطلوب";
    else if (!/^[12]\d{9}$/.test(nationalId.trim())) e.nationalId = "رقم هوية غير صحيح";
    if (!whatsapp.trim()) e.whatsapp = "مطلوب";
    else if (!/^05\d{8}$/.test(whatsapp.trim())) e.whatsapp = "يجب أن يبدأ بـ 05 ويتكون من 10 أرقام";
    if (!address.trim()) e.address = "مطلوب";
    setErrors(e);
    if (Object.keys(e).length === 0)
      onSubmit({ name, nationalId, whatsapp, address, installmentType, months, downPayment });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">

      {/* ── Personal Info ── */}
      <div className="relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl border border-[#225EFF]/10 shadow-[0_4px_24px_rgba(34,94,255,0.07)]">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#225EFF]/0 via-[#225EFF] to-[#225EFF]/0" />
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#225EFF] to-[#7FA8FF] flex items-center justify-center shadow-[0_4px_12px_rgba(34,94,255,0.3)]">
              <IoPersonOutline size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-800">بيانات العميل</h3>
              <p className="text-[11px] text-gray-400">أدخل بياناتك الشخصية</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="الاسم كاملاً" icon={<IoPersonOutline size={11} />} error={errors.name}>
              <input value={name} onChange={(e) => { setName(e.target.value.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, "")); setErrors((p) => ({ ...p, name: "" })); }} placeholder="محمد أحمد" className={inputClass("name")} />
            </Field>
            <Field label="رقم الهوية / الإقامة" icon={<IoCardOutline size={11} />} error={errors.nationalId}>
              <input value={nationalId} onChange={(e) => { setNationalId(e.target.value.replace(/[^0-9]/g, "").slice(0, 10)); setErrors((p) => ({ ...p, nationalId: "" })); }} placeholder="1XXXXXXXXX" maxLength={10} className={inputClass("nationalId")} />
            </Field>
            <Field label="رقم الواتساب" icon={<IoCallOutline size={11} />} error={errors.whatsapp}>
              <input type="tel" value={whatsapp} onChange={(e) => { setWhatsapp(e.target.value.replace(/[^0-9]/g, "").slice(0, 10)); setErrors((p) => ({ ...p, whatsapp: "" })); }} placeholder="05XXXXXXXX" className={inputClass("whatsapp")} />
            </Field>
            <Field label="العنوان" icon={<IoLocationOutline size={11} />} error={errors.address}>
              <input value={address} onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: "" })); }} placeholder="المدينة - الحي - الشارع" className={inputClass("address")} />
            </Field>
          </div>
        </div>
      </div>

      {/* ── Payment ── */}
      <div className="relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl border border-[#225EFF]/10 shadow-[0_4px_24px_rgba(34,94,255,0.07)]">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7FA8FF]/0 via-[#7FA8FF] to-[#7FA8FF]/0" />
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7FA8FF] to-[#AAD6FF] flex items-center justify-center shadow-[0_4px_12px_rgba(127,168,255,0.3)]">
              <IoWalletOutline size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-800">طريقة الدفع</h3>
              <p className="text-[11px] text-gray-400">اختر طريقة الدفع المناسبة</p>
            </div>
          </div>

          {/* Toggle */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { type: "installment" as const, icon: <IoLayersOutline size={20} />, label: "تقسيط شهري", color: "#225EFF" },
              { type: "full" as const, icon: <IoCashOutline size={20} />, label: "كاش كامل", color: "#7FA8FF" },
            ].map(({ type, icon, label, color }) => (
              <button key={type} onClick={() => setInstallmentType(type)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                  installmentType === type
                    ? "border-[#225EFF]/40 bg-gradient-to-br from-[#225EFF]/8 to-[#7FA8FF]/8 shadow-[0_4px_16px_rgba(34,94,255,0.12)]"
                    : "border-[#225EFF]/8 bg-white/40 hover:border-[#225EFF]/20 hover:bg-[#225EFF]/4"
                }`}>
                {installmentType === type && (
                  <motion.div layoutId="pcheck" className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-gradient-to-br from-[#225EFF] to-[#7FA8FF] rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(34,94,255,0.4)]">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </motion.div>
                )}
                <span style={{ color: installmentType === type ? color : "#9ca3af" }}>{icon}</span>
                <span className={`text-xs font-bold ${installmentType === type ? "text-[#225EFF]" : "text-gray-400"}`}>{label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {installmentType === "installment" ? (
              <motion.div key="inst" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="عدد الأشهر" icon={<IoCalendarOutline size={11} />}>
                    <div className="relative">
                      <select value={String(months)} onChange={(e) => setMonths(Number(e.target.value))} className={selectClass}>
                        {MONTHS_OPTIONS.map((m) => <option key={m} value={m}>{m} شهر</option>)}
                      </select>
                      <IoChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#225EFF]/40 pointer-events-none" />
                    </div>
                  </Field>
                  <Field label="الدفعة الأولى" icon={<IoWalletOutline size={11} />}>
                    <div className="relative">
                      <select value={String(downPaymentExtra)} onChange={(e) => setDownPaymentExtra(Number(e.target.value))} className={selectClass}>
                        {DOWN_PAYMENT_OPTIONS.map((v) => <option key={v} value={v - minDownPayment}>{fmt(v)} ر.س</option>)}
                        <option value={total - minDownPayment}>كامل ({fmt(total)} ر.س)</option>
                      </select>
                      <IoChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#225EFF]/40 pointer-events-none" />
                    </div>
                  </Field>
                </div>

                {/* Monthly highlight */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#225EFF] to-[#0a3adb] rounded-xl p-4 shadow-[0_8px_28px_rgba(34,94,255,0.3)]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#7FA8FF]/20 rounded-full translate-x-8 -translate-y-8 pointer-events-none" />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-white/50 font-bold mb-0.5">القسط الشهري</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-white">{fmt(monthlyPayment)}</span>
                        <span className="text-sm text-white/40">ر.س / شهر</span>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-[11px] text-white/50 font-bold mb-0.5">لمدة</p>
                      <p className="text-xl font-black text-[#AAD6FF]">{months} <span className="text-sm text-white/40">شهر</span></p>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                {months > 0 && (
                  <div className="rounded-xl overflow-hidden border border-[#225EFF]/10">
                    <div className="max-h-52 overflow-y-auto scrollbar-hide">
                      <table className="w-full text-sm">
                        <thead className="sticky top-0">
                          <tr className="bg-gradient-to-r from-[#225EFF] to-[#7FA8FF]">
                            <th className="py-2.5 px-3 text-right text-[11px] font-bold text-white/80">#</th>
                            <th className="py-2.5 px-3 text-right text-[11px] font-bold text-white/80">التاريخ</th>
                            <th className="py-2.5 px-3 text-right text-[11px] font-bold text-white/80">المبلغ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {schedule.map((row, i) => (
                            <tr key={row.index} className={`${i % 2 === 0 ? "bg-white/80" : "bg-[#225EFF]/[0.02]"} hover:bg-[#225EFF]/[0.05] transition-colors`}>
                              <td className="py-2 px-3 text-[#225EFF]/40 font-bold text-xs">{row.index}</td>
                              <td className="py-2 px-3 text-gray-500 text-xs">{row.date}</td>
                              <td className="py-2 px-3 font-bold text-[#225EFF] text-xs">{fmt(row.amount)} ر.س</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="full" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <div className="relative overflow-hidden bg-gradient-to-br from-[#7FA8FF] to-[#225EFF] rounded-xl p-5 text-center shadow-[0_8px_28px_rgba(34,94,255,0.25)]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-8 -translate-y-8 pointer-events-none" />
                  <div className="relative">
                    <IoCashOutline size={28} className="text-white/60 mx-auto mb-2" />
                    <p className="text-[11px] text-white/60 font-bold mb-1">المبلغ الإجمالي</p>
                    <div className="flex items-baseline justify-center gap-1.5">
                      <span className="text-3xl font-black text-white">{fmt(total)}</span>
                      <span className="text-sm text-white/50">ر.س</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Submit ── */}
      <motion.button
        whileHover={{ scale: 1.01, y: -2 }} whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        className="w-full relative overflow-hidden bg-gradient-to-r from-[#225EFF] to-[#7FA8FF] text-white font-black py-4 rounded-2xl text-base shadow-[0_8px_32px_rgba(34,94,255,0.4)] hover:shadow-[0_16px_48px_rgba(34,94,255,0.5)] transition-shadow duration-300"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <IoCheckmarkCircle size={20} />
          تأكيد الطلب والمتابعة
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />
      </motion.button>
    </motion.div>
  );
}
