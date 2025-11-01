import { Link, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../userDash.css";

const UserDash = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("username");

  const auth = () => {
    if (!name) {
      alert("Please login first");
      navigate("/userlogin");
    }
  };

  useEffect(() => {
    auth();
  }, []);

  return (
    <>
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2 className="sidebar-title">User Dashboard</h2>
          <nav>
            <ul className="nav-links">
              <li>
                <Link to="mytask" className="nav-link">
                  🗂️ My Tasks
                </Link>
              </li>
              <li>
                <Link to="/" className="nav-link">
                  🔙 Logout
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <header className="dashboard-header">
            <h1>Welcome, {name ? name : "User"} 👋</h1>
            <p>Manage your daily tasks efficiently and stay organized.</p>
          </header>

          <section className="dashboard-body">
            <Outlet />
          </section>
        </main>
      </div>
    </>
  );
};

export default UserDash;
