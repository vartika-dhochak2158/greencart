import React, { useState } from 'react'
import { UploadCloud, X } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

export default function AddProduct() {
    const { backendUrl, axios } = useAppContext()

    const [image1, setImage1] = useState(null)
    const [image2, setImage2] = useState(null)
    const [image3, setImage3] = useState(null)
    const [image4, setImage4] = useState(null)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('Vegetables')
    const [price, setPrice] = useState('')
    const [offerPrice, setOfferPrice] = useState('')

    const images = [
        { file: image1, setter: setImage1, id: 'image1' },
        { file: image2, setter: setImage2, id: 'image2' },
        { file: image3, setter: setImage3, id: 'image3' },
        { file: image4, setter: setImage4, id: 'image4' },
    ]

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('description', description)
            formData.append('category', category)
            formData.append('price', price)
            formData.append('offerPrice', offerPrice || price)

            if (image1) formData.append('image1', image1)
            if (image2) formData.append('image2', image2)
            if (image3) formData.append('image3', image3)
            if (image4) formData.append('image4', image4)

            const url = backendUrl ? `${backendUrl}/api/product/add` : '/api/product/add'
            const { data } = await axios.post(url, formData)

            if (data?.success) {
                toast.success(data.message || 'Product Added Successfully')
                setName('')
                setDescription('')
                setPrice('')
                setOfferPrice('')
                setImage1(null)
                setImage2(null)
                setImage3(null)
                setImage4(null)
            } else {
                toast.error(data?.message || 'Failed to add product')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="space-y-6 max-w-2xl bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div>
                <h2 className="text-lg font-black text-slate-900">Add New Product</h2>
                <p className="text-xs text-slate-400 font-semibold">Upload product photos and information</p>
            </div>

            {/* Product Image Upload Section */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Product Images (Up to 4)</label>
                <div className="flex flex-wrap gap-3">
                    {images.map((item, idx) => (
                        <div key={item.id} className="relative size-24">
                            {item.file ? (
                                <div className="relative size-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                                    <img
                                        src={URL.createObjectURL(item.file)}
                                        alt={`Preview ${idx + 1}`}
                                        className="size-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => item.setter(null)}
                                        className="absolute top-1 right-1 grid size-5 place-items-center rounded-full bg-red-500 text-white shadow hover:bg-red-600 transition"
                                    >
                                        <X className="size-3" />
                                    </button>
                                </div>
                            ) : (
                                <label
                                    htmlFor={item.id}
                                    className="flex flex-col items-center justify-center size-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-slate-400 hover:text-emerald-600 cursor-pointer transition"
                                >
                                    <UploadCloud className="size-6 stroke-[1.5]" />
                                    <span className="text-[10px] font-bold mt-1">Upload</span>
                                    <input
                                        id={item.id}
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => item.setter(e.target.files[0])}
                                    />
                                </label>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Information Inputs */}
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Product Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Type product name here"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Product Description</label>
                    <textarea
                        rows={3}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Type description here..."
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Product Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-emerald-500 bg-white"
                        >
                            <option value="Vegetables">Vegetables</option>
                            <option value="Fruits">Fruits</option>
                            <option value="Dairy">Dairy</option>
                            <option value="Bakery">Bakery</option>
                            <option value="Grains">Grains</option>
                            <option value="Instant">Instant & Frozen</option>
                            <option value="Beverages">Beverages</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Product Price (₹)</label>
                        <input
                            type="number"
                            required
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="100"
                            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Offer Price (₹)</label>
                        <input
                            type="number"
                            value={offerPrice}
                            onChange={(e) => setOfferPrice(e.target.value)}
                            placeholder="80"
                            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition"
            >
                Add Product
            </button>
        </form>
    )
}