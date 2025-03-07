import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: 'cart',
    initialState:[],

    reducers:{
        addToCart : (state,action)=>{
            const product = action.payload;
            const existingProduct = state.find((item)=>item.id === product.id);

            if(existingProduct){
                existingProduct.quantity +=1;
            }else{
                state.push({...product,quantity:1});
            }
        },

        removeFromCart: (state, action) => {
            const productId = action.payload;
            return state.filter(item => item.id !== productId);
          },
    },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;