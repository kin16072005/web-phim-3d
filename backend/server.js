// --- PHẦN 1: KHAI BÁO THƯ VIỆN ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Gọi file routes vừa tạo vào đây để sử dụng
const movieRoute = require("./routes/movies"); 

const app = express();
const PORT = 5000;

// --- PHẦN 2: KẾT NỐI MONGODB (LOCAL) ---
// Dòng code thông minh: Ưu tiên lấy link trên Render trước, nếu không có mới dùng Local
const MONGO_URI = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/WebPhimHH";   

// --- PHẦN 3: CẤU HÌNH ---
app.use(cors()); // Cho phép trang web bên ngoài gọi vào
app.use(express.json()); // Cho phép đọc dữ liệu JSON gửi lên

// Kết nối tới Database
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Đã kết nối thành công tới MongoDB!"))
    .catch(err => console.error("❌ Lỗi kết nối:", err));

// --- PHẦN 4: ĐỊNH NGHĨA ĐƯỜNG DẪN (ROUTES) ---
// (Lúc trước cậu viết trực tiếp ở đây, giờ mình chuyển hướng sang file riêng)

// Ai gõ /api/movies thì chuyển sang file routes/movies.js xử lý
app.use("/api/movies", movieRoute);

// --- PHẦN 5: CHẠY SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});