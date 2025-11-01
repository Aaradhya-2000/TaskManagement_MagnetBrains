import { useState } from "react";
import BackendURL from "../config/BackendUrl";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import "./AdminLogin1.css"; // 👈 Add CSS file

const AdminLogin1 = () => {
  const navigate = useNavigate();
  const [myData, setMydata] = useState({});

  const handleinput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setMydata((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const api = `${BackendURL}admin/login`;
      const res = await axios.post(api, myData);
      console.log(res.data);
      localStorage.setItem("token", res.data.admin.token);
      navigate("/Dashboard-1");
    } catch (err) {
      alert("Invalid credentials! Please try again.");
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="admin-login">
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
