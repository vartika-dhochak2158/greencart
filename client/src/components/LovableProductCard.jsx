import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Star, Heart, Plus, Minus, Check, X, MessageSquarePlus } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

// Generates varied initial ratings
function getProductRating(product) {
  if (product.rating && product.rating !== 4.8) return Number(product.rating).toFixed(1)
  const idStr = String(product.id || product._id || product.name || '')
  let hash = 0
  for (let i = 0; i < idStr.length; i++) {
    hash = (hash << 5) - hash + idStr.charCodeAt(i)
  }
  const score = 2.5 + ((Math.abs(hash) % 26) / 10)
  return Math.min(5, Math.max(1, score)).toFixed(1)
}

export default function LovableProductCard({ product }) {
  const {
    cartItems = {},
    addToCart,
    removeFromCart,
    updateQuantity,
    wishlist = [],
    toggleWishlist,
  } = useAppContext()

  const productId = String(product.source?._id || product.id || product._id)
  const quantity = cartItems[productId] || 0

  // Connected to global wishlist state
  const isLiked = wishlist.includes(productId)

  const [currentRating, setCurrentRating] = useState(getProductRating(product))
  const [reviewCount, setReviewCount] = useState(Math.floor(Math.random() * 35) + 5)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [userRating, setUserRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState('')

  const handleToggleLike = (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (toggleWishlist) {
      toggleWishlist(productId)
    }
    if (!isLiked) {
      toast.success(`Added ${product.name} to wishlist! ❤️`)
    } else {
      toast('Removed from wishlist', { icon: '🤍' })
    }
  }

  const handleOpenReview = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setShowReviewModal(true)
  }

  const handleSubmitReview = (e) => {
    e.preventDefault()
    const newAverage = (
        (parseFloat(currentRating) * reviewCount + userRating) /
        (reviewCount + 1)
    ).toFixed(1)

    setCurrentRating(newAverage)
    setReviewCount((prev) => prev + 1)
    setShowReviewModal(false)
    setReviewText('')
    toast.success(`Rated ${userRating} Stars! Thank you for your review. ⭐`)
  }

  return (
      <>
        <div className="group relative flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-3 shadow-sm hover:shadow-md transition-all duration-200">
          {/* Standardized full-width square image container */}
          <div className="relative w-full aspect-square rounded-2xl bg-slate-50 overflow-hidden flex items-center justify-center">

            {/* Clean Rating Badge */}
            <button
                type="button"
                onClick={handleOpenReview}
                title="Click to view & add reviews"
                className="absolute left-2.5 top-2.5 z-10 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-black text-slate-800 shadow-sm backdrop-blur hover:bg-emerald-50 transition"
            >
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <span>{currentRating}</span>
            </button>

            {/* Global Wishlist Heart */}
            <button
                type="button"
                onClick={handleToggleLike}
                aria-label="Wishlist"
                className="absolute right-2.5 top-2.5 z-10 grid size-8 place-items-center rounded-full bg-white/95 text-slate-400 shadow-sm backdrop-blur transition active:scale-90 hover:bg-white hover:text-red-500"
            >
              <motion.div
                  animate={{ scale: isLiked ? [1, 1.35, 1] : 1 }}
                  transition={{ duration: 0.3 }}
              >
                <Heart
                    className={`size-4 transition-colors duration-200 ${
                        isLiked ? 'fill-red-500 text-red-500' : 'text-slate-400'
                    }`}
                />
              </motion.div>
            </button>

            {/* Full-width & uniform image */}
            <img
                src={product.image}
                alt={product.name}
                className="size-full object-cover object-center transition group-hover:scale-105 duration-300"
            />
          </div>

          {/* Product Details */}
          <div className="mt-3 space-y-1">
            <p className="text-xs font-black text-slate-800 line-clamp-1">{product.name}</p>
            <p className="text-[11px] font-semibold text-slate-400">{product.unit || '500g'}</p>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-black text-slate-900">₹{product.price}</span>
                {product.oldPrice && (
                    <span className="text-[10px] text-slate-400 line-through">₹{product.oldPrice}</span>
                )}
              </div>

              {/* Add to Cart / Quantity Pill */}
              {quantity === 0 ? (
                  <button
                      type="button"
                      onClick={() => addToCart(productId)}
                      className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white transition active:scale-95 shadow-sm"
                  >
                    <Plus className="size-3" /> Add
                  </button>
              ) : (
                  <div className="flex items-center gap-1.5 rounded-full border border-emerald-600 bg-white px-2 py-0.5 shadow-sm">
                    <button
                        type="button"
                        onClick={() =>
                            updateQuantity
                                ? updateQuantity(productId, quantity - 1)
                                : removeFromCart(productId)
                        }
                        className="grid size-5 place-items-center text-slate-600 hover:text-red-500 transition"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="text-xs font-black text-emerald-700 min-w-3 text-center">
                  {quantity}
                </span>
                    <button
                        type="button"
                        onClick={() =>
                            updateQuantity
                                ? updateQuantity(productId, quantity + 1)
                                : addToCart(productId)
                        }
                        className="grid size-5 place-items-center text-slate-600 hover:text-emerald-600 transition"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Review Modal */}
        <AnimatePresence>
          {showReviewModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowReviewModal(false)}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl z-10 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquarePlus className="size-4 text-emerald-600" />
                      <h4 className="text-sm font-black text-slate-800">Rate & Review</h4>
                    </div>
                    <button
                        onClick={() => setShowReviewModal(false)}
                        className="grid size-7 place-items-center rounded-full hover:bg-slate-100 text-slate-400 transition"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl">
                    <img src={product.image} alt={product.name} className="size-12 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-slate-800 truncate">{product.name}</p>
                      <p className="text-[11px] font-bold text-emerald-700">
                        Current Rating: {currentRating} ({reviewCount} reviews)
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    {/* Star Picker */}
                    <div className="flex flex-col items-center gap-2 py-1">
                  <span className="text-xs font-bold text-slate-600">
                    Select your rating:{' '}
                    <strong className="text-amber-500 text-sm">
                      {hoverRating || userRating} Stars
                    </strong>
                  </span>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setUserRating(star)}
                                className="p-1 transition-transform hover:scale-125 active:scale-95"
                            >
                              <Star
                                  className={`size-7 transition-colors ${
                                      (hoverRating || userRating) >= star
                                          ? 'fill-amber-400 text-amber-400'
                                          : 'text-slate-200'
                                  }`}
                              />
                            </button>
                        ))}
                      </div>
                    </div>

                    {/* Optional Feedback */}
                    <div>
                  <textarea
                      rows={3}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Write a quick comment about quality, freshness, or delivery (optional)..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                    </div>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition active:scale-95 shadow-sm"
                    >
                      <Check className="size-4" /> Submit Review
                    </button>
                  </form>
                </motion.div>
              </div>
          )}
        </AnimatePresence>
      </>
  )
}