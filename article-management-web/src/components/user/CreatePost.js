import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
  Image,
} from "react-bootstrap";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { UserContext } from "../context/MyContext";
import { authApis, endpoints } from "../../configs/Apis";
import cookies from "react-cookies";

const CreatePost = () => {
  const navigate = useNavigate();
  const [user] = useContext(UserContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdPostId, setCreatedPostId] = useState(null);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ color: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "color",
    "list",
    "bullet",
    "blockquote",
    "link",
  ];

  const { quill, quillRef } = useQuill({
    modules,
    formats,
    placeholder: "Viết nội dung bài viết của bạn...",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const getQuillContent = () => {
    if (quill) {
      return quill.root.innerHTML;
    }
    return "";
  };

  const hasQuillContent = () => {
    if (quill) {
      const content = quill.root.innerHTML;
      return content.trim();
    }
    return false;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Vui lòng chọn file hình ảnh hợp lệ!");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Kích thước file không được vượt quá 5MB!");
        return;
      }

      setImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview("");
    const imageInput = document.getElementById("imageInput");
    if (imageInput) {
      imageInput.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề bài viết");
      return;
    }

    if (!description.trim()) {
      setError("Vui lòng nhập mô tả bài viết");
      return;
    }

    const content = getQuillContent();
    if (!hasQuillContent()) {
      setError("Vui lòng nhập nội dung bài viết");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const token = cookies.load("token");

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("content", content.trim());

      if (image) {
        formData.append("image", image);
      }

      const response = await authApis(token).post(endpoints.post, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setCreatedPostId(response.data.id);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error creating post:", error);
      if (error.response?.status === 413) {
        setError("File quá lớn. Vui lòng chọn file nhỏ hơn!");
      } else if (error.response?.status === 400) {
        setError("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại!");
      } else {
        setError("Không thể tạo bài viết. Vui lòng thử lại!");
      }
    } finally {
      setCreating(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    if (createdPostId) {
      navigate(`/post/${createdPostId}`);
    } else {
      navigate("/");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!user) {
    return (
      <Container className='mt-5'>
        <div className='text-center py-5'>
          <Spinner animation='border' variant='primary' size='lg' />
          <p className='mt-3 text-muted fs-5'>Đang kiểm tra đăng nhập...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className='mt-4'>
      <Row className='justify-content-center'>
        <Col lg={10} xl={8}>
          <div className='d-flex justify-content-between align-items-center mb-4'>
            <h2 className='text-primary fw-bold mb-0'>Tạo bài viết mới</h2>
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

                {/* Description Field */}
                <Form.Group className='mb-4'>
                  <Form.Label className='fw-semibold fs-5'>
                    Mô tả bài viết <span className='text-danger'>*</span>
                  </Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='Nhập mô tả ngắn gọn về bài viết...'
                    required
                    style={{ resize: "vertical" }}
                  />
                </Form.Group>

                <Form.Group className='mb-4'>
                  <Form.Label className='fw-semibold fs-5'>
                    Hình ảnh minh họa
                  </Form.Label>
                  <Form.Control
                    id='imageInput'
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='mb-3'
                  />
                  <Form.Text className='text-muted'>
                    Chọn hình ảnh (JPG, PNG, GIF). Tối đa 5MB.
                  </Form.Text>

                  {imagePreview && (
                    <div className='mt-3'>
                      <div className='d-flex justify-content-between align-items-center mb-2'>
                        <span className='fw-semibold'>Xem trước:</span>
                        <Button
                          variant='outline-danger'
                          size='sm'
                          onClick={handleRemoveImage}
                        >
                          Xóa ảnh
                        </Button>
                      </div>
                      <Image
                        src={imagePreview}
                        alt='Preview'
                        fluid
                        thumbnail
                        style={{ maxHeight: "300px", objectFit: "cover" }}
                      />
                    </div>
                  )}
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

                {/* Action Buttons */}
                <div className='d-flex gap-3 justify-content-end pt-3 border-top'>
                  <Button
                    variant='outline-secondary'
                    onClick={handleCancel}
                    disabled={creating}
                    className='px-4'
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type='submit'
                    variant='primary'
                    disabled={
                      creating ||
                      !title.trim() ||
                      !description.trim() ||
                      !hasQuillContent()
                    }
                    className='px-4'
                  >
                    {creating ? (
                      <>
                        <Spinner
                          animation='border'
                          size='sm'
                          className='me-2'
                        />
                        Đang tạo...
                      </>
                    ) : (
                      "Tạo bài viết"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={handleModalClose}
        centered
        backdrop='static'
      >
        <Modal.Header closeButton>
          <Modal.Title className='text-success'>
            Tạo bài viết thành công
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center py-4'>
          <p className='fs-5 mb-3'>Bài viết đã được tạo thành công!</p>
          <p className='text-muted'>
            Bạn sẽ được chuyển đến trang xem bài viết.
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

export default CreatePost;
