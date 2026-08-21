import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { categories, dietaryTags, products } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { FilterSheet } from "@/components/FilterSheet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Fresh Groceries & Meals — FreshCart" },
      {
        name: "description",
        content:
          "Browse organic produce, bakery, dairy, seafood and hot meals. Filter by price, rating, distance and dietary needs.",
      },
      { property: "og:title", content: "Explore Fresh Groceries & Meals — FreshCart" },
      {
        property: "og:description",
        content: "Search and filter thousands of fresh items delivered in minutes.",
      },
    ],
  }),
  component: Explore,
});

function Explore() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null>(null);

  const results = useMemo(
    () =>
      products.filter(
        (p) =>
          (!q || p.name.toLowerCase().includes(q.toLowerCase())) &&
          (!cat || p.category === cat) &&
          (!tag || p.tags.includes(tag)),
      ),
    [q, cat, tag],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 pb-8 pt-4"
    >
      <div className="space-y-3 px-4">
        <h1 className="text-xl font-black">Explore</h1>
        <div className="flex items-center gap-2">
          <label className="flex flex-1 items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-ring/40">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for anything fresh…"
              className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
            />
          </label>
          <FilterSheet>
            <button
              aria-label="Filters"
              className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground transition active:scale-95"
            >
              <SlidersHorizontal className="size-4.5" />
            </button>
          </FilterSheet>
        </div>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat((v) => (v === c.id ? null : c.id))}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold transition active:scale-95",
              cat === c.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 px-4">
        {dietaryTags.map((t) => (
          <button
            key={t}
            onClick={() => setTag((v) => (v === t ? null : t))}
            className={cn(
              "rounded-full border px-3 py-1 text-[11px] font-bold transition active:scale-95",
              tag === t
                ? "border-accent bg-accent-soft text-accent"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <p className="px-4 text-xs font-bold text-muted-foreground">
        {results.length} item{results.length === 1 ? "" : "s"} found
      </p>

      <div className="grid grid-cols-2 gap-3 px-4">
        {results.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {results.length === 0 && (
        <p className="px-4 py-10 text-center text-sm text-muted-foreground">
          Nothing matches that yet — try another search.
        </p>
      )}
    </motion.div>
  );
}
