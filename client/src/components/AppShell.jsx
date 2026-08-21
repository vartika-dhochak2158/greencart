import React, { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ChevronDown, Home, MapPin, Package, Search, ShoppingCart, User, ShoppingBag, Plus } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import Footer from './Footer'

const DEFAULT_ADDRESSES = [
    { id: 'home', label: 'Home', detail: 'Flat 402, Green Valley Apartments, Main Street' },
    { id: 'work', label: 'Work', detail: 'Tech Park, Tower B, 3rd Floor' },
]

const desktopLinks = [
    { to: '/', label: 'Home' },
    { to: '/explore', label: 'Explore' },
    { to: '/my-orders', label: 'Orders' },
]

const mobileLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/explore', label: 'Explore', icon: Search },
    { to: '/cart', label: 'Cart', icon: ShoppingCart },
    { to: '/my-orders', label: 'Orders', icon: Package },
]

export default function AppShell({ children }) {
    // Load saved addresses list from localStorage
    const [addressList, setAddressList] = useState(() => {
        try {
            const saved = localStorage.getItem('greencart_all_addresses')
            return saved ? JSON.parse(saved) : DEFAULT_ADDRESSES
        } catch {
            return DEFAULT_ADDRESSES
        }
    })

    // Load currently selected address from localStorage
    const [selectedAddress, setSelectedAddress] = useState(() => {
        try {
            const saved = localStorage.getItem('greencart_selected_address')
            return saved ? JSON.parse(saved) : DEFAULT_ADDRESSES[0]
        } catch {
            return DEFAULT_ADDRESSES[0]
        }
    })

    const [addressOpen, setAddressOpen] = useState(false)
    const searchInputRef = useRef(null)
    const navigate = useNavigate()

    const {
        user,
        getCartCount,
        setShowUserLogin,
        setSearchQuery,
        setSearch,
    } = useAppContext()

    // Save selected address to localStorage whenever it changes
    const handleSelectAddress = (addr) => {
        setSelectedAddress(addr)
        setAddressOpen(false)
        try {
            localStorage.setItem('greencart_selected_address', JSON.stringify(addr))
        } catch (err) {
            console.error('Failed to save selected address:', err)
        }
    }

    const handleSearchChange = (e) => {
        const val = e.target.value
        if (setSearchQuery) setSearchQuery(val)
        if (setSearch) setSearch(val)

        // Automatically navigate to explore if user starts typing from another page
        if (val.trim() && window.location.pathname !== '/explore') {
            navigate('/explore')
        }
    }

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            navigate('/explore')
        }
    }

    // Keyboard shortcut: Cmd/Ctrl + K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault()
                searchInputRef.current?.focus()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const cartCount = typeof getCartCount === 'function' ? getCartCount() : 0

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
            {/* Top Navbar */}
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-xl md:px-8">
                <div className="mx-auto flex w-full max-w-7xl items-center gap-4">

                    {/* Brand Logo */}
                    <NavLink to="/" className="shrink-0 flex items-center gap-2 group">
                        <div className="grid size-9 place-items-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700 transition">
                            <ShoppingBag className="size-5" />
                        </div>
                        <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-slate-900 leading-none">
                Green<span className="text-emerald-600">Cart</span>
              </span>
                            <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">
                Groceries
              </span>
                        </div>
                    </NavLink>

                    {/* Persistent Address Selector */}
                    <div className="relative hidden shrink-0 lg:block">
                        <button
                            type="button"
                            onClick={() => setAddressOpen((prev) => !prev)}
                            className="flex items-center gap-2 rounded-2xl px-2.5 py-1.5 text-left hover:bg-emerald-50/70 border border-transparent hover:border-emerald-100 transition"
                        >
              <span className="grid size-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                <MapPin className="size-4" />
              </span>
                            <span className="max-w-[200px]">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Deliver to
                </span>
                <span className="flex items-center gap-1 text-xs font-extrabold text-slate-800">
                  <span className="truncate">{selectedAddress.label} · {selectedAddress.detail}</span>
                  <ChevronDown className="size-3.5 text-slate-400 shrink-0" />
                </span>
              </span>
                        </button>

                        {addressOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setAddressOpen(false)} />
                                <div className="absolute left-0 top-14 z-50 w-72 rounded-2xl border border-slate-100 bg-white p-2.5 shadow-2xl animate-in fade-in space-y-1">
                                    <div className="flex items-center justify-between px-2 py-1">
                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                                            Saved Addresses
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAddressOpen(false)
                                                navigate('/add-address')
                                            }}
                                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline"
                                        >
                                            <Plus className="size-3" /> Add New
                                        </button>
                                    </div>

                                    {addressList.map((item) => {
                                        const isSelected = selectedAddress.id === item.id
                                        return (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => handleSelectAddress(item)}
                                                className={`flex w-full items-start gap-2.5 rounded-xl p-2 text-left transition ${
                                                    isSelected ? 'bg-emerald-50 border border-emerald-200' : 'hover:bg-slate-50'
                                                }`}
                                            >
                                                <MapPin className={`size-4 mt-0.5 shrink-0 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                                                <span className="flex-1 min-w-0">
                          <b className="block text-xs font-bold text-slate-800">{item.label}</b>
                          <small className="text-[11px] text-slate-500 font-medium line-clamp-2">{item.detail}</small>
                        </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Search Bar */}
                    <label className="hidden min-w-0 flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 md:flex transition">
                        <Search className="size-4 shrink-0 text-slate-400" />
                        <input
                            ref={searchInputRef}
                            onChange={handleSearchChange}
                            placeholder="Search fresh groceries, bakery, drinks..."
                            className="min-w-0 flex-1 bg-transparent text-xs sm:text-sm font-medium outline-none text-slate-800"
                        />
                        <kbd className="hidden rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400 lg:block">
                            ⌘ K
                        </kbd>
                    </label>

                    {/* Desktop Navigation Links */}
                    <nav className="ml-auto hidden items-center gap-1 md:flex">
                        {desktopLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `rounded-xl px-3 py-2 text-xs font-bold transition ${
                                        isActive
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Cart Icon */}
                    <button
                        type="button"
                        onClick={() => navigate('/cart')}
                        className="relative grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:text-emerald-600 transition active:scale-95"
                        aria-label="View Cart"
                    >
                        <ShoppingCart className="size-4" />
                        {cartCount > 0 && (
                            <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-emerald-600 text-[10px] font-black text-white shadow-sm ring-2 ring-white">
                {cartCount}
              </span>
                        )}
                    </button>

                    {/* Profile / Login */}
                    <button
                        type="button"
                        onClick={() => (user ? navigate('/profile') : (setShowUserLogin ? setShowUserLogin(true) : null))}
                        className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-emerald-400 hover:text-emerald-600 transition active:scale-95 md:flex"
                    >
                        {user ? (
                            <span className="grid size-6 place-items-center rounded-lg bg-emerald-100 text-emerald-700 font-extrabold text-xs">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </span>
                        ) : (
                            <User className="size-4" />
                        )}
                        {user ? 'Account' : 'Login'}
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="mx-auto w-full max-w-7xl px-4 pb-16 md:pb-10 pt-4 md:px-8 flex-1">
                {children}
            </main>

            {/* Footer */}
            <Footer />

            {/* Mobile Bottom Bar */}
            <nav className="fixed bottom-3 left-1/2 z-30 flex w-[calc(100%-24px)] max-w-md -translate-x-1/2 items-center justify-between rounded-[26px] border border-slate-200/80 bg-white/95 p-1.5 shadow-2xl backdrop-blur-xl md:hidden">
                {mobileLinks.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex flex-1 flex-col items-center gap-0.5 rounded-[20px] py-1.5 text-[10px] font-bold transition active:scale-95 ${
                                isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400'
                            }`
                        }
                    >
                        <Icon className="size-5" />
                        {label}
                    </NavLink>
                ))}
            </nav>
        </div>
    )
}