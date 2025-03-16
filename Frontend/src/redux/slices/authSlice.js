import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn : localStorage.getItem("isLoggedIn")==='true',
    user:JSON.parse(localStorage.getItem("user"))||null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,

    reducers:{
        signup :(state,action)=>{
            state.user = action.payload;
            state.isLoggedIn = true;
            localStorage.setItem("user",JSON.stringify(action.payload));
            localStorage.setItem("isLoggedIn","true");
        },

        login : (state,action)=>{
            state.user = action.payload;
            state.isLoggedIn= true;
            localStorage.setItem("user",JSON.stringify(action.payload));
            localStorage.setItem("isLoggedIn","true");
        },

        logout: (state,action)=>{
            state.user = null;
            state.isLoggedIn=false;
            localStorage.removeItem("user");
            localStorage.removeItem("isLoggedIn");
        },
    },
});

export const {login,logout,signup} = authSlice.actions;
export default authSlice.reducer;