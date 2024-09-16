import { useState } from "react";
import { Loans } from "./components/Loans";
import { HistoryPage } from "./components/HistoryPage";

export const ShelfPage = () => {
  const [activeSection, setActiveSection] = useState("loans");

  const renderContent = () => {
    switch (activeSection) {
      case "loans":
        return (
          <div>
            <Loans />
          </div>
        );
      case "history":
        return (
          <div>
            <HistoryPage />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mx-auto my-5 max-w-4xl p-5">
      <nav className="mb-3 flex space-x-4">
        <button
          className={`rounded-lg border-2 border-cyan-700 px-2 ${activeSection === "loans" ? "bg-white text-cyan-700 shadow-lg" : "bg-cyan-700 text-white"}`}
          onClick={() => setActiveSection("loans")}
        >
          Loans
        </button>
        <button
          className={`rounded-lg border-2 border-cyan-700 px-2 ${activeSection === "history" ? "bg-white text-cyan-700 shadow-lg" : "bg-cyan-700 text-white"}`}
          onClick={() => setActiveSection("history")}
        >
          Your History
        </button>
      </nav>
      <hr className="mb-3" />
      <div>{renderContent()}</div>
    </div>
  );
};
