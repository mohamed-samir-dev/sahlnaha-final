import type { Metadata } from "next";
import AboutClient from "./AboutClient";

const SITE_URL = "https://sahlnahastore.com";

export const metadata: Metadata = {
  title: "عن مؤسسة سهلناها التقنية",
  description: "تعرف على مؤسسة سهلناها التقنية - رؤيتنا وخدماتنا في بيع الأجهزة الإلكترونية بالأقساط داخل المملكة العربية السعودية.",
  keywords: ["سهلناها التقنية", "عن المؤسسة", "أجهزة إلكترونية بالأقساط", "السعودية"],
  openGraph: {
    type: "website",
    url: `${SITE_URL}/about`,
    title: "عن مؤسسة سهلناها التقنية",
    description: "تعرف على مؤسسة سهلناها التقنية - رؤيتنا وخدماتنا في بيع الأجهزة الإلكترونية بالأقساط داخل المملكة العربية السعودية.",
    locale: "ar_SA",
    siteName: "مؤسسة سهلناها التقنية",
  },
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return <AboutClient />;
}
