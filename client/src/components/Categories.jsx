import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../assets/assets'; // or categoriesData / dummyCategories

const Categories = () => {
    const navigate = useNavigate();

    return (
        <section className="py-6 px-4 sm:px-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                    Shop by category
                </h2>
                <button
                    onClick={() => navigate('/products')}
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition"
                >
                    See all
                </button>
            </div>

            {/* Categories Grid (Evenly fills full width) */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4">
                {categories.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(`/products/${item.category || item.name}`)}
                        className="group cursor-pointer flex flex-col items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200"
                    >
                        {/* Circular Image Container */}
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-50 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-200">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Label */}
                        <p className="mt-2 text-xs sm:text-sm font-medium text-slate-700 text-center leading-tight line-clamp-2 group-hover:text-emerald-600 transition-colors">
                            {item.name}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Categories;