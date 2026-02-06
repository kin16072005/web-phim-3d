import { useEffect, useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";

function Home() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 1. Biến để lưu từ khóa tìm kiếm

  useEffect(() => {
    fetch("http://localhost:5000/api/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.log(err));
  }, []);

  // 2. Logic lọc phim: Lấy danh sách phim gốc -> Lọc những phim có tên chứa từ khóa
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <h1 style={{ margin: 0 }}>🎥 Web Phim 3D</h1>
        
        {/* 3. Thanh tìm kiếm */}
        <input 
          type="text" 
          placeholder="🔍 Tìm tên phim..." 
          style={{
            padding: "10px 15px",
            width: "300px",
            borderRadius: "20px",
            border: "none",
            outline: "none",
            backgroundColor: "#333",
            color: "white",
            fontSize: "1rem"
          }}
          onChange={(e) => setSearchTerm(e.target.value)} // Gõ gì lưu nấy
        />
      </div>

      <div className="movie-grid">
        {/* 4. Hiển thị danh sách ĐÃ LỌC (filteredMovies) chứ không hiển thị tất cả nữa */}
        {filteredMovies.map((movie) => (
          <Link to={`/watch/${movie._id}`} key={movie._id} style={{textDecoration: 'none'}}>
            <div className="movie-card">
              <img 
                src={movie.poster} 
                alt={movie.title} 
                className="movie-poster"
                onError={(e) => {e.target.src = 'https://via.placeholder.com/300x450?text=No+Image'}}
              />
              <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-status">{movie.status}</p>
                <p className="movie-episode">{movie.currentEpisode}</p>
              </div>
            </div>
          </Link>
        ))}
        
        {/* Nếu tìm không thấy phim nào thì báo câu này */}
        {filteredMovies.length === 0 && (
          <p style={{ textAlign: "center", width: "100%", color: "#777" }}>Không tìm thấy phim nào...</p>
        )}
      </div>
    </div>
  );
}

export default Home;