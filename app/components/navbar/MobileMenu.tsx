import { useState } from "react";
import Link from "next/link";
import { NavItem } from "./data";
import { ChevronDownIcon } from "./icons";

interface MobileMenuProps {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ items, isOpen, onClose }: MobileMenuProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const hasChildren = (item: NavItem) => item.children || item.groups;

  return (
    <>
      {/* Overlay */}
      <div
        className={`lg:hidden fixed inset-0 top-14 sm:top-16 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        className={`lg:hidden fixed top-14 sm:top-16 right-0 w-[78vw] max-w-[320px] h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)] z-50 overflow-y-auto shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-[110%]"
        }`}
        style={{ background: "linear-gradient(180deg, #06399B 0%, #02329E 100%)" }}
        dir="rtl"
      >
        <div className="py-2">
          {/* Header */}
          <div className="px-5 py-4 text-base font-bold text-white border-b border-white/10 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#476CB7] animate-pulse" />
            أقسام المتجر
          </div>

          {items.map((item) => (
            <div key={item.label} className="border-b border-white/5">
              {hasChildren(item) ? (
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-all"
                >
                  {item.label}
                  <span className={`transition-transform duration-200 ${openDropdown === item.label ? "rotate-180" : ""}`}>
                    <ChevronDownIcon />
                  </span>
                </button>
              ) : (
                <Link
                  href={item.href}
                  className="block px-5 py-3.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-all"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              )}

              <div
                className={`transition-all duration-300 ease-in-out ${
                  hasChildren(item) && openDropdown === item.label ? "max-h-[600px] opacity-100 overflow-y-auto" : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <div className="bg-white/5 py-1">
                  {item.groups?.map((group, gi) => (
                    <div key={gi}>
                      <div className="px-5 py-2 text-xs font-bold text-[#D9E4F5] uppercase tracking-wide border-b border-white/5">
                        {group.groupLabel}
                      </div>
                      {group.items.map((child, ci) => (
                        <Link
                          key={`${child.href}-${ci}`}
                          href={child.href}
                          className="block px-8 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
                          onClick={onClose}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                  {item.children?.map((child, index) => (
                    <Link
                      key={`${child.href}-${index}`}
                      href={child.href}
                      className="block px-8 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
                      onClick={onClose}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
