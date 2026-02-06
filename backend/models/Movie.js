const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true }, // Tên phim (VD: Phàm Nhân Tu Tiên)
    slug: { type: String, unique: true },                  // Link đẹp (pham-nhan-tu-tien)
    desc: { type: String },                                // Mô tả nội dung
    poster: { type: String },                              // Ảnh bìa dọc
    backdrop: { type: String },                            // Ảnh nền ngang
    
    // --- Thông tin Anime ---
    status: { type: String, default: "Đang tiến hành" },   // Hoàn thành / Đang ra
    totalEpisodes: { type: Number, default: 0 },           // Tổng số tập
    currentEpisode: { type: String, default: "0" },        // Tập mới nhất
    language: { type: String, default: "Vietsub" },        // Vietsub / Thuyết minh
    views: { type: Number, default: 0 },                   // Tổng lượt xem
}, { timestamps: true });

module.exports = mongoose.model("Movie", MovieSchema);