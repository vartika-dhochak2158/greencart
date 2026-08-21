import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { dietaryTags } from "@/lib/data";
import { cn } from "@/lib/utils";

export function FilterSheet({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState([15]);
  const [rating, setRating] = useState(4.5);
  const [distance, setDistance] = useState([3]);
  const [tags, setTags] = useState<string[]>(["Organic"]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl border-border">
        <SheetHeader className="text-left">
          <SheetTitle className="text-lg font-black">Filters</SheetTitle>
          <SheetDescription>Fine-tune what shows up in your feed.</SheetDescription>
        </SheetHeader>
        <div className="space-y-6 px-4 pb-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-bold">
              <span>Max price</span>
              <span className="text-primary">${price[0]}</span>
            </div>
            <Slider value={price} onValueChange={setPrice} min={1} max={40} step={1} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-bold">
              <span>Max distance</span>
              <span className="text-primary">{distance[0]} km</span>
            </div>
            <Slider value={distance} onValueChange={setDistance} min={1} max={15} step={1} />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-bold">Minimum rating</p>
            <div className="flex gap-2">
              {[3.5, 4, 4.5, 4.8].map((r) => (
                <button
                  key={r}
                  onClick={() => setRating(r)}
                  className={cn(
                    "flex-1 rounded-xl border px-2 py-2 text-xs font-bold transition active:scale-95",
                    rating === r
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border bg-card text-muted-foreground",
                  )}
                >
                  ⭐ {r}+
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-bold">Dietary</p>
            <div className="flex flex-wrap gap-2">
              {dietaryTags.map((t) => (
                <button
                  key={t}
                  onClick={() =>
                    setTags((prev) =>
                      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
                    )
                  }
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-bold transition active:scale-95",
                    tags.includes(t)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => {
              setOpen(false);
              toast.success("Filters applied");
            }}
            className="w-full rounded-2xl bg-primary py-3.5 text-sm font-black text-primary-foreground transition active:scale-95"
          >
            Show results
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
