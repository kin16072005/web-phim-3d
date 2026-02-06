import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Admin() {
  const [movies, setMovies] = useState([]);
  const [formData, setFormData] = useState({
    title: "", desc: "", poster: "", videoUrl: "", currentEpisode: "", status: "Đang tiến hành", quality: "HD"
  });

  // Biến này để lưu ID của phim đang sửa
  // Nếu nó là null -> Đang ở chế độ THÊM MỚI
  // Nếu nó có ID -> Đang ở chế độ SỬA
  const [editingId, setEditingId] = useState(null);

  // --- LẤY DANH SÁCH PHIM ---
  useEffect(() => {
    fetch("http://localhost:5000/api/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- HÀM XỬ LÝ CHUNG (THÊM HOẶC SỬA) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = "http://localhost:5000/api/movies";
      let method = "POST";

      // Nếu đang có ID sửa -> Chuyển sang chế độ SỬA (PUT)
      if (editingId) {
        url = `http://localhost:5000/api/movies/${editingId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi Server");

      alert(editingId ? "✅ Đã sửa xong!" : "✅ Thêm thành công!");

      // Logic cập nhật lại danh sách trên màn hình mà không cần F5
      if (editingId) {
        // Nếu là sửa: Tìm thằng cũ thay bằng thằng mới
        setMovies(movies.map(m => m._id === editingId ? data : m));
        setEditingId(null); // Thoát chế độ sửa
      } else {
        // Nếu là thêm: Chèn lên đầu
        setMovies([data, ...movies]);
      }

      // Reset form
      setFormData({ title: "", desc: "", poster: "", videoUrl: "", currentEpisode: "", status: "", quality: "" });

    } catch (err) {
      alert("❌ Lỗi: " + err.message);
    }
  };

  // --- HÀM KHI BẤM NÚT SỬA ---
  const startEditing = (movie) => {
    // 1. Đưa màn hình cuộn lên đầu trang (để nhìn thấy form)
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 2. Điền thông tin phim cũ vào Form
    setFormData({
      title: movie.title,
      desc: movie.desc || "",
      poster: movie.poster,
      videoUrl: movie.videoUrl || "",
      currentEpisode: movie.currentEpisode || "",
      status: movie.status || "",
      quality: movie.quality || ""
    });

    // 3. Ghi nhớ ID đang sửa
    setEditingId(movie._id);
  };

  // --- HÀM HỦY SỬA (Nếu đổi ý) ---
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", desc: "", poster: "", videoUrl: "", currentEpisode: "", status: "", quality: "" });
  };

  // --- HÀM XÓA (GIỮ NGUYÊN) ---
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa không?")) return;
    try {
      await fetch(`http://localhost:5000/api/movies/${id}`, { method: "DELETE" });
      setMovies(movies.filter(movie => movie._id !== id));
    } catch (err) { alert("Lỗi xóa"); }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", color: "white" }}>
       <Link to="/" style={{ color: "#aaa", textDecoration: "none" }}>⬅ Về trang chủ</Link>
       
       <h1 style={{ textAlign: "center", color: "#e50914" }}>QUẢN TRỊ VIÊN</h1>

       {/* --- FORM NHẬP LIỆU ĐA NĂNG --- */}
       <div style={{ backgroundColor: "#333", padding: "20px", borderRadius: "10px", marginBottom: "40px", border: editingId ? "2px solid #e50914" : "none" }}>
          <h2 style={{color: editingId ? "#e50914" : "white"}}>
            {editingId ? "✏️ ĐANG SỬA PHIM" : "➕ THÊM PHIM MỚI"}
          </h2>
          
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input name="title" value={formData.title} onChange={handleChange} placeholder="Tên phim" required style={inputStyle} />
              <textarea name="desc" value={formData.desc} onChange={handleChange} placeholder="Mô tả phim..." style={{...inputStyle, height: "80px"}} />
              <input name="poster" value={formData.poster} onChange={handleChange} placeholder="Link Ảnh" required style={inputStyle} />
              <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="Link Video Embed" required style={inputStyle} />
              <div style={{display: 'flex', gap: 10}}>
                <input name="currentEpisode" value={formData.currentEpisode} onChange={handleChange} placeholder="Tập hiện tại" style={{...inputStyle, flex: 1}} />
                <input name="status" value={formData.status} onChange={handleChange} placeholder="Tình trạng" style={{...inputStyle, flex: 1}} />
              </div>

              {/* Bộ nút bấm thông minh */}
              <div style={{display: "flex", gap: "10px"}}>
                 <button type="submit" style={{...btnStyle, flex: 1, backgroundColor: editingId ? "#2ecc71" : "#e50914"}}>
                    {editingId ? "LƯU LẠI (SAVE)" : "THÊM NGAY (ADD)"}
                 </button>
                 
                 {/* Nút Hủy chỉ hiện ra khi đang sửa */}
                 {editingId && (
                   <button type="button" onClick={cancelEdit} style={{...btnStyle, backgroundColor: "#777"}}>HỦY BỎ</button>
                 )}
              </div>
          </form>
       </div>

       {/* --- DANH SÁCH --- */}
       <div>
          <h2>📂 Danh sách phim ({movies.length})</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
            {movies.map(movie => (
              <div key={movie._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#222", padding: "10px", borderRadius: "5px", border: "1px solid #444" }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <img src={movie.poster} alt="" style={{width: '40px', height: '60px', objectFit: 'cover'}} />
                  <div>
                    <h4 style={{margin: 0}}>{movie.title}</h4>
                    <small style={{color: '#888'}}>{movie.currentEpisode}</small>
                  </div>
                </div>
                
                <div style={{display: "flex", gap: "10px"}}>
                  {/* NÚT SỬA MỚI TOANH */}
                  <button 
                    onClick={() => startEditing(movie)}
                    style={{ backgroundColor: "#3498db", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}
                  >
                    SỬA ✏️
                  </button>

                  <button 
                    onClick={() => handleDelete(movie._id)}
                    style={{ backgroundColor: "#ff0000", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}
                  >
                    XÓA 🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
       </div>
    </div>
  );
}

const inputStyle = { padding: "10px", borderRadius: "5px", border: "none", outline: "none", background: "#555", color: "white" };
const btnStyle = { padding: "10px", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" };

export default Admin;