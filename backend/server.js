const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const passport = require('passport');
const connectDB = require('./config/db');
require('./config/passport');

// JWT_SECRET validation
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.warn('\n⚠️  WARNING: JWT_SECRET is too weak! Use at least 32 characters in production.\n');
}

connectDB();
const app = express();

// Security HTTP headers - adjust crossOriginResourcePolicy for external images if needed
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Body parser, reading data from body into req.body
// Increased limit to 50mb to allow for product image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Trust proxy required for Render load balancer to correctly identify user IPs for rate limiting
app.set('trust proxy', 1);

// Rate Limiting to prevent brute-force attacks
const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per windowMs
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.use(passport.initialize());

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Health
app.get('/api/health', (req, res) => res.json({ status: 'Aurelia Luxe API Running 💎' }));

// Error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: err.message, stack: process.env.NODE_ENV === 'production' ? null : err.stack });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`\n💎 Aurelia Luxe Server running on port ${PORT}`));
