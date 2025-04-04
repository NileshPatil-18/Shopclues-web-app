const express = require('express');
const cors = require('cors');
const app = express();
// const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  "https://shopcluesweb.onrender.com"
];

// CORS Middleware with Dynamic Origin Handling
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

const dotenv = require('dotenv');
dotenv.config();

const connectDb = require('./db/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoute = require('./routes/categoryRoute');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');


const port = process.env.PORT || 8080;
connectDb();


app.use('/api',userRoutes);
app.use('/api',productRoutes);
app.use('/api',categoryRoute);
app.use('/api',cartRoutes);
app.use('/api',orderRoutes);
app.use('/api/payments',paymentRoutes);


app.get("/", (req, res) => {
    res.send("Backend is running successfully!");
    console.log("Backend is running successfully!");

});

app.listen(port,()=>{
    console.log(`app is listening on port ${port}`);
})