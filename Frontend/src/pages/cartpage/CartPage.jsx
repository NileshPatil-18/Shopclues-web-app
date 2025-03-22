import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateCartItem, removeCartItem, clearCart } from '../../redux/slices/cartSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth); // Fetch user from auth state

  useEffect(() => {
    if (user) {
      dispatch(fetchCart()); // Fetch cart only if the user is logged in
    }
  }, [dispatch, user]);

  const handleUpdateQuantity = (productId, quantity) => {
    if (!user) {
      alert('Please log in to update the cart.'); // Handle case where user is not logged in
      return;
    }
    dispatch(updateCartItem({ productId, quantity }));
  };

  const handleRemoveItem = (productId) => {
    if (!user) {
      alert('Please log in to remove items from the cart.'); // Handle case where user is not logged in
      return;
    }
    dispatch(removeCartItem({ userId: user.id, productId })); // Use userId from the authenticated user
  };

  const handleClearCart = () => {
    if (!user) {
      alert('Please log in to clear the cart.'); // Handle case where user is not logged in
      return;
    }
    dispatch(clearCart(user.id)); // Use userId from the authenticated user
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Cart</h1>
      <div>
        {items.map((item) => (
          <div key={item.productId}>
            <h2>{item.name}</h2>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ${item.price}</p>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value))}
            />
            <button onClick={() => handleRemoveItem(item.productId)}>Remove</button>
          </div>
        ))}
      </div>
      <button onClick={handleClearCart}>Clear Cart</button>
    </div>
  );
};

export default CartPage;