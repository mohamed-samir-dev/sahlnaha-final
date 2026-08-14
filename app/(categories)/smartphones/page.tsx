import type { Metadata } from "next";
import SmartphonesClient from "./SmartphonesClient";
import { getCachedCompany } from "../../lib/cache";

export const revalidate = 3600;

const BACKEND = (process.env.BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");
const SITE_URL = "https://sahlnahastore.com";

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCachedCompany();
  const siteName = company.nameAr || "مؤسسة سهلناها التقنية";
  const title = `الهواتف الذكية | ${siteName}`;
  const description = `تسوق أحدث الهواتف الذكية بأفضل الأسعار وبالأقساط في ${siteName}. آيفون، سامسونج، شاومي وأكثر.`;
  const logoUrl = company.logo
    ? (company.logo.startsWith("http") ? company.logo : `${BACKEND}${company.logo}`)
    : "";
  return {
    title,
    description,
    keywords: ["هواتف ذكية", "آيفون", "سامسونج", "شاومي", "أقساط", "السعودية", siteName],
    openGraph: {
      type: "website",
      url: `${SITE_URL}/smartphones`,
      title,
      description,
      siteName,
      locale: "ar_SA",
      images: logoUrl ? [{ url: logoUrl, width: 1200, height: 630, alt: title }] : [],
    },
    twitter: { card: "summary_large_image", title, description, images: logoUrl ? [logoUrl] : [] },
    alternates: { canonical: `${SITE_URL}/smartphones` },
  };
}

export default function SmartphonesPage() {
  return <SmartphonesClient />;
}
