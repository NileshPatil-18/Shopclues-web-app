import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { createPaymentIntent } from "../../redux/slices/paymentSlice";
import { useLocation, useNavigate } from "react-router-dom";
import CheckoutForm from "../../components/checkout/checkoutForm"; // Make sure this path is correct
import LoadingSpinner from "../../components/common/LoadingSpinner";

// Check if Stripe key is loaded

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublicKey) {
  console.error("⚠️ Stripe Public Key is missing! Check your .env file");
}

const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

const PaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data passed from checkout page
  const { orderData, cartItems, totalPrice } = location.state || {};
  
  const { clientSecret, loading, error } = useSelector((state) => state.payment);
  const [stripeError, setStripeError] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);

  // Add this useEffect at the top of your component
useEffect(() => {
  // Check authentication
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  
  if (!token || !storedUser) {
    toast.error("Please login to proceed with payment");
    navigate("/login", { 
      state: { 
        from: "/payment",
        message: "Authentication required for payment" 
      } 
    });
    return;
  }

  // Verify token is valid
  try {
    const user = JSON.parse(storedUser);
    if (!user || !user.email) {
      throw new Error("Invalid user data");
    }
  } catch (error) {
    console.error("User data parse error:", error);
    localStorage.clear();
    navigate("/login");
  }
}, [navigate]);

  useEffect(() => {
    // Calculate amount to charge
    const amount = totalPrice || 
                   cartItems?.reduce((acc, item) => 
                     acc + (item.productId?.price || item.price) * item.quantity, 0) || 
                   0;
    
    setPaymentAmount(amount);

    if (amount > 0 && stripePublicKey) {
      console.log("Creating payment intent for amount:", amount);
      dispatch(createPaymentIntent(amount));
    } else {
      setStripeError("Invalid payment amount or Stripe not configured");
    }
  }, [dispatch, totalPrice, cartItems]);

  // If no stripe key, show error
  if (!stripePublicKey) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger">
          <h4>Payment System Not Configured</h4>
          <p>Stripe payment gateway is not configured. Please contact support.</p>
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-primary mt-2"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // If no items, redirect to cart
  if (!cartItems || cartItems.length === 0) {
    useEffect(() => {
      navigate("/cart");
    }, [navigate]);
    return <LoadingSpinner />;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          {/* Payment Header */}
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary">Secure Payment</h2>
            <p className="text-muted">Complete your purchase securely</p>
          </div>

          {/* Order Summary */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              {cartItems?.map((item, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    {item.productId?.image && (
                      <img 
                        src={item.productId.image} 
                        alt={item.productId.name} 
                        className="rounded me-3" 
                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                      />
                    )}
                    <div>
                      <h6 className="mb-0">{item.productId?.name || "Product"}</h6>
                      <small className="text-muted">Qty: {item.quantity}</small>
                    </div>
                  </div>
                  <span className="fw-bold">
                    ${((item.productId?.price || item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total Amount:</span>
                <span className="text-success">${paymentAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              {loading && (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Preparing secure payment...</p>
                </div>
              )}

              {error && (
                <div className="alert alert-danger text-center">
                  <h5>Payment Error</h5>
                  <p>{error}</p>
                  <button 
                    onClick={() => dispatch(createPaymentIntent(paymentAmount))}
                    className="btn btn-warning btn-sm"
                  >
                    Retry
                  </button>
                </div>
              )}

              {stripeError && (
                <div className="alert alert-warning text-center">
                  <p>{stripeError}</p>
                </div>
              )}

              {/* Stripe Elements */}
              {clientSecret && !loading && !error && (
                <div className="mt-3">
                  <h5 className="mb-3">Payment Details</h5>
                  <Elements 
                    stripe={stripePromise} 
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          colorPrimary: '#0d6efd',
                          colorBackground: '#ffffff',
                          colorText: '#212529',
                          colorDanger: '#dc3545',
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                          spacingUnit: '4px',
                          borderRadius: '8px'
                        }
                      }
                    }}
                  >
                    <CheckoutForm 
                      clientSecret={clientSecret}
                      orderData={orderData}
                      cartItems={cartItems}
                      totalPrice={paymentAmount}
                      navigate={navigate}
                    />
                  </Elements>
                </div>
              )}

              {/* Back Button */}
              <div className="text-center mt-4">
                <button 
                  onClick={() => navigate("/checkout")}
                  className="btn btn-outline-secondary"
                >
                  ← Back to Checkout
                </button>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="mt-4 text-center">
            <p className="text-muted small">
              <i className="bi bi-shield-check me-1"></i>
              Your payment is secured with 256-bit SSL encryption. 
              We don't store your card details.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <img src="https://stripe.com/img/v3/home/trusted-by/visa.svg" alt="Visa" height="30" />
              <img src="https://stripe.com/img/v3/home/trusted-by/mastercard.svg" alt="Mastercard" height="30" />
              <img src="https://stripe.com/img/v3/home/trusted-by/amex.svg" alt="Amex" height="30" />
              <img src="https://stripe.com/img/v3/home/trusted-by/discover.svg" alt="Discover" height="30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;