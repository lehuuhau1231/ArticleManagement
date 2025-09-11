# Article Management System

Hệ thống quản lý bài viết với Spring Boot backend và React frontend.

## Mô tả dự án

:

- Đăng ký và đăng nhập tài khoản
- Tạo, đọc, cập nhật và xóa bài viết
- Xem danh sách bài viết của tất cả người dùng

## Tài khoản được tạo sẵn để test trên hệ thông

email: lehuuhau1231@gmail.com  
password: Lehuuhau1231@

### Backend

- **Java 21**

### Frontend

- **React 19.1.1**
- **React Router Dom**
- **Bootstrap 5.3.8**
- **Axios** (HTTP Client)
- **Quill** (Rich Text Editor)

## Yêu cầu hệ thống

- **Java 21** hoặc cao hơn
- **Node.js 16** hoặc cao hơn
- **MySQL 8.0** hoặc cao hơn
- **Maven 3.6** hoặc cao hơn

## Hướng dẫn cài đặt

### 1. Thiết lập Database

#### Bước 1: Cài đặt MySQL

- Tải và cài đặt MySQL từ [https://dev.mysql.com/downloads/](https://dev.mysql.com/downloads/)
- Khởi động MySQL service

#### Bước 2: Cấu hình database

Mở file `src/main/resources/application.yaml` và cập nhật thông tin database cho phù hợp với MySQL trên máy của Anh/ Chị:

```yaml
spring:
  datasource:
    url: "jdbc:mysql://localhost:3306/articledb"
    username: root # Thay đổi theo username MySQL của Anh/ Chị
    password: 123456 # Thay đổi theo password MySQL của Anh/ Chị
```

**Các thông số cần cấu hình:**

- **url**: Giữ nguyên `jdbc:mysql://localhost:3306/articledb` (articledb là tên database đã tạo ở bước trước)
- **username**: Thay bằng username MySQL của Anh/ Chị (thường là `root`)
- **password**: Thay bằng password MySQL của Anh/ Chị

#### Bước 3: Tạo database articledb và khởi tạo dữ liệu

- Bước 1: vào mySQL -> vào Server -> chọn Data Import
  ![alt text](image.png)
- Bước 2: chọn Import from Self-Contained File -> chọn vào file data.sql ở thư mực ArticleManagement -> tạo schema articledb -> start import
  ![alt text](image-1.png)

### 2. Thiết lập Backend (Spring Boot)

#### Bước 1: Di chuyển vào thư mục backend

```cmd
cd article
```

#### Bước 3: Chạy ứng dụng

# Chạy ứng dụng

mvn spring-boot:run

````

Backend sẽ chạy tại: `http://localhost:8080/article`

### 3. Thiết lập Frontend (React)

#### Bước 1: Di chuyển vào thư mục frontend
```cmd
cd article-management-web
````

#### Bước 2: Cài đặt dependencies

```cmd
npm install
```

#### Bước 3: Chạy ứng dụng

```cmd
npm start
```

Frontend sẽ chạy tại: `http://localhost:3000`

## Kiểm tra chức năng

### 1. Tạo tài khoản mới

#### Bước 1: Truy cập giao diện đăng ký

- Mở trình duyệt và truy cập `http://localhost:3000`
- Click vào nút **"Đăng ký"**

#### Bước 2: Điền thông tin đăng ký

- **Email**: Nhập email hợp lệ (ví dụ: `lehuuhau1231@gmail.com`)
- **Mật khẩu**: Mật khẩu phải mạnh (ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt)
- **Họ tên**: Nhập họ tên đầy đủ
- Click **"Đăng ký"**

#### Bước 3: Kiểm tra dữ liệu trong database

```sql
USE articledb;
SELECT * FROM user;
```

### 2. Đăng nhập và lấy token

#### Bước 1: Đăng nhập qua giao diện web

- Truy cập trang đăng nhập tại `http://localhost:3000/login`
- Nhập email và mật khẩu vừa tạo
- Click **"Đăng nhập"**

#### Bước 2: Kiểm tra token qua Developer Tools

1. Mở **Developer Tools** (F12)
2. Vào tab **Application** → **Cookies** → `http://localhost:3000`
3. Tìm key `token` để xem JWT token

#### Bước 3: Kiểm tra token qua Postman (tùy chọn)

```
POST http://localhost:8080/article/auth/token
Content-Type: application/json

{
  "email": "lehuuhau1231@gmail.com",
  "password": "Lehuuhau1231@"
}
```

Response sẽ chứa token:

```json
{
  "code": 0,
  "result": {
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJsZWh1dWhhdS5jb20iLCJzdWIiOiJsZWh1dWhhdTEyMzFAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzU3NTgwMTQ3LCJpYXQiOjE3NTc1NzY1NDd9.FCzmfkZcFxfFyCMk0QELXDsQuhV8nD7iiQr9kWu1-Iq-gKCZPcnnzvxcUPKVq_lS6fDpxRuYgQjd7L0hk53zWw",
    "role": "USER",
    "fullName": "Lee"
  }
}
```

### 3. Tạo bài viết mới

#### Bước 1: Truy cập trang tạo bài viết

- Sau khi đăng nhập, click vào **"Tạo bài viết"**

#### Bước 2: Tạo bài viết

- **Tiêu đề**: Nhập tiêu đề bài viết
- **Mô tả**: Nhập tiêu đề bài viết
- **Nội dung**: Sử dụng rich text editor để viết nội dung
- **Hình ảnh**: Upload ảnh cho bài viết (tùy chọn)
- Click **"Tạo bài viết"**

#### Bước 3: Kiểm tra bài viết trên danh sách

- Truy cập trang chủ `http://localhost:3000`
- Bài viết mới sẽ hiển thị trong danh sách
- Click vào bài viết để xem chi tiết

#### Bước 4: Kiểm tra trong database

```sql
SELECT * FROM post ORDER BY created_date DESC LIMIT 5;
```

### 4. Chỉnh sửa và xóa bài viết

#### Chỉnh sửa bài viết:

1. Vào **"Bài viết của tôi"**
2. Click nút **"Sửa"** trên bài viết muốn chỉnh sửa
3. Thực hiện thay đổi và click **"Cập nhật"**
4. Kiểm tra thay đổi trên danh sách bài viết

#### Xóa bài viết:

1. Vào **"Bài viết của tôi"**
2. Click nút **"Xóa"** trên bài viết muốn xóa
3. Xác nhận xóa trong popup
4. Kiểm tra bài viết đã biến mất khỏi danh sách

#### Kiểm tra trong database:

```sql
-- Kiểm tra bài viết đã cập nhật
SELECT * FROM post WHERE id = 'POST_ID';

-- Kiểm tra bài viết đã xóa (không còn tồn tại)
SELECT * FROM post WHERE id = 'DELETED_POST_ID';
```

## API Endpoints chính

### Authentication

- `POST /article/api/user` - Đăng ký tài khoản
- `POST /article/auth/token` - Đăng nhập

### Posts

- `GET /article/api/posts` - Lấy danh sách bài viết
- `POST /article/api/posts` - Tạo bài viết mới
- `PATCH /article/api/posts/{id}` - Cập nhật bài viết
- `DELETE /article/api/posts/{id}` - Xóa bài viết
- `GET /article/api/posts/{id}` - Lấy chi tiết bài viết

### Users

- `GET /article/api/users` - Lấy thông tin user đang đăng nhập

## Xử lý sự cố

### Lỗi kết nối Database

1. **Kiểm tra database articledb đã tồn tại:**

```sql
mysql -u root -p
SHOW DATABASES;
```

2. **Kiểm tra thông tin kết nối trong `application.yaml`:**

   - Username và password MySQL đúng chưa
   - Port MySQL (mặc định 3306)
   - Tên database `articledb` đúng chưa

3. **Lỗi thường gặp:**

```
Access denied for user 'root'@'localhost'
→ Kiểm tra lại username/password trong application.yaml

Unknown database 'articledb'
→ Tạo lại database: articledb;
```
