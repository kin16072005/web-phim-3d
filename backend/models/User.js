const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Tên đăng nhập
    email: { type: String, required: true, unique: true },    // Email
    password: { type: String, required: true },               // Mật khẩu
    avatar: { type: String, default: "" },                    // Ảnh đại diện
    role: { type: String, default: "user" },                  // user hoặc admin

    // --- HỆ THỐNG TU TIÊN (Cái cậu cần đây) ---
    cultivation: {
        exp: { type: Number, default: 0 },             // Điểm kinh nghiệm (cày phim để tăng)
        level_name: { type: String, default: "Phàm Nhân" } // Cấp bậc hiện tại
    },
    
    // Danh sách phim yêu thích
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }] 
}, { timestamps: true }); // Tự động tạo createdAt, updatedAt

module.exports = mongoose.model("User", UserSchema);