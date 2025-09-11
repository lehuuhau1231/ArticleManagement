import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
  Form,
  InputGroup,
  Modal,
} from "react-bootstrap";
import { format } from "date-fns";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import cookies, { load } from "react-cookies";

const MyPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const loadPosts = async () => {
    setError("");
    try {
      let url = `${endpoints.post_title}?page=${page}`;

      if (keyword.trim()) {
        url += `&title=${keyword.trim()}`;
      }

      console.log("url: ", url);
      const token = cookies.load("token");

      const response = await authApis(token).get(url);
      const { content, totalElements, totalPages } = response.data;
      if (page <= 1) setPosts([]);
      console.log("response: ", response.data);
      setPosts((prevPosts) => [...prevPosts, ...content]);

      setTotalElements(totalElements);
      setPage(page);
      setHasMore(page < totalPages);
    } catch (error) {
      console.error("Error loading posts:", error);
      setError("Không thể tải danh sách bài viết. Vui lòng thử lại!");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [page]);

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setPage((prevPage) => prevPage + 1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy HH:mm");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (page !== 1) setPage(1);
    else loadPosts();
  };

  const handleDetail = (postId) => {
    navigate(`/my-articles/${postId}`);
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;

    try {
      setDeleting(true);
      setError("");

      const token = cookies.load("token");
      await authApis(token).delete(`${endpoints.post}/${postToDelete.id}`);

      loadPosts();

      setShowDeleteModal(false);
      setPostToDelete(null);
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("Không thể xóa bài viết. Vui lòng thử lại!");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  return (
    <Container className='mt-4'>
      <Row>
        <Col>
          <div className='text-center mb-5'>
            <h1 className='fw-bold text-primary mb-3'>
              Danh sách bài viết của bạn
            </h1>
            <Badge bg='info' className='fs-6'>
              Tổng cộng: {totalElements} bài viết
            </Badge>
          </div>

          {/* Search Form */}
          <Row className='mb-4'>
            <Col lg={8} className='mx-auto'>
              <Form onSubmit={handleSearch}>
                <InputGroup size='lg'>
                  <Form.Control
                    type='text'
                    placeholder='Tìm kiếm bài viết theo tiêu đề hoặc nội dung...'
                    value={keyword}
                    onChange={handleKeywordChange}
                    className='border-end-0'
                  />
                  <Button
                    variant='primary'
                    type='submit'
                    disabled={loading}
                    className='px-4'
                  >
                    Tìm kiếm
                  </Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>

          {error && (
            <Alert variant='danger' className='mb-4'>
              {error}
            </Alert>
          )}

          {loading && posts.length === 0 ? (
            <div className='text-center py-5'>
              <Spinner animation='border' variant='primary' />
              <p className='mt-3 text-muted'>Đang tải bài viết...</p>
            </div>
          ) : (
            <>
              <div className='posts-list'>
                {posts.map((post) => (
                  <Card className='mb-4 shadow-sm hover-card' key={post.id}>
                    <Row className='g-0'>
                      <Col md={4}>
                        <div className='post-image-container'>
                          <Card.Img
                            src={post.image}
                            className='post-image'
                            style={{
                              height: "200px",
                              objectFit: "cover",
                              borderRadius: "0.375rem 0 0 0.375rem",
                            }}
                          />
                        </div>
                      </Col>
                      <Col md={8}>
                        <Card.Body className='h-100 d-flex flex-column'>
                          <div className='mb-3'>
                            <Card.Title className='text-primary fw-bold mb-2 fs-4'>
                              {post.title}
                            </Card.Title>
                            <Card.Text
                              className='text-muted mb-3'
                              style={{ fontSize: "1.1rem", lineHeight: "1.6" }}
                            >
                              {post.description}
                            </Card.Text>
                          </div>

                          <div className='mt-auto'>
                            <div className='d-flex align-items-center'>
                              <small className='text-muted'>
                                {formatDate(post.updatedAt)}
                              </small>
                            </div>

                            <div className='d-flex gap-2'>
                              <Button
                                variant='primary'
                                size='sm'
                                className='px-4'
                                onClick={() => handleDetail(post.id)}
                              >
                                Chỉnh sửa
                              </Button>
                              <Button
                                variant='danger'
                                size='sm'
                                className='px-4'
                                onClick={() => handleDeleteClick(post)}
                              >
                                Xóa
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className='text-center mt-4 mb-5'>
                  <Button
                    variant='primary'
                    size='lg'
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className='px-5'
                  >
                    {loadingMore ? (
                      <>
                        <Spinner
                          as='span'
                          animation='border'
                          size='sm'
                          role='status'
                          className='me-2'
                        />
                        Đang tải...
                      </>
                    ) : (
                      "Xem thêm bài viết"
                    )}
                  </Button>
                </div>
              )}

              {!hasMore && posts.length > 0 && (
                <div className='text-center mt-4 mb-5'>
                  <p className='text-muted'>Bạn đã xem hết tất cả bài viết!</p>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={handleCancelDelete}
        centered
        backdrop='static'
      >
        <Modal.Header closeButton>
          <Modal.Title className='text-danger'>
            Xác nhận xóa bài viết
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='py-4'>
          <p className='fs-5 mb-3'>
            Bạn có chắc chắn muốn xóa bài viết này không?
          </p>
          {postToDelete && (
            <div className='bg-light p-3 rounded mb-3'>
              <h6 className='text-primary fw-bold mb-1'>
                {postToDelete.title}
              </h6>
              <small className='text-muted'>
                {formatDate(postToDelete.updatedAt)}
              </small>
            </div>
          )}
          <p className='text-danger mb-0'>
            <strong>Lưu ý:</strong> Hành động này không thể hoàn tác!
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='outline-secondary'
            onClick={handleCancelDelete}
            disabled={deleting}
          >
            Hủy bỏ
          </Button>
          <Button
            variant='danger'
            onClick={handleConfirmDelete}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Spinner animation='border' size='sm' className='me-2' />
                Đang xóa...
              </>
            ) : (
              "Xóa bài viết"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyPost;
