import React, { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from "@stripe/react-stripe-js";
import { useDispatch } from "react-redux";
import { placeOrder } from "../../redux/slices/orderSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import { toast } from "react-toastify";

const CheckoutForm = ({ clientSecret, orderData, cartItems, totalPrice, navigate }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe.js hasn't loaded yet.");
      return;
    }

    setIsProcessing(true);
    setMessage("");

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders`,
        },
        redirect: "if_required",
      });

      if (error) {
        setMessage(error.message);
        toast.error(`Payment failed: ${error.message}`);
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        setIsSuccess(true);
        setMessage("Payment successful! Processing your order...");
        
        const orderPayload = {
          ...orderData,
          cartItems,
          totalPrice,
          paymentStatus: "Paid"
        };

        try {
          const result = await dispatch(placeOrder(orderPayload)).unwrap();
          
          if (result) {
            dispatch(clearCart());
            
            toast.success("Order placed successfully!");
            
            setTimeout(() => {
              navigate("/orders", { 
                state: { 
                  paymentSuccess: true,
                  orderId: result.order?._id 
                }
              });
            }, 2000);
          }
        } catch (orderError) {
          setMessage(`Payment succeeded but order creation failed: ${orderError.message}`);
          toast.error("Order creation failed. Please contact support.");
        }
      }
    } catch (err) {
      setMessage(`An unexpected error occurred: ${err.message}`);
      toast.error("Payment processing failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecretFromURL = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecretFromURL) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecretFromURL).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="form-label fw-bold">Card Details</label>
        <div className="border rounded p-3 bg-light">
          <PaymentElement 
            id="payment-element"
            options={{
              layout: "tabs",
              wallets: {
                applePay: "auto",
                googlePay: "auto"
              }
            }}
          />
        </div>
      </div>

      <div className="mb-3">
        <h6 className="mb-2">Or enter card details manually:</h6>
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label small">Card Number</label>
            <div className="border rounded p-2">
              <CardNumberElement 
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#212529',
                      '::placeholder': {
                        color: '#6c757d',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label small">Expiry Date</label>
            <div className="border rounded p-2">
              <CardExpiryElement 
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#212529',
                      '::placeholder': {
                        color: '#6c757d',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label small">CVC</label>
            <div className="border rounded p-2">
              <CardCvcElement 
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#212529',
                      '::placeholder': {
                        color: '#6c757d',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'} mt-3`}>
          {message}
        </div>
      )}

      <button
        className="btn btn-primary w-100 py-3 fw-bold mt-3"
        disabled={isProcessing || !stripe || !elements || isSuccess}
        id="submit"
      >
        {isProcessing ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Processing...
          </>
        ) : isSuccess ? (
          "Payment Successful!"
        ) : (
          `Pay $${totalPrice.toFixed(2)}`
        )}
      </button>

      <div className="mt-4 p-3 bg-light rounded">
        <h6 className="fw-bold">Test Card for Demo:</h6>
        <div className="row">
          <div className="col-md-6">
            <p className="mb-1 small">
              <strong>Card Number:</strong> 4242 4242 4242 4242
            </p>
            <p className="mb-1 small">
              <strong>Expiry:</strong> Any future date
            </p>
            <p className="mb-1 small">
              <strong>CVC:</strong> Any 3 digits
            </p>
          </div>
          <div className="col-md-6">
            <p className="mb-1 small">
              <strong>ZIP:</strong> Any 5 digits
            </p>
            <p className="mb-0 small text-muted">
              Use these test details to simulate a payment
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;