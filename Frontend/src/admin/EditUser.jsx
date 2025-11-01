import { useEffect, useState } from "react";
import BackendURL from "../config/BackendUrl";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { ToastContainer, toast } from "react-toastify";

const EditDetails = () => {
  const [users, setUsers] = useState([]);
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    empid: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // 🟢 Load all users
  const loadData = async () => {
    try {
      const res = await axios.get(`${BackendURL}admin/showuser`);
      setUsers(res.data);
    } catch (err) {
      toast.error("❌ Failed to fetch users!");
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🟡 Open Edit Modal
  const handleShowEditModal = (user) => {
    setSelectedUserId(user._id);
    setUserFormData({
      name: user.name,
      email: user.email,
      empid: user.empid,
    });
    setShowEditModal(true);
  };

  // 🟢 Handle Input
  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setUserFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🟢 Update User
  const handleUserUpdate = async (e) => {
    e.preventDefault();
    try {
      const api = `${BackendURL}admin/updateuser/${selectedUserId}`;
      await axios.put(api, userFormData);
      toast.success("✅ User updated successfully!");
      setShowEditModal(false);
      loadData();
    } catch (err) {
      toast.error("❌ Error updating user!");
      console.error("Error updating user:", err.response?.data || err.message);
    }
  };

  return (
    <div className="user-details-container p-4">
      <h1 className="text-center mb-4 fw-bold text-primary">👥 Edit User Details</h1>

      <Table striped bordered hover responsive className="shadow-lg rounded-3">
        <thead className="table-dark text-center">
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id} className="align-middle text-center">
                <td>{user.empid}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleShowEditModal(user)}
                  >
                    ✏️ Edit
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-muted py-3">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* 🟡 Edit User Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        animation={true}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-semibold">🛠️ Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUserUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Employee ID</Form.Label>
              <Form.Control
                type="text"
                name="empid"
                value={userFormData.empid}
                onChange={handleUserInput}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={userFormData.name}
                onChange={handleUserInput}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={userFormData.email}
                onChange={handleUserInput}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100 mt-3">
              💾 Update User
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default EditDetails;
