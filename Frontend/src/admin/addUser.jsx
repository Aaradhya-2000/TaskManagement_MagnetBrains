import Form from "react-bootstrap/Form";
import { useState } from "react";
import BackendURL from "../config/BackendUrl";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const AddUser = () => {
  const [myData, setMydata] = useState({});

  // 🟢 Handle Input Change
  const handleInput = (e) => {
    const { name, value } = e.target;
    setMydata((prev) => ({ ...prev, [name]: value }));
  };

  // 🟢 Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const api = `${BackendURL}admin/usercreate`;
      const res = await axios.post(api, myData);

      if (res.data) {
        toast.success("🎉 User Created Successfully!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
        setMydata({}); // Clear form
      }
    } catch (err) {
      console.error("Error creating user:", err);
      toast.error("❌ Failed to create user!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="adduser-container">
      <div className="adduser-box">
        <h2>Create New User</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formGroupEmpid">
            <Form.Label>Employee ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Employee ID"
              name="empid"
              value={myData.empid || ""}
              onChange={handleInput}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGroupName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Full Name"
              name="name"
              value={myData.name || ""}
              onChange={handleInput}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email"
              name="email"
              value={myData.email || ""}
              onChange={handleInput}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              name="password"
              value={myData.password || ""}
              onChange={handleInput}
              required
            />
          </Form.Group>

          <button type="submit" className="create-btn">
            🚀 Create User
          </button>
        </Form>
      </div>

      {/* Toastify container */}
      <ToastContainer />
    </div>
  );
};

export default AddUser;
