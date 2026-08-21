import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  ChevronLeft,
  ChevronRight,
  Mic,
  Search,
  SlidersHorizontal,
  Star,
  Zap,
} from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import {
  lovableCategories,
  matchesCategory,
  toLovableProduct,
} from '../lib/lovableData'
import LovableProductCard from '../components/LovableProductCard'

// Import banner images
import banner1 from '../assets/banner1.jpg'
import banner2 from '../assets/banner2.jpg'
import banner3 from '../assets/banner3.jpg'
import banner4 from '../assets/banner4.jpg'

const MotionDiv = motion.div

export default function Home() {
  const { products, addToCart, setSearchQuery, fetchProducts } = useAppContext()
  const navigate = useNavigate()
  const [active, setActive] = useState(null)
  const [banner, setBanner] = useState(0)
  const [loading, setLoading] = useState(true)

  const items = products.map(toLovableProduct)

  // Carousel banners with target links
  const banners = [
    { image: banner1, link: '/products' },
    { image: banner2, link: '/products/Bakery' },
    { image: banner3, link: '/products/Fruits' },
    { image: banner4, link: '/products/Vegetables' },
  ]

  // Auto-play timer for carousel (switches every 4.5 seconds)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    const loop = setInterval(() => {
      setBanner((prev) => (prev + 1) % banners.length)
    }, 4500)
    return () => {
      clearTimeout(timer)
      clearInterval(loop)
    }
  }, [banners.length])

  const nextBanner = () => setBanner((prev) => (prev + 1) % banners.length)
  const prevBanner = () =>
      setBanner((prev) => (prev - 1 + banners.length) % banners.length)

  const featured = active
      ? items.filter((item) => matchesCategory(item.category, active.split('-')[0]))
      : items
  const deals = items.filter((item) => item.oldPrice)

  return (
      <MotionDiv
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 pb-8 pt-5"
      >
        {/* Mobile Search Bar */}
        <div className="flex items-center gap-2 md:hidden">
          <label className="flex flex-1 items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-sm">
            <Search className="size-4 text-muted-foreground" />
            <input
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search fresh groceries..."
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
            <Mic className="size-4 text-primary" />
          </label>
          <button
              type="button"
              onClick={() => navigate('/explore')}
              className="grid size-11 place-items-center rounded-2xl bg-primary text-white"
          >
            <SlidersHorizontal className="size-4" />
          </button>
        </div>

        {/* Modern Banner Carousel */}
        <div className="relative group overflow-hidden rounded-3xl shadow-sm border border-slate-100 bg-white">
          <div
              onClick={() => navigate(banners[banner].link)}
              className="cursor-pointer w-full aspect-[21/9] sm:aspect-[24/9] md:h-[340px] lg:h-[400px] relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.img
                  key={banner}
                  src={banners[banner].image}
                  alt="Promotion Banner"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover sm:object-contain md:object-cover"
              />
            </AnimatePresence>
          </div>

          {/* Previous Button */}
          <button
              onClick={(e) => {
                e.stopPropagation()
                prevBanner()
              }}
              aria-label="Previous Slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 grid size-9 sm:size-10 place-items-center rounded-full bg-white/90 text-slate-800 shadow-md backdrop-blur opacity-0 group-hover:opacity-100 hover:bg-white transition-all duration-200"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* Next Button */}
          <button
              onClick={(e) => {
                e.stopPropagation()
                nextBanner()
              }}
              aria-label="Next Slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 grid size-9 sm:size-10 place-items-center rounded-full bg-white/90 text-slate-800 shadow-md backdrop-blur opacity-0 group-hover:opacity-100 hover:bg-white transition-all duration-200"
          >
            <ChevronRight className="size-5" />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full">
            {banners.map((_, index) => (
                <button
                    key={`dot-${index}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setBanner(index)
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                        index === banner ? 'w-6 bg-emerald-500' : 'w-2 bg-white/70 hover:bg-white'
                    }`}
                />
            ))}
          </div>
        </div>

        {/* Shop by Category - Full Cover Cards */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-800">Shop by category</h3>
            <Link to="/products" className="text-xs font-bold text-emerald-600 hover:underline">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 w-full">
            {lovableCategories.map((category, idx) => (
                <button
                    key={`cat-${category.id || idx}`}
                    onClick={() =>
                        setActive((value) => (value === category.id ? null : category.id))
                    }
                    className={`group flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-200 hover:shadow-md ${
                        active === category.id
                            ? 'border-emerald-600 ring-2 ring-emerald-500 bg-emerald-50 text-emerald-800'
                            : 'border-slate-100 bg-white hover:border-emerald-300'
                    }`}
                >
                  <div className="w-full h-24 sm:h-28 overflow-hidden bg-slate-50">
                    <img
                        src={category.image}
                        alt={category.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2.5 w-full flex items-center justify-center min-h-[44px]">
                    <span className="text-center text-xs font-bold leading-tight line-clamp-2">
                      {category.label}
                    </span>
                  </div>
                </button>
            ))}
          </div>
        </section>

        {/* Popular Products Grid */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-800">
              {active
                  ? lovableCategories.find((category) => category.id === active)?.label
                  : 'Popular Near You'}
            </h3>
            <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
            <Zap className="size-3.5 text-amber-500" /> 15 min avg
          </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                    <div key={`skeleton-${index}`} className="rounded-2xl border border-slate-100 bg-white p-3 space-y-2">
                      <div className="aspect-square bg-slate-100 rounded-xl animate-pulse" />
                      <div className="h-3 w-2/3 bg-slate-100 rounded-full animate-pulse" />
                      <div className="h-3 w-1/3 bg-slate-100 rounded-full animate-pulse" />
                    </div>
                ))
            ) : featured.length ? (
                featured.map((product, index) => (
                    <LovableProductCard
                        key={`feat-${product.id || product._id || index}`}
                        product={product}
                    />
                ))
            ) : (
                <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
                  <p className="text-sm font-bold text-slate-600">No products are available right now.</p>
                  <button
                      onClick={fetchProducts}
                      className="mt-3 rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white hover:bg-emerald-700 transition"
                  >
                    Refresh products
                  </button>
                </div>
            )}
          </div>
        </section>

        {/* Daily Deals & Best Sellers */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-800">Daily Deals & Best Sellers</h3>
            <Link to="/products" className="flex items-center text-xs font-bold text-emerald-600 hover:underline">
              More <ChevronRight className="size-3.5" />
            </Link>
          </div>
          <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
            {deals.map((product, idx) => {
              const pId = String(product.source?._id || product.id || product._id || idx)
              return (
                  <div
                      key={`deal-${pId}-${idx}`}
                      className="flex w-[260px] shrink-0 items-center gap-3 rounded-2xl border border-slate-100 bg-white p-2.5 shadow-sm"
                  >
                    <img
                        src={product.image}
                        alt={product.name}
                        className="size-20 shrink-0 rounded-xl object-cover bg-slate-50"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-extrabold text-slate-800">{product.name}</p>
                      <p className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Star className="size-3 fill-amber-400 text-amber-400" /> {product.rating} ·{' '}
                        {product.unit}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-sm font-black text-slate-900">₹{product.price}</span>
                        <button
                            onClick={() => addToCart(pId)}
                            className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700 hover:bg-emerald-100 transition active:scale-95"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
              )
            })}
          </div>
        </section>
      </MotionDiv>
  )
}