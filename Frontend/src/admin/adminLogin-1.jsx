import { useState } from "react";
import BackendURL from "../config/BackendUrl";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLogin1 = () => {
  const navigate = useNavigate();
  const [myData, setMydata] = useState({});

  const handleinput = (e) => {
    const { name, value } = e.target;
    setMydata((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const api = `${BackendURL}admin/login`;
      const res = await axios.post(api, myData);

      // ✅ Corrected this line
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);

      toast.success("✅ Login successful!");
      setTimeout(() => navigate("/Dashboard-1"), 1000);
    } catch (err) {
      toast.error("❌ Invalid credentials! Please try again.");
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="admin-login">
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="admin-login-box">
        <h1>Admin Login</h1>
        <input
          type="text"
          name="email"
          placeholder="Enter email"
          onChange={handleinput}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          onChange={handleinput}
        />
        <button onClick={handleSubmit}>Login</button>
      </div>
    </div>
  );
};

export default AdminLogin1;
