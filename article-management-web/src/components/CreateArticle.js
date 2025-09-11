import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const CreateArticle = () => {
  return (
    <Container className='mt-4'>
      <Row>
        <Col>
          <h1 className='text-center mb-4'>➕ Tạo bài viết mới</h1>
          <Card className='shadow-sm'>
            <Card.Body>
              <Card.Title>Viết bài viết</Card.Title>
              <Card.Text>Trang này sẽ chứa form để tạo bài viết mới.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateArticle;
