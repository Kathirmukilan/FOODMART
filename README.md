# FOODMART

A modern food ordering system that allows users to browse restaurants, explore menus, and place food orders with ease.

## Problem Description

Traditional food ordering can be cumbersome and time-consuming. Customers often struggle to:
- Find nearby restaurants quickly
- Browse menus across multiple platforms
- Compare prices and offerings
- Place orders efficiently
- Track order status in real-time

FOODMART solves these challenges by providing a unified, user-friendly platform for discovering restaurants and ordering food online.

## Proposed Solution

FOODMART is a web-based food ordering application that:
- Provides an intuitive interface for browsing restaurants and menus
- Enables seamless order placement and payment processing
- Offers real-time order tracking
- Delivers a responsive experience across desktop and mobile devices
- Maintains user order history and preferences

## Features

✨ **Core Features:**
- 🔐 User Authentication & Registration
- 🏪 Restaurant Browsing & Search
- 🍽️ Dynamic Menu Display
- 🛒 Shopping Cart Management
- 💳 Order Checkout & Payment Integration
- 📦 Order Tracking & Status Updates
- ⭐ User Reviews & Ratings
- 💾 Order History
- 🎯 Favorites & Wishlist
- 📱 Responsive Design

## Technologies Used

**Frontend:**
- JavaScript (77.9%)
- HTML (1.2%)
- CSS (20.9%)

**Key Libraries & Frameworks:**
- HTML5 for semantic markup
- CSS3 for styling and responsive design
- Vanilla JavaScript for DOM manipulation and API communication
- ES6+ features for modern JavaScript development

**Backend & Services:**
- REST API for server communication
- JSON for data exchange
- Local Storage for client-side data persistence

**Potential Integrations:**
- Payment Gateway (Stripe/Razorpay)
- Maps API (Google Maps)
- Email Service for notifications

## API Endpoints

### Authentication
```
POST /api/auth/register
- Register a new user
- Body: { "email": "user@example.com", "password": "password123", "name": "John Doe" }
- Response: { "id": "user_123", "email": "user@example.com", "name": "John Doe", "token": "jwt_token" }

POST /api/auth/login
- Login an existing user
- Body: { "email": "user@example.com", "password": "password123" }
- Response: { "id": "user_123", "email": "user@example.com", "token": "jwt_token" }

POST /api/auth/logout
- Logout user
- Headers: { "Authorization": "Bearer jwt_token" }
- Response: { "message": "Logged out successfully" }
```

### Restaurants
```
GET /api/restaurants
- Get all restaurants
- Query params: ?city=new_york&rating=4&limit=10&offset=0
- Response: { "restaurants": [...], "total": 150 }

GET /api/restaurants/:id
- Get restaurant details
- Response: { "id": "rest_123", "name": "Pizza Palace", "rating": 4.5, "address": "...", "menu": [...] }

GET /api/restaurants/:id/menu
- Get restaurant menu
- Response: { "items": [{ "id": "item_1", "name": "Margherita Pizza", "price": 12.99, "category": "Pizza" }, ...] }

GET /api/restaurants/search?q=pizza
- Search restaurants by name
- Response: { "restaurants": [...] }
```

### Menus & Items
```
GET /api/menu-items
- Get all menu items
- Query params: ?restaurant_id=rest_123&category=Pizza
- Response: { "items": [...], "total": 50 }

GET /api/menu-items/:id
- Get menu item details
- Response: { "id": "item_1", "name": "Margherita Pizza", "price": 12.99, "description": "...", "image": "...", "ingredients": [...] }
```

### Cart
```
POST /api/cart/add
- Add item to cart
- Headers: { "Authorization": "Bearer jwt_token" }
- Body: { "item_id": "item_1", "quantity": 2, "restaurant_id": "rest_123" }
- Response: { "cart_id": "cart_123", "items": [...], "total": 25.98 }

GET /api/cart
- Get current cart
- Headers: { "Authorization": "Bearer jwt_token" }
- Response: { "cart_id": "cart_123", "items": [...], "total": 25.98, "restaurant": {...} }

PUT /api/cart/:item_id
- Update cart item quantity
- Headers: { "Authorization": "Bearer jwt_token" }
- Body: { "quantity": 3 }
- Response: { "items": [...], "total": 38.97 }

DELETE /api/cart/:item_id
- Remove item from cart
- Headers: { "Authorization": "Bearer jwt_token" }
- Response: { "items": [...], "total": 12.99 }

DELETE /api/cart
- Clear cart
- Headers: { "Authorization": "Bearer jwt_token" }
- Response: { "message": "Cart cleared successfully" }
```

### Orders
```
POST /api/orders
- Create a new order
- Headers: { "Authorization": "Bearer jwt_token" }
- Body: { "cart_id": "cart_123", "delivery_address": "123 Main St", "payment_method": "card", "coupon_code": "SAVE10" }
- Response: { "order_id": "order_456", "total": 25.98, "status": "confirmed", "estimated_delivery": "2026-05-17T19:30:00Z" }

GET /api/orders
- Get user's orders
- Headers: { "Authorization": "Bearer jwt_token" }
- Query params: ?status=completed&limit=10
- Response: { "orders": [...], "total": 25 }

GET /api/orders/:id
- Get order details
- Headers: { "Authorization": "Bearer jwt_token" }
- Response: { "order_id": "order_456", "items": [...], "total": 25.98, "status": "delivered", "delivery_address": "...", "order_date": "..." }

PUT /api/orders/:id/cancel
- Cancel an order
- Headers: { "Authorization": "Bearer jwt_token" }
- Response: { "order_id": "order_456", "status": "cancelled", "refund_status": "initiated" }
```

