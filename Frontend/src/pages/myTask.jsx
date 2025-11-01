import { useState, useEffect } from "react";
import BackendURL from "../config/BackendUrl";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
// import "./MyTask.css"; // ✨ Add this for styling

const MyTask = () => {
  const uid = localStorage.getItem("uid");
  const [mdata, setMdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // 🔹 Load all tasks for this user
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BackendURL}user/mytask/?id=${uid}`);
      setMdata(res.data.tasks || []);
    } catch (err) {
      console.error("❌ Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🔹 Show task details in modal
  const handleRowClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  // 🔹 Update task status
  const handleStatusChange = async (taskId, currentStatus) => {
    let newStatus;
    if (currentStatus === "Pending") newStatus = "In Progress";
    else if (currentStatus === "In Progress") newStatus = "Completed";
    else return;

    try {
      setUpdatingId(taskId);
      await axios.put(`${BackendURL}user/updatetaskstatus/${taskId}`, {
        taskStatus: newStatus,
      });

      // Update locally
      setMdata((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, taskStatus: newStatus } : task
        )
      );
    } catch (err) {
      console.error("❌ Error updating status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // 🔹 Render task status as button/badge
  const renderStatusButton = (task) => {
    const { taskStatus } = task;
    const isUpdating = updatingId === task._id;

    if (taskStatus === "Completed") {
      return <Badge bg="success">Completed ✅</Badge>;
    }

    return (
      <Button
        variant={
          taskStatus === "Pending"
            ? "warning"
            : taskStatus === "In Progress"
            ? "info"
            : "secondary"
        }
        size="sm"
        disabled={isUpdating}
        onClick={(e) => {
          e.stopPropagation(); // prevent modal from opening on button click
          handleStatusChange(task._id, taskStatus);
        }}
      >
        {isUpdating
          ? "Updating..."
          : taskStatus === "Pending"
          ? "Pending 🕓"
          : "In Progress 🔵"}
      </Button>
    );
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3 text-primary">🧾 My Tasks</h2>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p>Loading tasks...</p>
        </div>
      ) : mdata.length === 0 ? (
        <h5 className="text-center text-muted">No tasks assigned yet!</h5>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-dark text-center">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned On</th>
            </tr>
          </thead>
          <tbody>
            {mdata.map((task) => (
              <tr
                key={task._id}
                className="task-row"
                onClick={() => handleRowClick(task)}
              >
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.duration} days</td>
                <td>
                  {task.priority === "High" ? (
                    <Badge bg="danger">High</Badge>
                  ) : task.priority === "Medium" ? (
                    <Badge bg="warning">Medium</Badge>
                  ) : (
                    <Badge bg="success">Low</Badge>
                  )}
                </td>
                <td>{renderStatusButton(task)}</td>
                <td>{new Date(task.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* 🔹 Task Details Modal */}
      <Modal
        show={showTaskModal}
        onHide={() => setShowTaskModal(false)}
        centered
        size="md"
        className="task-modal"
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>📄 Task Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTask && (
            <Card className="border-0 shadow-sm p-3 rounded">
              <h5 className="mb-3 text-dark fw-bold">{selectedTask.title}</h5>
              <p><strong>Description:</strong> {selectedTask.description}</p>
              <p><strong>Duration:</strong> {selectedTask.duration} days</p>
              <p><strong>Priority:</strong> {selectedTask.priority}</p>
              <p><strong>Status:</strong> {selectedTask.taskStatus}</p>
              <p><strong>Assigned On:</strong> {new Date(selectedTask.createdAt).toLocaleString()}</p>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTaskModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyTask;
