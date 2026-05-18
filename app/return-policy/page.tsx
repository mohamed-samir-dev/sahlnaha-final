import type { Metadata } from "next";
import ReturnPolicyClient from "./ReturnPolicyClient";

const SITE_URL = "https://sahlnahastore.com";

export const metadata: Metadata = {
  title: "سياسة الاستبدال والاسترجاع",
  description: "الشروط المنظمة لطلبات الإلغاء والاستبدال والاسترجاع داخل مؤسسة سهلناها التقنية.",
  keywords: ["سياسة الاسترجاع", "استبدال", "إلغاء طلب", "سهلناها التقنية", "السعودية"],
  openGraph: {
    type: "website",
    url: `${SITE_URL}/return-policy`,
    title: "سياسة الاستبدال والاسترجاع | مؤسسة سهلناها التقنية",
    description: "الشروط المنظمة لطلبات الإلغاء والاستبدال والاسترجاع داخل مؤسسة سهلناها التقنية.",
    locale: "ar_SA",
    siteName: "مؤسسة سهلناها التقنية",
  },
  alternates: { canonical: `${SITE_URL}/return-policy` },
};

export default function ReturnPolicyPage() {
  return <ReturnPolicyClient />;
}
