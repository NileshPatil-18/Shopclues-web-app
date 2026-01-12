const express = require('express');
const cors = require('cors');
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://shopcluesweb.onrender.com"
];

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

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`🌐 ${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
    next();
});

const dotenv = require('dotenv');
dotenv.config();

const connectDb = require('./db/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoute = require('./routes/categoryRoute');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const port = process.env.PORT || 8080;

// Connect to database
connectDb();

app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url}`);
  next();
});

// Mount routes
app.use('/api/admin', adminRoutes); 

app.use('/api', userRoutes); // Admin routes
app.use('/api', productRoutes);
app.use('/api', categoryRoute);
app.use('/api', cartRoutes);
app.use('/api/wishlist',wishlistRoutes);
app.use('/api', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Route listing endpoint for debugging
app.get('/api/debug/routes', (req, res) => {
    const routes = [];
    
    // Collect all routes
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            routes.push({
                path: middleware.route.path,
                method: Object.keys(middleware.route.methods)[0]
            });
        } else if (middleware.name === 'router') {
            middleware.handle.stack.forEach((handler) => {
                if (handler.route) {
                    routes.push({
                        path: handler.route.path,
                        method: Object.keys(handler.route.methods)[0]
                    });
                }
            });
        }
    });
    
    res.json({
        success: true,
        adminRoutes: routes.filter(r => r.path.includes('admin')),
        allRoutes: routes
    });
});

app.get("/", (req, res) => {
    res.send("Backend is running successfully!");
    console.log("Backend is running successfully!");
});

app.listen(port, () => {
    console.log(`🚀 Server is listening on port ${port}`);
    
});