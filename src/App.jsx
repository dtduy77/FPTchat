import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-container">
          <img src="src/assets/fptlogo.png" alt="ChatFPT" className="logo" />
          <h1>ChatFPT</h1>
        </div>
        <div className="auth-buttons">
          <button className="register-btn">Đăng kí</button>
          <button className="login-btn">Đăng nhập</button>
        </div>
      </header>
      <main className="App-main">
        <h1>Bạn đang thắc mắc điều gì?</h1>
        <div className="button-container">
          <button className="query-btn">Khối đào tạo ngành học của FPT</button>
          <button className="query-btn">Cách tính điểm GPA</button>
          <button className="query-btn">Địa chỉ đại học FPT Quy Nhơn</button>
          <button className="query-btn">
            Học phí các chuyên ngành năm 2024
          </button>
        </div>

        <div className="input-container">
          <input
            type="text"
            placeholder="Nhập tin nhắn"
            className="input-field"
          />
          <img
            src="src/assets/input.png"
            alt="send icon"
            className="send-icon"
          />
        </div>
      </main>
    </div>
  );
}

export default App;
