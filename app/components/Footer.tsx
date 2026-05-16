import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaMobileAlt, FaEnvelope, FaChevronLeft } from "react-icons/fa";

const API = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getCompany() {
  try {
    const r = await fetch(`${API}/api/admin/company`, { cache: "no-store" });
    return r.ok ? r.json() : {};
  } catch {
    return {};
  }
}

export default async function Footer() {
  const c = await getCompany();

  function ensureAbsolute(url: string) {
    if (!url) return "";
    return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
  }

  function toInlineUrl(url: string) {
    if (!url) return url;
    return `/view-file?url=${encodeURIComponent(url)}`;
  }

  const qrSrc: string = c.qrImage || "";
  const qrLink: string = ensureAbsolute(c.qrLink || "");

  const footerItems: { image: string; linkType: string; link: string; file: string }[] =
    (c.footerItems || []).filter((item: { image: string }) => item.image);

  const img1: string = c.img1 || "";
  const linkType1: string = c.link1Type || c.linkType1 || "link";
  const useFile1 = linkType1 === "file" || (!!(c.file1 || "").trim() && !(c.link1 || "").trim());
  const link1: string = useFile1 ? toInlineUrl(c.file1 || "") : ensureAbsolute(c.link1 || "");
  const img2: string = c.img2 || "";
  const linkType2: string = c.link2Type || c.linkType2 || "link";
  const useFile2 = linkType2 === "file" || (!!(c.file2 || "").trim() && !(c.link2 || "").trim());
  const link2: string = useFile2 ? toInlineUrl(c.file2 || "") : ensureAbsolute(c.link2 || "");

  function getHref(item: { linkType: string; link: string; file: string }) {
    const asFile = item.linkType === "file" || (!!(item.file || "").trim() && !(item.link || "").trim());
    return asFile ? toInlineUrl(item.file) : ensureAbsolute(item.link);
  }

  const links = [
    { label: "عن مؤسسة سهلناها التقنية", href: "/about" },
    { label: "طرق الدفع", href: "/payment" },
    { label: "سياسة الاستبدال والاسترجاع", href: "/return-policy" },
    { label: "سياسة الخصوصية واتفاقية الاستخدام", href: "/privacy" },
  ];

  return (
    <footer dir="rtl" className="relative overflow-hidden text-white" style={{ background: "linear-gradient(160deg, #061e2f 0%, #0a3550 40%, #0F4C6E 100%)" }}>

      {/* top accent line */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #7CC043, #06399B, #7CC043)" }} />

      {/* decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #7CC043, transparent 70%)" }} />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #06399B, transparent 70%)" }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

          {/* من نحن */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="block w-1 h-6 rounded-full" style={{ background: "#7CC043" }} />
              <h3 className="font-bold text-lg" style={{ color: "#7CC043" }}>من نحن</h3>
            </div>
            <p className="text-sm leading-7 text-blue-100/80">
              {c.details || "مؤسسة سهلناها التقنية هي اختيارك الأول لشراء أجهزتك بالأقساط داخل السعودية، ضمان موثوق وخدمة محلية."}
            </p>
          </div>

          {/* روابط مهمة */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="block w-1 h-6 rounded-full" style={{ background: "#7CC043" }} />
              <h3 className="font-bold text-lg" style={{ color: "#7CC043" }}>روابط مهمة</h3>
            </div>
            <ul className="space-y-2">
              {links.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center gap-2 text-sm text-blue-100/75 transition-colors hover:text-white"
                  >
                    <FaChevronLeft size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#7CC043" }} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* تواصل معنا */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="block w-1 h-6 rounded-full" style={{ background: "#7CC043" }} />
              <h3 className="font-bold text-lg" style={{ color: "#7CC043" }}>تواصل معنا</h3>
            </div>
            <ul className="space-y-3">
              {c.whatsapp && (
                <li>
                  <a href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 text-sm text-blue-100/75 hover:text-white transition-colors group">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 group-hover:bg-emerald-500/20 transition-colors">
                      <FaWhatsapp size={15} className="text-emerald-400" />
                    </span>
                    <span dir="ltr">{c.whatsapp}</span>
                  </a>
                </li>
              )}
              {c.phone && (
                <li>
                  <a href={`tel:${c.phone}`}
                    className="flex items-center gap-3 text-sm text-blue-100/75 hover:text-white transition-colors group">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 group-hover:bg-blue-400/20 transition-colors">
                      <FaMobileAlt size={15} className="text-blue-300" />
                    </span>
                    <span dir="ltr">{c.phone}</span>
                  </a>
                </li>
              )}
              {c.email && (
                <li>
                  <a href={`mailto:${c.email}`}
                    className="flex items-center gap-3 text-sm text-blue-100/75 hover:text-white transition-colors group">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 group-hover:bg-blue-400/20 transition-colors">
                      <FaEnvelope size={15} className="text-blue-300" />
                    </span>
                    <span dir="ltr">{c.email}</span>
                  </a>
                </li>
              )}
            </ul>

            {/* Badges / QR */}
            {(qrSrc || footerItems.length > 0 || img1 || img2) && (
              <div className="flex flex-wrap gap-2 pt-1">
                {qrSrc && (
                  qrLink
                    ? <a href={qrLink} target="_blank" rel="noreferrer"><Image src={qrSrc} alt="رمز QR" width={200} height={50} className="h-[46px] w-auto object-contain rounded-lg bg-white p-1" /></a>
                    : <Image src={qrSrc} alt="رمز QR" width={200} height={50} className="h-[46px] w-auto object-contain rounded-lg bg-white p-1" />
                )}
                {footerItems.map((item, i) => {
                  const href = getHref(item);
                  const el = <Image key={i} src={item.image} alt={`شعار شريك ${i + 1}`} width={200} height={50} className="h-[46px] w-auto object-contain rounded-lg" />;
                  return href ? <a key={i} href={href} target="_blank" rel="noreferrer">{el}</a> : <span key={i}>{el}</span>;
                })}
                {img1 && (link1 ? <a href={link1} target="_blank" rel="noreferrer"><Image src={img1} alt="وسيلة دفع" width={200} height={50} className="h-[46px] w-auto object-contain rounded-lg" /></a> : <Image src={img1} alt="وسيلة دفع" width={200} height={50} className="h-[46px] w-auto object-contain rounded-lg" />)}
                {img2 && (link2 ? <a href={link2} target="_blank" rel="noreferrer"><Image src={img2} alt="وسيلة دفع" width={200} height={50} className="h-[46px] w-auto object-contain rounded-lg" /></a> : <Image src={img2} alt="وسيلة دفع" width={200} height={50} className="h-[46px] w-auto object-contain rounded-lg" />)}
              </div>
            )}
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-10 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-200/60">
          <span>الحقوق محفوظة © 2026 مؤسسة سهلناها التقنية</span>
          <Image src="/فيزا ماستر مدى.webp" alt="Visa Mastercard Mada" width={100} height={30} className="object-contain" style={{ width: "auto" }} />
        </div>
      </div>
    </footer>
  );
}
