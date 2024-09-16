import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import { AdminMessages } from "./components/AdminMessages";
import { AddNewBook } from "./components/AddNewBook";
import { ChangeQuantityOfBooks } from "./components/ChangeQuantityOfBooks";

export const ManageLibraryPage = () => {
  const { authState } = useOktaAuth();

  const [activeSection, setActiveSection] = useState("add new book");

  const renderContent = () => {
    switch (activeSection) {
      case "add new book":
        return <AddNewBook />;
      case "change quantity":
        return <ChangeQuantityOfBooks />;
      case "messages":
        return <AdminMessages />;
      default:
        return null;
    }
  };

  if (authState?.accessToken?.claims.userType === undefined) {
    return <Redirect to="/home" />;
  }

  return (
    <div>
      <div className="mx-auto my-5 max-w-4xl space-y-5 p-5">
        <h3>Manage Library</h3>
        <nav className="mb-3 flex space-x-4">
          <button
            className={`rounded-lg border-2 border-cyan-700 px-2 ${activeSection === "add new book" ? "bg-white text-cyan-700 shadow-lg" : "bg-cyan-700 text-white"}`}
            onClick={() => setActiveSection("add new book")}
          >
            Add new book
          </button>
          <button
            className={`rounded-lg border-2 border-cyan-700 px-2 ${activeSection === "change quantity" ? "bg-white text-cyan-700 shadow-lg" : "bg-cyan-700 text-white"}`}
            onClick={() => setActiveSection("change quantity")}
          >
            Change quantity
          </button>
          <button
            className={`rounded-lg border-2 border-cyan-700 px-2 ${activeSection === "messages" ? "bg-white text-cyan-700 shadow-lg" : "bg-cyan-700 text-white"}`}
            onClick={() => setActiveSection("messages")}
          >
            Messages
          </button>
        </nav>
        <hr className="mb-3" />
        <div>{renderContent()}</div>
      </div>
    </div>
  );
};
