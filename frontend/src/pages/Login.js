import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin" : "/foods", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);
      navigate(data.user.role === "admin" ? "/admin" : "/foods");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero auth-hero--login">
        <h1 className="script-title">Fresh n Delicious</h1>
        <p className="page-subtitle">Pizzas, Burgers &amp; Salads</p>
        <div className="auth-hero-floats">
          <span className="float-food">🍔</span>
          <span className="float-food">🍕</span>
          <span className="float-food">🥤</span>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p className="subtitle muted">Sign in to order your favorites</p>

          {error && <p className="alert alert-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Mukilan@email.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
              />
            </label>

            <button type="submit" className="btn btn-red btn-block" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-footer">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
