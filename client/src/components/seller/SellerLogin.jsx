import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const SellerLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { axios, backendUrl, setIsSeller } = useAppContext();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            // Send request to port 4000 backend URL
            const { data } = await axios.post(`${backendUrl}/api/seller/login`, {
                email,
                password,
            });

            if (data.success) {
                setIsSeller(true);
                toast.success("Login Successful");
            } else {
                toast.error(data.message || "Invalid Credentials");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <form
                onSubmit={onSubmitHandler}
                className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-slate-100"
            >
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-800">
                        <span className="text-emerald-600">Seller</span> Login
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Sign in to access your seller dashboard
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                            placeholder="seller@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default SellerLogin;