"use client";
import Image from "next/image";

export default function PaymentClient() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden" dir="rtl">

      {/* ══ HERO ══ */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-20 pt-16 sm:pt-24 lg:pt-32 pb-16 sm:pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* Right - Text + Features */}
          <div className="flex-1 text-center lg:text-right">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0031f3] mb-3 leading-tight">
              طرق الدفع
            </h1>
            <p className="text-[#797D9B] text-sm sm:text-base lg:text-lg leading-relaxed max-w-md mx-auto lg:mx-0 mb-8">
              نوفر لك مجموعة متنوعة من طرق الدفع الآمنة والموثوقة
              لتجربة تسوق سهلة وسريعة وآمنة.
            </p>

            {/* Features - horizontal */}
            <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-0 lg:divide-x lg:divide-x-reverse lg:divide-gray-200 max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-center gap-3 lg:pl-5">
                <div className="w-10 h-10 rounded-lg bg-[#1A59FD]/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#1A59FD]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0031f3]">دفع آمن</h3>
                  <p className="text-xs text-[#797D9B]">جميع عمليات الدفع مشفرة وآمنة لحماية بياناتك</p>
                </div>
              </div>

              <div className="flex items-center gap-3 lg:px-5">
                <div className="w-10 h-10 rounded-lg bg-[#1A59FD]/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#1A59FD]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0031f3]">سريع وسهل</h3>
                  <p className="text-xs text-[#797D9B]">اختر طريقة الدفع المناسبة وأكمل طلبك خلال ثوانٍ</p>
                </div>
              </div>

              <div className="flex items-center gap-3 lg:pr-5">
                <div className="w-10 h-10 rounded-lg bg-[#1A59FD]/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#1A59FD]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0031f3]">موثوق ومعتمد</h3>
                  <p className="text-xs text-[#797D9B]">نستخدم بوابات دفع عالمية معتمدة وآمنة 100%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Left - Image */}
          <div className="flex-1 flex justify-center">
            <Image
              src="/top.webp"
              alt="طرق الدفع"
              width={500}
              height={400}
              className="object-contain w-full max-w-[420px]"
              priority
            />
          </div>
        </div>
      </section>

      {/* ══ PAYMENT METHODS ══ */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-20 pb-20 sm:pb-28">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0031f3] text-center mb-4">
          طرق الدفع المتاحة
        </h2>
        <p className="text-[#797D9B] text-center text-sm sm:text-base mb-12 max-w-lg mx-auto">
          اختر الطريقة الأنسب لك من بين وسائل الدفع المعتمدة
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">

          {/* Mastercard */}
          <div className="group bg-[#f8faff] rounded-3xl border border-gray-100 p-7 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-24 h-24 mx-auto mb-5 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Image src="/master.webp" alt="ماستركارد" width={64} height={64} className="object-contain" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0031f3] mb-2">ماستركارد</h3>
            <p className="text-sm text-[#797D9B] leading-relaxed mb-4">
              ادفع باستخدام بطاقات ماستركارد الائتمانية أو مسبقة الدفع
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#1A59FD] bg-[#1A59FD]/8 rounded-full px-4 py-1.5 font-medium">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              مدعومة عالمياً
            </span>
          </div>

          {/* Visa */}
          <div className="group bg-[#f8faff] rounded-3xl border border-gray-100 p-7 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-24 h-24 mx-auto mb-5 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Image src="/visa.webp" alt="فيزا" width={64} height={64} className="object-contain" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0031f3] mb-2">فيزا</h3>
            <p className="text-sm text-[#797D9B] leading-relaxed mb-4">
              ادفع باستخدام بطاقات فيزا الائتمانية أو مسبقة الدفع
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#1A59FD] bg-[#1A59FD]/8 rounded-full px-4 py-1.5 font-medium">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              مدعومة عالمياً
            </span>
          </div>

          {/* Mada */}
          <div className="group bg-[#f8faff] rounded-3xl border border-gray-100 p-7 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-24 h-24 mx-auto mb-5 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Image src="/mada.webp" alt="مدى" width={64} height={64} className="object-contain" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0031f3] mb-2">مدى</h3>
            <p className="text-sm text-[#797D9B] leading-relaxed mb-4">
              ادفع بسهولة وأمان باستخدام بطاقات مدى البنكية
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#1A59FD] bg-[#1A59FD]/8 rounded-full px-4 py-1.5 font-medium">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              مدعومة في السعودية
            </span>
          </div>


        </div>
      </section>

      {/* ══ INSTALLMENT CARD ══ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-20 sm:pb-28">
        <div className="bg-[#EFF4FD] rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-center gap-6">
          {/* Right - Image */}
          <div className="shrink-0">
            <Image
              src="/final.webp"
              alt="خطة التقسيط"
              width={180}
              height={140}
              className="object-contain"
            />
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-32 bg-gray-300" />

          {/* Left - Text */}
          <div className="text-center lg:text-right">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#0031f3] mb-3">
              ادفع بالتقسيط المريح
            </h3>
            <p className="text-[#797D9B] text-sm leading-relaxed">
              ابدأ الآن بدفعة أولى <span className="font-bold text-[#1A59FD]">1,000 ريال</span> فقط،
              وقسّط الباقي على <span className="font-bold text-[#1A59FD]">24 شهر</span> بأقساط
              ميسّرة بدون فوائد. استمتع بخدماتنا فوراً وادفع براحتك.
            </p>
          </div>
        </div>
      </section>

      {/* ══ TRUST BANNER ══ */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-20 pb-20 sm:pb-28">
        <div className="bg-[#000F4C] rounded-3xl p-8 sm:p-12 text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            تسوق بثقة وأمان
          </h3>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            جميع بياناتك محمية بأحدث تقنيات الأمان والتشفير.
            نستخدم بروتوكولات حماية متقدمة لضمان سرية معلوماتك المالية والشخصية،
            حتى تتمكن من إتمام عمليات الشراء براحة بال تامة دون أي قلق.
          </p>
        </div>
      </section>

    </main>
  );
}
