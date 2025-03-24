const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDb = require('./db/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoute = require('./routes/categoryRoute');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const port = process.env.PORT || 8000;
connectDb();


app.use('/api',userRoutes);
app.use('/api',productRoutes);
app.use('/api',categoryRoute);
app.use('/api',cartRoutes);
app.use('/api',orderRoutes);
app.use('/api/payments',paymentRoutes);

// app.get('/',(req,res)=>{
//     res.send("Hello world");
// });

app.listen(port,()=>{
    console.log(`app is listening on port ${port}`);
})