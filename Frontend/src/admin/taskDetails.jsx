import { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import BackendURL from "../config/BackendUrl";
import Spinner from "react-bootstrap/Spinner";
import Pagination from "react-bootstrap/Pagination";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskDetails = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const tasksPerPage = 4;

  // 🟢 Load Tasks
  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BackendURL}admin/alltasks`);
      setTasks(res.data.tasks || []);
    } catch (error) {
      toast.error("❌ Error fetching tasks!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // 🟡 Update Task Status
  const updateStatus = async (taskId, newStatus) => {
    try {
      setUpdatingId(taskId);
      await axios.put(`${BackendURL}admin/updatestatus/${taskId}`, {
        taskStatus: newStatus,
      });
      toast.success("✅ Task status updated!");
      loadTasks();
    } catch (error) {
      toast.error("❌ Failed to update status!");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  // 🟠 Confirm Delete (Open Modal)
  const confirmDeleteTask = (taskId) => {
    setSelectedTaskId(taskId);
    setShowConfirmModal(true);
  };

  // 🔴 Delete Task (After Confirmation)
  const deleteTask = async () => {
    if (!selectedTaskId) return;
    try {
      setDeletingId(selectedTaskId);
      await axios.delete(`${BackendURL}admin/deletetask/${selectedTaskId}`);
      setTasks(tasks.filter((task) => task._id !== selectedTaskId));
      toast.success("🗑 Task deleted successfully!");
    } catch (error) {
      toast.error("❌ Error deleting task!");
      console.error(error);
    } finally {
      setDeletingId(null);
      setShowConfirmModal(false);
      setSelectedTaskId(null);
    }
  };

  // 🟢 Pagination Logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 🟢 Status Button
  const getStatusButton = (task) => {
    const { taskStatus, _id } = task;
    const isUpdating = updatingId === _id;

    if (taskStatus === "Pending") {
      return (
        <Button variant="secondary" size="sm" disabled>
          Pending 🕓
        </Button>
      );
    } else if (taskStatus === "In Progress") {
      return (
        <Button
          variant="info"
          size="sm"
          disabled={isUpdating}
          onClick={() => updateStatus(_id, "Completed")}
        >
          {isUpdating ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Updating...
            </>
          ) : (
            "In Progress 🔵"
          )}
        </Button>
      );
    } else {
      return (
        <Button variant="success" size="sm" disabled>
          Completed ✅
        </Button>
      );
    }
  };

  // 🟢 Priority Display
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return <span className="text-danger fw-bold">High 🔴</span>;
      case "Medium":
        return <span className="text-warning fw-bold">Medium 🟠</span>;
      default:
        return <span className="text-success fw-bold">Low 🟢</span>;
    }
  };

  return (
    <div className="task-container p-4">
      <ToastContainer position="top-right" autoClose={2500} />
      <h2 className="text-center mb-4 text-primary fw-bold">
        📋 All Task Details
      </h2>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-2">Loading tasks...</p>
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive className="shadow-sm rounded">
            <thead className="table-dark">
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
              {currentTasks.length > 0 ? (
                currentTasks.map((task, index) => (
                  <tr key={task._id}>
                    <td>{indexOfFirstTask + index + 1}</td>
                    <td>{task.userId?.name || "—"}</td>
                    <td>{task.userId?.email || "—"}</td>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{task.duration} days</td>
                    <td>{getPriorityColor(task.priority)}</td>
                    <td>{getStatusButton(task)}</td>
                    <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => confirmDeleteTask(task._id)}
                        disabled={deletingId === task._id}
                      >
                        {deletingId === task._id ? (
                          <>
                            <Spinner animation="border" size="sm" /> Deleting...
                          </>
                        ) : (
                          "🗑 Delete"
                        )}
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

          {/* 🟢 Pagination Section */}
          <div className="d-flex justify-content-center mt-3">
            <Pagination>
              <Pagination.First
                onClick={() => paginate(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => paginate(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </>
      )}

      {/* 🔴 Confirm Delete Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-danger fw-semibold">
            ⚠️ Are you sure you want to delete this task? This action cannot be undone!
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={deleteTask}
            disabled={deletingId === selectedTaskId}
          >
            {deletingId === selectedTaskId ? (
              <>
                <Spinner animation="border" size="sm" /> Deleting...
              </>
            ) : (
              "Yes, Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TaskDetails;
