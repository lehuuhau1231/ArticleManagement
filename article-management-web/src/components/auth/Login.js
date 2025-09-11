import React, { useState, useContext, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../context/MyContext";
import Apis, { endpoints } from "../../configs/Apis";
import cookies from "react-cookies";
import "../styles/Auth.css";
import AlertSuccess from "../layout/AlertSuccess";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);
  const [q] = useSearchParams();
  const [showAlert, setShowAlert] = useState(false);

  const [, dispatch] = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  useEffect(() => {
    if (q.get("registered")) {
      setShowAlert(true);
    }

    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setValidated(true);

    if (!validateEmail(user.email)) {
      setError("Vui lòng nhập email hợp lệ");
      setValidated(true);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await Apis.post(endpoints.login, {
        email: user.email,
        password: user.password,
      });
      if (response && response.data) {
        cookies.save("token", response.data.result.token);

        dispatch({ type: "login", payload: response.data.result });

        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data) {
        if (error.response.data.code === 1002) {
          setError("Tài khoản email không tồn tại");
        } else if (error.response.data.code === 1005) {
          setError("Sai mật khẩu. Vui lòng thử lại!");
        } else {
          setError("Đăng nhập thất bại. Vui lòng thử lại.");
        }
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className='auth-container'>
      {showAlert && (
        <AlertSuccess message='Đăng ký thành công! Vui lòng đăng nhập.' />
      )}
      <Row className='justify-content-center'>
        <Col md={6} lg={5}>
          <Card className='shadow auth-card'>
            <Card.Body>
              <div className='text-center mb-4'>
                <h2 className='fw-bold text-primary'>Đăng nhập</h2>
                <p className='text-muted'>Chào mừng bạn trở lại!</p>
              </div>

              {error && (
                <Alert variant='danger' className='mb-3'>
                  {error}
                </Alert>
              )}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className='mb-3'>
                  <Form.Label className='fw-semibold'>Email</Form.Label>
                  <Form.Control
                    type='email'
                    name='email'
                    value={user.email}
                    onChange={handleChange}
                    placeholder='Nhập email của bạn'
                    required
                    isInvalid={
                      validated && (!user.email || !validateEmail(user.email))
                    }
                  />
                  <Form.Control.Feedback type='invalid'>
                    Vui lòng nhập email hợp lệ
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className='mb-4'>
                  <Form.Label className='fw-semibold'>Mật khẩu</Form.Label>
                  <Form.Control
                    type='password'
                    name='password'
                    value={user.password}
                    onChange={handleChange}
                    placeholder='Nhập mật khẩu'
                    required
                    minLength={8}
                    isInvalid={validated && user.password.length < 8}
                  />
                  <Form.Control.Feedback type='invalid'>
                    Mật khẩu phải có ít nhất 8 ký tự
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant='primary'
                  type='submit'
                  className='w-100 fw-semibold py-2'
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as='span'
                        animation='border'
                        size='sm'
                        role='status'
                        className='me-2'
                      />
                      Đang đăng nhập...
                    </>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>
              </Form>

              <div className='text-center mt-4'>
                <p className='mb-0'>
                  Chưa có tài khoản?{" "}
                  <Link
                    to='/register'
                    className='text-primary fw-semibold text-decoration-none'
                  >
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
