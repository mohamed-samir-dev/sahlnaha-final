import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaMobileAlt, FaEnvelope } from "react-icons/fa";

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
    <footer dir="rtl" className="relative overflow-hidden text-white mt-16"
      style={{ background: "linear-gradient(160deg, #04143E 0%, #0a1f5e 35%, #225EFF 100%)" }}>

      {/* glow blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] opacity-20 blur-3xl rounded-full"
          style={{ background: "#225EFF" }} />
        <div className="absolute bottom-0 right-0 w-64 h-64 opacity-10 blur-3xl rounded-full"
          style={{ background: "#0FF" }} />
      </div>

      {/* cyan accent line on top */}
      <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg, transparent, #0FF, #7FA8FF, transparent)" }} />

      <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

          {/* من نحن */}
          <div>
            <h3 className="font-bold text-base mb-4 tracking-wide" style={{ color: "#AAD6FF" }}>
              من نحن
            </h3>
            <div className="w-8 h-[2px] mb-4 rounded-full" style={{ background: "linear-gradient(90deg, #0FF, #225EFF)" }} />
            <p className="text-sm leading-7" style={{ color: "#7FA8FF" }}>
              {c.details || "مؤسسة سهلناها التقنية هي اختيارك الأول لشراء أجهزتك بالأقساط داخل السعودية، ضمان موثوق وخدمة محلية."}
            </p>
          </div>

          {/* روابط مهمة */}
          <div>
            <h3 className="font-bold text-base mb-4 tracking-wide" style={{ color: "#AAD6FF" }}>
              روابط مهمة
            </h3>
            <div className="w-8 h-[2px] mb-4 rounded-full" style={{ background: "linear-gradient(90deg, #0FF, #225EFF)" }} />
            <ul className="space-y-3">
              {links.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href}
                    className="text-sm flex items-center gap-2 transition-all duration-200 group"
                    style={{ color: "#7FA8FF" }}
                  >
                    <span className="w-1 h-1 rounded-full shrink-0 transition-all duration-200 group-hover:w-2"
                      style={{ background: "#0FF" }} />
                    <span className="group-hover:text-white transition-colors duration-200">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* تواصل معنا */}
          <div>
            <h3 className="font-bold text-base mb-4 tracking-wide" style={{ color: "#AAD6FF" }}>
              تواصل معنا
            </h3>
            <div className="w-8 h-[2px] mb-4 rounded-full" style={{ background: "linear-gradient(90deg, #0FF, #225EFF)" }} />
            <ul className="space-y-3 mb-5">
              {c.whatsapp && (
                <li>
                  <a href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 text-sm transition-colors duration-200 hover:text-white group"
                    style={{ color: "#7FA8FF" }}>
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg"
                      style={{ background: "rgba(34,94,255,0.3)", border: "1px solid rgba(127,168,255,0.2)" }}>
                      <FaWhatsapp size={13} style={{ color: "#AAD6FF" }} />
                    </span>
                    <span dir="ltr">{c.whatsapp}</span>
                  </a>
                </li>
              )}
              {c.phone && (
                <li>
                  <a href={`tel:${c.phone}`}
                    className="flex items-center gap-3 text-sm transition-colors duration-200 hover:text-white group"
                    style={{ color: "#7FA8FF" }}>
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg"
                      style={{ background: "rgba(34,94,255,0.3)", border: "1px solid rgba(127,168,255,0.2)" }}>
                      <FaMobileAlt size={13} style={{ color: "#AAD6FF" }} />
                    </span>
                    <span dir="ltr">{c.phone}</span>
                  </a>
                </li>
              )}
              {c.email && (
                <li>
                  <a href={`mailto:${c.email}`}
                    className="flex items-center gap-3 text-sm transition-colors duration-200 hover:text-white group"
                    style={{ color: "#7FA8FF" }}>
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg"
                      style={{ background: "rgba(34,94,255,0.3)", border: "1px solid rgba(127,168,255,0.2)" }}>
                      <FaEnvelope size={13} style={{ color: "#AAD6FF" }} />
                    </span>
                    <span dir="ltr">{c.email}</span>
                  </a>
                </li>
              )}
            </ul>

            {/* badges */}
            {(qrSrc || footerItems.length > 0 || img1 || img2) && (
              <div className="flex flex-wrap gap-2">
                {qrSrc && (qrLink
                  ? <a href={qrLink} target="_blank" rel="noreferrer"><Image src={qrSrc} alt="رمز QR" width={200} height={50} className="h-[44px] w-auto object-contain rounded-lg bg-white p-1" /></a>
                  : <Image src={qrSrc} alt="رمز QR" width={200} height={50} className="h-[44px] w-auto object-contain rounded-lg bg-white p-1" />
                )}
                {footerItems.map((item, i) => {
                  const href = getHref(item);
                  const el = <Image key={i} src={item.image} alt={`شعار شريك ${i + 1}`} width={200} height={50} className="h-[44px] w-auto object-contain rounded-lg" />;
                  return href ? <a key={i} href={href} target="_blank" rel="noreferrer">{el}</a> : <span key={i}>{el}</span>;
                })}
                {img1 && (link1
                  ? <a href={link1} target="_blank" rel="noreferrer"><Image src={img1} alt="وسيلة دفع" width={200} height={50} className="h-[44px] w-auto object-contain rounded-lg" /></a>
                  : <Image src={img1} alt="وسيلة دفع" width={200} height={50} className="h-[44px] w-auto object-contain rounded-lg" />
                )}
                {img2 && (link2
                  ? <a href={link2} target="_blank" rel="noreferrer"><Image src={img2} alt="وسيلة دفع" width={200} height={50} className="h-[44px] w-auto object-contain rounded-lg" /></a>
                  : <Image src={img2} alt="وسيلة دفع" width={200} height={50} className="h-[44px] w-auto object-contain rounded-lg" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: "1px solid rgba(127,168,255,0.15)", color: "#7FA8FF" }}>
          <span>الحقوق محفوظة © 2026 مؤسسة سهلناها التقنية</span>
          <Image src="/فيزا ماستر مدى.webp" alt="Visa Mastercard Mada" width={100} height={30}
            className="object-contain" style={{ width: "auto" }} />
        </div>
      </div>
    </footer>
  );
}
