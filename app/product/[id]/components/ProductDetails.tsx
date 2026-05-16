"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IoCheckmarkCircle } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { HiOutlineIdentification, HiOutlineCreditCard, HiOutlineClipboardDocumentCheck, HiOutlinePencilSquare, HiOutlineCalendarDays } from "react-icons/hi2";
import type { Product } from "../../../components/products/types";

const fmt = (n: number) => n.toLocaleString("en-US");

type TabKey = "overview" | "specs" | "reviews";

interface Props {
  product: Product;
}

export default function ProductDetails({ product }: Props) {
  const { overview, description, specs, installment } = product;
  const specifications = (product as any).specifications as { groupName: string; items: { label: string; value: string }[] }[] | undefined;
  const features = (product as any).features as string[] | undefined;
  const reviews = (product as any).reviews as { name: string; rate: number; comment: string; date: string }[] | undefined;
  const detailedSpecs = (product as any).detailedSpecs as Record<string, Record<string, string>> | undefined;

  const overviewText = overview || description || "";
  const hasSpecs = !!(specifications && specifications.length > 0) || !!(specs && Object.values(specs).some(Boolean));
  const hasReviews = !!(reviews && reviews.length > 0);
  const hasInstallment = !!installment?.available;

  const tabs: { key: TabKey; label: string }[] = [];
  if (overviewText || features) tabs.push({ key: "overview", label: "نظرة عامة" });
  if (hasSpecs) tabs.push({ key: "specs", label: "المواصفات" });
  if (hasReviews) tabs.push({ key: "reviews", label: "التقييمات" });

  const [activeTab, setActiveTab] = useState<TabKey>(tabs[0]?.key || "overview");

  if (!overviewText && !hasSpecs && !hasReviews && !hasInstallment) return null;

  return (
    <div className="mt-8 sm:mt-12 md:mt-16">

      {/* ── Tab Navigation ── */}
      {tabs.length > 1 && (
        <div className="flex gap-1.5 sm:gap-2 p-1.5 bg-[#D9E4F5]/30 rounded-2xl mb-6 sm:mb-8 overflow-x-auto scrollbar-hide border border-[#D9E4F5]/50">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`relative px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                activeTab === key
                  ? "bg-white text-[#06399B] shadow-md shadow-[#06399B]/10"
                  : "text-gray-500 hover:text-[#06399B]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ── Overview Tab ── */}
      {activeTab === "overview" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Overview text */}
          {overviewText && (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#D9E4F5]/50 shadow-[0_2px_16px_rgba(6,57,155,0.05)] p-5 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#06399B] to-[#3258B1]" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900">نظرة عامة</h3>
              </div>
              <p className="text-sm sm:text-[15px] text-gray-600 leading-[1.9]">{overviewText}</p>
            </div>
          )}

          {/* Features */}
          {features && features.length > 0 && (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#D9E4F5]/50 shadow-[0_2px_16px_rgba(6,57,155,0.05)] p-5 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#3258B1] to-[#476CB7]" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900">أبرز المميزات</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 bg-[#D9E4F5]/20 rounded-xl px-4 py-3 border border-[#D9E4F5]/30">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#06399B] to-[#3258B1] flex items-center justify-center shrink-0">
                      <IoCheckmarkCircle size={14} className="text-white" />
                    </div>
                    <span className="text-xs sm:text-[13px] font-semibold text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Specs (body, display, camera, connectivity) */}
          {detailedSpecs && typeof detailedSpecs === "object" && Object.keys(detailedSpecs).length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {Object.entries(detailedSpecs).map(([groupKey, groupVal]) => {
                if (!groupVal || typeof groupVal !== "object") return null;
                const entries = Object.entries(groupVal).filter(([, v]) => !!v);
                if (entries.length === 0) return null;
                const groupLabels: Record<string, string> = {
                  body: "الهيكل",
                  display: "الشاشة",
                  camera: "الكاميرا",
                  connectivity: "الاتصال",
                };
                return (
                  <div key={groupKey} className="bg-white rounded-2xl border border-[#D9E4F5]/50 shadow-[0_2px_16px_rgba(6,57,155,0.05)] p-4 sm:p-5">
                    <h4 className="text-xs sm:text-sm font-bold text-[#06399B] mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#06399B]" />
                      {groupLabels[groupKey] || groupKey}
                    </h4>
                    <div className="space-y-2">
                      {entries.map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center py-1.5 border-b border-[#D9E4F5]/30 last:border-0">
                          <span className="text-[11px] sm:text-xs text-gray-400">{key}</span>
                          <span className="text-[11px] sm:text-xs font-bold text-gray-800">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* ── Specs Tab ── */}
      {activeTab === "specs" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* New specifications format (grouped) */}
          {specifications && specifications.length > 0 ? (
            <div className="space-y-4">
              {specifications.map((group, gi) => (
                <div key={gi} className="bg-white rounded-2xl sm:rounded-3xl border border-[#D9E4F5]/50 shadow-[0_2px_16px_rgba(6,57,155,0.05)] overflow-hidden">
                  {/* Group header */}
                  <div className="bg-gradient-to-l from-[#D9E4F5]/40 to-[#D9E4F5]/20 px-5 sm:px-6 py-3 sm:py-3.5 border-b border-[#D9E4F5]/40">
                    <h4 className="text-sm sm:text-[15px] font-bold text-[#06399B]">{group.groupName}</h4>
                  </div>
                  {/* Items */}
                  <div className="divide-y divide-[#D9E4F5]/30">
                    {group.items.map((item, ii) => (
                      <div key={ii} className="flex justify-between items-center px-5 sm:px-6 py-3 sm:py-3.5 hover:bg-[#D9E4F5]/10 transition-colors">
                        <span className="text-xs sm:text-[13px] text-gray-500">{item.label}</span>
                        <span className="text-xs sm:text-[13px] font-bold text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : specs ? (
            /* Old specs format */
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#D9E4F5]/50 shadow-[0_2px_16px_rgba(6,57,155,0.05)] overflow-hidden">
              <div className="divide-y divide-[#D9E4F5]/30">
                {([
                  ["screen", "الشاشة"], ["processor", "المعالج"], ["ram", "الرام"], ["storage", "التخزين"],
                  ["rearCamera", "الكاميرا الخلفية"], ["frontCamera", "الكاميرا الأمامية"],
                  ["battery", "البطارية"], ["batteryLife", "عمر البطارية"], ["charging", "الشحن"],
                  ["os", "نظام التشغيل"], ["extras", "مميزات إضافية"],
                ] as [keyof NonNullable<Product["specs"]>, string][])
                  .filter(([key]) => !!specs[key])
                  .map(([key, label]) => (
                    <div key={key} className="flex justify-between items-center px-5 sm:px-6 py-3 sm:py-3.5 hover:bg-[#D9E4F5]/10 transition-colors">
                      <span className="text-xs sm:text-[13px] text-gray-500">{label}</span>
                      <span className="text-xs sm:text-[13px] font-bold text-gray-900">{specs[key]}</span>
                    </div>
                  ))}
              </div>
            </div>
          ) : null}
        </motion.div>
      )}

      {/* ── Reviews Tab ── */}
      {activeTab === "reviews" && hasReviews && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Rating summary */}
          {product.rating && (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#D9E4F5]/50 shadow-[0_2px_16px_rgba(6,57,155,0.05)] p-5 sm:p-6 flex items-center gap-5">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-[#06399B]">{product.rating.average}</div>
                <div className="flex items-center gap-0.5 mt-1 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={12} className={i < Math.round(product.rating!.average) ? "text-amber-400" : "text-gray-200"} />
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">{product.rating.count} تقييم</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = reviews!.filter(r => r.rate === star).length;
                  const pct = reviews!.length > 0 ? (count / reviews!.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 w-3">{star}</span>
                      <FaStar size={9} className="text-amber-400" />
                      <div className="flex-1 h-2 rounded-full bg-[#D9E4F5]/40 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#06399B] to-[#3258B1]" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-400 w-5">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Individual reviews */}
          {reviews!.map((review, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#D9E4F5]/50 shadow-[0_2px_16px_rgba(6,57,155,0.05)] p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#06399B] to-[#3258B1] flex items-center justify-center text-white text-xs font-bold">
                    {(review.name || "م").charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs sm:text-[13px] font-bold text-gray-800">{review.name || "مستخدم"}</p>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, si) => (
                        <FaStar key={si} size={9} className={si < review.rate ? "text-amber-400" : "text-gray-200"} />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400">{review.date}</span>
              </div>
              <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* ── Installment Section (always visible) ── */}
      {hasInstallment && (
        <div className="mt-8 sm:mt-12 space-y-4">
          {/* Installment hero */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#06399B] via-[#3258B1] to-[#476CB7]" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/8 rounded-full blur-[60px]" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#D9E4F5]/10 rounded-full blur-[50px]" />
            <div className="relative p-5 sm:p-8 md:p-10 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl">💳</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">احصل عليه بالتقسيط المريح</h3>
              {installment!.downPayment && (
                <p className="text-sm sm:text-base text-white/70">
                  ادفع مقدم <span className="text-white font-bold">{fmt(installment!.downPayment)} ر.س</span> والباقي أقساط شهرية
                </p>
              )}
              {installment!.note && <p className="text-[11px] sm:text-xs text-white/40 mt-3">{installment!.note}</p>}
            </div>
          </div>

          {/* Conditions */}
          {installment!.conditions && installment!.conditions.length > 0 && (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#D9E4F5]/50 shadow-[0_2px_16px_rgba(6,57,155,0.05)] p-5 sm:p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#06399B] to-[#3258B1]" />
                <h4 className="text-sm sm:text-base font-bold text-gray-900">شروط التقسيط</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {installment!.conditions.map((c, i) => {
                  const icons = [HiOutlineIdentification, HiOutlineCreditCard, HiOutlineClipboardDocumentCheck, HiOutlinePencilSquare, HiOutlineCalendarDays];
                  const Icon = icons[i % icons.length];
                  return (
                    <div key={i} className="flex items-center gap-3 bg-[#D9E4F5]/15 rounded-xl px-4 py-3 border border-[#D9E4F5]/30">
                      <div className="w-8 h-8 rounded-lg bg-[#06399B]/8 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#06399B]" />
                      </div>
                      <span className="text-[11px] sm:text-xs font-medium text-gray-700 leading-relaxed">{c}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
