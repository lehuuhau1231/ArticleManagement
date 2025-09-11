import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { UserContext } from "../context/MyContext";
import { authApis, endpoints } from "../../configs/Apis";
import cookies from "react-cookies";

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [user] = useContext(UserContext);

  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
  ];

  const { quill, quillRef } = useQuill({
    modules,
    formats,
    placeholder: "Nhập nội dung bài viết...",
  });

  useEffect(() => {
    const loadPost = async () => {
      if (!user) {
        setError("Bạn cần đăng nhập để chỉnh sửa bài viết");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = cookies.load("token");

        const response = await authApis(token).get(
          `${endpoints.post}/${postId}`
        );
        const postData = response.data;

        if (postData.userId !== user.id) {
          setError("Bạn không có quyền chỉnh sửa bài viết này");
          setLoading(false);
          return;
        }

        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
      } catch (error) {
        console.error("Error loading post:", error);
        if (error.response?.status === 404) {
          setError("Bài viết không tồn tại");
        } else if (error.response?.status === 403) {
          setError("Bạn không có quyền truy cập bài viết này");
        } else {
          setError("Không thể tải bài viết. Vui lòng thử lại!");
        }
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      loadPost();
    }
  }, [postId, user]);

  useEffect(() => {
    if (quill && content) {
      quill.clipboard.dangerouslyPasteHTML(content);
    }
  }, [quill, content]);

  const getQuillContent = () => {
    if (quill) {
      return quill.root.innerHTML;
    }
    return content;
  };

  const hasQuillContent = () => {
    if (quill) {
      const content = quill.root.innerHTML;
      return content.trim() && content.trim() !== "<p><br></p>";
    }
    return content.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề bài viết");
      return;
    }

    const currentContent = getQuillContent();
    if (!currentContent.trim() || currentContent.trim() === "<p><br></p>") {
      setError("Vui lòng nhập nội dung bài viết");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const token = cookies.load("token");

      const updateData = {
        id: postId,
        title: title.trim(),
        content: currentContent.trim(),
      };

      await authApis(token).patch(`${endpoints.post}`, updateData);

      setShowConfirmModal(true);
    } catch (error) {
      console.error("Error updating post:", error);
      if (error.response?.status === 403) {
        setError("Bạn không có quyền chỉnh sửa bài viết này");
      } else if (error.response?.status === 404) {
        setError("Bài viết không tồn tại");
      } else {
        setError("Không thể cập nhật bài viết. Vui lòng thử lại!");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // Handle modal close and redirect
  const handleModalClose = () => {
    setShowConfirmModal(false);
    navigate(`/post/${postId}`);
  };

  if (loading) {
    return (
      <Container className='mt-5'>
        <div className='text-center py-5'>
          <Spinner animation='border' variant='primary' size='lg' />
          <p className='mt-3 text-muted fs-5'>Đang tải bài viết...</p>
        </div>
      </Container>
    );
  }

  if (error && !post) {
    return (
      <Container className='mt-5'>
        <Row className='justify-content-center'>
          <Col lg={8}>
            <Alert variant='danger' className='text-center py-4'>
              <h4>Lỗi</h4>
              <p className='mb-3'>{error}</p>
              <Button variant='outline-primary' onClick={() => navigate("/")}>
                Quay về trang chủ
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className='mt-4'>
      <Row className='justify-content-center'>
        <Col lg={10} xl={8}>
          <div className='d-flex justify-content-between align-items-center mb-4'>
            <h2 className='text-primary fw-bold mb-0'>Chỉnh sửa bài viết</h2>
            <Button variant='outline-secondary' onClick={handleCancel}>
              ← Quay lại
            </Button>
          </div>

          {error && (
            <Alert variant='danger' className='mb-4'>
              {error}
            </Alert>
          )}

          <Card className='shadow-sm'>
            <Card.Body className='p-4'>
              <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-4'>
                  <Form.Label className='fw-semibold fs-5'>
                    Tiêu đề bài viết <span className='text-danger'>*</span>
                  </Form.Label>
                  <Form.Control
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Nhập tiêu đề bài viết...'
                    required
                    className='fs-5'
                    style={{ padding: "12px 16px" }}
                  />
                </Form.Group>

                <Form.Group className='mb-4'>
                  <Form.Label className='fw-semibold fs-5'>
                    Nội dung bài viết <span className='text-danger'>*</span>
                  </Form.Label>
                  <div className='mb-5'>
                    <div
                      ref={quillRef}
                      style={{ height: "400px", marginBottom: "50px" }}
                    />
                  </div>
                </Form.Group>

                <div className='d-flex gap-3 justify-content-end pt-3 border-top'>
                  <Button
                    variant='outline-secondary'
                    onClick={handleCancel}
                    disabled={saving}
                    className='px-4'
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type='submit'
                    variant='primary'
                    disabled={saving || !title.trim() || !hasQuillContent()}
                    className='px-4'
                  >
                    {saving ? (
                      <>
                        <Spinner
                          animation='border'
                          size='sm'
                          className='me-2'
                        />
                        Đang lưu...
                      </>
                    ) : (
                      "Lưu thay đổi"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showConfirmModal}
        onHide={handleModalClose}
        centered
        backdrop='static'
      >
        <Modal.Header closeButton>
          <Modal.Title className='text-success'>
            Cập nhật thành công
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center py-4'>
          <p className='fs-5 mb-3'>Bài viết đã được cập nhật thành công!</p>
          <p className='text-muted'>
            Bạn sẽ được chuyển đến trang chi tiết bài viết.
          </p>
        </Modal.Body>
        <Modal.Footer className='justify-content-center'>
          <Button variant='primary' onClick={handleModalClose} className='px-4'>
            Xem bài viết
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EditPost;
