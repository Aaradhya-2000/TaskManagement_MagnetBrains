import { useState } from "react";
import BackendURL from "../config/BackendUrl";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../UserLogin.css";

const UserLogin = () => {
  const navigate = useNavigate();
  const [myData, setMydata] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input
  const handleInput = (e) => {
    const { name, value } = e.target;
    setMydata((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const api = `${BackendURL}user/userlogin`;
      const res = await axios.post(api, myData);

      if (res.data && res.data.user) {
        localStorage.setItem("username", res.data.user.name);
        localStorage.setItem("uid", res.data.user._id);
        navigate("/userdash");
      } else {
        setError("Invalid credentials ❌");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.msg || "Invalid email or password ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">👤 User Login</h2>
        {error && <p className="error-text">{error}</p>}

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleInput}
            value={myData.email}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleInput}
            value={myData.password}
            required
          />
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login 🚀"}
        </button>
      </form>
    </div>
  );
};

export default UserLogin;
