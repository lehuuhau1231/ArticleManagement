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
} from "react-bootstrap";
import { format, set } from "date-fns";
import Apis, { endpoints } from "../configs/Apis";
import "./styles/Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const loadPosts = async () => {
    setError("");
    try {
      let url = `${endpoints.post}?page=${page}`;

      if (keyword.trim()) {
        url += `&kw=${keyword.trim()}`;
      }

      console.log(url);

      const response = await Apis.get(url);
      const { content, totalElements, totalPages } = response.data;
      if (page <= 1) setPosts([]);

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
    console.log("voo");
    if (page !== 1) setPage(1);
    else loadPosts();
  };

  const handleDetail = (postId) => {
    console.log("postId", postId);
    navigate(`/post/${postId}`);
  };

  return (
    <Container className='mt-4'>
      <Row>
        <Col>
          <div className='text-center mb-5'>
            <h1 className='fw-bold text-primary mb-3'>Danh sách bài viết</h1>
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
                            src={`${post.image}`}
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
                            <div className='d-flex justify-content-between align-items-center mb-3'>
                              <div className='d-flex align-items-center'>
                                <small className='text-muted fw-semibold'>
                                  {post.fullName}
                                </small>
                              </div>
                              <div className='d-flex align-items-center'>
                                <small className='text-muted'>
                                  {formatDate(post.updatedAt)}
                                </small>
                              </div>
                            </div>

                            <div className='d-flex gap-2'>
                              <Button
                                variant='primary'
                                size='sm'
                                className='px-4'
                                onClick={() => handleDetail(post.id)}
                              >
                                Đọc thêm
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
    </Container>
  );
};

export default Home;
