"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, X, Send } from "lucide-react";

interface Review {
  _id: string;
  name: string;
  comment: string;
  rating: number;
  gender: string;
  createdAt: string;
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  );
}

function Avatar({ name, gender }: { name: string; gender: string }) {
  const isFemale = gender === "female";
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
        isFemale ? "bg-gradient-to-br from-pink-400 to-rose-500" : "bg-gradient-to-br from-[#06399B] to-[#1a5fd4]"
      }`}
    >
      {name.trim().charAt(0).toUpperCase()}
    </div>
  );
}

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [current, setCurrent] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", comment: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState<Review | null>(null);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setReviews(data))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
      setShowForm(false);
      setForm({ name: "", comment: "", rating: 5 });
    } catch {}
    setSubmitting(false);
  }

  const perPage = 3;
  const totalPages = Math.ceil(reviews.length / perPage);
  const visible = reviews.slice(current * perPage, current * perPage + perPage);

  return (
    <section className="w-full py-14 bg-gradient-to-b from-white to-[#f0f5ff]" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block bg-[#06399B]/10 text-[#06399B] text-xs font-bold px-4 py-1.5 rounded-full mb-3 tracking-wide">
            ماذا يقول عملاؤنا
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#06399B]">آراء العملاء</h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="h-1 w-10 rounded-full bg-[#06399B]" />
            <div className="h-1 w-4 rounded-full bg-[#06399B]/30" />
          </div>
        </div>

        {reviews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="wait">
                {visible.map((r, i) => (
                  <motion.div
                    key={r._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: i * 0.07 }}
                    onClick={() => setSelected(r)}
                    className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-[#06399B]/8 hover:shadow-[0_8px_30px_rgba(6,57,155,0.12)] hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col group"
                  >
                    {/* Top accent bar */}
                    <div className="h-1 w-full bg-gradient-to-l from-[#06399B] to-[#06399B]" />

                    <div className="p-5 flex flex-col gap-3 flex-1">
                      {/* Quote + Stars row */}
                      <div className="flex items-start justify-between">
                        <div className="w-8 h-8 rounded-lg bg-[#06399B]/8 flex items-center justify-center">
                          <Quote size={16} className="text-[#06399B] fill-[#06399B]" />
                        </div>
                        <StarRating rating={r.rating} />
                      </div>

                      <p className="text-gray-600 text-sm leading-relaxed flex-1 line-clamp-3">
                        {r.comment}
                      </p>

                      {r.comment.length > 120 && (
                        <span className="text-[#06399B] text-xs font-semibold">اقرأ المزيد ←</span>
                      )}

                      <div className="h-px bg-gradient-to-l from-[#06399B]/10 via-[#7CC043]/20 to-transparent" />

                      <div className="flex items-center gap-3">
                        <Avatar name={r.name} gender={r.gender} />
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{r.name}</p>
                          <p className="text-gray-400 text-xs">
                            {new Date(r.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "short" })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  onClick={() => setCurrent((p) => Math.max(0, p - 1))}
                  disabled={current === 0}
                  className="w-9 h-9 rounded-full border border-[#06399B]/20 flex items-center justify-center text-[#06399B] hover:bg-[#06399B] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={16} />
                </button>
                <div className="flex gap-1.5">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-[#06399B]" : "w-2 bg-[#06399B]/20"}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCurrent((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={current === totalPages - 1}
                  className="w-9 h-9 rounded-full border border-[#06399B]/20 flex items-center justify-center text-[#06399B] hover:bg-[#06399B] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-400 text-sm mb-6">لا توجد آراء بعد، كن أول من يعلق!</p>
        )}

        {/* Add Review Button */}
        <div className="flex justify-center mt-8">
          {submitted ? (
            <div className="flex items-center gap-2 text-sm text-[#7CC043] font-semibold bg-[#f0f9e8] border border-[#7CC043]/40 px-5 py-2.5 rounded-full">
              <span className="text-base">✓</span> تم إرسال تعليقك وسيظهر بعد المراجعة
            </div>
          ) : (
            <button
              onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-2 bg-gradient-to-l from-[#06399B] to-[#3258B1] hover:from-[#052d7a] hover:to-[#06399B] text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-[0_4px_20px_rgba(6,57,155,0.35)] hover:shadow-[0_6px_25px_rgba(6,57,155,0.5)] transition-all"
            >
              {showForm ? <X size={15} /> : <Star size={15} className="fill-white" />}
              {showForm ? "إلغاء" : "أضف تقييمك"}
            </button>
          )}
        </div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              className="mt-5 max-w-lg mx-auto rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(6,57,155,0.12)] border border-[#06399B]/10"
            >
              {/* Form Header */}
              <div className="bg-gradient-to-l from-[#06399B] to-[#3258B1] px-5 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Star size={15} className="fill-white text-white" />
                </div>
                <p className="text-white font-bold text-sm">شاركنا رأيك</p>
              </div>

              <div className="bg-white p-5 flex flex-col gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#06399B]" >الاسم</label>
                  <input
                    type="text"
                    placeholder="اكتب اسمك هنا"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#06399B] focus:bg-white focus:ring-2 focus:ring-[#06399B]/10 transition-all placeholder:text-gray-400"
                    required
                  />
                </div>

                {/* Comment */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#06399B]">تعليقك</label>
                  <textarea
                    placeholder="اكتب تجربتك مع المنتج أو الخدمة..."
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    rows={3}
                    className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#06399B] focus:bg-white focus:ring-2 focus:ring-[#06399B]/10 transition-all resize-none placeholder:text-gray-400"
                    required
                  />
                </div>

                {/* Rating */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#06399B]">تقييمك</label>
                  <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} type="button" onClick={() => setForm({ ...form, rating: s })} className="transition-transform hover:scale-110">
                        <Star size={24} className={s <= form.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-200"} />
                      </button>
                    ))}
                    <span className="mr-2 text-xs text-gray-400 font-medium">
                      {["" ,"ضعيف", "مقبول", "جيد", "جيد جداً", "ممتاز"][form.rating]}
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 bg-[#06399B] hover:bg-[#06399B] text-white text-sm font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                >
                  <Send size={14} />
                  {submitting ? "جاري الإرسال..." : "إرسال التعليق"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full flex flex-col gap-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 left-4 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X size={14} />
              </button>
              <StarRating rating={selected.rating} size={18} />
              <p className="text-gray-700 text-sm leading-relaxed">{selected.comment}</p>
              <div className="h-px bg-gray-100" />
              <div className="flex items-center gap-3">
                <Avatar name={selected.name} gender={selected.gender} />
                <div>
                  <p className="font-bold text-gray-800">{selected.name}</p>
                  <p className="text-gray-400 text-xs">
                    {new Date(selected.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
