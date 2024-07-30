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

    if (selectedFile) {
      const formData = new FormData();
      formData.append("doc", selectedFile);

      try {
        const response = await fetch(
          "https://duythduong-fpt-chat.hf.space/api/v1/vectorstore/ingest",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        console.log("Document Ingest Response:", data);
        // Proceed with the query only after the document is ingested
        await sendQuery(inputValue);
      } catch (error) {
        console.error("Error ingesting document:", error);
        // Handle the error
      }

      setInputValue(""); // Clear the input field after sending
      setSelectedFile(null); // Clear the file input after sending
    } else {
      await sendQuery(inputValue);
    }
  };

  const sendQuery = async (query) => {
    try {
      const response = await fetch(
        `https://duythduong-fpt-chat.hf.space/api/v1/vectorstore/retrieve?query=${encodeURIComponent(
          query
        )}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      console.log("Query Response:", data);
      setResponseData(data.data); // Store the response data
    } catch (error) {
      console.error("Error retrieving data:", error);
      // Handle the error
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendClick();
    }
  };

  const handleButtonClick = async (event) => {
    const buttonText = event.target.textContent;
    console.log("Button text:", buttonText);
    setQuestion(buttonText);

    try {
      const response = await fetch(
        `https://duythduong-fpt-chat.hf.space/api/v1/vectorstore/retrieve?query=${encodeURIComponent(
          buttonText
        )}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      console.log("Button Query Response:", data);
      setResponseData(data.data); // Store the response data
    } catch (error) {
      console.error("Error retrieving data:", error);
      // Handle the error
    }
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
