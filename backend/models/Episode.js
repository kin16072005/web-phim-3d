const mongoose = require("mongoose");

const EpisodeSchema = new mongoose.Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true }, // Thuộc về phim nào?
    name: { type: String, required: true },  // Tên tập (VD: "Tập 1", "Tập 2")
    slug: { type: String },                  // Link tập (tap-1)
    
    // Link phim (Có thể lưu nhiều server dự phòng)
    link_m3u8: { type: String },             // Link chạy nhanh
    link_embed: { type: String },            // Link nhúng (dự phòng)
    
    views: { type: Number, default: 0 }      // Lượt xem riêng từng tập
}, { timestamps: true });

module.exports = mongoose.model("Episode", EpisodeSchema);