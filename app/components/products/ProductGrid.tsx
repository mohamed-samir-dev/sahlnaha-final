"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import type { Product } from "./types";
import CategoryBanner from "../banner/CategoryBanner";
import { slugConfigs } from "../../lib/categoryConfig";

const LIMIT = 4;

// Normalize Arabic text for loose matching (remove diacritics, normalize alef/hamza)
function normalizeAr(s: string) {
  return s
    .replace(/[أإآا]/g, "ا")
    .replace(/[ىي]/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

// Build a map from normalized category string → slug path from categoryConfig
const slugCategoryMap: Record<string, string> = {};
for (const [slug, config] of Object.entries(slugConfigs)) {
  if (config.filters.category) {
    slugCategoryMap[normalizeAr(config.filters.category)] = `${config.parentHref}/${slug}`;
  }
}

// Fallback map for English/short category keys
const categoryPageMap: Record<string, string> = {
  smartphone: "/smartphones/apple-only",
  smartphones: "/smartphones/apple-only",
  watch: "/apple-watches/se",
  audio: "/audio/airpods-pro",
  speaker: "/audio/airpods-max",
  earbuds: "/audio/samsung-buds",
  ps5: "/playstation/ps5",
  ps4: "/playstation/ps5-slim",
  xbox: "/playstation/xbox-one",
  controller: "/playstation/controllers",
  "gaming-accessories": "/playstation/ps-accessories",
  laptop: "/laptops/macbook-pro",
  monitor: "/laptops/samsung-monitors",
  tablet: "/tablets/ipad-pro",
  powerbank: "/accessories/anker-batteries",
  gaming: "/games/ps5-games",
  "mice-keyboards": "/games/mice-keyboards",
  microphone: "/games/microphones",
  figures: "/games/figures",
  rgb: "/games/rgb-lighting",
  "ساعات ابل": "/apple-watches/se",
  "سماعات ابل": "/audio/airpods-pro",
  "بلاي ستيشن": "/playstation/ps5",
  "لابتوبات": "/laptops/macbook-pro",
  "ايبادات": "/tablets/ipad-pro",
  "ملحقات": "/accessories/anker-batteries",
  "العاب": "/games/ps5-games",
};

function getCategoryHref(category: string): string {
  // 1. Try exact match in slugCategoryMap (normalized)
  const normalized = normalizeAr(category);
  if (slugCategoryMap[normalized]) return slugCategoryMap[normalized];
  // 2. Try exact match in categoryPageMap
  if (categoryPageMap[category]) return categoryPageMap[category];
  if (categoryPageMap[category.toLowerCase()]) return categoryPageMap[category.toLowerCase()];
  // 3. Fallback to search
  return `/search?q=${encodeURIComponent(category)}`;
}

function pickFirst4(items: Product[]): Product[] {
  const parseStorage = (s?: string) => {
    if (!s) return 0;
    const n = parseFloat(s);
    if (s.includes("تيرا") || s.toLowerCase().includes("tb")) return n * 1024;
    return n || 0;
  };
  return [...items].sort((a, b) => parseStorage(a.storage) - parseStorage(b.storage)).slice(0, LIMIT);
}

function CategoryRow({ category, items, isFirst }: { category: string; items: Product[]; isFirst?: boolean }) {
  const visible = pickFirst4(items);
  const href = getCategoryHref(category);

  return (
    <div className="mb-14">
      {/* Section Header */}
      <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-7" dir="rtl">
        <div className="flex-1 h-px bg-gradient-to-l from-[#D9E4F5] to-transparent" />
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#D9E4F5]/60 border border-[#D9E4F5]">
          <span className="w-2 h-2 rounded-full bg-[#06399B] animate-pulse flex-shrink-0" />
          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-[#06399B] whitespace-nowrap">{category}</h2>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-[#D9E4F5] to-transparent" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {visible.map((p, i) => (
          <ProductCard key={p._id} product={p} priority={isFirst && i === 0} />
        ))}
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-5">
        <Link
          href={href}
          className="inline-flex items-center gap-2 px-10 py-3 rounded-xl bg-gradient-to-r from-[#06399B] to-[#3258B1] text-white text-sm font-bold shadow-[0_4px_16px_rgba(6,57,155,0.3)] hover:shadow-[0_8px_28px_rgba(6,57,155,0.45)] hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto justify-center"
        >
          عرض جميع المنتجات
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </Link>
      </div>
    </div>
  );
}

