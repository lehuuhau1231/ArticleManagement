import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const MyArticles = () => {
  return (
    <Container className='mt-4'>
      <Row>
        <Col>
          <h1 className='text-center mb-4'>📝 Bài viết của bạn</h1>
          <Card className='shadow-sm'>
            <Card.Body>
              <Card.Title>Quản lý bài viết</Card.Title>
              <Card.Text>
                Trang này sẽ hiển thị tất cả bài viết mà bạn đã tạo.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MyArticles;
