import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [question, setQuestion] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    if (conversationHistory.length === 0) {
      setStartTime(new Date());
    }
  }, [conversationHistory]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    event.target.value = null; // Reset file input value

    if (file) {
      const formData = new FormData();
      formData.append("doc", file);

      setUploadStatus("uploading");
      setUploadMessage("Đang tải lên...");

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

        setUploadStatus("success");
        setUploadMessage("Tải lên thành công!");
        setTimeout(() => {
          setUploadStatus(null);
          setUploadMessage("");
        }, 4000);

        // Clear the file input after sending
        setSelectedFile(null);
      } catch (error) {
        console.error("Error ingesting document:", error);

        setUploadStatus("error");
        setUploadMessage("Upload failed. Please try again.");
        setTimeout(() => {
          setUploadStatus(null);
          setUploadMessage("");
        }, 4000);
      }
    }
  };

  const handleSendClick = async () => {
    if (!inputValue) {
      alert("Please provide a question.");
      return;
    }

    const currentQuestion = inputValue;
    setQuestion(currentQuestion);
    setInputValue(""); // Clear the input field immediately

    await sendQuery(currentQuestion);
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
      const formattedResponse = replaceNewlinesWithBr(data.data);
      setResponseData(formattedResponse);
      updateConversationHistory(query, formattedResponse); // Store the response data with <br>
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
      const formattedResponse = replaceNewlinesWithBr(data.data);
      setResponseData(formattedResponse);
      updateConversationHistory(buttonText, formattedResponse); // Store the response data with <br>
    } catch (error) {
      console.error("Error retrieving data:", error);
      // Handle the error
    }
  };

  const updateConversationHistory = (question, response) => {
    const newEntry = { question, response, time: new Date() };
    setConversationHistory((prevHistory) => [...prevHistory, newEntry]);
  };

  const replaceNewlinesWithBr = (html) => {
    // Regular expression to match <table> tags and their content
    const tableRegex = /<table[^>]*>[\s\S]*?<\/table>/gi;
    const tables = html.match(tableRegex) || [];

    // Placeholder to store the separated parts
    let plainTextParts = [];
    let lastIndex = 0;

    // Extract plain text parts and store them with their original indices
    tables.forEach((table, index) => {
      const tableIndex = html.indexOf(table, lastIndex);
      if (tableIndex > lastIndex) {
        plainTextParts.push({
          text: html.substring(lastIndex, tableIndex),
          index: lastIndex,
        });
      }
      lastIndex = tableIndex + table.length;
    });

    // Add any remaining plain text after the last table
    if (lastIndex < html.length) {
      plainTextParts.push({
        text: html.substring(lastIndex),
        index: lastIndex,
      });
    }

    // Replace newlines with <br> in plain text parts
    plainTextParts = plainTextParts.map((part) => ({
      ...part,
      text: part.text.replace(/\n/g, "<br>"),
    }));

    // Reconstruct the HTML with the modified plain text and original tables
    let reconstructedHtml = "";
    lastIndex = 0;

    plainTextParts.forEach((part) => {
      reconstructedHtml += part.text;
      if (lastIndex < tables.length) {
        reconstructedHtml += tables[lastIndex];
        lastIndex++;
      }
    });

    return reconstructedHtml;
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
                      <strong>A:</strong>{" "}
                      <span
                        dangerouslySetInnerHTML={{ __html: entry.response }}
                      ></span>
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
                src="https://firebasestorage.googleapis.com/v0/b/exe-rag.appspot.com/o/fpt-chat%2Ffptlogo.png?alt=media&token=f4355cdc-02a7-4049-8bb1-2c2b7826aa00"
                alt="ChatFPT"
                className="logo"
              />
              <h1>ChatFPT</h1>
            </div>
            <div className="auth-buttons">
              <button className="register-btn">Đăng kí</button>
              <Link to="/login">
                <button className="login-btn">Đăng nhập</button>
              </Link>
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
                  <p dangerouslySetInnerHTML={{ __html: responseData }}></p>
                </div>
              )}
            </div>
            {uploadStatus && (
              <div className={`upload-status ${uploadStatus}`}>
                {uploadMessage}
              </div>
            )}
          </div>
          <div className="bottom-container">
            <div className="button-container">
              <button className="query-btn" onClick={handleButtonClick}>
                Khối đào tạo ngành học của FPT
              </button>
              <button className="query-btn" onClick={handleButtonClick}>
                Cách tính điểm trung bình (GPA)
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
                src="https://firebasestorage.googleapis.com/v0/b/exe-rag.appspot.com/o/fpt-chat%2Finput.png?alt=media&token=8378c692-dfe1-477f-8590-cf12790264c1"
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
                src="https://firebasestorage.googleapis.com/v0/b/exe-rag.appspot.com/o/fpt-chat%2Fupload.png?alt=media&token=cff19e1f-3f0f-4e31-82d3-f7664cff29ea"
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
