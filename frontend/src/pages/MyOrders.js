import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const statusColors = {
  pending: "status-pending",
  preparing: "status-preparing",
  delivered: "status-delivered",
};

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/orders/my")
      .then((res) => setOrders(res.data.orders || []))
      .catch((err) => setError(err.response?.data?.message || "Failed to load orders."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="page-loading">Loading your orders...</p>;
  }

  return (
    <div className="orders-page">
      <header className="orders-hero">
        <h1 className="script-title">My Orders</h1>
        <p className="page-subtitle">Track your deliveries</p>
      </header>

      {error && <p className="alert alert-error">{error}</p>}

      {orders.length === 0 ? (
        <div className="card empty-card">
          <h2 className="script-title">No orders yet</h2>
          <p className="muted">Hungry? Browse our menu and place your first order.</p>
          <Link to="/foods" className="btn btn-red" style={{ marginTop: "1rem" }}>
            Order Today!
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article key={order._id} className="card order-card">
              <div className="order-card-top">
                <div>
                  <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                  <p className="muted">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={`status-badge ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>

              <p>
                <strong>📍</strong> {order.deliveryAddress}
              </p>

              <ul className="order-items">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} ×{item.quantity} — $
                    {(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>

              <p className="order-total">Total: ${order.totalAmount.toFixed(2)}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
