import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { createPaymentIntent } from "../../redux/slices/paymentSlice";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe("your-publishable-key-here");

const PaymentPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { clientSecret, loading, error } = useSelector((state) => state.payment);
    const cartTotal = useSelector((state) => state.cart.totalAmount);

    useEffect(() => {
        if (cartTotal) {
            dispatch(createPaymentIntent(cartTotal));
        }
    }, [cartTotal, dispatch]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-6 bg-white shadow-lg rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Secure Payment</h2>
                {loading && <p className="text-center">Loading payment details...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                {clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <CheckoutForm navigate={navigate} />
                    </Elements>
                )}
            </div>
        </div>
    );
};

const CheckoutForm = ({ navigate }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const clientSecret = useSelector((state) => state.payment.clientSecret);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);
        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate("/payment-success");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <CardElement className="border p-2 rounded-md" />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md" disabled={!stripe || loading}>
                {loading ? "Processing..." : "Pay Now"}
            </button>
        </form>
    );
};

export default PaymentPage;
