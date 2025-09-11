-- Xóa bảng nếu tồn tại
DROP TABLE IF EXISTS post;
DROP TABLE IF EXISTS user;

-- Bảng users
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role ENUM('USER', 'ADMIN') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO user VALUES
(1, "lehuuhau1231@gmail.com", "$2a$10$Hc4cPB7rv4mJiBHi0YHwu.9v1ycSDBsOIdB9CSjvdZDvKMle3MA6O", 'Lê Hữu Hậu', 'USER', NOW());

-- Bảng posts
CREATE TABLE post (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description VARCHAR(255),
    content LONGTEXT,
    image VARCHAR(255),
    user_id INT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

INSERT INTO post VALUES 
(1, 'Spring Boot Basics', 'pring là một Java framework siêu to và khổng lồ, làm được đủ mọi thứ.', 'Giới thiệu về Spring Boot và cách tạo ứng dụng REST API đầu tiên.', 'https://i0.wp.com/e4developer.com/wp-content/uploads/2018/01/spring-boot.png?resize=600%2C315&ssl=1', 1, NOW(), NOW()),
(2, 'React Hooks Guide', 'React là thư viện JavaScript được xây dựng bởi Facebook, với mục tiêu dùng công nghệ để tạo ra giao diện người dùng dễ dàng hơn', 'Bài viết giải thích chi tiết về React Hooks như useState, useEffect.', 'https://techvccloud.mediacdn.vn/280518386289090560/2024/9/17/reactjs-1726545361892465400796-6-0-465-817-crop-17265453645351178455990.jpg', 1, NOW(), NOW()),
(3, 'JWT Authentication', 'JSON Web Mã (JWT) là một chuẩn mở (RFC 7519) định nghĩa một cách nhỏ gọn và khép kín để truyền một cách an toàn thông tin giữa các bên dưới dạng đối tượng JSON', 'Hướng dẫn cách triển khai JWT Authentication trong ứng dụng web.', 'https://techvccloud.mediacdn.vn/280518386289090560/2024/9/17/reactjs-1726545361892465400796-6-0-465-817-crop-17265453645351178455990.jpg', 1, NOW(), NOW()),
(4, 'Database Optimization', 'Mô tả', 'Một số kỹ thuật tối ưu truy vấn trong MySQL và PostgreSQL.', 'https://images.viblo.asia/9fa318d9-3f3e-4e3d-be3f-1846199e4955.jpg', 1, NOW(), NOW()),
(5, 'Microservices Architecture', 'Mô tả', 'Tìm hiểu kiến trúc microservices và khi nào nên áp dụng.', 'https://topdev.vn/blog/wp-content/uploads/2017/10/microservices1.png', 1, NOW(), NOW()),
(6, 'Redis', 'Mô tả', 'Tìm hiểu kiến trúc microservices và khi nào nên áp dụng.', 'https://topdev.vn/blog/wp-content/uploads/2019/05/Redis-1.png', 1, NOW(), NOW()),
(7, 'PostgreSQL', 'PostgreSQL là một hệ thống quản trị cơ sở dữ liệu quan hệ và đối tượng ', 'Tìm hiểu kiến trúc microservices và khi nào nên áp dụng.', 'https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg', 1, NOW(), NOW());
