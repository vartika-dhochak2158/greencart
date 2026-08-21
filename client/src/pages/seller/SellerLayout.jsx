import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { PlusCircle, ListOrdered, ShoppingBag, LogOut, Store } from "lucide-react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SellerLayout = () => {
    const { axios, navigate } = useAppContext();

    const sidebarLinks = [
        { name: "Add Product", path: "/seller", icon: PlusCircle },
        { name: "Product List", path: "/seller/product-list", icon: ListOrdered },
        { name: "Orders", path: "/seller/orders", icon: ShoppingBag },
    ];

    const logout = async () => {
        try {
            const { data } = await axios.get('/api/seller/logout');
            if (data?.success) {
                toast.success(data.message);
                navigate('/');
            } else {
                toast.error(data?.message || 'Logout failed');
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 md:px-8 border-b border-slate-200 py-3 bg-white shadow-sm sticky top-0 z-30">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="grid size-9 place-items-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
                        <Store className="size-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black tracking-tight text-slate-900 leading-none">
                            Green<span className="text-emerald-600">Cart</span>
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">
                            Seller Dashboard
                        </span>
                    </div>
                </Link>

                <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-600 hidden sm:inline">
                        Hi, Admin
                    </span>
                    <button
                        onClick={logout}
                        className="flex items-center gap-1.5 border border-slate-200 rounded-full text-xs font-bold px-4 py-1.5 text-slate-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition active:scale-95"
                    >
                        <LogOut className="size-3.5" /> Logout
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <div className="w-16 md:w-64 border-r border-slate-200 bg-white pt-4 flex flex-col shrink-0 min-h-[calc(100vh-61px)]">
                    {sidebarLinks.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                to={item.path}
                                key={item.name}
                                end={item.path === "/seller"}
                                className={({ isActive }) =>
                                    `flex items-center py-3 px-4 gap-3 text-xs font-bold transition ${
                                        isActive
                                            ? "border-r-4 border-emerald-600 bg-emerald-50 text-emerald-700"
                                            : "hover:bg-slate-50 text-slate-600"
                                    }`
                                }
                            >
                                <Icon className="size-5 shrink-0" />
                                <span className="hidden md:block">{item.name}</span>
                            </NavLink>
                        );
                    })}
                </div>

                {/* Content View */}
                <div className="flex-1 p-6 md:p-8 max-w-5xl">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default SellerLayout;