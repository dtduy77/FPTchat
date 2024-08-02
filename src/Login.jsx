import "./Login.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Login() {
  return (
    <div className="login-container">
      <div className="login-box">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/exe-rag.appspot.com/o/fpt-chat%2Ffptlogo.png?alt=media&token=f4355cdc-02a7-4049-8bb1-2c2b7826aa00"
          alt="Logo"
          className="logo"
        />
        <h2>Chào mừng đến với ChatFPT</h2>
        <div className="login-form-horizontal">
          <div className="email-login">
            <input
              type="email"
              placeholder="Nhập địa chỉ Email*"
              className="input-field"
            />
            <button className="continue-btn">Tiếp tục</button>
            <p>
              Bạn không có tài khoản? <a href="#register">Đăng ký</a>
            </p>
          </div>
          <div className="separator-horizontal">
            <div className="line"></div>
          </div>
          <div className="social-login">
            <button className="social-btn google-btn">
              <i className="fab fa-google google-icon"></i> Tiếp tục với Google
            </button>
            <button className="social-btn facebook-btn">
              <i className="fab fa-facebook facebook-icon"></i> Tiếp tục với
              Facebook
            </button>
            <button className="social-btn microsoft-btn">
              <i className="fab fa-microsoft microsoft-icon"></i> Tiếp tục với
              Microsoft
            </button>
          </div>
        </div>
        <p className="terms">Điều khoản sử dụng Chính sách riêng tư</p>
      </div>
    </div>
  );
}

export default Login;
