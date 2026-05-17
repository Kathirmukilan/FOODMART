const Food = require("../models/Food");

// GET /api/foods
const getFoods = async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });
    res.json({ count: foods.length, foods });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/foods/:id
const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: "Food not found." });
    }
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/foods
const addFood = async (req, res) => {
  try {
    const { name, description, price, category, image, inStock } = req.body;

    if (!name || !description || price === undefined) {
      return res.status(400).json({ message: "Name, description, and price are required." });
    }

    const food = await Food.create({
      name,
      description,
      price,
      category,
      image,
      inStock,
    });

    res.status(201).json({ message: "Food added.", food });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/foods/:id
const updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: "Food not found." });
    }

    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ message: "Food updated.", food: updatedFood });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/foods/:id
const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: "Food not found." });
    }

    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: "Food deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFoods, getFoodById, addFood, updateFood, deleteFood };
