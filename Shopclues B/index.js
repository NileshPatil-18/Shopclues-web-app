const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./db/db");

dotenv.config();
connectDb();

const app = express();

// 🛠️ Move CORS middleware to the top
const allowedOrigins = [
    "http://localhost:5173",
    "https://shopcluesweb.netlify.app",
  ];
  
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: "GET,POST,PUT,DELETE",
      credentials: true,
    })
  );
  

// Now apply express.json()
app.use(express.json());

// Import Routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoute = require("./routes/categoryRoute");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Routes
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", categoryRoute);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
  console.log("Backend is running successfully!");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
