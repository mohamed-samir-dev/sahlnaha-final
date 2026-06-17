"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Contract = {
  _id: string;
  employeeName: string;
  nationalId: string;
  nationality: string;
  birthDate: string;
  contractDuration: number;
  startDate: string;
  endDate: string;
  contractDate: string;
  createdAt: string;
};

const empty = { employeeName: "", nationalId: "", nationality: "", birthDate: "", contractDuration: 1, startDate: "", endDate: "", contractDate: "" };

function calcEndDate(startDate: string, duration: number) {
  if (!startDate || !duration) return "";
  const d = new Date(startDate);
  d.setFullYear(d.getFullYear() + duration);
  return d.toISOString().split("T")[0];
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const res = await fetch("/api/admin/employee-contracts");
    const data = await res.json();
    setContracts(Array.isArray(data) ? data : []);
  }

  function openNew() {
    setForm(empty);
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(c: Contract) {
    setForm({
      employeeName: c.employeeName,
      nationalId: c.nationalId,
      nationality: c.nationality || "",
      birthDate: c.birthDate,
      contractDuration: c.contractDuration,
      startDate: c.startDate,
      endDate: c.endDate,
      contractDate: c.contractDate,
    });
    setEditing(c._id);
    setShowForm(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const url = editing ? `/api/admin/employee-contracts/${editing}` : "/api/admin/employee-contracts";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setLoading(false);
    if (res.ok) {
      toast.success(editing ? "تم التعديل ✅" : "تم الإنشاء ✅");
      setShowForm(false);
      load();
    } else {
      const d = await res.json();
      toast.error(d.error || "حدث خطأ");
    }
  }

  async function deleteContract(id: string) {
    const res = await fetch(`/api/admin/employee-contracts/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("تم الحذف ✅");
      setContracts((p) => p.filter((c) => c._id !== id));
    }
    setConfirmDelete(null);
  }

  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">عقود الموظفين</h1>
        <button onClick={openNew} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          عقد جديد
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right" style={{ minWidth: 700 }}>
            <thead className="bg-gray-50 text-gray-600 font-semibold">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">اسم الموظف</th>
                <th className="px-4 py-3">رقم الهوية</th>
                <th className="px-4 py-3">تاريخ الميلاد</th>
                <th className="px-4 py-3">مدة العقد</th>
                <th className="px-4 py-3">تاريخ البداية</th>
                <th className="px-4 py-3">تاريخ الانتهاء</th>
                <th className="px-4 py-3">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contracts.map((c, i) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{c.employeeName}</td>
                  <td className="px-4 py-3 text-gray-600">{c.nationalId}</td>
                  <td className="px-4 py-3 text-gray-600">{c.birthDate}</td>
                  <td className="px-4 py-3 text-gray-600">{c.contractDuration} سنة</td>
                  <td className="px-4 py-3 text-gray-600">{c.startDate}</td>
                  <td className="px-4 py-3 text-gray-600">{c.endDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      <button onClick={() => window.open(`/admin/contracts/${c._id}/contract`, "_blank")}
                        className="inline-flex items-center gap-1 bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-lg transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m0 0h10m-10 0v4m10-4v4"/></svg>
                        طباعة
                      </button>
                      <button onClick={() => openEdit(c)}
                        className="inline-flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-lg transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        تعديل
                      </button>
                      <button onClick={() => setConfirmDelete({ id: c._id, name: c.employeeName })}
                        className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-lg transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" strokeWidth={2} strokeLinecap="round"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {contracts.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">لا توجد عقود</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{editing ? "تعديل العقد" : "إنشاء عقد جديد"}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={submit} className="px-6 py-4 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم الموظف</label>
                <input required value={form.employeeName} onChange={e => setForm(p => ({ ...p, employeeName: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="الاسم الكامل" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهوية / الإقامة</label>
                <input required value={form.nationalId} onChange={e => setForm(p => ({ ...p, nationalId: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="رقم الهوية" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الجنسية</label>
                <input required value={form.nationality} onChange={e => setForm(p => ({ ...p, nationality: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="مثال: سعودي، مصري" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الميلاد</label>
                <input required type="date" value={form.birthDate} onChange={e => setForm(p => ({ ...p, birthDate: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ إبرام العقد</label>
                <input required type="date" value={form.contractDate} onChange={e => setForm(p => ({ ...p, contractDate: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">مدة العقد (سنوات)</label>
                <input required type="number" min={1} value={form.contractDuration} onChange={e => {
                  const dur = Number(e.target.value);
                  setForm(p => ({ ...p, contractDuration: dur, endDate: calcEndDate(p.startDate, dur) }));
                }} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ بداية العقد</label>
                <input required type="date" value={form.startDate} onChange={e => {
                  const start = e.target.value;
                  setForm(p => ({ ...p, startDate: start, endDate: calcEndDate(start, p.contractDuration) }));
                }} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ انتهاء العقد</label>
                <input required type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2 rounded-lg transition-colors text-sm">
                  {loading ? "جاري الحفظ..." : editing ? "حفظ التعديلات" : "إنشاء العقد"}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" dir="rtl">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">تأكيد الحذف</h2>
            <p className="text-sm text-gray-500 mb-1">هتحذف عقد الموظف</p>
            <p className="text-base font-bold text-red-600 mb-4">« {confirmDelete.name} »</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => deleteContract(confirmDelete.id)}
                className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-6 py-2 rounded-lg transition-colors">
                نعم، احذف
              </button>
              <button onClick={() => setConfirmDelete(null)}
                className="border border-gray-300 text-gray-700 text-sm font-bold px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
