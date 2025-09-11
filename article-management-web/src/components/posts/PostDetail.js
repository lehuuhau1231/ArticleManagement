import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
  Image,
} from "react-bootstrap";
import { format } from "date-fns";
import Apis, { endpoints } from "../../configs/Apis";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load post detail from API
  const loadPostDetail = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await Apis.get(`${endpoints.post}/${postId}`);
      setPost(response.data);
    } catch (error) {
      console.error("Error loading post detail:", error);
      if (error.response && error.response.data) {
        if (error.response.data.code === 1009)
          setError("Bài viết không tồn tại hoặc đã bị xóa.");
      } else {
        setError("Không thể tải chi tiết bài viết. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      loadPostDetail();
    }
  }, [postId]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy 'lúc' HH:mm");
  };

  const handleBack = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <Container className='mt-5'>
        <div className='text-center py-5'>
          <Spinner animation='border' variant='primary' size='lg' />
          <p className='mt-3 text-muted fs-5'>Đang tải chi tiết bài viết...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className='mt-5'>
        <Row className='justify-content-center'>
          <Col lg={8}>
            <Alert variant='danger' className='text-center py-4'>
              <h4>Lỗi</h4>
              <p className='mb-3'>{error}</p>
              <Button variant='outline-primary' onClick={handleBack}>
                🏠 Quay về trang chủ
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container className='mt-5'>
        <Row className='justify-content-center'>
          <Col lg={8}>
            <Alert variant='warning' className='text-center py-4'>
              <h4>Không tìm thấy bài viết</h4>
              <p className='mb-3'>Bài viết bạn đang tìm không tồn tại.</p>
              <Button variant='outline-primary' onClick={handleBack}>
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
          {/* Back button */}
          <div className='mb-4'>
            <Button
              variant='outline-secondary'
              onClick={handleBack}
              className='d-flex align-items-center'
            >
              ← Quay lại danh sách
            </Button>
          </div>

          {/* Post content */}
          <Card className='shadow-sm'>
            <Card.Body>
              {/* Post image */}
              {post.image && (
                <div className='mb-4'>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fluid
                    style={{
                      maxHeight: "400px",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}

              <h1 className='text-primary fw-bold mb-3'>{post.title}</h1>

              {post.description && (
                <div className='mb-4 p-3 bg-light border-start border-primary border-4'>
                  <p className='text-muted fs-5 fst-italic mb-0'>
                    Mô tả: {post.description}
                  </p>
                </div>
              )}

              <div className='mb-4 pb-3 border-bottom'>
                <Row className='align-items-center'>
                  <Col md={6}>
                    <div className='d-flex align-items-center'>
                      <span className='text-muted me-2'>👤 Tác giả:</span>
                      <Badge bg='primary'>{post.fullName}</Badge>
                    </div>
                  </Col>
                  <Col md={6} className='text-md-end mt-2 mt-md-0'>
                    <div className='d-flex align-items-center justify-content-md-end'>
                      <span className='text-muted me-2'>🕒 Cập nhật:</span>
                      <span className='fw-semibold text-secondary'>
                        {formatDate(post.updatedAt)}
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>

              <div className='mb-4'>
                <div
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  style={{ lineHeight: "1.8", fontSize: "1.1rem" }}
                />
              </div>

              <div className='mt-4 pt-3 border-top bg-light p-3'>
                <Row>
                  <Col md={6}></Col>
                  <Col md={6} className='text-md-end mt-2 mt-md-0'>
                    <Button variant='primary' onClick={handleBack}>
                      Xem thêm bài viết
                    </Button>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PostDetail;
