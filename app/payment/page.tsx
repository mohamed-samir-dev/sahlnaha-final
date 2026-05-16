import type { Metadata } from "next";
import PaymentClient from "./PaymentClient";

export const metadata: Metadata = { title: "طرق الدفع" };

export default function PaymentPage() {
  return <PaymentClient />;
}
