import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Heart,
  LifeBuoy,
  MapPin,
  Settings,
} from "lucide-react";
import { products } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — FreshCart" },
      {
        name: "description",
        content: "Manage saved addresses, payment methods, favourites and notification preferences.",
      },
      { property: "og:title", content: "Your Profile — FreshCart" },
      { property: "og:description", content: "Addresses, payments, favourites and support in one place." },
    ],
  }),
  component: Profile,
});

const rows = [
  { icon: MapPin, label: "Saved addresses", sub: "3 places" },
  { icon: CreditCard, label: "Payment methods", sub: "Apple Pay · Visa ••4291" },
  { icon: Bell, label: "Notifications", sub: "Deals & order updates" },
  { icon: Settings, label: "App preferences", sub: "Language, units" },
  { icon: LifeBuoy, label: "Help & support", sub: "24/7 chat" },
];

function Profile() {
  const { favorites } = useStore();
  const favProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 px-4 pb-8 pt-4"
    >
      <div className="flex items-center gap-3 rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary-soft text-lg font-black text-primary">
          VD
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-black">Vartika Dhochak</p>
          <p className="truncate text-xs text-muted-foreground">vartika@freshcart.app</p>
        </div>
        <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-1 text-[10px] font-black text-accent">
          GOLD
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { k: "Orders", v: "42" },
          { k: "Saved", v: "$168" },
          { k: "Points", v: "1,240" },
        ].map((s) => (
          <div key={s.k} className="rounded-2xl border border-border bg-card p-3 text-center">
            <p className="text-base font-black">{s.v}</p>
            <p className="text-[10px] font-bold text-muted-foreground">{s.k}</p>
          </div>
        ))}
      </div>

      <section className="space-y-2">
        <h2 className="flex items-center gap-1.5 text-sm font-black">
          <Heart className="size-4 text-destructive" /> Favourites
        </h2>
        {favProducts.length ? (
          <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
            {favProducts.map((p) => (
              <Link
                key={p.id}
                to="/product/$productId"
                params={{ productId: p.id }}
                className="w-24 shrink-0 active:scale-95"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  width={700}
                  height={700}
                  className="h-24 w-24 rounded-2xl object-cover"
                />
                <p className="mt-1 line-clamp-1 text-[11px] font-bold">{p.name}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No favourites saved yet.</p>
        )}
      </section>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {rows.map(({ icon: Icon, label, sub }, i) => (
          <button
            key={label}
            className={`flex w-full items-center gap-3 p-4 text-left transition active:bg-secondary ${
              i ? "border-t border-border" : ""
            }`}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-foreground">
              <Icon className="size-4.5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-extrabold">{label}</span>
              <span className="block text-[11px] text-muted-foreground">{sub}</span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
