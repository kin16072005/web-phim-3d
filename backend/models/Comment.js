const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },   // Ai chat?
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true }, // Chat ở phim nào?
    content: { type: String, required: true }, // Nội dung chat
}, { timestamps: true });

module.exports = mongoose.model("Comment", CommentSchema);