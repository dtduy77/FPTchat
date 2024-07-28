import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState } from "react";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [question, setQuestion] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    // Reset file input value
    event.target.value = null;
  };

  const handleSendClick = async () => {
    if (!inputValue) {
      alert("Please provide a question.");
      return;
    }

    setQuestion(inputValue);

    if (selectedFile || question) {
      const formData = new FormData();
      formData.append("doc", selectedFile);
      formData.append("question", inputValue);

      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/rag/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        console.log("Response:", data);
        setResponseData(data.data); // Store the response data
      } catch (error) {
        console.error("Error:", error);
        // Handle the error
      }

      setInputValue(""); // Clear the input field after sending
      // We do not clear the selectedFile so it can be reused
    } else {
      console.log("Input value:", inputValue);
      // setResponseData(inputValue); // Display input value if no file is uploaded
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendClick();
    }
  };

  const handleButtonClick = (event) => {
    const buttonText = event.target.textContent;
    console.log("Button text:", buttonText);
    // Additional logic for handling the button text
  };

  return (
    <div className="container-fluid App">
      <div className="row">
        <nav className="col-md-1 d-none d-md-block sidebar">
          <i className="fa fa-bars sidebar-icon"></i>
        </nav>

        <main role="main" className="col-md-11">
          <header className="App-header">
            <div className="logo-container">
              <img
                src="src/assets/fptlogo.png"
                alt="ChatFPT"
                className="logo"
              />
              <h1>ChatFPT</h1>
            </div>
            <div className="auth-buttons">
              <button className="register-btn">Đăng kí</button>
              <button className="login-btn">Đăng nhập</button>
            </div>
          </header>
          <div className="App-main">
            {!responseData && !question && <h1>Bạn đang thắc mắc điều gì?</h1>}
            {question && (
              <div className="question-container">
                <p>{question}</p>
              </div>
            )}
            {responseData && (
              <div className="response-container">
                <p>{responseData}</p>
              </div>
            )}
            <div className="button-container">
              <button className="query-btn" onClick={handleButtonClick}>
                Khối đào tạo ngành học của FPT
              </button>
              <button className="query-btn" onClick={handleButtonClick}>
                Cách tính điểm GPA
              </button>
              <button className="query-btn" onClick={handleButtonClick}>
                Địa chỉ đại học FPT Quy Nhơn
              </button>
              <button className="query-btn" onClick={handleButtonClick}>
                Học phí các chuyên ngành năm 2024
              </button>
            </div>
            <div className="input-container">
              <input
                type="text"
                placeholder="Nhập tin nhắn"
                className="input-field"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
              <img
                src="src/assets/input.png"
                alt="send icon"
                className="send-icon"
                onClick={handleSendClick}
              />
              <input
                type="file"
                id="fileInput"
                className="file-input"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <img
                src="src/assets/upload.png"
                alt="upload icon"
                className="upload-icon"
                onClick={() => document.getElementById("fileInput").click()}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
