import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../../redux/slices/orderSlice";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { userOrders = [], status, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  console.log("Re-rendering with userOrders:", userOrders);

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">My Orders</h2>
      {status === "loading" && <h3 className="text-center">Loading Orders...</h3>}
      {error && <h3 className="text-center text-danger">{error}</h3>}
      {userOrders?.length === 0 ? (
        <h4 className="text-center mt-3 text-muted">No orders placed yet.</h4>
      ) : (
        <div className="row g-4">
          {userOrders?.map((order) => (
            <div key={order._id} className="col-lg-6 col-md-6 col-sm-12">
              <div className="card shadow-sm border-0 p-3 rounded-lg order-card">
                <div className="card-body">
                  <h5 className="fw-bold text-primary">Order ID: {order._id}</h5>
                  <hr />
                  <p className="mb-2"><b>Total Price:</b> <span className="text-success">${order.totalPrice}</span></p>
                  <p className="mb-2"><b>Payment Method:</b> {order.paymentMethod}</p>
                  <p className="mb-2"><b>Shipping Address:</b> {order.address}</p>
                  <p className="mb-2">
                    <b>Status:</b> <span className={`badge ${order.status === "Pending" ? "bg-warning" : "bg-success"}`}>{order.status}</span>
                  </p>
                  <h6 className="fw-bold mt-3">Products:</h6>
                  <ul className="list-group list-group-flush">
                    {order.items.map((item,index) => (
                      <li 
                      key={`${order._id}-${item.productId?._id || item.productId}-${index}`} 
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <img 
                        src={item.productId?.image || "/placeholder.jpg"} 
                        alt={item.productId?.name} 
                        className="img-fluid rounded me-2" 
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      />
                      {item.productId?.name} 
                      <span className="badge bg-secondary">{item.quantity} pcs</span>
                    </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
