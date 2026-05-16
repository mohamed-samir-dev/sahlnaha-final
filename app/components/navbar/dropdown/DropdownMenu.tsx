"use client";

import Link from "next/link";
import { NavGroup } from "../data";

interface DropdownMenuProps {
  items?: { label: string; href: string }[];
  groups?: NavGroup[];
}

export default function DropdownMenu({ items, groups }: DropdownMenuProps) {
  return (
    <div className="absolute top-full right-0 mt-2 w-64 rounded-2xl shadow-2xl border border-white/10 py-2 z-50 max-h-96 overflow-y-auto opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 backdrop-blur-xl"
      style={{ background: "linear-gradient(135deg, #06399B 0%, #02329E 100%)" }}
    >
      {groups?.map((group, gi) => (
        <div key={gi}>
          <div className="px-4 py-2 text-xs font-bold text-[#D9E4F5] uppercase tracking-wide border-b border-white/10">
            {group.groupLabel}
          </div>
          {group.items.map((item, ci) => (
            <Link
              key={`${item.href}-${ci}`}
              href={item.href}
              className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all text-right rounded-lg mx-1"
            >
              {item.label}
            </Link>
          ))}
        </div>
      ))}
      {items?.map((item, index) => (
        <Link
          key={`${item.href}-${index}`}
          href={item.href}
          className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all text-right rounded-lg mx-1"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
