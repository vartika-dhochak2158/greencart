import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Check, MessageCircle, Phone, Timer } from "lucide-react";
import mapMock from "@/assets/map-mock.jpg";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Live Order Tracking — FreshCart" },
      {
        name: "description",
        content:
          "Follow your FreshCart order in real time: preparation, courier location on the map and a live ETA countdown.",
      },
      { property: "og:title", content: "Live Order Tracking — FreshCart" },
      { property: "og:description", content: "Watch your courier approach with a live ETA." },
    ],
  }),
  component: Track,
});

const steps = ["Order Confirmed", "Preparing Dish", "Out for Delivery", "Delivered"];

function Track() {
  const [step, setStep] = useState(1);
  const [eta, setEta] = useState(14 * 60);

  useEffect(() => {
    const t = setInterval(() => setEta((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setStep((v) => Math.min(steps.length - 1, v + 1)), 9000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(eta / 60)).padStart(2, "0");
  const ss = String(eta % 60).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 px-4 pb-8 pt-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-black">Order #GRO-8901</h1>
          <p className="text-xs font-semibold text-muted-foreground">
            {steps[step]} · Green Street Farms
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-black text-accent">
          <Timer className="size-3.5" /> {mm}:{ss}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
        <img src={mapMock} alt="Courier route map" width={900} height={700} className="h-56 w-full object-cover" />
        <motion.span
          animate={{ x: [0, 40, 80], y: [0, -14, -26] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute left-8 bottom-16 grid size-9 place-items-center rounded-full bg-primary text-base shadow-[var(--shadow-float)]"
        >
          🛵
        </motion.span>
        <span className="absolute bottom-3 left-3 rounded-full bg-card/90 px-3 py-1.5 text-[11px] font-black backdrop-blur">
          2.1 km away · arriving in {mm} min
        </span>
      </div>

      <div className="space-y-0 rounded-2xl border border-border bg-card p-4">
        {steps.map((s, i) => {
          const done = i <= step;
          return (
            <div key={s} className="flex gap-3">
              <div className="flex flex-col items-center">
                <motion.span
                  animate={{ scale: i === step ? [1, 1.15, 1] : 1 }}
                  transition={{ duration: 1.4, repeat: i === step ? Infinity : 0 }}
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full border-2 transition",
                    done ? "border-primary bg-primary" : "border-border bg-card",
                  )}
                >
                  {done && <Check className="size-3.5 text-primary-foreground" />}
                </motion.span>
                {i < steps.length - 1 && (
                  <span
                    className={cn("h-10 w-0.5", i < step ? "bg-primary" : "bg-border")}
                  />
                )}
              </div>
              <div className="pb-1">
                <p className={cn("text-sm font-extrabold", !done && "text-muted-foreground")}>{s}</p>
                <p className="text-[11px] text-muted-foreground">
                  {done ? (i === step ? "In progress right now" : "Completed") : "Pending"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-base font-black text-primary">
          MJ
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-extrabold">Marcus J.</p>
          <p className="text-[11px] text-muted-foreground">Your courier · ⭐ 4.9 · Green e-scooter</p>
        </div>
        <button
          aria-label="Call courier"
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground active:scale-90"
        >
          <Phone className="size-4.5" />
        </button>
        <button
          aria-label="Chat with courier"
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-foreground active:scale-90"
        >
          <MessageCircle className="size-4.5" />
        </button>
      </div>

      <Link
        to="/orders"
        className="block rounded-2xl border border-border bg-card py-3.5 text-center text-sm font-black active:scale-95"
      >
        View order history
      </Link>
    </motion.div>
  );
}
