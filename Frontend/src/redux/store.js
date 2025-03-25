import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import wishlistReducer from './slices/wishlistSlice'
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';
import paymentReducer from './slices/paymentSlice';



export const store = configureStore({
    reducer:{
        auth : authReducer,
        cart: cartReducer,
        products:productReducer,
        categories: categoryReducer,
        wishlist : wishlistReducer,
        order:orderReducer,
        user: userReducer,
        payment:paymentReducer,

    }
});

export default store;