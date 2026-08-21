import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { ChevronRight, Search, SlidersHorizontal, Mic, Star, Zap } from "lucide-react";
import bannerVeggies from "@/assets/banner-veggies.jpg";
import bannerDelivery from "@/assets/banner-delivery.jpg";
import { categories, products } from "@/lib/data";
import { money, useStore } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { FilterSheet } from "@/components/FilterSheet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FreshCart — 15-Minute Food & Grocery Delivery" },
      {
        name: "description",
        content:
          "Order fresh produce, bakery, dairy and hot meals with 15-minute delivery. Daily deals, live order tracking and doorstep freshness.",
      },
      { property: "og:title", content: "FreshCart — 15-Minute Food & Grocery Delivery" },
      {
        property: "og:description",
        content: "Fresh groceries and hot meals delivered in 15 minutes. Daily deals inside.",
      },
    ],
  }),
  component: Home,
});

const banners = [
  {
    id: 1,
    image: bannerVeggies,
    tag: "30% OFF",
    title: "Fresh Organic Veggies & Bakery Items",
    sub: "Farm-picked this morning · Ends tonight",
  },
  {
    id: 2,
    image: bannerDelivery,
    tag: "Fast 15-min ⚡",
    title: "Free delivery on your first 3 orders",
    sub: "No minimum basket · Green Street area",
  },
];

function BannerCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, []);
  const b = banners[i]!;

  return (
    <div className="px-4">
      <motion.div
        key={b.id}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-card)]"
      >
        <img
          src={b.image}
          alt={b.title}
          width={1200}
          height={700}
          className="h-44 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center gap-2 p-5">
          <span className="w-fit rounded-full bg-accent px-2.5 py-1 text-[11px] font-black text-accent-foreground">
            {b.tag}
          </span>
          <h2 className="max-w-[15rem] text-lg font-black leading-tight text-card">{b.title}</h2>
          <p className="max-w-[15rem] text-[11px] font-medium text-card/80">{b.sub}</p>
          <Link
            to="/explore"
            className="mt-1 w-fit rounded-full bg-primary px-4 py-2 text-xs font-black text-primary-foreground transition active:scale-95"
          >
            Order Now
          </Link>
        </div>
      </motion.div>
      <div className="mt-2 flex justify-center gap-1.5">
        {banners.map((x, idx) => (
          <button
            key={x.id}
            onClick={() => setI(idx)}
            aria-label={`Banner ${idx + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all",
              idx === i ? "w-5 bg-primary" : "w-1.5 bg-border",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function Home() {
  const { addToCart } = useStore();
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const featured = active ? products.filter((p) => p.category === active) : products;
  const deals = products.filter((p) => p.oldPrice);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-8 pt-4"
    >
      <div className="sticky top-[68px] z-20 bg-background/95 px-4 pb-3 pt-1 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <label className="flex flex-1 items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-ring/40">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              placeholder="Search croissants, avocados, coffee…"
              className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
            />
            <Mic className="size-4 shrink-0 text-primary" />
          </label>
          <FilterSheet>
            <button
              aria-label="Filters"
              className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-card)] transition active:scale-95"
            >
              <SlidersHorizontal className="size-4.5" />
            </button>
          </FilterSheet>
        </div>
      </div>

      <BannerCarousel />

      <section className="space-y-3">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-base font-black">Shop by category</h3>
          <Link to="/explore" className="text-xs font-bold text-primary">
            See all
          </Link>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive((v) => (v === c.id ? null : c.id))}
              className={cn(
                "flex w-[74px] shrink-0 flex-col items-center gap-1.5 rounded-2xl border p-2 transition active:scale-95",
                active === c.id
                  ? "border-primary bg-primary-soft"
                  : "border-border bg-card hover:border-primary/40",
              )}
            >
              <span className="grid size-11 place-items-center rounded-2xl bg-secondary text-xl">
                {c.emoji}
              </span>
              <span className="text-center text-[10px] font-bold leading-tight">{c.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-base font-black">
            {active ? categories.find((c) => c.id === active)?.label : "Popular Near You"}
          </h3>
          <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
            <Zap className="size-3.5 text-accent" /> 15 min avg
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 px-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="shimmer aspect-square w-full" />
                  <div className="space-y-2 p-3">
                    <div className="shimmer h-3 w-2/3 rounded-full" />
                    <div className="shimmer h-3 w-1/3 rounded-full" />
                  </div>
                </div>
              ))
            : featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-base font-black">Daily Deals & Best Sellers</h3>
          <Link to="/explore" className="flex items-center text-xs font-bold text-primary">
            More <ChevronRight className="size-3.5" />
          </Link>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-2">
          {deals.map((p) => (
            <div
              key={p.id}
              className="flex w-[240px] shrink-0 items-center gap-3 rounded-2xl border border-border bg-card p-2.5 shadow-[var(--shadow-card)]"
            >
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  width={700}
                  height={700}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-1 top-1 rounded-full bg-accent px-1.5 text-[10px] font-black text-accent-foreground">
                  -{Math.round((1 - p.price / p.oldPrice!) * 100)}%
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold">{p.name}</p>
                <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Star className="size-3 fill-accent text-accent" /> {p.rating} · {p.unit}
                </p>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <span className="text-sm font-black">{money(p.price)}</span>
                  <button
                    onClick={() => addToCart(p)}
                    className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-black text-primary transition active:scale-95"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
