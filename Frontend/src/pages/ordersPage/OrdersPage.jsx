import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../../redux/slices/orderSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { userOrders = [], status, error } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const calculateOrderTotal = (items = []) =>
    items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );

  if (status === "loading") {
    return <LoadingSpinner text="Loading your orders..." />;
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger">
          <h4>Error loading orders</h4>
          <p>{error}</p>
          <button
            className="btn btn-warning"
            onClick={() => dispatch(fetchUserOrders())}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">My Orders</h2>

      {userOrders.length === 0 ? (
        <div className="text-center mt-5">
          <div className="card shadow-sm p-5 border-0">
            <h3 className="text-muted">No Orders Yet</h3>
            <p className="text-muted">Start shopping to see your orders here</p>
            <a href="/" className="btn btn-primary mt-3">
              Start Shopping
            </a>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {userOrders.map((order) => {
            const orderTotal = calculateOrderTotal(order.items);

            return (
              <div key={order._id} className="col-lg-6 col-md-12">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="fw-bold text-primary mb-0">
                        Order #{order._id?.slice(-6).toUpperCase()}
                      </h5>
                      <span
                        className={`badge ${
                          order.status === "Pending"
                            ? "bg-warning"
                            : "bg-success"
                        }`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </div>

                    <small className="text-muted">
                      Placed on{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "Just now"}
                    </small>

                    <hr />

                    {/* Products */}
                    <h6 className="fw-bold mb-3">
                      Products ({order.items?.length || 0})
                    </h6>

                    <div className="list-group list-group-flush">
                      {order.items?.map((item, index) => (
                        <div
                          key={index}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div className="d-flex align-items-center">
                            {item.productId?.image && (
                              <img
                                src={item.productId.image}
                                alt={item.productId.name}
                                className="rounded me-3"
                                style={{
                                  width: 45,
                                  height: 45,
                                  objectFit: "cover",
                                }}
                              />
                            )}
                            <div>
                              <strong>{item.productId?.name}</strong>
                              <div className="text-muted small">
                                Qty {item.quantity} × $
                                {item.price?.toFixed(2)}
                              </div>
                            </div>
                          </div>

                          <span className="fw-bold">
                            $
                            {(
                              (item.price || 0) *
                              (item.quantity || 1)
                            ).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        <p className="mb-1">
                          <b>Payment:</b>{" "}
                          {order.paymentMethod || "Cash on Delivery"}
                        </p>
                        <p className="mb-0">
                          <b>Address:</b>{" "}
                          {order.address || "Not specified"}
                        </p>
                      </div>

                      <h4 className="text-success fw-bold mb-0">
                        ${orderTotal.toFixed(2)}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
