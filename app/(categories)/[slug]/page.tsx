import type { Metadata } from "next";
import { slugConfigs } from "../../lib/categoryConfig";
import CategoryPageClient from "./CategoryPageClient";
import { getCachedCompany } from "../../lib/cache";

const SITE_URL = "https://sahlnahastore.com";
const BACKEND = (process.env.BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const config = slugConfigs[slug];
  const company = await getCachedCompany();

  const siteName = company.nameAr || "مؤسسة سهلناها التقنية";
  const label = config?.label ?? slug;
  const parentLabel = config?.parentLabel ?? "";

  const title = parentLabel ? `${label} - ${parentLabel}` : label;
  const description = `تسوق ${label} بأفضل الأسعار وبالأقساط في ${siteName}. ${parentLabel ? `ضمن قسم ${parentLabel}.` : ""} شحن سريع وضمان معتمد.`;

  const logoUrl = company.logo
    ? (company.logo.startsWith("http") ? company.logo : `${BACKEND}${company.logo}`)
    : "";

  return {
    title,
    description,
    keywords: [label, parentLabel, siteName, "أقساط", "شراء", "السعودية"].filter(Boolean),
    openGraph: {
      type: "website",
      url: `${SITE_URL}/categories/${slug}`,
      title: `${title} | ${siteName}`,
      description,
      siteName,
      locale: "ar_SA",
      images: logoUrl ? [{ url: logoUrl, width: 1200, height: 630, alt: title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
      images: logoUrl ? [logoUrl] : [],
    },
    alternates: {
      canonical: `${SITE_URL}/categories/${slug}`,
    },
  };
}

export default async function CategorySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CategoryPageClient slug={slug} />;
}
