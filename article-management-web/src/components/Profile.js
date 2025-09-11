import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const Profile = () => {
  return (
    <Container className='mt-4'>
      <Row>
        <Col>
          <h1 className='text-center mb-4'>👤 Hồ sơ cá nhân</h1>
          <Card className='shadow-sm'>
            <Card.Body>
              <Card.Title>Thông tin tài khoản</Card.Title>
              <Card.Text>
                Trang này sẽ hiển thị và cho phép chỉnh sửa thông tin cá nhân.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
