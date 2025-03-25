import React, { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { createPaymentIntent } from "../../redux/slices/paymentSlice";
import { useNavigate } from "react-router-dom";
import CheckoutForm from '../../components/checkout/CheckoutPage'
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clientSecret, loading, error } = useSelector((state) => state.payment);
  const cartTotal = useSelector((state) => state.cart.totalAmount);

  useEffect(() => {
    if (cartTotal > 0) {
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

export default PaymentPage;
