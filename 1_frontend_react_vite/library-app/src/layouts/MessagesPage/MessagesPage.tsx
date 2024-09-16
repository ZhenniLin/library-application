import { useState } from "react";
import { PostNewMessage } from "./components/PostNewMessage";
import { Messages } from "./components/Messages";

export const MessagesPage = () => {
  const [activeSection, setActiveSection] = useState("submit question");

  const renderContent = () => {
    switch (activeSection) {
      case "submit question":
        return <PostNewMessage />;
      case "Q/A response":
        return <Messages />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto my-5 max-w-4xl p-5">
      <nav className="mb-3 flex space-x-4">
        <button
          className={`rounded-lg border-2 border-cyan-700 px-2 ${activeSection === "submit question" ? "bg-white text-cyan-700 shadow-lg" : "bg-cyan-700 text-white"}`}
          onClick={() => setActiveSection("submit question")}
        >
          Submit Question
        </button>
        <button
          className={`rounded-lg border-2 border-cyan-700 px-2 ${activeSection === "Q/A response" ? "bg-white text-cyan-700 shadow-lg" : "bg-cyan-700 text-white"}`}
          onClick={() => setActiveSection("Q/A response")}
        >
          Q/A Response
        </button>
      </nav>
      <hr className="mb-3" />
      <div>{renderContent()}</div>
    </div>
  );
};
