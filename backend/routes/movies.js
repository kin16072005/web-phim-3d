const router = require("express").Router();
const Movie = require("../models/Movie"); // Gọi cái khuôn Phim ra

// --- HÀM TẠO SLUG (Code mới thêm vào đây) ---
// Tác dụng: Biến tên "Đấu Phá Thương Khung" -> "dau-pha-thuong-khung-17823612"
function createSlug(str) {
  if (!str) return "";
  return str
    .toLowerCase() // Chuyển thành chữ thường
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Xóa dấu tiếng Việt
    .replace(/[^\w\s-]/g, '') // Xóa ký tự đặc biệt
    .replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu gạch ngang
    + '-' + Date.now(); // Thêm ngày giờ vào cuối để KHÔNG BAO GIỜ TRÙNG
}

// 1. API THÊM PHIM MỚI (Đã sửa lại để dùng hàm tạo Slug)
// Postman sẽ gửi vào: POST http://localhost:5000/api/movies
router.post("/", async (req, res) => {
    try {
        // Lấy dữ liệu người dùng gửi lên
        const movieData = req.body;
        
        // Tự động tạo slug từ tên phim (Đây là liều thuốc chữa bệnh trùng lặp)
        movieData.slug = createSlug(movieData.title);

        // Tạo phim mới với dữ liệu đã có slug
        const newMovie = new Movie(movieData); 
        const savedMovie = await newMovie.save(); // Lưu vào Database
        
        res.status(201).json(savedMovie); // Trả về phim vừa tạo
    } catch (err) {
        // Nếu lỗi thì in chi tiết ra để dễ sửa
        res.status(500).json({ error: err.message }); 
    }
});

// 2. API LẤY DANH SÁCH TẤT CẢ PHIM (Dành cho Trang chủ)
// Trình duyệt sẽ gõ: GET http://localhost:5000/api/movies
router.get("/", async (req, res) => {
    try {
        const movies = await Movie.find(); // Lấy tất cả phim trong kho
        res.status(200).json(movies.reverse()); // reverse để phim mới nhất lên đầu
    } catch (err) {
        res.status(500).json(err);
    }
});

// API MỚI: Lấy chi tiết 1 bộ phim (Dựa vào ID gửi lên)
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id); // Tìm trong DB
        res.json(movie); // Trả về phim tìm được
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API XÓA PHIM (DELETE)
// Gọi vào: DELETE http://localhost:5000/api/movies/ID_CUA_PHIM
router.delete('/:id', async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id); // Tìm đúng ID và xóa
        res.status(200).json("Phim đã bị xóa sổ!"); // Báo cáo lại
    } catch (err) {
        res.status(500).json(err);
    }
});

// API SỬA PHIM (UPDATE)
// Gọi vào: PUT http://localhost:5000/api/movies/ID_CUA_PHIM
router.put("/:id", async (req, res) => {
  try {
    // 1. Tìm phim theo ID và cập nhật bằng dữ liệu mới gửi lên (req.body)
    // { new: true } nghĩa là: Sửa xong thì trả về bản mới nhất cho tôi xem
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true } 
    );
    
    res.status(200).json(updatedMovie);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;