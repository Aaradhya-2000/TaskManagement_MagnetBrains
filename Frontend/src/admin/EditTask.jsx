import { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import BackendURL from "../config/BackendUrl";
// import "../TaskDetails.css"; // optional styling

const EditTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    priority: "",
    taskStatus: "",
  });

  // ✅ Load tasks
  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BackendURL}admin/alltasks`);
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // ✅ Handle Edit button click
  const handleEditClick = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      duration: task.duration,
      priority: task.priority,
      taskStatus: task.taskStatus,
    });
    setShowModal(true);
  };

  // ✅ Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Save updated task
  const handleSave = async () => {
    try {
      setUpdatingId(selectedTask._id);
      await axios.put(`${BackendURL}admin/edittask/${selectedTask._id}`, formData);
      setShowModal(false);
      loadTasks();
    } catch (error) {
      console.error("❌ Error updating task:", error);
      alert("Failed to update task!");
    } finally {
      setUpdatingId(null);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return <span className="priority high">High 🔴</span>;
      case "Medium":
        return <span className="priority medium">Medium 🟠</span>;
      default:
        return <span className="priority low">Low 🟢</span>;
    }
  };

  return (
    <div className="task-container">
      <h2 className="text-center mb-4">📝 Edit & Manage Tasks</h2>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-2">Loading tasks...</p>
        </div>
      ) : (
        <Table striped bordered hover responsive className="task-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Email</th>
              <th>Title</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned On</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <tr key={task._id}>
                  <td>{index + 1}</td>
                  <td>{task.userId?.name || "—"}</td>
                  <td>{task.userId?.email || "—"}</td>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.duration}</td>
                  <td>{getPriorityColor(task.priority)}</td>
                  <td>{task.taskStatus}</td>
                  <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleEditClick(task)}
                    >
                      ✏️ Edit
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center text-muted">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* ✅ Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="taskStatus"
                value={formData.taskStatus}
                onChange={handleChange}
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleSave}
            disabled={updatingId === selectedTask?._id}
          >
            {updatingId === selectedTask?._id ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditTask;
