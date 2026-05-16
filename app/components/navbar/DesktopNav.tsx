"use client";

import Link from "next/link";
import { NavItem } from "./data";
import { DropdownMenu } from "./dropdown";
import { ChevronDownIcon } from "./icons";

interface DesktopNavProps {
  items: NavItem[];
}

export default function DesktopNav({ items }: DesktopNavProps) {
  return (
    <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
      {items.map((item) => (
        <div key={item.label} className="relative group">
          <Link
            href={item.href}
            className="flex items-center gap-1 px-2.5 xl:px-3.5 py-2 text-[13px] xl:text-sm font-medium text-[#06399B] hover:text-[#02329E] rounded-lg hover:bg-[#D9E4F5]/50 transition-all duration-200 whitespace-nowrap"
          >
            {item.label}
            {(item.children || item.groups) && <ChevronDownIcon />}
          </Link>
          {(item.children || item.groups) && (
            <DropdownMenu items={item.children} groups={item.groups} />
          )}
        </div>
      ))}
    </div>
  );
}
