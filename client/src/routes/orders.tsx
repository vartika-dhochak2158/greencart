import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ChevronRight, PackageCheck } from "lucide-react";
import { pastOrders } from "@/lib/data";
import { money } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Your Orders — FreshCart" },
      {
        name: "description",
        content: "See your active delivery and reorder past FreshCart grocery and meal orders in one tap.",
      },
      { property: "og:title", content: "Your Orders — FreshCart" },
      { property: "og:description", content: "Track active deliveries and reorder favourites instantly." },
    ],
  }),
  component: Orders,
});

function Orders() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 px-4 pb-8 pt-4"
    >
      <h1 className="text-xl font-black">Orders</h1>

      <Link
        to="/track"
        className="flex items-center gap-3 rounded-2xl bg-primary p-4 text-primary-foreground shadow-[var(--shadow-card)] transition active:scale-[0.98]"
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-foreground/15 text-xl">
          🛵
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-black">Order #GRO-8901 is on the way</span>
          <span className="block text-[11px] opacity-85">Arriving in ~14 min · Tap to track live</span>
        </span>
        <ChevronRight className="size-5 shrink-0" />
      </Link>

      <h2 className="text-sm font-black text-muted-foreground">Past orders</h2>
      <div className="space-y-3">
        {pastOrders.map((o) => (
          <div key={o.id} className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-extrabold">#{o.id}</p>
                <p className="text-[11px] text-muted-foreground">{o.date}</p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black",
                  o.status === "Delivered"
                    ? "bg-primary-soft text-primary"
                    : "bg-destructive/10 text-destructive",
                )}
              >
                {o.status}
              </span>
            </div>
            <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">{o.items}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-black">{money(o.total)}</span>
              <Link
                to="/"
                className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-[11px] font-black text-primary active:scale-95"
              >
                <PackageCheck className="size-3.5" /> Reorder
              </Link>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
