import { useState, useEffect } from "react";
import BackendURL from "../config/BackendUrl";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
// import "./MyTask.css"; // we'll add exciting styles here

const MyTask = () => {
  const uid = localStorage.getItem("uid");
  const [mdata, setMdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Load tasks
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

  // Open modal before completion
  const confirmCompletion = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  // Update task status API call
  const handleStatusChange = async (taskId, currentStatus) => {
    let newStatus;
    if (currentStatus === "Pending") newStatus = "In Progress";
    else if (currentStatus === "In Progress") newStatus = "Completed";
    else return; // Completed → no change

    try {
      setUpdatingId(taskId);
      await axios.put(`${BackendURL}user/updatetaskstatus/${taskId}`, {
        taskStatus: newStatus,
      });

      // Update UI locally
      setMdata((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, taskStatus: newStatus } : task
        )
      );
    } catch (err) {
      console.error("❌ Error updating status:", err);
    } finally {
      setUpdatingId(null);
      setShowModal(false);
    }
  };

  // Badge or Button for each status
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
        onClick={() =>
          taskStatus === "In Progress"
            ? confirmCompletion(task)
            : handleStatusChange(task._id, taskStatus)
        }
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
      <h2 className="text-center mb-3">🧾 My Tasks</h2>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p>Loading tasks...</p>
        </div>
      ) : mdata.length === 0 ? (
        <h5 className="text-center text-muted">No tasks assigned yet!</h5>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Duration (days)</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned On</th>
            </tr>
          </thead>
          <tbody>
            {mdata.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.duration}</td>
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

      {/* Confirmation Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className="confirm-modal"
      >
        <div className="modal-glow">
          <Modal.Header closeButton>
            <Modal.Title>🎉 Confirm Completion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="modal-text">
              💪 Are you sure you’ve completed the task <br />
              <strong>“{selectedTask?.title}”</strong>?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={() =>
                handleStatusChange(selectedTask._id, selectedTask.taskStatus)
              }
            >
              ✅ Yes, Complete it!
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              ❌ Cancel
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
};

export default MyTask;
