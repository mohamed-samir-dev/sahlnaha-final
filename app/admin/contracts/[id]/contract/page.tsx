"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Contract = {
  employeeName: string;
  nationalId: string;
  nationality: string;
  birthDate: string;
  contractDuration: number;
  startDate: string;
  endDate: string;
  contractDate: string;
};
type Company = { header?: string; footer?: string; stamp?: string };

function formatDate(d: string) {
  if (!d) return "____  /  ____  /  ________";
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2, "0")}  /  ${String(dt.getMonth() + 1).padStart(2, "0")}  /  ${dt.getFullYear()}`;
}

const LINE = "................................................................";

export default function EmployeeContractPrint() {
  const { id } = useParams<{ id: string }>();
  const [contract, setContract] = useState<Contract | null>(null);
  const [company, setCompany] = useState<Company>({});

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/employee-contracts/${id}`).then((r) => r.json()),
      fetch("/api/admin/company").then((r) => r.json()).catch(() => ({})),
    ]).then(([c, co]) => { setContract(c); setCompany(co); });
  }, [id]);

  useEffect(() => {
    document.body.classList.add("print-page", "contract-page");
    return () => document.body.classList.remove("print-page", "contract-page");
  }, []);

  useEffect(() => {
    if (contract) setTimeout(() => window.print(), 700);
  }, [contract]);

  if (!contract)
    return <div style={{ textAlign: "center", padding: 60, fontFamily: "Arial", color: "#777" }}>جاري التحميل...</div>;

  const css = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: #fff !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    @media print { @page { size: A4 portrait; margin: 0; } html, body { margin: 0 !important; padding: 0 !important; } }
    body { font-family: "Times New Roman", serif; direction: rtl; color: #111; font-size: 14px; line-height: 1.9; }
    p, li { margin: 0; }
    .section-title { font-size: 15px; font-weight: 700; border-bottom: 1px solid #111; padding-bottom: 4px; margin-bottom: 10px; letter-spacing: 0.5px; }
    .info-grid { display: grid; grid-template-columns: 170px 1fr; row-gap: 4px; }
    .info-grid span { padding: 3px 0; }
    .info-grid .lbl { color: #333; }
    .clause { margin-bottom: 13px; }
    .clause-head { font-weight: 700; margin-bottom: 4px; }
    .clause-body { padding-right: 16px; }
    .sig-line { display: inline-block; border-bottom: 1px solid #111; min-width: 160px; vertical-align: bottom; }
    ul.tasks { margin: 0; padding-right: 20px; }
    ul.tasks li { margin-bottom: 3px; }
    .page-break { page-break-before: always; break-before: page; margin-top: 40px; }
  `;

  return (
    <div style={{ fontFamily: '"Times New Roman", serif', direction: "rtl", background: "#fff", color: "#111", maxWidth: 794, margin: "0 auto" }}>
      <style>{css}</style>

      {/* ── HEADER IMAGE ── */}
      {company.header && <img src={company.header} alt="header" style={{ width: "100%", display: "block" }} />}

      {/* ── BODY ── */}
      <div style={{ padding: "32px 52px 40px" }}>

        <hr style={{ border: "none", borderTop: "2px solid #111", marginBottom: 20 }} />

        {/* ── الأطراف ── */}
        <div style={{ display: "flex", gap: 40, marginBottom: 20, fontSize: 15 }}>
          <div style={{ flex: 1 }}>
            <p className="section-title">أولاً: الطرف الأول &nbsp;<span style={{ fontWeight: 400 }}>(صاحب العمل)</span></p>
            <div className="info-grid">
              <span className="lbl">الجهة:</span><span><strong>مؤسسة سهلناها التقنية</strong></span>
              <span className="lbl">السجل التجاري:</span><span><strong>7054284067</strong></span>
              <span className="lbl">العنوان:</span><span><strong>مؤسسة أولاين</strong></span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <p className="section-title">ثانياً: الطرف الثاني &nbsp;<span style={{ fontWeight: 400 }}>(الموظف)</span></p>
            <div className="info-grid">
              <span className="lbl">الاسم:</span><span><strong>{contract.employeeName}</strong></span>
              <span className="lbl">رقم الهوية / الإقامة:</span><span><strong>{contract.nationalId}</strong></span>
              <span className="lbl">تاريخ الميلاد:</span><span><strong>{formatDate(contract.birthDate)}</strong></span>
              <span className="lbl">الجنسية:</span><span><strong>{contract.nationality}</strong></span>
            </div>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #111", marginBottom: 18 }} />

        {/* ── البنود ── */}
        <div style={{ marginBottom: 18 }}>
          {([
            { n: "الأول",   t: "الوظيفة",      body: <>يُعيَّن الطرف الثاني لدى الطرف الأول بوظيفة: <strong>موظف دعم فني (Technical Support Specialist)</strong>، ويكون مسؤولاً عن تنفيذ جميع المهام المتعلقة بالدعم الفني وفق متطلبات العمل وسياسات الشركة.</> },
            { n: "الثاني",  t: "مكان العمل",   body: "يعمل الطرف الثاني داخل نطاق العمل حسب حاجة التشغيل." },
            { n: "الثالث",  t: "مدة العقد",    body: <>مدة هذا العقد: <strong>{contract.contractDuration} سنة / سنوات</strong>، تبدأ من: <strong>{formatDate(contract.startDate)} م</strong>، وتنتهي في: <strong>{formatDate(contract.endDate)} م</strong>. ويجوز تجديد العقد باتفاق الطرفين وفق أحكام نظام العمل السعودي.</> },
            { n: "الرابع",  t: "الراتب",       body: <>الراتب الشهري الأساسي: <strong>3,000 ريال سعودي فقط لا غير</strong>. ويُصرف الراتب في نهاية كل شهر ميلادي وفق الإجراءات المالية المعتمدة لدى الشركة.</> },
            { n: "الخامس", t: "ساعات العمل",  body: <>تكون ساعات العمل الرسمية من: <strong>10:00 صباحاً حتى 4:00 مساءً</strong>، من <strong>الأحد إلى الخميس</strong>، وذلك وفق نظام العمل السعودي وسياسات الشركة الداخلية.</> },
            { n: "السادس", t: "مهام الوظيفة", body: (<ul className="tasks"><li>استقبال طلبات الدعم الفني ومعالجة المشكلات التقنية.</li><li>الرد على العملاء بشكل فوري خلال وقت الدوام.</li><li>تقديم الدعم الفني للمستخدمين وتوثيق الأعطال والحلول.</li><li>متابعة جميع الطلبات وعند حدوث مشكلة التواصل مع مدير الدعم الفني.</li><li>تنفيذ أي مهام أخرى ذات صلة يُكلَّف بها من قبل الإدارة.</li></ul>) },
            { n: "السابع", t: "الإجازات",     body: "يستحق الموظف الإجازات النظامية (السنوية، المرضية، والرسمية) وفقاً لنظام العمل السعودي ولوائح الشركة المعتمدة.", pageBreak: true },
            { n: "الثامن", t: "إنهاء العقد",  body: "يجوز لأي من الطرفين إنهاء هذا العقد بشرط تقديم إشعار خطي مسبق قبل أسبوع واحد على الأقل، مع تسوية جميع الحقوق والالتزامات المالية والنظامية المستحقة." },
          ] as { n: string; t: string; body: React.ReactNode; pageBreak?: boolean }[]).map((c) => (
            <div key={c.n} className={`clause${c.pageBreak ? " page-break" : ""}`}>
              <p className="clause-head">البند {c.n}: {c.t}</p>
              <div className="clause-body">{c.body}</div>
            </div>
          ))}
        </div>

        <hr style={{ border: "none", borderTop: "2px solid #111", marginBottom: 20 }} />

        {/* ── التوقيعات ── */}
        <div style={{ paddingTop: 24 }}>

          <hr style={{ border: "none", borderTop: "2px solid #111", marginBottom: 24 }} />

          <p style={{ fontWeight: 700, fontSize: 16, textAlign: "center", marginBottom: 28, letterSpacing: 3 }}>التوقيعات</p>

          {/* صف التوقيعين */}
          <div style={{ display: "flex", gap: 48, marginBottom: 48, fontSize: 15 }}>
            <div style={{ flex: 1 }}>
              <p className="section-title" style={{ marginBottom: 16 }}>الطرف الأول &mdash; صاحب العمل</p>
              <p style={{ marginBottom: 6 }}>الاسم: &nbsp;<strong>مؤسسة سهلناها التقنية</strong></p>
              <p style={{ marginBottom: 16 }}>التاريخ: &nbsp;<span className="sig-line" style={{ minWidth: 160 }}>&nbsp;</span> م</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                <span style={{ fontWeight: 700 }}>التوقيع:</span>
                {company.stamp ? (
                  <img src={company.stamp} alt="stamp" style={{ width: 80, height: 80, objectFit: "contain" }} />
                ) : (
                  <div style={{ width: 80, height: 80, borderRadius: "50%", border: "2px solid #111", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: 10, lineHeight: 1.7 }}>
                    <span style={{ fontWeight: 700 }}>مؤسسة سهلناها</span>
                    <span>التقنية</span>
                    <span style={{ fontSize: 9 }}>7054284067</span>
                  </div>
                )}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <p className="section-title" style={{ marginBottom: 16 }}>الطرف الثاني &mdash; الموظف</p>
              <p style={{ marginBottom: 6 }}>الاسم: &nbsp;<strong>{contract.employeeName}</strong></p>
              <p style={{ marginBottom: 28 }}>التاريخ: &nbsp;<span className="sig-line" style={{ minWidth: 160 }}>&nbsp;</span> م</p>
              <p style={{ marginBottom: 16 }}>التوقيع: &nbsp;<span className="sig-line" style={{ minWidth: 200 }}>&nbsp;</span></p>
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #111", marginBottom: 28 }} />

          {/* اعتماد + ختم */}
          <div style={{ display: "flex", gap: 48, alignItems: "flex-start", fontSize: 15 }}>
            <div style={{ flex: 1 }}>
              <p className="section-title" style={{ marginBottom: 16 }}>اعتماد صاحب العمل</p>
              <p style={{ marginBottom: 4 }}>اسم المنشأة: &nbsp;<strong>مؤسسة سهلناها التقنية</strong></p>
              <p style={{ marginBottom: 16 }}>السجل التجاري: &nbsp;<strong>7054284067</strong></p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                <span style={{ fontWeight: 700 }}>التوقيع:</span>
                {company.stamp ? (
                  <img src={company.stamp} alt="stamp" style={{ width: 80, height: 80, objectFit: "contain" }} />
                ) : (
                  <div style={{ width: 80, height: 80, borderRadius: "50%", border: "2px solid #111", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: 10, lineHeight: 1.7 }}>
                    <span style={{ fontWeight: 700 }}>مؤسسة سهلناها</span>
                    <span>التقنية</span>
                    <span style={{ fontSize: 9 }}>7054284067</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>{/* end body */}

      {/* ── FOOTER IMAGE ── */}
      <img src="/contract.webp" alt="footer" style={{ width: "100%", display: "block" }} />

    </div>
  );
}
