import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  ProgressBar,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Apis, { endpoints } from "../../configs/Apis";
import "../styles/Auth.css";

const Register = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validated, setValidated] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
    setError("");
    setSuccess("");

    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;

    // Kiểm tra độ dài ít nhất 8 ký tự
    if (password.length >= 8) strength += 20;

    // Kiểm tra có chữ thường
    if (/[a-z]/.test(password)) strength += 20;

    // Kiểm tra có chữ hoa
    if (/[A-Z]/.test(password)) strength += 20;

    // Kiểm tra có số
    if (/[0-9]/.test(password)) strength += 20;

    // Kiểm tra có ký tự đặc biệt
    if (/[@#$%^&+=!]/.test(password)) strength += 20;

    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return "danger";
    if (passwordStrength < 60) return "warning";
    if (passwordStrength < 80) return "info";
    if (passwordStrength < 100) return "warning";
    return "success";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return "Rất yếu";
    if (passwordStrength < 60) return "Yếu";
    if (passwordStrength < 80) return "Trung bình";
    if (passwordStrength < 100) return "Khá mạnh";
    return "Mạnh";
  };

  const isPasswordStrong = () => {
    return passwordStrength === 100;
  };

  const validateForm = () => {
    if (!user.fullName.trim()) {
      setError("Vui lòng nhập họ tên");
      return false;
    }

    if (!validateEmail(user.email)) {
      setError("Vui lòng nhập email hợp lệ");
      return false;
    }

    if (!isPasswordStrong()) {
      setError(
        "Mật khẩu phải mạnh (ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt)"
      );
      return false;
    }

    if (user.password !== user.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setValidated(true);

    if (!validateForm()) {
      setValidated(true);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await Apis.post(endpoints.user, {
        email: user.email,
        password: user.password,
        fullName: user.fullName,
      });

      setSuccess("Đăng ký thành công! Vui lòng đăng nhập.");

      // Clear form
      setUser({
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
      });
      setPasswordStrength(0);
      setValidated(false);

      navigate("/login?registered=true");
    } catch (error) {
      if (error.response) {
        if (error.response.data.code === 1001)
          setError("Email đã được sử dụng. Vui lòng chọn email khác");
        else setError("Đăng ký thất bại");
      } else {
        setError("Lỗi kết nối. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className='auth-container'>
      <Row className='justify-content-center'>
        <Col md={7} lg={6}>
          <Card className='shadow auth-card'>
            <Card.Body>
              <div className='text-center mb-4'>
                <h2 className='fw-bold text-primary'>Đăng ký</h2>
                <p className='text-muted'>Tạo tài khoản mới để bắt đầu!</p>
              </div>

              {error && (
                <Alert variant='danger' className='mb-3'>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant='success' className='mb-3'>
                  {success}
                </Alert>
              )}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className='mb-3'>
                  <Form.Label className='fw-semibold'>Họ và tên</Form.Label>
                  <Form.Control
                    type='text'
                    name='fullName'
                    value={user.fullName}
                    onChange={handleChange}
                    placeholder='Nhập họ và tên'
                    required
                    isInvalid={validated && !user.fullName.trim()}
                  />
                  <Form.Control.Feedback type='invalid'>
                    Vui lòng nhập họ và tên
                  </Form.Control.Feedback>
                </Form.Group>

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

                <Form.Group className='mb-3'>
                  <Form.Label className='fw-semibold'>Mật khẩu</Form.Label>
                  <Form.Control
                    type='password'
                    name='password'
                    value={user.password}
                    onChange={handleChange}
                    placeholder='Nhập mật khẩu'
                    required
                    isInvalid={
                      validated && (!user.password || !isPasswordStrong())
                    }
                  />

                  {user.password && (
                    <div className='mt-2'>
                      <ProgressBar
                        variant={getPasswordStrengthColor()}
                        now={passwordStrength}
                        className='mb-1'
                        style={{ height: "8px" }}
                      />
                      <small className={`text-${getPasswordStrengthColor()}`}>
                        Độ mạnh mật khẩu: {getPasswordStrengthText()}
                      </small>
                    </div>
                  )}

                  <Form.Control.Feedback type='invalid'>
                    Mật khẩu phải mạnh (ít nhất 8 ký tự, có chữ hoa, chữ thường,
                    số và ký tự đặc biệt)
                  </Form.Control.Feedback>

                  <Form.Text className='text-muted'>
                    Mật khẩu phải có đủ tất cả: ít nhất 8 ký tự, chữ hoa, chữ
                    thường, số và ký tự đặc biệt
                  </Form.Text>
                </Form.Group>

                <Form.Group className='mb-4'>
                  <Form.Label className='fw-semibold'>
                    Xác nhận mật khẩu
                  </Form.Label>
                  <Form.Control
                    type='password'
                    name='confirmPassword'
                    value={user.confirmPassword}
                    onChange={handleChange}
                    placeholder='Nhập lại mật khẩu'
                    required
                    isInvalid={
                      validated && user.password !== user.confirmPassword
                    }
                  />
                  <Form.Control.Feedback type='invalid'>
                    Mật khẩu xác nhận không khớp
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
                      Đang đăng ký...
                    </>
                  ) : (
                    "Đăng ký"
                  )}
                </Button>
              </Form>

              <div className='text-center mt-4'>
                <p className='mb-0'>
                  Đã có tài khoản?{" "}
                  <Link
                    to='/login'
                    className='text-primary fw-semibold text-decoration-none'
                  >
                    Đăng nhập ngay
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

export default Register;
