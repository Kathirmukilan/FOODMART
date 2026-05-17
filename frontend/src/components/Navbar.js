import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { menuCategories } from "../utils/foodVisuals";

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isFoodsPage = location.pathname === "/foods";
  const categoryParam = new URLSearchParams(location.search).get("category") || "all";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const setCategory = (key) => {
    const search = key === "all" ? "" : `?category=${key}`;
    navigate(`/foods${search}`);
  };

  return (
    <header className="site-header">
      <div className="top-bar">
        <div className="top-bar-inner">
          <nav className="top-links">
            <Link to="/">Home</Link>
            <span className="dot">•</span>
            <Link to="/foods">Menu</Link>
            {user && (
              <>
                <span className="dot">•</span>
                <Link to="/orders">My Orders</Link>
              </>
            )}
          </nav>
          <nav className="top-links">
            {user ? (
              <>
                {isAdmin && <Link to="/admin">Admin Panel</Link>}
                <button type="button" className="top-link-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="main-header">
        <div className="main-header-inner">
          <div className="header-left">
            <span className="delivery-badge">🚚 Fast Delivery</span>
            <span className="phone">0763551279</span>
          </div>

          <Link to="/" className="brand-logo">
            <span className="logo-circle">🍕</span>
            <span className="logo-text">FoodMart</span>
          </Link>

          <div className="header-right">
            {user ? (
              <>
                <span className="user-pill">
                  👤 {user.name}
                </span>
                {!isAdmin && (
                  <Link to="/foods" className="btn btn-red">
                    Order Today!
                  </Link>
                )}
              </>
            ) : (
              <Link to="/register" className="btn btn-red">
                Order Today!
              </Link>
            )}
          </div>
        </div>
      </div>

      {user && isFoodsPage && (
        <nav className="category-bar">
          <div className="category-bar-inner">
            {menuCategories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                className={`category-item ${
                  categoryParam === cat.key || (cat.key === "all" && !location.search)
                    ? "active"
                    : ""
                }`}
                onClick={() => setCategory(cat.key)}
              >
                <span className="cat-emoji">{cat.emoji}</span>
                <span className="cat-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
