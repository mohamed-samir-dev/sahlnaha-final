"use client";

import { useState, useEffect, useSyncExternalStore, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { navItems } from "./data";
import { SearchIcon, CartIcon, MenuIcon, CloseIcon } from "./icons";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";
import { useCartStore } from "../../store/cartStore";
import { useCompanyStore } from "../../store/companyStore";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<{ _id: string; name: string; images?: string[]; image?: string; salePrice?: number; originalPrice?: number; price?: number }[]>([]);
  const [searching, setSearching] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.qty, 0));
  const { logo, fetchCompany } = useCompanyStore();

  const API_IMG = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const resolveImg = (src: string) => src.startsWith("http") ? src : `${API_IMG}${src.startsWith("/") ? src : "/" + src}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(`/api/products?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchResults(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchResults]);

  useEffect(() => { fetchCompany(); }, [fetchCompany]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "navbar-scrolled" : ""}`}
      style={{ background: "linear-gradient(135deg, #06399B 0%, #02329E 100%)" }}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-5">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-[72px]">
          {/* Right: Hamburger + Logo */}
          <div className="flex items-center gap-2">
            <button
              aria-label="القائمة"
              className="lg:hidden p-2 text-[#D9E4F5] hover:text-white rounded-xl hover:bg-white/10 transition-all duration-200"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            <Link href="/" className="shrink-0" aria-label="الصفحة الرئيسية">
              {logo && (
                <Image
                  src={logo}
                  unoptimized
                  alt="الصفحة الرئيسية"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="h-9 sm:h-11 lg:h-14 w-auto brightness-0 invert"
                  priority
                  loading="eager"
                />
              )}
            </Link>
          </div>

          {/* Center: Desktop Nav */}
          <div className="hidden lg:block">
            <DesktopNav items={navItems} />
          </div>

          {/* Left: Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              aria-label="بحث"
              className="p-2 text-[#D9E4F5] hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <SearchIcon />
            </button>
            <Link
              href="/cart"
              aria-label="السلة"
              className="p-2 text-[#D9E4F5] hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 relative"
            >
              <CartIcon />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -left-0.5 bg-[#476CB7] text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 shadow-lg shadow-[#476CB7]/30">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div ref={searchWrapRef} className="border-t border-white/10 px-4 py-3 relative" dir="rtl">
          <div className="max-w-2xl mx-auto flex gap-2">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/50 outline-none focus:border-[#D9E4F5] focus:bg-white/15 transition-all"
            />
            {searching && (
              <div className="absolute left-6 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-[#D9E4F5] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {results.length > 0 && (
            <ul className="absolute right-4 left-4 max-w-2xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-2xl mt-2 z-50 max-h-72 overflow-y-auto">
              {results.map((p) => {
                const img = p.images?.[0] || p.image;
                const price = p.salePrice ?? p.originalPrice ?? p.price ?? 0;
                return (
                  <li key={p._id}>
                    <Link
                      href={`/product/${p._id}`}
                      onClick={() => { setSearchOpen(false); setSearchQuery(""); setResults([]); }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#FBFBFC] transition-colors"
                    >
                      {img && (
                        <Image src={resolveImg(img)} alt={p.name} width={40} height={40} className="object-contain rounded-lg" unoptimized />
                      )}
                      <span className="flex-1 text-sm text-[#00002F] line-clamp-1 font-medium">{p.name}</span>
                      <span className="text-sm font-bold text-[#06399B] shrink-0">{price.toLocaleString("en-US")} ر.س</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {!searching && searchQuery.trim() && results.length === 0 && (
            <p className="text-center text-sm text-white/50 py-3">لا توجد نتائج</p>
          )}
        </div>
      )}

      <MobileMenu items={navItems} isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </nav>
  );
}
