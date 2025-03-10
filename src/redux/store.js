import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import wishlistReducer from './slices/wishlistSlice'



export const store = configureStore({
    reducer:{
        auth : authReducer,
        cart: cartReducer,
        products:productReducer,
        categories: categoryReducer,
        wishlist : wishlistReducer,
    }
});

export default store;