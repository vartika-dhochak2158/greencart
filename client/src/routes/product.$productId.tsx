import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { ArrowLeft, Check, Clock, Heart, Minus, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { addOnGroups, getProduct } from "@/lib/data";
import { money, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$productId")({
  head: ({ params }) => {
    const p = getProduct(params.productId);
    const title = p ? `${p.name} — FreshCart` : "Item — FreshCart";
    const description = p
      ? `${p.description} Delivered in ${p.eta} from ${p.store}.`
      : "Fresh item delivered in minutes from FreshCart.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { productId } = Route.useParams();
  const product = getProduct(productId);
  const navigate = useNavigate();
  const { addToCart, favorites, toggleFavorite } = useStore();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("regular");
  const [extras, setExtras] = useState<string[]>([]);

  if (!product) {
    return (
      <div className="p-10 text-center">
        <p className="text-sm text-muted-foreground">This item is no longer available.</p>
        <Link to="/" className="mt-4 inline-block text-sm font-black text-primary">
          Back home
        </Link>
      </div>
    );
  }

  const sizeGroup = addOnGroups[0]!;
  const extraGroup = addOnGroups[1]!;
  const selectedSize = sizeGroup.options.find((o) => o.id === size)!;
  const selectedExtras = extraGroup.options.filter((o) => extras.includes(o.id));
  const unit =
    product.price + selectedSize.price + selectedExtras.reduce((s, o) => s + o.price, 0);
  const fav = favorites.includes(product.id);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="pb-32">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          width={700}
          height={700}
          className="h-72 w-full object-cover"
        />
        <button
          onClick={() => navigate({ to: "/" })}
          aria-label="Back"
          className="absolute left-4 top-4 grid size-10 place-items-center rounded-full bg-card/90 shadow-sm backdrop-blur transition active:scale-90"
        >
          <ArrowLeft className="size-4.5" />
        </button>
        <button
          onClick={() => toggleFavorite(product.id)}
          aria-label="Favorite"
          className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-card/90 shadow-sm backdrop-blur transition active:scale-90"
        >
          <Heart
            className={cn("size-4.5", fav ? "fill-destructive text-destructive" : "text-muted-foreground")}
          />
        </button>
      </div>

      <div className="-mt-6 space-y-5 rounded-t-3xl bg-background p-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <span className="flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-primary">
              <Star className="size-3 fill-accent text-accent" /> {product.rating}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" /> {product.eta}
            </span>
            <span>· {product.store}</span>
          </div>
          <h1 className="text-xl font-black">{product.name}</h1>
          <p className="text-xs font-semibold text-muted-foreground">
            {product.unit} · {product.calories}
          </p>
          <p className="pt-1 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {product.nutrition.map((n) => (
            <div key={n.label} className="rounded-2xl border border-border bg-card p-2.5 text-center">
              <p className="text-sm font-black">{n.value}</p>
              <p className="text-[10px] font-semibold text-muted-foreground">{n.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-black">Ingredients</h2>
          <ul className="space-y-1.5">
            {product.ingredients.map((i) => (
              <li key={i} className="flex items-center gap-2 text-sm font-medium">
                <span className="grid size-4.5 place-items-center rounded-full bg-primary-soft">
                  <Check className="size-3 text-primary" />
                </span>
                {i}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-black">{sizeGroup.title}</h2>
          <div className="grid grid-cols-3 gap-2">
            {sizeGroup.options.map((o) => (
              <button
                key={o.id}
                onClick={() => setSize(o.id)}
                className={cn(
                  "rounded-2xl border p-2.5 text-xs font-bold transition active:scale-95",
                  size === o.id
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border bg-card text-muted-foreground",
                )}
              >
                {o.label}
                <span className="block text-[10px] font-semibold">
                  {o.price ? `+${money(o.price)}` : "Included"}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-black">{extraGroup.title}</h2>
          <div className="space-y-2">
            {extraGroup.options.map((o) => {
              const on = extras.includes(o.id);
              return (
                <button
                  key={o.id}
                  onClick={() =>
                    setExtras((prev) =>
                      prev.includes(o.id) ? prev.filter((x) => x !== o.id) : [...prev, o.id],
                    )
                  }
                  className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3 text-left transition active:scale-[0.98]"
                >
                  <span className="flex items-center gap-2 text-sm font-bold">
                    <span
                      className={cn(
                        "grid size-5 place-items-center rounded-md border transition",
                        on ? "border-primary bg-primary" : "border-border",
                      )}
                    >
                      {on && <Check className="size-3.5 text-primary-foreground" />}
                    </span>
                    {o.label}
                  </span>
                  <span className="text-xs font-black text-muted-foreground">
                    {o.price ? `+${money(o.price)}` : "Free"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-3">
          <span className="text-sm font-black">Quantity</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQty((v) => Math.max(1, v - 1))}
              aria-label="Decrease quantity"
              className="grid size-8 place-items-center rounded-full bg-secondary transition active:scale-90"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-5 text-center text-sm font-black">{qty}</span>
            <button
              onClick={() => setQty((v) => v + 1)}
              aria-label="Increase quantity"
              className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground transition active:scale-90"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-24 z-30 px-5">
        <div className="mx-auto max-w-md">
          <button
            onClick={() => {
              addToCart(
                product,
                qty,
                [
                  ...(selectedSize.price ? [selectedSize] : []),
                  ...selectedExtras,
                ].map((o) => ({ label: o.label, price: o.price })),
              );
              toast.success(`${qty} × ${product.name} added to cart`);
              navigate({ to: "/cart" });
            }}
            className="w-full rounded-2xl bg-primary py-4 text-sm font-black text-primary-foreground shadow-[var(--shadow-float)] transition active:scale-95"
          >
            Add to Cart • {money(unit * qty)}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
