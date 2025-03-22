import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../../redux/slices/orderSlice";

const OrdersPage = () => {
  const dispatch = useDispatch();
const { userOrders =[], status, error } = useSelector(state => state.orders || {});
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (status === "loading") return <h3 className="text-center mt-5">Loading Orders...</h3>;
  if (error) return <h3 className="text-center text-danger">{error}</h3>;

  return (
    <div className="container mt-4">
      <h2 className="text-center">My Orders</h2>
      {userOrders.length === 0 ? (
        <h4 className="text-center mt-3 text-muted">No orders placed yet.</h4>
      ) : (
        <div className="row g-4">
          {userOrders.map((order) => (
            <div key={order._id} className="col-md-6">
              <div className="card shadow-sm border-0 p-3">
                <h5 className="fw-bold">Order ID: {order._id}</h5>
                <p><b>Total Price:</b> ${order.totalPrice}</p>
                <p><b>Payment Method:</b> {order.paymentMethod}</p>
                <p><b>Shipping Address:</b> {order.address}</p>
                <p><b>Status:</b> <span className="badge bg-primary">{order.status}</span></p>
                <h6 className="fw-bold mt-2">Products:</h6>
                <ul className="list-group">
                  {order.items.map((item) => (
                    <li key={item.product._id} className="list-group-item">
                      {item.product.title} - <b>{item.quantity}</b> pcs
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
