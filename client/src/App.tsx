import { useState, useEffect } from "react";
import "./App.css";
import io from "socket.io-client";
import getTimeStamp from "./utils/getTimeStamp.js";

const socket = io("http://localhost:4000");

type Message = {
  body: string;
  from: string;
  timeStamp: string;
};

interface AppStates {
  message: string;
  messages: Message[] | [];
}

function App() {
  const [message, setMessage] = useState<AppStates["message"]>("");
  const [messages, setMessages] = useState<AppStates["messages"]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("message", message);

    const newMessage = {
      body: message,
      from: "Me",
      timeStamp: getTimeStamp(),
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  useEffect(() => {
    const receiveMessage = (message: Message) => {
      setMessages([...messages, message]);
    };

    socket.on("message", receiveMessage);

    return () => {
      socket.off("message", receiveMessage);
    };
  }, [messages]);

  return (
    <section className="msger">
      <header className="msger-header">
        <div className="msger-header-title">
          <i className="fas fa-comment-alt"></i> React Socket.io Chat
        </div>
        <div className="msger-header-options">
          <span>
            <i className="fas fa-cog" />
          </span>
        </div>
      </header>

      <main className="msger-chat">
        {messages.map((message, i) => {
          return (
            <div
              className={
                message.from === "Me" ? "msg right-msg" : "msg left-msg"
              }
              key={i}
            >
              <div className="msg-bubble">
                <div className="msg-info">
                  <div className="msg-info-name">{message.from}</div>
                  <div className="msg-info-time">{message.timeStamp}</div>
                </div>

                <div className="msg-text">{message.body}</div>
              </div>
            </div>
          );
        })}
      </main>

      <form className="msger-inputarea" onSubmit={handleSubmit}>
        <input
          className="msger-input"
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message..."
          type="text"
          value={message}
        />
        <button type="submit" className="msger-send-btn">
          Send
        </button>
      </form>
    </section>
  );
}

export default App;
