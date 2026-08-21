import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { toLovableProduct } from '../lib/lovableData'
import LovableProductCard from '../components/LovableProductCard'

// Capitalized wrapper satisfies the ESLint capital-letter component rule
const MotionDiv = motion.div

export default function Wishlist() {
    const { products, wishlist, setWishlist } = useAppContext()
    const navigate = useNavigate()

    // Filter only items in the user's wishlist
    const wishlistedItems = products
        .map(toLovableProduct)
        .filter((p) => {
            const pid = String(p.source?._id || p.id || p._id)
            return wishlist.map(String).includes(pid)
        })

    const handleClearWishlist = () => {
        setWishlist([])
    }

    return (
        <MotionDiv
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pb-12 pt-4 px-4 sm:px-8 max-w-7xl mx-auto w-full"
        >
            {/* Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="grid size-9 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition"
                    >
                        <ArrowLeft className="size-4" />
                    </button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                            My Wishlist <Heart className="size-5 fill-red-500 text-red-500 inline" />
                        </h1>
                        <p className="text-xs text-slate-500 font-semibold">
                            {wishlistedItems.length} {wishlistedItems.length === 1 ? 'item' : 'items'} saved
                        </p>
                    </div>
                </div>

                {wishlistedItems.length > 0 && (
                    <button
                        type="button"
                        onClick={handleClearWishlist}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-50 text-xs font-bold transition active:scale-95"
                    >
                        <Trash2 className="size-3.5" /> Clear Wishlist
                    </button>
                )}
            </div>

            {/* Grid of Wishlisted Products */}
            {wishlistedItems.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {wishlistedItems.map((product) => (
                        <LovableProductCard key={product.id || product._id} product={product} />
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="py-20 text-center space-y-4 max-w-md mx-auto">
                    <div className="grid size-16 place-items-center rounded-3xl bg-red-50 text-red-400 mx-auto">
                        <Heart className="size-8 stroke-[1.5]" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base font-black text-slate-800">Your wishlist is empty</h3>
                        <p className="text-xs text-slate-400">
                            Save your favorite vegetables, fruits, dairy, and grocery items to order anytime later.
                        </p>
                    </div>
                    <Link
                        to="/explore"
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition active:scale-95"
                    >
                        <ShoppingBag className="size-4" /> Explore Groceries
                    </Link>
                </div>
            )}
        </MotionDiv>
    )
}