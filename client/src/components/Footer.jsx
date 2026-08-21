import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Footer = () => {
    const [modalContent, setModalContent] = useState(null);

    const policyContent = {
        delivery: {
            title: "Delivery Information",
            body: "We deliver 7 days a week from 6:00 AM to 11:00 PM. Standard delivery arrives within 15–30 minutes in serviceable pin codes. Orders over $20 qualify for free express delivery.",
        },
        return: {
            title: "Return & Refund Policy",
            body: "If any grocery item arrives damaged, expired, or incorrect, request a return or replacement directly through your 'My Orders' tab within 24 hours of delivery for an instant refund.",
        },
        payment: {
            title: "Payment Methods",
            body: "We support Cash on Delivery (COD), Stripe Credit/Debit cards (Visa, MasterCard, Amex), UPI, Apple Pay, and Google Pay with end-to-end encryption.",
        },
        faqs: {
            title: "Frequently Asked Questions",
            body: "Q: How do I track my delivery?\nA: Go to 'Orders' in the navigation bar to see real-time status.\n\nQ: Can I schedule a delivery?\nA: Yes, select your preferred delivery slot on the checkout screen.",
        },
        contact: {
            title: "Contact Us",
            body: "Need assistance with an order?\n\n• Email: support@greencart.com\n• Helpline: +1 (800) 123-4567\n• Working Hours: 24/7 Customer Support",
        },
    };

    return (
        <footer className="bg-slate-50 border-t border-slate-200 mt-16 text-slate-600 text-sm">
            {/* Policy / Info Modal */}
            {modalContent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="text-lg font-bold text-slate-800">{modalContent.title}</h3>
                            <button
                                onClick={() => setModalContent(null)}
                                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
                            >
                                ✕
                            </button>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                            {modalContent.body}
                        </p>
                        <button
                            onClick={() => setModalContent(null)}
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}

            {/* Main Balanced Content Area */}
            <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-14 flex flex-col md:flex-row items-start justify-between gap-12">
                {/* Left Side: Brand & Description */}
                <div className="max-w-md space-y-4">
                    <Link to="/" className="inline-block">
                        <img src={assets.logo} alt="GreenCart" className="h-8 object-contain" />
                    </Link>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        We deliver fresh groceries and snacks straight to your door. Trusted by thousands, we aim to make your shopping experience simple, fast, and affordable.
                    </p>
                </div>

                {/* Right Side: Links Grouped Together */}
                <div className="flex flex-wrap sm:flex-nowrap gap-16 md:gap-24">
                    {/* Quick Links */}
                    <div className="space-y-3">
                        <p className="font-bold text-slate-800 text-base">Quick Links</p>
                        <ul className="space-y-2.5 text-sm">

                            <li>
                                <Link to="/products" className="hover:text-emerald-600 transition block">
                                    Best Sellers
                                </Link>
                            </li>
                            <li>
                                <Link to="/explore" className="hover:text-emerald-600 transition block">
                                    Offers & Deals
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={() => setModalContent(policyContent.contact)}
                                    className="hover:text-emerald-600 transition text-left"
                                >
                                    Contact Us
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setModalContent(policyContent.faqs)}
                                    className="hover:text-emerald-600 transition text-left"
                                >
                                    FAQs
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Need Help? */}
                    <div className="space-y-3">
                        <p className="font-bold text-slate-800 text-base">Need help?</p>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <button
                                    onClick={() => setModalContent(policyContent.delivery)}
                                    className="hover:text-emerald-600 transition text-left"
                                >
                                    Delivery Information
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setModalContent(policyContent.return)}
                                    className="hover:text-emerald-600 transition text-left"
                                >
                                    Return & Refund Policy
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setModalContent(policyContent.payment)}
                                    className="hover:text-emerald-600 transition text-left"
                                >
                                    Payment Methods
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setModalContent(policyContent.contact)}
                                    className="hover:text-emerald-600 transition text-left"
                                >
                                    Customer Support
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-400">
                Copyright 2026 © GreenCart All Right Reserved.
            </div>
        </footer>
    );
};

export default Footer;