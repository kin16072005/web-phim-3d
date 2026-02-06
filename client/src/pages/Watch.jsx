import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function Watch() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null); // Biến để lưu phim lấy về

  useEffect(() => {
    // 1. Gọi điện cho Backend xin thông tin phim theo ID
    fetch(`http://localhost:5000/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data)) // 2. Lưu phim vào biến
      .catch((err) => console.log(err));
  }, [id]);

  // Nếu chưa lấy được phim (mạng chậm) thì hiện chữ Đang tải...
  if (!movie) return <div style={{color: "white", padding: 20}}>Đang tải phim...</div>;

  return (
    <div style={{ backgroundColor: "#1a1a1a", minHeight: "100vh", color: "white", padding: "20px" }}>
      <div className="container" style={{maxWidth: "1000px", margin: "0 auto"}}>
        
        {/* Nút quay lại */}
        <Link to="/" style={{ color: "#aaa", textDecoration: "none", fontSize: "1.2rem", display: "block", marginBottom: "20px" }}>
          ⬅ Quay lại trang chủ
        </Link>
        
        {/* Khung Chiếu Phim (Iframe Youtube) */}
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "12px", boxShadow: "0 0 20px rgba(229, 9, 20, 0.5)" }}>
          <iframe 
            src={movie.videoUrl} 
            title={movie.title}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            allowFullScreen
          ></iframe>
        </div>

        {/* Thông tin phim */}
        <div style={{ marginTop: "30px" }}>
          <h1 style={{ color: "#e50914", fontSize: "2.5rem" }}>{movie.title}</h1>
          <p style={{ fontSize: "1.1rem", marginTop: "10px", color: "#ccc" }}>{movie.desc}</p>
          <div style={{ marginTop: "20px" }}>
             <span style={{ backgroundColor: "#333", padding: "5px 10px", borderRadius: "5px", marginRight: "10px" }}>{movie.quality || "HD"}</span>
             <span style={{ backgroundColor: "#333", padding: "5px 10px", borderRadius: "5px" }}>{movie.language}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Watch;