import React, { useContext } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { UserContext } from "../context/MyContext";
import cookies from "react-cookies";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, dispatch] = useContext(UserContext);

  const isActive = (path) => {
    if (path === "/") {
      return (
        location.pathname === "/" || location.pathname.startsWith("/post/")
      );
    }
    if (path === "/my-articles") {
      return location.pathname.startsWith("/my-articles");
    }
    if (path === "/create-post") {
      return location.pathname.startsWith("/create-post");
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    cookies.remove("token");
    dispatch({ type: "logout" });
    navigate("/");
  };

  return (
    <Navbar bg='primary' variant='dark' expand='lg' className='shadow-sm'>
      <Container>
        <Navbar.Brand
          as={Link}
          to='/'
          className='fw-bold fs-4 text-decoration-none'
        >
          Article Management
        </Navbar.Brand>

        <Navbar.Toggle aria-controls='basic-navbar-nav' />

        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='ms-auto'>
            <Nav.Link
              as={Link}
              to='/'
              className={`fw-semibold ${
                isActive("/")
                  ? "active text-warning bg-dark rounded px-3 py-2"
                  : "text-white px-3 py-2"
              }`}
            >
              Trang chủ
            </Nav.Link>

            {user && (
              <>
                <Nav.Link
                  as={Link}
                  to='/my-articles'
                  className={`fw-semibold ${
                    isActive("/my-articles")
                      ? "active text-warning bg-dark rounded px-3 py-2"
                      : "text-white px-3 py-2"
                  }`}
                >
                  Bài viết của bạn
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to='/create-post'
                  className={`fw-semibold ${
                    isActive("/create-post")
                      ? "active text-warning bg-dark rounded px-3 py-2"
                      : "text-white px-3 py-2"
                  }`}
                >
                  Tạo bài viết
                </Nav.Link>
              </>
            )}

            {user ? (
              <NavDropdown
                title={`Xin chào, ${user.fullName || user.email}`}
                id='user-dropdown'
                className='fw-semibold'
              >
                <NavDropdown.Item onClick={handleLogout}>
                  Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to='/login'
                  className={`fw-semibold ${
                    isActive("/login")
                      ? "active text-warning bg-dark rounded px-3 py-2"
                      : "text-white px-3 py-2"
                  }`}
                >
                  Đăng nhập
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to='/register'
                  className={`fw-semibold ${
                    isActive("/register")
                      ? "active text-warning bg-dark rounded px-3 py-2"
                      : "text-white px-3 py-2"
                  }`}
                >
                  Đăng ký
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
