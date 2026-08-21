import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { money, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Basket — FreshCart" },
      {
        name: "description",
        content:
          "Review your basket, apply promo codes, add a courier tip and see your full bill breakdown before checkout.",
      },
      { property: "og:title", content: "Your Basket — FreshCart" },
      { property: "og:description", content: "Promo codes, tips and a transparent bill breakdown." },
    ],
  }),
  component: Cart,
});

const tips = [1, 2, 3];

function Cart() {
  const {
    lines,
    setQty,
    removeLine,
    itemTotal,
    discount,
    deliveryFee,
    taxes,
    savings,
    grandTotal,
    promo,
    applyPromo,
    tip,
    setTip,
  } = useStore();
  const [code, setCode] = useState("");
  const [customTip, setCustomTip] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 px-4 pb-8 pt-4"
    >
      <h1 className="text-xl font-black">Your basket</h1>

      {lines.length === 0 ? (
        <div className="space-y-3 rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <ShoppingBag className="mx-auto size-8 text-muted-foreground" />
          <p className="text-sm font-bold">Your basket is empty</p>
          <Link
            to="/"
            className="inline-block rounded-full bg-primary px-4 py-2 text-xs font-black text-primary-foreground active:scale-95"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {lines.map((l) => (
              <motion.div
                key={l.key}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 60, height: 0 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -90) {
                    removeLine(l.key);
                    toast(`${l.product.name} removed`);
                  }
                }}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5 shadow-[var(--shadow-card)]"
              >
                <img
                  src={l.product.image}
                  alt={l.product.name}
                  loading="lazy"
                  width={700}
                  height={700}
                  className="size-16 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold">{l.product.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {l.addons.length ? l.addons.map((a) => a.label).join(", ") : l.product.unit}
                  </p>
                  <p className="mt-1 text-sm font-black">
                    {money((l.product.price + l.addons.reduce((s, a) => s + a.price, 0)) * l.qty)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <button
                    onClick={() => removeLine(l.key)}
                    aria-label="Remove item"
                    className="text-muted-foreground transition active:scale-90"
                  >
                    <Trash2 className="size-4" />
                  </button>
                  <div className="flex items-center gap-1 rounded-full bg-primary-soft p-0.5">
                    <button
                      onClick={() => setQty(l.key, l.qty - 1)}
                      aria-label="Decrease"
                      className="grid size-6 place-items-center rounded-full bg-card text-primary active:scale-90"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="w-4 text-center text-xs font-black text-primary">{l.qty}</span>
                    <button
                      onClick={() => setQty(l.key, l.qty + 1)}
                      aria-label="Increase"
                      className="grid size-6 place-items-center rounded-full bg-primary text-primary-foreground active:scale-90"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <p className="text-center text-[11px] text-muted-foreground">
            Tip: swipe a card left to remove it
          </p>
        </div>
      )}

      <div className="space-y-2 rounded-2xl border border-border bg-card p-3">
        <p className="flex items-center gap-2 text-sm font-black">
          <Tag className="size-4 text-primary" /> Promo code
        </p>
        <div className="flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Try FRESH20"
            className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold uppercase outline-none focus:ring-2 focus:ring-ring/40"
          />
          <button
            onClick={() => {
              if (applyPromo(code)) toast.success(`Promo ${code.toUpperCase()} applied`);
              else toast.error("That code isn't valid");
            }}
            className="rounded-xl bg-primary px-4 text-xs font-black text-primary-foreground active:scale-95"
          >
            Apply
          </button>
        </div>
        {promo && (
          <p className="text-xs font-bold text-primary">
            {promo} applied — you saved {money(discount)}
          </p>
        )}
      </div>

      <div className="space-y-2 rounded-2xl border border-border bg-card p-3">
        <p className="text-sm font-black">Tip your courier 🛵</p>
        <div className="flex gap-2">
          {tips.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTip(t);
                setCustomTip("");
              }}
              className={cn(
                "flex-1 rounded-xl border py-2 text-xs font-black transition active:scale-95",
                tip === t
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border text-muted-foreground",
              )}
            >
              ${t}
            </button>
          ))}
          <input
            value={customTip}
            onChange={(e) => {
              setCustomTip(e.target.value);
              setTip(Number(e.target.value) || 0);
            }}
            inputMode="decimal"
            placeholder="Custom"
            className="w-20 rounded-xl border border-border bg-background px-2 text-center text-xs font-bold outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>
      </div>

      <div className="space-y-2 rounded-2xl border border-border bg-card p-4 text-sm">
        <Row label="Item total" value={money(itemTotal)} />
        {discount > 0 && <Row label="Promo discount" value={`-${money(discount)}`} accent />}
        <Row label="Delivery fee" value={deliveryFee === 0 ? "FREE" : money(deliveryFee)} />
        <Row label="Taxes & fees" value={money(taxes)} />
        <Row label="Courier tip" value={money(tip)} />
        <div className="my-2 border-t border-dashed border-border" />
        <div className="flex items-center justify-between text-base font-black">
          <span>Grand total</span>
          <span>{money(grandTotal)}</span>
        </div>
        <p className="rounded-xl bg-primary-soft px-3 py-2 text-xs font-black text-primary">
          🎉 Total savings on this order: {money(savings)}
        </p>
      </div>

      <Link
        to="/checkout"
        className={cn(
          "block rounded-2xl bg-primary py-4 text-center text-sm font-black text-primary-foreground shadow-[var(--shadow-card)] transition active:scale-95",
          lines.length === 0 && "pointer-events-none opacity-50",
        )}
      >
        Proceed to checkout • {money(grandTotal)}
      </Link>
    </motion.div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-semibold text-muted-foreground">{label}</span>
      <span className={cn("font-bold", accent && "text-primary")}>{value}</span>
    </div>
  );
}
