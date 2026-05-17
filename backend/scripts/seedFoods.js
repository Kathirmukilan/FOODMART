/**
 * Adds sample foods to the database.
 * Run: npm run seed
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Food = require("../models/Food");

const sampleFoods = [
  {
    name: "Margherita Pizza",
    description: "Classic tomato, mozzarella, and basil",
    price: 12.99,
    category: "Pizza",
  },
  {
    name: "Chicken Burger",
    description: "Grilled chicken with lettuce and mayo",
    price: 9.49,
    category: "Burger",
  },
  {
    name: "Caesar Salad",
    description: "Romaine lettuce, croutons, parmesan",
    price: 7.99,
    category: "Salad",
  },
  {
    name: "Chocolate Brownie",
    description: "Warm brownie with chocolate sauce",
    price: 4.99,
    category: "Dessert",
  },
];

const seedFoods = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const count = await Food.countDocuments();
    if (count > 0) {
      console.log(`Database already has ${count} food(s). Skipping seed.`);
      process.exit(0);
    }

    await Food.insertMany(sampleFoods);
    console.log(`Seeded ${sampleFoods.length} foods successfully.`);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seedFoods();
