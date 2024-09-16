import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51Pyrfq02asLf1eB1kaUuOj9OA1lXd6vjRrzrLafQbY8u4wm9QrfdgoshyyaY9UxQkPr38NHLUZqC5w9bMmYju4up00VLTRyH4i",
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </BrowserRouter>
  </React.StrictMode>,
);
