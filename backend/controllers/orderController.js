const Order = require("../models/Order");
const Food = require("../models/Food");

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must have at least one item." });
    }

    if (!deliveryAddress) {
      return res.status(400).json({ message: "Delivery address is required." });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const food = await Food.findById(item.foodId);
      if (!food) {
        return res.status(404).json({ message: `Food not found: ${item.foodId}` });
      }
      if (!food.inStock) {
        return res.status(400).json({ message: `${food.name} is out of stock.` });
      }

      const quantity = item.quantity || 1;
      orderItems.push({
        food: food._id,
        name: food.name,
        price: food.price,
        quantity,
      });

      totalAmount += food.price * quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.food", "name price");

    res.status(201).json({ message: "Order placed.", order: populatedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/my
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.food", "name price image")
      .sort({ createdAt: -1 });

    res.json({ count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.food", "name price")
      .sort({ createdAt: -1 });

    res.json({ count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["pending", "preparing", "delivered"];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Status must be: pending, preparing, or delivered.",
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.food", "name price");

    res.json({ message: "Order status updated.", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