type HomeSettings = { category: string; subCategory: string; showInHome: boolean; order: number };
type HomeConfig = { settings: HomeSettings[]; max: number };

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [homeConfig, setHomeConfig] = useState<HomeConfig | null>(null);
  const [bannerMap, setBannerMap] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/products`).then((r) => r.json()),
      fetch("/api/sub-categories-home").then((r) => r.json()).catch(() => ({ settings: [], max: 4 })),
    ])
      .then(([prods, config]) => {
        setProducts(prods);
        setHomeConfig(Array.isArray(config) ? { settings: config, max: 4 } : config);
        // Fetch all category banners in one bulk call
        const cats = [...new Set((prods as Product[]).map((p) => p.category).filter(Boolean))];
        if (cats.length) {
          fetch(`/api/admin/category-banners-bulk?categories=${encodeURIComponent(cats.join(","))}`)
            .then((r) => r.json())
            .then((data) => { if (data && typeof data === "object") setBannerMap(data); })
            .catch(() => {});
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const map: Record<string, Product[]> = {};
    products.forEach((p) => {
      const cat = p.category || "أخرى";
      (map[cat] ??= []).push(p);
    });
    return map;
  }, [products]);

  // If no settings configured yet, show all. Otherwise filter & sort by settings.
  const orderedCategories = useMemo(() => {
    const allCats = Object.keys(grouped).filter((c) => c !== "أخرى");
    if (!homeConfig) return allCats;
    const { settings, max } = homeConfig;
    const visibleSettings = settings.filter((s) => s.showInHome);
    if (visibleSettings.length === 0) return allCats;
    const orderedCats = visibleSettings
      .sort((a, b) => a.order - b.order)
      .slice(0, max)
      .map((s) => s.category)
      .filter((c, idx, arr) => arr.indexOf(c) === idx)
      .filter((c) => allCats.includes(c));
    return orderedCats;
  }, [grouped, homeConfig]);

  if (loading) return (
    <section className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {[1, 2, 3].map((g) => (
        <div key={g} className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#D9E4F5]" />
            <div className="h-8 w-40 bg-[#D9E4F5] animate-pulse rounded-2xl" />
            <div className="flex-1 h-px bg-[#D9E4F5]" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#D9E4F5]/60 overflow-hidden shadow-sm">
                <div className="w-full aspect-square bg-[#D9E4F5]/40 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-[#D9E4F5]/60 animate-pulse rounded w-3/4" />
                  <div className="h-4 bg-[#D9E4F5]/60 animate-pulse rounded w-1/2" />
                </div>
                <div className="border-t border-[#D9E4F5]/40 h-12 bg-[#D9E4F5]/20 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
  if (!products.length) return <p className="text-center text-gray-400 py-10">لا توجد منتجات حالياً</p>;

  return (
    <section className="w-full py-8 sm:py-12 overflow-hidden" dir="rtl">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        {/* Section Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D9E4F5] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#06399B] animate-pulse" />
            <span className="text-xs font-semibold text-[#06399B]">منتجاتنا المختارة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#06399B]">تسوّق بالتصنيف</h2>
          <p className="text-sm sm:text-base text-gray-500 mt-2">أفضل المنتجات من كل تصنيف</p>
        </div>

        {orderedCategories.map((category, catIdx) => (
          <div key={category}>
            {/* Category Banner */}
            {bannerMap[category]?.length > 0 && (
              <div className="-mx-3 sm:-mx-4 mb-5 sm:mb-7">
                <CategoryBanner category={category} images={bannerMap[category]} />
              </div>
            )}
            <CategoryRow category={category} items={grouped[category]} isFirst={catIdx === 0} />
          </div>
        ))}
      </div>
    </section>
  );
}
