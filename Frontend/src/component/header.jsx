import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, Outlet } from "react-router-dom";
// import "./Header.css";

const Header = () => {
  return (
    <>
      <Navbar expand="lg" className="custom-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand-logo">
            🌟 TaskMaster
          </Navbar.Brand>
          <Nav className="ms-auto">
        
            <Nav.Link to="adminlogin" as={Link} className="nav-link-custom">
              Admin Login
            </Nav.Link>
          
            <Nav.Link to="userLogin" as={Link} className="nav-link-custom">
              User Login
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <div className="main-content">
        <Outlet />
      </div>

      <footer className="simple-footer">
        <p>
          © {new Date().getFullYear()} <span>www.Footer.com</span> | All Rights
          Reserved 🚀
        </p>
      </footer>
    </>
  );
};

export default Header;
