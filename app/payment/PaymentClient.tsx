"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.12, duration: 0.45, ease: "easeOut" as const },
  }),
};

export default function PaymentClient() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden" dir="rtl">

      {/* ══ HERO ══ */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-20 pt-10 sm:pt-20 lg:pt-28 pb-12 sm:pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 lg:gap-16">

          {/* Right - Text + Features */}
          <div className="flex-1 text-right">
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="text-[1.6rem] sm:text-[2.2rem] md:text-4xl lg:text-5xl font-extrabold text-[#0031f3] mb-3 sm:mb-4 leading-[1.3]"
            >
              طرق الدفع
            </motion.h1>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="text-[#6b7280] text-[0.82rem] sm:text-[0.92rem] lg:text-base leading-[1.8] max-w-md mb-6 sm:mb-8"
            >
              نوفر لك مجموعة متنوعة من طرق الدفع الآمنة والموثوقة
              لتجربة تسوق سهلة وسريعة وآمنة.
            </motion.p>

            {/* Features */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap items-start gap-3 sm:gap-4 lg:gap-0 lg:divide-x lg:divide-x-reverse lg:divide-gray-200 max-w-2xl"
            >
              <div className="flex items-center gap-3 w-full sm:w-auto lg:pl-5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1A59FD]/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#1A59FD]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-[0.8rem] sm:text-sm font-bold text-[#0031f3]">دفع آمن</h3>
                  <p className="text-[0.7rem] sm:text-xs text-[#6b7280] leading-relaxed">جميع عمليات الدفع مشفرة وآمنة</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto lg:px-5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1A59FD]/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#1A59FD]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-[0.8rem] sm:text-sm font-bold text-[#0031f3]">سريع وسهل</h3>
                  <p className="text-[0.7rem] sm:text-xs text-[#6b7280] leading-relaxed">أكمل طلبك خلال ثوانٍ معدودة</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto lg:pr-5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1A59FD]/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#1A59FD]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-[0.8rem] sm:text-sm font-bold text-[#0031f3]">موثوق ومعتمد</h3>
                  <p className="text-[0.7rem] sm:text-xs text-[#6b7280] leading-relaxed">بوابات دفع عالمية آمنة 100%</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Left - Image */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="flex-1 flex justify-center"
          >
            <Image
              src="/top.webp"
              alt="طرق الدفع"
              width={500}
              height={400}
              className="object-contain w-full max-w-[240px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px]"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* ══ PAYMENT METHODS ══ */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-20 pb-16 sm:pb-24">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0031f3] text-center mb-2 sm:mb-4"
        >
          طرق الدفع المتاحة
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          className="text-[#6b7280] text-center text-[0.8rem] sm:text-sm md:text-base mb-8 sm:mb-12 max-w-lg mx-auto leading-relaxed"
        >
          اختر الطريقة الأنسب لك من بين وسائل الدفع المعتمدة
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-4xl mx-auto">

          {/* Mastercard */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,49,243,0.1)" }}
            className="group bg-gradient-to-b from-[#f8faff] to-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 sm:p-7 text-center transition-all duration-300"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-5 rounded-xl sm:rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Image src="/master.webp" alt="ماستركارد" width={64} height={64} className="object-contain w-10 sm:w-12 lg:w-14" />
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#0031f3] mb-1.5 sm:mb-2">ماستركارد</h3>
            <p className="text-[0.75rem] sm:text-sm text-[#6b7280] leading-relaxed mb-3 sm:mb-4">
              ادفع باستخدام بطاقات ماستركارد الائتمانية أو مسبقة الدفع
            </p>
            <span className="inline-flex items-center gap-1.5 text-[0.7rem] sm:text-xs text-[#1A59FD] bg-[#1A59FD]/8 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 font-semibold">
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              مدعومة عالمياً
            </span>
          </motion.div>

          {/* Visa */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,49,243,0.1)" }}
            className="group bg-gradient-to-b from-[#f8faff] to-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 sm:p-7 text-center transition-all duration-300"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-5 rounded-xl sm:rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Image src="/visa.webp" alt="فيزا" width={64} height={64} className="object-contain w-10 sm:w-12 lg:w-14" />
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#0031f3] mb-1.5 sm:mb-2">فيزا</h3>
            <p className="text-[0.75rem] sm:text-sm text-[#6b7280] leading-relaxed mb-3 sm:mb-4">
              ادفع باستخدام بطاقات فيزا الائتمانية أو مسبقة الدفع
            </p>
            <span className="inline-flex items-center gap-1.5 text-[0.7rem] sm:text-xs text-[#1A59FD] bg-[#1A59FD]/8 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 font-semibold">
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              مدعومة عالمياً
            </span>
          </motion.div>

          {/* Mada */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,49,243,0.1)" }}
            className="group bg-gradient-to-b from-[#f8faff] to-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 sm:p-7 text-center transition-all duration-300 sm:col-span-2 lg:col-span-1 sm:max-w-sm sm:mx-auto lg:max-w-none"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-5 rounded-xl sm:rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Image src="/mada.webp" alt="مدى" width={64} height={64} className="object-contain w-10 sm:w-12 lg:w-14" />
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#0031f3] mb-1.5 sm:mb-2">مدى</h3>
            <p className="text-[0.75rem] sm:text-sm text-[#6b7280] leading-relaxed mb-3 sm:mb-4">
              ادفع بسهولة وأمان باستخدام بطاقات مدى البنكية
            </p>
            <span className="inline-flex items-center gap-1.5 text-[0.7rem] sm:text-xs text-[#1A59FD] bg-[#1A59FD]/8 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 font-semibold">
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              مدعومة في السعودية
            </span>
          </motion.div>

        </div>
      </section>

      {/* ══ INSTALLMENT CARD ══ */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
        className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pb-14 sm:pb-24"
      >
        <div className="bg-gradient-to-br from-[#EFF4FD] to-[#e8effc] rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8">
          <div className="shrink-0">
            <Image
              src="/final.webp"
              alt="خطة التقسيط"
              width={180}
              height={140}
              className="object-contain w-[100px] sm:w-[140px] md:w-[170px]"
            />
          </div>

          <div className="hidden md:block w-px h-28 bg-gray-300/60" />

          <div className="text-center md:text-right">
            <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#0031f3] mb-2 sm:mb-3">
              ادفع بالتقسيط المريح
            </h3>
            <p className="text-[#6b7280] text-[0.78rem] sm:text-sm leading-[1.9]">
              ابدأ الآن بدفعة أولى <span className="font-bold text-[#1A59FD]">1,000 ريال</span> فقط،
              وقسّط الباقي على <span className="font-bold text-[#1A59FD]">24 شهر</span> بأقساط
              ميسّرة بدون فوائد. استمتع بخدماتنا فوراً وادفع براحتك.
            </p>
          </div>
        </div>
      </motion.section>

      {/* ══ TRUST BANNER ══ */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
        className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-20 pb-14 sm:pb-24"
      >
        <div className="bg-gradient-to-br from-[#000F4C] to-[#001a6e] rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 text-center">
          <h3 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white mb-3 sm:mb-4">
            تسوق بثقة وأمان
          </h3>
          <p className="text-white/75 text-[0.78rem] sm:text-sm md:text-base leading-[1.9] max-w-2xl mx-auto">
            جميع بياناتك محمية بأحدث تقنيات الأمان والتشفير.
            نستخدم بروتوكولات حماية متقدمة لضمان سرية معلوماتك المالية والشخصية،
            حتى تتمكن من إتمام عمليات الشراء براحة بال تامة دون أي قلق.
          </p>
        </div>
      </motion.section>

    </main>
  );
}
