require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "FoodMart API is running." });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: require("mongoose").connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "FoodMart API",
    endpoints: {
      auth: {
        "POST /api/auth/register": "Register user",
        "POST /api/auth/login": "Login (returns token)",
        "GET /api/auth/me": "Current user (needs Bearer token)",
      },
      foods: {
        "GET /api/foods": "List foods (needs token)",
        "GET /api/foods/:id": "One food (needs token)",
        "POST /api/foods": "Add food (admin)",
        "PUT /api/foods/:id": "Update food (admin)",
        "DELETE /api/foods/:id": "Delete food (admin)",
      },
      orders: {
        "POST /api/orders": "Create order (user)",
        "GET /api/orders/my": "My orders (user)",
        "GET /api/orders": "All orders (admin)",
        "PUT /api/orders/:id/status": "Update status (admin)",
      },
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found.",
    method: req.method,
    path: req.originalUrl,
    hint: "Open GET http://127.0.0.1:5000/api for valid endpoints.",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  if (!process.env.JWT_SECRET) {
    console.error("Missing JWT_SECRET in .env file. Copy .env.example to .env");
    process.exit(1);
  }

  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