### User Profile
```
GET /api/users/profile
- Get user profile
- Headers: { "Authorization": "Bearer jwt_token" }
- Response: { "id": "user_123", "name": "John Doe", "email": "john@example.com", "phone": "555-1234" }

PUT /api/users/profile
- Update user profile
- Headers: { "Authorization": "Bearer jwt_token" }
- Body: { "name": "John Smith", "phone": "555-5678" }
- Response: { "id": "user_123", "name": "John Smith", "email": "john@example.com", "phone": "555-5678" }

POST /api/users/addresses
- Add delivery address
- Headers: { "Authorization": "Bearer jwt_token" }
- Body: { "label": "Home", "address": "123 Main St", "city": "New York", "zip": "10001" }
- Response: { "address_id": "addr_789", "label": "Home", "address": "123 Main St", "city": "New York" }

GET /api/users/addresses
- Get all user addresses
- Headers: { "Authorization": "Bearer jwt_token" }
- Response: { "addresses": [...] }
```

### Reviews & Ratings
```
POST /api/reviews
- Submit a review
- Headers: { "Authorization": "Bearer jwt_token" }
- Body: { "order_id": "order_456", "rating": 5, "comment": "Great food and fast delivery!", "restaurant_id": "rest_123" }
- Response: { "review_id": "review_001", "rating": 5, "comment": "...", "created_at": "2026-05-17T..." }

GET /api/restaurants/:id/reviews
- Get restaurant reviews
- Query params: ?limit=10&offset=0
- Response: { "reviews": [...], "average_rating": 4.5, "total_reviews": 245 }
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Modern web browser
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Kathirmukilan/FOODMART.git
   cd FOODMART
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment configuration:**
   Create a `.env` file in the project root:
   ```
   API_BASE_URL=http://localhost:5000/api
   PAYMENT_GATEWAY_KEY=your_payment_key_here
   GOOGLE_MAPS_API_KEY=your_maps_key_here
   ```

4. **Configure your backend API:**
   Update the API endpoints in the JavaScript configuration files to match your backend server URL.

5. **Set up a local server (optional):**
   ```bash
   npm install -g http-server
   http-server -p 8000
   ```

## How to Run the Project

### Development Mode

1. **Start a local development server:**
   ```bash
   npm start
   ```
   Or if using http-server:
   ```bash
   http-server -p 8000
   ```

2. **Open your browser:**
   - Navigate to `http://localhost:8000` (or your configured port)

3. **Access the application:**
   - Home page displays featured restaurants
   - Sign up or log in to place orders
   - Browse menus and add items to cart
   - Proceed to checkout and payment

### Production Build

1. **Optimize and bundle files:**
   ```bash
   npm run build
   ```

2. **Deploy to a web server:**
   - Upload the contents to your hosting provider
   - Configure your domain and SSL certificate
   - Update API endpoints for production

### Testing

1. **Run tests (if configured):**
   ```bash
   npm test
   ```

2. **Manual testing checklist:**
   - ✅ User registration and login
   - ✅ Restaurant and menu browsing
   - ✅ Add/remove items from cart
   - ✅ Order placement and checkout
   - ✅ Order tracking and history
   - ✅ User profile management

## File Structure

```
FOODMART/
├── index.html              # Main HTML file
├── css/
│   ├── style.css          # Main stylesheet
│   ├── responsive.css     # Mobile responsive styles
│   └── components.css     # Component styles
├── js/
│   ├── main.js            # Application entry point
│   ├── api.js             # API communication
│   ├── auth.js            # Authentication logic
│   ├── cart.js            # Shopping cart logic
│   ├── orders.js          # Order management
│   └── utils.js           # Utility functions
├── assets/
│   ├── images/            # Image assets
│   └── icons/             # Icon assets
├── .env                   # Environment variables
├── README.md              # Project documentation
└── package.json           # Project dependencies
```

## Usage Examples

### Placing an Order
1. Browse restaurants and select one
2. Add desired items to your cart
3. Review cart and adjust quantities
4. Enter delivery address
5. Choose payment method
6. Confirm and submit order
7. Track order status in real-time

### Managing Your Account
1. Sign up with email and password
2. Complete your profile information
3. Add delivery addresses
4. View order history
5. Leave reviews and ratings

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Future Enhancements

- 🤖 AI-powered restaurant recommendations
- 👥 Social features and group ordering
- 🎁 Loyalty and rewards program
- 📊 Advanced analytics dashboard
- 🌍 Multi-language support
- 🔔 Push notifications
- 💬 Live chat support
- 🚚 Real-time delivery tracking with map

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support & Contact

For support, issues, or inquiries:
- 📧 Email: support@foodmart.com
- 🐛 GitHub Issues: [Report a bug](https://github.com/Kathirmukilan/FOODMART/issues)
- 💬 Discussions: [Community discussions](https://github.com/Kathirmukilan/FOODMART/discussions)

## Acknowledgments

- Built with vanilla JavaScript, HTML5, and CSS3
- Thanks to all contributors and users
- Special thanks to the open-source community

---

**Made with ❤️ by Kathirmukilan**

Last Updated: 2026-05-17
