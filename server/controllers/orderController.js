import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "stripe";
import User from "../models/User.js";
import mongoose from "mongoose";

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;

        if (!address || !items || items.length === 0) {
            return res.json({ success: false, message: "Invalid order data" });
        }

        let amount = 0;
        const validItems = [];

        for (const item of items) {
            let price = 0;

            // Check if product ID is a valid MongoDB ObjectId
            if (mongoose.Types.ObjectId.isValid(item.product)) {
                const product = await Product.findById(item.product);
                if (product) {
                    price = product.offerPrice || product.price;
                    validItems.push({ product: product._id, quantity: item.quantity });
                }
            }

            // Fallback for dummy / test items
            if (price === 0) {
                price = item.price || item.offerPrice || 10;
                // If it's a dummy ID, generate a temporary ObjectId so Mongoose schema doesn't reject it
                validItems.push({
                    product: mongoose.Types.ObjectId.isValid(item.product)
                        ? item.product
                        : new mongoose.Types.ObjectId(),
                    quantity: item.quantity,
                });
            }

            amount += price * item.quantity;
        }

        // Add 2% Tax Charge
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId: mongoose.Types.ObjectId.isValid(userId) ? userId : new mongoose.Types.ObjectId(),
            items: validItems,
            amount,
            address: mongoose.Types.ObjectId.isValid(address) ? address : new mongoose.Types.ObjectId(),
            paymentType: "COD",
            isPaid: false,
        });

        return res.json({ success: true, message: "Order Placed Successfully" });
    } catch (error) {
        console.error("COD Order Error:", error);
        return res.json({ success: false, message: error.message });
    }
};

// Place Order Stripe : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        const { origin } = req.headers;

        if (!address || !items || items.length === 0) {
            return res.json({ success: false, message: "Invalid order data" });
        }

        let productData = [];
        let amount = 0;
        const validItems = [];

        for (const item of items) {
            let name = "Product Item";
            let price = 0;

            if (mongoose.Types.ObjectId.isValid(item.product)) {
                const product = await Product.findById(item.product);
                if (product) {
                    name = product.name;
                    price = product.offerPrice || product.price;
                    validItems.push({ product: product._id, quantity: item.quantity });
                }
            }

            if (price === 0) {
                name = item.name || "Grocery Item";
                price = item.price || item.offerPrice || 10;
                validItems.push({
                    product: mongoose.Types.ObjectId.isValid(item.product)
                        ? item.product
                        : new mongoose.Types.ObjectId(),
                    quantity: item.quantity,
                });
            }

            productData.push({
                name,
                price,
                quantity: item.quantity,
            });

            amount += price * item.quantity;
        }

        // Add 2% Tax Charge
        amount += Math.floor(amount * 0.02);

        const order = await Order.create({
            userId: mongoose.Types.ObjectId.isValid(userId) ? userId : new mongoose.Types.ObjectId(),
            items: validItems,
            amount,
            address: mongoose.Types.ObjectId.isValid(address) ? address : new mongoose.Types.ObjectId(),
            paymentType: "Online",
            isPaid: false,
        });

        // Stripe Gateway Initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        const line_items = productData.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.round((item.price + item.price * 0.02) * 100),
                },
                quantity: item.quantity,
            };
        });

        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId: userId.toString(),
            },
        });

        return res.json({ success: true, url: session.url });
    } catch (error) {
        console.error("Stripe Order Error:", error);
        return res.json({ success: false, message: error.message });
    }
};

// Stripe Webhooks to Verify Payments Action : /stripe
export const stripeWebhooks = async (request, response) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    switch (event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntent.id,
            });

            if (session.data?.[0]?.metadata) {
                const { orderId, userId } = session.data[0].metadata;
                await Order.findByIdAndUpdate(orderId, { isPaid: true });
                if (mongoose.Types.ObjectId.isValid(userId)) {
                    await User.findByIdAndUpdate(userId, { cartItems: {} });
                }
            }
            break;
        }
        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object;
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntent.id,
            });

            if (session.data?.[0]?.metadata) {
                const { orderId } = session.data[0].metadata;
                await Order.findByIdAndDelete(orderId);
            }
            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}`);
            break;
    }
    response.json({ received: true });
};

// Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const query = {
            $or: [{ paymentType: "COD" }, { isPaid: true }],
        };
        if (mongoose.Types.ObjectId.isValid(userId)) {
            query.userId = userId;
        }
        const orders = await Order.find(query)
            .populate("items.product address")
            .sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get All Orders (for seller / admin) : /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }],
        })
            .populate("items.product address")
            .sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};