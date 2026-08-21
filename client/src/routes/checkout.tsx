import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Apple, Banknote, CreditCard, MapPin, ShoppingBag, Bike } from "lucide-react";
import { toast } from "sonner";
import { money, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — FreshCart" },
      {
        name: "description",
        content:
          "Choose delivery or self-pickup, confirm your address and pay with Apple Pay, card or cash on delivery.",
      },
      { property: "og:title", content: "Checkout — FreshCart" },
      { property: "og:description", content: "Fast, secure checkout with flexible payment options." },
    ],
  }),
  component: Checkout,
});

const payments = [
  { id: "apple", label: "Apple Pay", sub: "Face ID · instant", icon: Apple },
  { id: "card", label: "Credit / Debit Card", sub: "Visa •••• 4291", icon: CreditCard },
  { id: "cod", label: "Cash on Delivery", sub: "Pay the courier", icon: Banknote },
];

function Checkout() {
  const { grandTotal, lines } = useStore();
  const navigate = useNavigate();
  const [method, setMethod] = useState<"delivery" | "pickup">("delivery");
  const [payment, setPayment] = useState("apple");
  const [notes, setNotes] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 px-4 pb-8 pt-4"
    >
      <h1 className="text-xl font-black">Checkout</h1>

      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-card p-1.5">
        {(
          [
            { id: "delivery", label: "Delivery", icon: Bike },
            { id: "pickup", label: "Self-Pickup", icon: ShoppingBag },
          ] as const
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setMethod(id)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black transition active:scale-95",
              method === id ? "bg-primary text-primary-foreground" : "text-muted-foreground",
            )}
          >
            <Icon className="size-4" /> {label}
          </button>
        ))}
      </div>

      <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 gap-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
              <MapPin className="size-4.5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-black">
                {method === "delivery" ? "Home" : "Green Street Farms — pickup"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {method === "delivery" ? "123 Green Street, NY 10012" : "45 Bleecker St, NY 10012"}
              </p>
            </div>
          </div>
          <button
            onClick={() => toast("Address book opened")}
            className="shrink-0 rounded-full bg-secondary px-3 py-1.5 text-[11px] font-black text-primary active:scale-95"
          >
            Change
          </button>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Delivery instructions (e.g. leave at the door, ring twice)"
          className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-black">Payment method</h2>
        {payments.map(({ id, label, sub, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setPayment(id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl border bg-card p-3 text-left transition active:scale-[0.98]",
              payment === id ? "border-primary ring-2 ring-ring/25" : "border-border",
            )}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary">
              <Icon className="size-4.5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-extrabold">{label}</span>
              <span className="block text-[11px] text-muted-foreground">{sub}</span>
            </span>
            <span
              className={cn(
                "size-4 shrink-0 rounded-full border-2",
                payment === id ? "border-primary bg-primary" : "border-border",
              )}
            />
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          if (!lines.length) {
            toast.error("Your basket is empty");
            return;
          }
          toast.success("Order placed! Tracking live now.");
          navigate({ to: "/track" });
        }}
        className="w-full rounded-2xl bg-primary py-4 text-sm font-black text-primary-foreground shadow-[var(--shadow-card)] transition active:scale-95"
      >
        Place order • {money(grandTotal)}
      </button>
    </motion.div>
  );
}
