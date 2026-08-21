import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  Truck,
} from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { toLovableProduct } from '../lib/lovableData'
import toast from 'react-hot-toast'

const MotionDiv = motion.div

export default function Cart() {
  const navigate = useNavigate()
  const {
    products,
    cartItems = {},
    addToCart,
    removeFromCart,
    updateQuantity,
    user,
    setShowUserLogin,
  } = useAppContext()

  const [tip, setTip] = useState(0)
  const tipOptions = [0, 100, 200, 300]

  const [coupon, setCoupon] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)
  const [couponMsg, setCouponMsg] = useState({ type: '', text: '' })

  // Match cart items with product list
  const cartProductList = Object.keys(cartItems)
      .map((productId) => {
        const product = products.find((p) => String(p._id || p.id) === String(productId))
        if (!product) return null
        return {
          ...toLovableProduct(product),
          quantity: cartItems[productId],
          rawPrice: Number(product.offerPrice || product.price || 0),
        }
      })
      .filter(Boolean)

  // Price calculations
  const subtotal = cartProductList.reduce(
      (acc, item) => acc + item.rawPrice * item.quantity,
      0
  )

  const freeDeliveryThreshold = 500
  const progressPercent = Math.min(100, (subtotal / freeDeliveryThreshold) * 100)
  const amountNeeded = Math.max(0, freeDeliveryThreshold - subtotal)
  const deliveryFee = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0 : 40
  const totalPayable = Math.max(0, subtotal - appliedDiscount + deliveryFee + tip)

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    setCouponMsg({ type: '', text: '' })

    const code = coupon.trim().toUpperCase()
    if (code === 'FRESH20') {
      const discount = Math.round(subtotal * 0.2)
      setAppliedDiscount(discount)
      setCouponMsg({ type: 'success', text: 'FRESH20 applied (20% OFF)!' })
    } else if (code === 'GREENCART50') {
      setAppliedDiscount(50)
      setCouponMsg({ type: 'success', text: 'GREENCART50 applied (₹50 OFF)!' })
    } else {
      setAppliedDiscount(0)
      setCouponMsg({ type: 'error', text: 'Invalid coupon code. Try FRESH20' })
    }
  }

  const handleProceedToCheckout = () => {
    if (!user) {
      toast.error('Please login to continue checkout')
      if (setShowUserLogin) setShowUserLogin(true)
      return
    }

    if (cartProductList.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    // Navigates to the defined address & payment route
    navigate('/add-address', {
      state: {
        totalPayable,
        deliveryFee,
        discount: appliedDiscount,
        tip,
      },
    })
  }

  if (cartProductList.length === 0) {
    return (
        <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4"
        >
          <div className="grid size-20 place-items-center rounded-3xl bg-emerald-50 text-emerald-600 mx-auto">
            <ShoppingBag className="size-10" />
          </div>
          <h2 className="text-xl font-black text-slate-800">Your cart is empty</h2>
          <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto">
            Looks like you haven't added any fresh groceries or bakery items yet.
          </p>
          <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition active:scale-95 shadow-sm"
          >
            Explore Products <ArrowRight className="size-3.5" />
          </Link>
        </MotionDiv>
    )
  }

  return (
      <MotionDiv
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto px-4 py-6 space-y-6"
      >
        <h1 className="text-xl font-black text-slate-900">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-7 space-y-3">
            {/* Free Delivery Bar */}
            <div className="rounded-2xl bg-emerald-50/70 border border-emerald-100 p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <Truck className="size-4 text-emerald-600" />
                {amountNeeded === 0 ? (
                    <span>You unlocked <strong>FREE Express Delivery</strong>! 🎉</span>
                ) : (
                    <span>
                  Add <strong>₹{amountNeeded}</strong> more for <strong>FREE Delivery</strong>
                </span>
                )}
              </div>
              <div className="h-2 w-full bg-emerald-200/50 rounded-full overflow-hidden">
                <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-3xl border border-slate-100 divide-y divide-slate-100 p-2 shadow-sm">
              {cartProductList.map((item) => (
                  <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 p-3 transition hover:bg-slate-50/50 rounded-2xl"
                  >
                    <img
                        src={item.image}
                        alt={item.name}
                        className="size-16 rounded-xl object-contain bg-slate-50 border border-slate-100 p-1 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-800 truncate">{item.name}</p>
                      <p className="text-[11px] font-semibold text-slate-400">{item.unit}</p>
                      <p className="text-xs font-black text-emerald-600 mt-1">₹{item.rawPrice}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm">
                        <button
                            type="button"
                            onClick={() =>
                                updateQuantity
                                    ? updateQuantity(item.id, item.quantity - 1)
                                    : removeFromCart(item.id)
                            }
                            className="grid size-5 place-items-center text-slate-500 hover:text-red-500 transition"
                        >
                          {item.quantity === 1 ? <Trash2 className="size-3" /> : <Minus className="size-3" />}
                        </button>
                        <span className="text-xs font-black text-slate-800 min-w-4 text-center">
                      {item.quantity}
                    </span>
                        <button
                            type="button"
                            onClick={() =>
                                updateQuantity
                                    ? updateQuantity(item.id, item.quantity + 1)
                                    : addToCart(item.id)
                            }
                            className="grid size-5 place-items-center text-slate-500 hover:text-emerald-600 transition"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          {/* Right Column: Checkout & Billing */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-5 shadow-sm">
              {/* Courier Tip */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Tip your courier 🛵</label>
                <div className="grid grid-cols-4 gap-2">
                  {tipOptions.map((amount) => (
                      <button
                          key={amount}
                          type="button"
                          onClick={() => setTip(amount)}
                          className={`py-2 px-2 rounded-2xl text-xs font-bold transition-all border ${
                              tip === amount
                                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600 shadow-sm'
                                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                      >
                        {amount === 0 ? '₹0' : `₹${amount}`}
                      </button>
                  ))}
                </div>
              </div>

              {/* Coupon Box */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                    <input
                        type="text"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        placeholder="Enter coupon (e.g. FRESH20)"
                        className="w-full pl-9 pr-3 py-2 text-xs font-bold uppercase bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition"
                    />
                  </div>
                  <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition active:scale-95"
                  >
                    Apply
                  </button>
                </div>
                {couponMsg.text && (
                    <p
                        className={`text-[11px] font-bold ${
                            couponMsg.type === 'success' ? 'text-emerald-600' : 'text-red-500'
                        }`}
                    >
                      {couponMsg.text}
                    </p>
                )}
              </form>

              {/* Bill Summary */}
              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between font-semibold">
                  <span>Items Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {appliedDiscount > 0 && (
                    <div className="flex justify-between font-bold text-emerald-600">
                      <span>Discount</span>
                      <span>-₹{appliedDiscount}</span>
                    </div>
                )}
                {tip > 0 && (
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>Courier Tip</span>
                      <span>₹{tip}</span>
                    </div>
                )}
                <div className="flex justify-between font-semibold">
                  <span>Delivery Fee</span>
                  <span>
                  {deliveryFee === 0 ? (
                      <strong className="text-emerald-600">FREE</strong>
                  ) : (
                      `₹${deliveryFee}`
                  )}
                </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total to Pay</span>
                  <span>₹{totalPayable}</span>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-xs font-bold text-white hover:bg-emerald-700 transition active:scale-95 shadow-md shadow-emerald-600/20"
              >
                Proceed to Address & Payment <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </MotionDiv>
  )
}