import { useEffect, useState } from "react";
import BackendURL from "../config/BackendUrl";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination"; // ✅ Import Bootstrap Pagination

const UserDetails = () => {
  const [myData, setMydata] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    taskStatus: "Pending",
    priority: "Low",
  });
  const [show, setShow] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 3;

  // 🟢 Close Modal
  const handleClose = () => {
    setShow(false);
    setFormData({
      title: "",
      description: "",
      duration: "",
      taskStatus: "Pending",
      priority: "Low",
    });
    setSelectedUserId(null);
  };

  // 🟢 Fetch users
  const loadData = async () => {
    try {
      const res = await axios.get(`${BackendURL}admin/showuser`);
      setMydata(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🟢 Delete user
  const del = async (id) => {
    try {
      await axios.delete(`${BackendURL}admin/userDelete/?id=${id}`);
      loadData();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // 🟢 Open modal
  const handleShow = (userId) => {
    setSelectedUserId(userId);
    setShow(true);
  };

  // 🟢 Handle form input
  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🟢 Submit task
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.duration ||
      !selectedUserId
    ) {
      alert("⚠️ Please fill all fields before assigning a task!");
      return;
    }

    try {
      const payload = { ...formData, userId: selectedUserId };
      await axios.post(`${BackendURL}admin/asigntask`, payload);
      alert("✅ Task Assigned Successfully!");
      handleClose();
    } catch (err) {
      console.error("❌ Error assigning task:", err.response?.data || err.message);
    }
  };

  // 🟢 Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = myData.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(myData.length / usersPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="user-details-container">
      <h1 className="text-center my-3">User Data</h1>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Delete</th>
            <th>Assign Task</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.empid}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => del(user._id)}
                  >
                    Delete
                  </Button>
                </td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleShow(user._id)}
                  >
                    Assign Task
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* ✅ Pagination Section */}
      {myData.length > 3 && (
        <div className="d-flex justify-content-center my-3">
          <Pagination>
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </Pagination>
        </div>
      )}

      {/* 🟢 Modal for Assigning Task */}
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Task Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                name="title"
                value={formData.title}
                onChange={handleInput}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                name="description"
                value={formData.description}
                onChange={handleInput}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Duration (in days)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter duration"
                name="duration"
                value={formData.duration}
                onChange={handleInput}
                min="1"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                name="priority"
                value={formData.priority}
                onChange={handleInput}
              >
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟠 Medium</option>
                <option value="High">🔴 High (Urgent)</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="taskStatus"
                value={formData.taskStatus}
                onChange={handleInput}
              >
                <option value="Pending">🟡 Pending</option>
                <option value="In Progress">🔵 In Progress</option>
                <option value="Completed">✅ Completed</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" variant="success" className="w-100">
              Assign Task
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserDetails;
