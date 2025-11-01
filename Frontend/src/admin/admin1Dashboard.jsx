import { Link, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "./Dashboard1.css"; // 👈 Add this CSS file if needed

const Dashboard1 = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  const auth = () => {
    if (!token) {
      toast.error("🚫 Please login first!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        pauseOnHover: true,
        theme: "colored",
      });
      setTimeout(() => {
        navigate("/adminlogin");
      }, 2500);
    }
  };

  useEffect(() => {
    auth();
  }, []);

  const handleLogout = () => {
    toast.info("👋 Logged out successfully!", {
      position: "top-right",
      autoClose: 1500,
      theme: "light",
    });
    setTimeout(() => {
      localStorage.clear();
      navigate("/adminlogin");
    }, 2000);
  };

  return (
    <div className="dashboard">
      <ToastContainer />

      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <h2 className="sidebar-title">⚙️ Admin Panel</h2>
        <ul className="sidebar-links">
          <li><Link to="adduser">➕ Add User</Link></li>
          <li><Link to="userDetails">📋 User Details</Link></li>
          <li><Link to="taskdetails">🧩 Task Details</Link></li>
          <li><Link to="edituser">🛠️ Edit User</Link></li>
          <li><Link to="edittask">✏️ Edit Task</Link></li>
        </ul>
      </aside>

      {/* Content Area */}
      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome, {name || "Admin"}</h1>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>

        <div className="dashboard-outlet">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard1;
