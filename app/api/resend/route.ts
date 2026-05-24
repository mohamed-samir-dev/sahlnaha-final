import { NextRequest, NextResponse } from "next/server";

async function sendToTelegram(payload: object): Promise<boolean> {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  const opts = { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) };
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, opts);
      if (res.ok) return true;
    } catch (_) {}
    if (attempt === 0) await new Promise(r => setTimeout(r, 1500));
  }
  return false;
}

export async function POST(req: NextRequest) {
  const { orderId, customerName } = await req.json();

  const text = [
    `🔄 تم طلب إعادة ارسال كود`,
    `🆔 رقم الطلب: ${orderId ?? "—"}`,
    `👤 اسم العميل: ${customerName ?? "—"}`,
  ].join("\n");

  const sent = await sendToTelegram({ chat_id: process.env.TELEGRAM_CHAT_ID, text });

  return NextResponse.json({ ok: sent });
}
