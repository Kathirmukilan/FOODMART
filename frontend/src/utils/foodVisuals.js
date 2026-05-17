const categoryMap = {
  burger: { emoji: "🍔", color: "#ff6b6b" },
  burgers: { emoji: "🍔", color: "#ff6b6b" },
  pizza: { emoji: "🍕", color: "#f39c12" },
  pizzas: { emoji: "🍕", color: "#f39c12" },
  noodle: { emoji: "🍜", color: "#e67e22" },
  noodles: { emoji: "🍜", color: "#e67e22" },
  sushi: { emoji: "🍣", color: "#3498db" },
  salad: { emoji: "🥗", color: "#2ecc71" },
  salads: { emoji: "🥗", color: "#2ecc71" },
  dessert: { emoji: "🍰", color: "#9b59b6" },
  desserts: { emoji: "🍰", color: "#9b59b6" },
  drink: { emoji: "🥤", color: "#1abc9c" },
  drinks: { emoji: "🥤", color: "#1abc9c" },
  general: { emoji: "🍽️", color: "#6ab04c" },
};

export const menuCategories = [
  { key: "all", label: "All", emoji: "⭐" },
  { key: "burger", label: "Burgers", emoji: "🍔" },
  { key: "pizza", label: "Pizzas", emoji: "🍕" },
  { key: "noodle", label: "Noodles", emoji: "🍜" },
  { key: "sushi", label: "Sushi", emoji: "🍣" },
  { key: "salad", label: "Salads", emoji: "🥗" },
  { key: "dessert", label: "Desserts", emoji: "🍰" },
  { key: "drink", label: "Drinks", emoji: "🥤" },
];

export function getFoodVisual(category = "General") {
  const key = category.toLowerCase().trim();
  return categoryMap[key] || categoryMap.general;
}

export function matchCategory(foodCategory, filterKey) {
  if (!filterKey || filterKey === "all") return true;
  return foodCategory?.toLowerCase().includes(filterKey);
}
