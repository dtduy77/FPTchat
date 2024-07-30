import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState, useEffect } from "react";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [question, setQuestion] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (conversationHistory.length === 0) {
      setStartTime(new Date());
    }
  }, [conversationHistory]);

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

    const currentQuestion = inputValue;
    setQuestion(currentQuestion);
    setInputValue(""); // Clear the input field immediately

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
        await sendQuery(currentQuestion);
      } catch (error) {
        console.error("Error ingesting document:", error);
        // Handle the error
      }

      setSelectedFile(null); // Clear the file input after sending
    } else {
      await sendQuery(currentQuestion);
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
      updateConversationHistory(query, data.data);
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
      updateConversationHistory(buttonText, data.data);
    } catch (error) {
      console.error("Error retrieving data:", error);
      // Handle the error
    }
  };

  const updateConversationHistory = (question, response) => {
    const newEntry = { question, response, time: new Date() };
    setConversationHistory((prevHistory) => [...prevHistory, newEntry]);
  };

  const formatTime = (date) => {
    const options = { hour: "2-digit", minute: "2-digit" };
    return date.toLocaleTimeString([], options);
  };

  const formatDate = (date) => {
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    }
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    }
    return date.toLocaleDateString();
  };

  const handleToggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="container-fluid App">
      <div className="row">
        <nav className="col-md-1 d-none d-md-block sidebar">
          <i className="fa fa-bars sidebar-icon"></i>
          <div className="conversation-history">
            <div className="conversation-summary" onClick={handleToggleHistory}>
              {startTime && formatTime(startTime)} - {formatTime(new Date())}
            </div>
            {showHistory && (
              <div className="history-details">
                {conversationHistory.map((entry, index) => (
                  <div key={index} className="conversation-entry">
                    <div className="conversation-time">
                      {formatDate(entry.time)} - {formatTime(entry.time)}
                    </div>
                    <div className="conversation-question">
                      <strong>Q:</strong> {entry.question}
                    </div>
                    <div className="conversation-response">
                      <strong>A:</strong> {entry.response}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
            <div className="chat-container">
              {!responseData && !question && (
                <h1>Bạn đang thắc mắc điều gì?</h1>
              )}
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
            </div>
          </div>

          <div className="bottom-container">
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
