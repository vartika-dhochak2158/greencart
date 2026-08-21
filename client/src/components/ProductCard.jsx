import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const CLOUDINARY_BASE = "https://res.cloudinary.com/e4nkrgxd/image/upload";

const getImageUrl = (image) => {
    if (!image) return "https://placehold.co/150";
    const target = Array.isArray(image) ? image[0] : image;
    if (!target) return "https://placehold.co/150";

    // If it's already a full URL or a Vite local bundle asset, leave it as is
    if (typeof target !== 'string' || target.startsWith('http://') || target.startsWith('https://') || target.startsWith('data:') || target.startsWith('/src/')) {
        return target;
    }

    let cleanName = target.replace(/^\/+/, '');
    if (!/\.(png|jpe?g|webp|svg)$/i.test(cleanName)) {
        cleanName = `${cleanName}.jpg`;
    }
    return `${CLOUDINARY_BASE}/${cleanName}`;
};

const ProductCard = ({ product }) => {
    const { currency, addToCart, cartItems, updateQuantity } = useAppContext();
    const navigate = useNavigate();

    const productId = product._id || product.id;
    const count = cartItems?.[productId] || 0;

    return (
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between">
            <div
                className="cursor-pointer"
                onClick={() => navigate(`/products/${product.category}/${productId}`)}
            >
                {/* Standardized fixed-height image container without padding */}
                <div className="w-full h-44 bg-slate-50 rounded-xl overflow-hidden mb-3">
                    <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="h-full w-full object-cover hover:scale-105 transition duration-300"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/150";
                        }}
                    />
                </div>
                <h3 className="font-semibold text-slate-800 text-sm line-clamp-1">{product.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {Array.isArray(product.description) ? product.description.join(', ') : product.description}
                </p>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div>
                    <span className="text-base font-bold text-slate-900">{currency}{product.offerPrice || product.price}</span>
                    {product.offerPrice && product.offerPrice < product.price && (
                        <span className="text-xs text-slate-400 line-through ml-1.5">{currency}{product.price}</span>
                    )}
                </div>

                {count === 0 ? (
                    <button
                        onClick={() => addToCart(productId)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition"
                    >
                        Add
                    </button>
                ) : (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1">
                        <button
                            onClick={() => updateQuantity(productId, count - 1)}
                            className="text-emerald-700 font-bold px-1 text-sm hover:opacity-75"
                        >
                            -
                        </button>
                        <span className="text-xs font-semibold text-emerald-800">{count}</span>
                        <button
                            onClick={() => addToCart(productId)}
                            className="text-emerald-700 font-bold px-1 text-sm hover:opacity-75"
                        >
                            +
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;