import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import { getFoodVisual, matchCategory } from "../utils/foodVisuals";

function Foods() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category") || "all";

  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState({});
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    api
      .get("/foods")
      .then((res) => setFoods(res.data.foods || []))
      .catch((err) => setError(err.response?.data?.message || "Failed to load foods."))
      .finally(() => setLoading(false));
  }, []);

  const filteredFoods = foods.filter((food) =>
    matchCategory(food.category, categoryFilter)
  );

  const updateQty = (foodId, delta) => {
    setCart((prev) => {
      const current = prev[foodId] || 0;
      const next = Math.max(0, current + delta);
      const updated = { ...prev };
      if (next === 0) delete updated[foodId];
      else updated[foodId] = next;
      return updated;
    });
  };

  const cartItems = Object.entries(cart).filter(([, qty]) => qty > 0);
  const cartTotal = cartItems.reduce((sum, [id, qty]) => {
    const food = foods.find((f) => f._id === id);
    return sum + (food ? food.price * qty : 0);
  }, 0);

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (cartItems.length === 0) {
      setError("Add at least one item to your order.");
      return;
    }

    if (!address.trim()) {
      setError("Please enter a delivery address.");
      return;
    }

    setOrdering(true);
    try {
      await api.post("/orders", {
        deliveryAddress: address,
        items: cartItems.map(([foodId, quantity]) => ({ foodId, quantity })),
      });
      setMessage("Order placed successfully!");
      setCart({});
      setAddress("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order.");
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return <p className="page-loading">Loading menu...</p>;
  }

  return (
    <div className="foods-page">
      <section className="menu-hero">
        <h1 className="script-title">Fresh n Delicious</h1>
        <p className="page-subtitle">Pizzas, Burgers &amp; Salads</p>
        <div className="menu-hero-deco">
          <span>🍔</span>
          <span>🍕</span>
          <span>🥤</span>
        </div>
      </section>

      <div className="foods-body">
        {error && <p className="alert alert-error">{error}</p>}
        {message && <p className="alert alert-success">{message}</p>}

        <section className="food-grid">
          {filteredFoods.length === 0 ? (
            <p className="muted">No items in this category.</p>
          ) : (
            filteredFoods.map((food) => {
              const visual = getFoodVisual(food.category);
              const qty = cart[food._id] || 0;

              return (
                <article key={food._id} className="card food-card">
                  <div
                    className="food-card-image"
                    style={{ background: `${visual.color}22` }}
                  >
                    {visual.emoji}
                  </div>
                  <div className="food-card-body">
                    <span className="food-category-tag">{food.category}</span>
                    <h3>{food.name}</h3>
                    <p className="food-desc">{food.description}</p>
                    {!food.inStock && (
                      <p className="out-of-stock">Out of stock</p>
                    )}
                    <div className="food-card-footer">
                      <p className="food-price">${food.price.toFixed(2)}</p>
                      <div className="qty-control">
                        <button
                          type="button"
                          disabled={!food.inStock}
                          onClick={() => updateQty(food._id, -1)}
                        >
                          −
                        </button>
                        <span>{qty}</span>
                        <button
                          type="button"
                          disabled={!food.inStock}
                          onClick={() => updateQty(food._id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>

        <aside className="card cart-card">
          <h2>🛒 Your order</h2>
          {cartItems.length === 0 ? (
            <p className="muted">Select items from the menu</p>
          ) : (
            <ul className="cart-list">
              {cartItems.map(([id, qty]) => {
                const food = foods.find((f) => f._id === id);
                if (!food) return null;
                return (
                  <li key={id}>
                    <span>{food.name} ×{qty}</span>
                    <span>${(food.price * qty).toFixed(2)}</span>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="cart-total">
            Total: <strong>${cartTotal.toFixed(2)}</strong>
          </p>

          <form onSubmit={placeOrder}>
            <label>
              Delivery address
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, city, zip"
                rows={3}
              />
            </label>
            <button
              type="submit"
              className="btn btn-red btn-block"
              disabled={ordering || cartItems.length === 0}
            >
              {ordering ? "Placing order..." : "Order Today!"}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}

export default Foods;
