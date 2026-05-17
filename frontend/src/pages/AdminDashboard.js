import { useEffect, useState } from "react";
import api from "../api";

const emptyFood = {
  name: "",
  description: "",
  price: "",
  category: "General",
  inStock: true,
};

function AdminDashboard() {
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyFood);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [foodsRes, ordersRes] = await Promise.all([
        api.get("/foods"),
        api.get("/orders"),
      ]);
      setFoods(foodsRes.data.foods || []);
      setOrders(ordersRes.data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(emptyFood);
    setEditId(null);
  };

  const saveFood = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const payload = {
      ...form,
      price: Number(form.price),
    };

    try {
      if (editId) {
        await api.put(`/foods/${editId}`, payload);
        setMessage("Food updated.");
      } else {
        await api.post("/foods", payload);
        setMessage("Food added.");
      }
      resetForm();
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save food.");
    }
  };

  const startEdit = (food) => {
    setEditId(food._id);
    setForm({
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category || "General",
      inStock: food.inStock,
    });
  };

  const deleteFood = async (id) => {
    if (!window.confirm("Delete this food?")) return;
    try {
      await api.delete(`/foods/${id}`);
      setMessage("Food deleted.");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete food.");
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setMessage(`Order marked as ${status}.`);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update status.");
    }
  };

  if (loading) {
    return <p className="page-loading">Loading dashboard...</p>;
  }

  return (
    <div className="admin-shell">
      <header className="page-header">
        <h1 className="script-title">Admin Dashboard</h1>
        <p className="page-subtitle">Manage menu &amp; orders</p>
      </header>

      <div className="admin-grid">
      {error && <p className="alert alert-error">{error}</p>}
      {message && <p className="alert alert-success">{message}</p>}

      <section className="card admin-section">
        <h2>{editId ? "Edit food" : "Add new food"}</h2>
        <form className="admin-form" onSubmit={saveFood}>
          <label>
            Name
            <input name="name" value={form.name} onChange={handleFormChange} required />
          </label>
          <label>
            Description
            <input
              name="description"
              value={form.description}
              onChange={handleFormChange}
              required
            />
          </label>
          <label>
            Price
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={handleFormChange}
              required
            />
          </label>
          <label>
            Category
            <input name="category" value={form.category} onChange={handleFormChange} />
          </label>
          <label className="checkbox-label">
            <input
              name="inStock"
              type="checkbox"
              checked={form.inStock}
              onChange={handleFormChange}
            />
            In stock
          </label>
          <div className="form-actions">
            <button type="submit" className="btn btn-green">
              {editId ? "Update food" : "Add food"}
            </button>
            {editId && (
              <button type="button" className="btn btn-outline-dark" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card admin-section">
        <h2>Menu items ({foods.length})</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food) => (
                <tr key={food._id}>
                  <td>{food.name}</td>
                  <td>${food.price.toFixed(2)}</td>
                  <td>{food.category}</td>
                  <td>{food.inStock ? "Yes" : "No"}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-dark"
                      onClick={() => startEdit(food)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteFood(food._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card admin-section">
        <h2>All orders ({orders.length})</h2>
        {orders.length === 0 ? (
          <p className="muted">No orders yet.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article key={order._id} className="card order-card admin-order">
                <div className="order-card-top">
                  <div>
                    <h3>
                      #{order._id.slice(-6)} — {order.user?.name || "User"}
                    </h3>
                    <p className="muted">{order.user?.email}</p>
                    <p className="muted">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">pending</option>
                    <option value="preparing">preparing</option>
                    <option value="delivered">delivered</option>
                  </select>
                </div>
                <p>
                  <strong>Address:</strong> {order.deliveryAddress}
                </p>
                <ul className="order-items">
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.name} x{item.quantity}
                    </li>
                  ))}
                </ul>
                <p className="order-total">
                  <strong>Total:</strong> {order.totalAmount.toFixed(2)}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
