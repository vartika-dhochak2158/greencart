import React, { useMemo, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Check,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { lovableCategories, matchesCategory, toLovableProduct } from '../lib/lovableData'
import LovableProductCard from '../components/LovableProductCard'

const MotionDiv = motion.div

export default function Explore() {
  const { products, search, setSearch } = useAppContext()
  const [cat, setCat] = useState(null)

  // Auto-suggestion state
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchContainerRef = useRef(null)

  // Filter & Sort States
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('featured')
  const [maxPrice, setMaxPrice] = useState(1000)
  const [onlyDiscounted, setOnlyDiscounted] = useState(false)

  const q = (search || '').trim().toLowerCase()

  // Close dropdown if user clicks outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Generate prefix auto-suggestions (prioritizes names starting with typed letters)
  const suggestions = useMemo(() => {
    if (!q || q.length < 1) return []

    const prefixMatches = []
    const containsMatches = []

    products.forEach((p) => {
      const name = p.name || ''
      const lowerName = name.toLowerCase()

      if (lowerName.startsWith(q)) {
        prefixMatches.push(name)
      } else if (lowerName.includes(q)) {
        containsMatches.push(name)
      }
    })

    // Remove duplicates and limit to top 6 suggestions
    return Array.from(new Set([...prefixMatches, ...containsMatches])).slice(0, 6)
  }, [products, q])

  const activeFiltersCount =
      (sortBy !== 'featured' ? 1 : 0) +
      (maxPrice < 1000 ? 1 : 0) +
      (onlyDiscounted ? 1 : 0) +
      (cat ? 1 : 0)

  const handleResetFilters = () => {
    setSortBy('featured')
    setMaxPrice(1000)
    setOnlyDiscounted(false)
    setCat(null)
  }

  // Filter & Sort Computation
  const results = useMemo(() => {
    let list = products
        .map(toLovableProduct)
        .filter((p) => {
          const matchesQuery =
              !q ||
              p.name.toLowerCase().includes(q) ||
              (p.category && p.category.toLowerCase().includes(q))
          const matchesCat = matchesCategory(p.category, cat)
          const matchesPrice = Number(p.price) <= maxPrice
          const matchesDiscount = onlyDiscounted ? Boolean(p.oldPrice && p.oldPrice > p.price) : true

          return matchesQuery && matchesCat && matchesPrice && matchesDiscount
        })

    if (sortBy === 'price-asc') {
      list.sort((a, b) => Number(a.price) - Number(b.price))
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => Number(b.price) - Number(a.price))
    } else if (sortBy === 'rating') {
      list.sort((a, b) => Number(b.rating || 4.5) - Number(a.rating || 4.5))
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name))
    }

    return list
  }, [products, q, cat, sortBy, maxPrice, onlyDiscounted])

  return (
      <MotionDiv
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5 pb-8 pt-2 w-full"
      >
        {/* Search Header with Auto-Suggestions */}
        <div className="space-y-3 px-4">
          <h1 className="text-xl font-black text-slate-900">Explore Groceries</h1>

          <div className="flex items-center gap-2">
            <div
                ref={searchContainerRef}
                className="relative flex-1"
            >
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition">
                <Search className="size-4 text-slate-400 shrink-0" />
                <input
                    value={search || ''}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={(e) => {
                      setSearch && setSearch(e.target.value)
                      setShowSuggestions(true)
                    }}
                    placeholder="Search for fresh vegetables, fruits, dairy..."
                    className="min-w-0 flex-1 bg-transparent text-xs font-semibold outline-none text-slate-800 placeholder:text-slate-400"
                />
                {search && (
                    <button
                        type="button"
                        onClick={() => {
                          setSearch && setSearch('')
                          setShowSuggestions(false)
                        }}
                        className="text-slate-400 hover:text-slate-600 text-xs"
                    >
                      <X className="size-3.5" />
                    </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 top-full mt-1.5 z-40 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl"
                    >
                      <div className="py-1">
                        {suggestions.map((suggestion, index) => {
                          const lowerSuggestion = suggestion.toLowerCase()
                          const starts = lowerSuggestion.startsWith(q)

                          return (
                              <button
                                  key={index}
                                  type="button"
                                  onClick={() => {
                                    setSearch && setSearch(suggestion)
                                    setShowSuggestions(false)
                                  }}
                                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
                              >
                                <Search className="size-3 text-slate-400 shrink-0" />
                                <span className="truncate">
                              {starts ? (
                                  <>
                                    <strong className="text-emerald-600 font-extrabold">
                                      {suggestion.slice(0, q.length)}
                                    </strong>
                                    {suggestion.slice(q.length)}
                                  </>
                              ) : (
                                  suggestion
                              )}
                            </span>
                              </button>
                          )
                        })}
                      </div>
                    </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                aria-label="Filter products"
                className="relative grid size-11 place-items-center rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition shadow-sm shrink-0"
            >
              <SlidersHorizontal className="size-4.5" />
              {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-amber-400 text-[10px] font-black text-slate-900 ring-2 ring-white">
                {activeFiltersCount}
              </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Filter Pills (Flex Full-Width Expansion) */}
        <div className="flex items-center gap-2 px-4 w-full">
          {lovableCategories.map((c) => (
              <button
                  key={c.id}
                  type="button"
                  onClick={() => setCat((v) => (v === c.id ? null : c.id))}
                  className={`flex-1 py-2.5 px-2 rounded-full text-xs font-bold text-center transition-all shadow-sm border truncate ${
                      cat === c.id
                          ? 'border-emerald-600 bg-emerald-600 text-white shadow-emerald-600/20 shadow-md'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-slate-50'
                  }`}
              >
                {c.label}
              </button>
          ))}
        </div>
        {/* Sub-bar Counter & Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span>{results.length} items found</span>
            {sortBy !== 'featured' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
              Sort: {sortBy === 'price-asc' ? 'Low to High' : sortBy === 'price-desc' ? 'High to Low' : sortBy === 'rating' ? 'Top Rated' : 'A-Z'}
                  <button onClick={() => setSortBy('featured')} className="hover:text-red-500">
                <X className="size-3" />
              </button>
            </span>
            )}
            {maxPrice < 1000 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
              ≤ ₹{maxPrice}
                  <button onClick={() => setMaxPrice(1000)} className="hover:text-red-500">
                <X className="size-3" />
              </button>
            </span>
            )}
            {onlyDiscounted && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
              Discounts Only
              <button onClick={() => setOnlyDiscounted(false)} className="hover:text-red-500">
                <X className="size-3" />
              </button>
            </span>
            )}
          </div>

          {activeFiltersCount > 0 && (
              <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-emerald-600 hover:underline"
              >
                <RotateCcw className="size-3" /> Clear all
              </button>
          )}
        </div>

        {/* Product List Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 px-4">
          {results.map((p) => (
              <LovableProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Empty State */}
        {!results.length && (
            <div className="px-4 py-16 text-center space-y-3">
              <p className="text-sm font-bold text-slate-700">No items match your filters</p>
              <p className="text-xs text-slate-400">Try adjusting your search query, price slider, or sorting criteria.</p>
              <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
              >
                <RotateCcw className="size-3.5" /> Reset All Filters
              </button>
            </div>
        )}

        {/* Filter Modal */}
        <AnimatePresence>
          {isFilterOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsFilterOpen(false)}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 10 }}
                    className="relative w-full max-w-2xl rounded-3xl bg-white p-7 shadow-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="size-4.5 text-emerald-600" />
                      <h3 className="text-base font-black text-slate-800">Filter & Sort</h3>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsFilterOpen(false)}
                        className="grid size-8 place-items-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                    >
                      <X className="size-4.5" />
                    </button>
                  </div>

                  <div className="w-full space-y-2.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <ArrowUpDown className="size-3.5 text-slate-400" /> Sort By
                    </label>
                    <div className="grid grid-cols-5 gap-2 w-full">
                      {[
                        { id: 'featured', label: 'Featured' },
                        { id: 'price-asc', label: 'Price: Low-High' },
                        { id: 'price-desc', label: 'Price: High-Low' },
                        { id: 'rating', label: 'Top Rated ⭐' },
                        { id: 'name', label: 'A to Z' },
                      ].map((opt) => (
                          <button
                              key={opt.id}
                              type="button"
                              onClick={() => setSortBy(opt.id)}
                              className={`w-full py-2.5 px-2 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-1 shadow-sm whitespace-nowrap ${
                                  sortBy === opt.id
                                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-600/20'
                                      : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-slate-50'
                              }`}
                          >
                            <span>{opt.label}</span>
                            {sortBy === opt.id && <Check className="size-3 text-emerald-600 shrink-0 stroke-[3]" />}
                          </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-700">Max Price Limit</span>
                      <span className="text-emerald-600 text-sm font-black">₹{maxPrice}</span>
                    </div>
                    <input
                        type="range"
                        min="50"
                        max="1000"
                        step="25"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                    />
                    <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                      <span>₹50</span>
                      <span>₹500</span>
                      <span>₹1000</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <label className="flex items-center justify-between cursor-pointer p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 transition border border-slate-100">
                      <div className="flex items-center gap-3">
                        <Sparkles className="size-4.5 text-amber-500 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Only Discounted Deals</p>
                          <p className="text-[11px] text-slate-400">Show items currently on special sale</p>
                        </div>
                      </div>
                      <input
                          type="checkbox"
                          checked={onlyDiscounted}
                          onChange={(e) => setOnlyDiscounted(e.target.checked)}
                          className="size-4.5 accent-emerald-600 rounded cursor-pointer"
                      />
                    </label>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={handleResetFilters}
                        className="flex-1 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                    >
                      Reset
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsFilterOpen(false)}
                        className="flex-1 py-3 rounded-2xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700 transition active:scale-95 shadow-sm shadow-emerald-600/20"
                    >
                      Apply Filters
                    </button>
                  </div>
                </motion.div>
              </div>
          )}
        </AnimatePresence>
      </MotionDiv>
  )
}