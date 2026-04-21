import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initTelegramMiniApp } from "@/lib/initTelegramMiniApp";
import App from "./App";
import "./index.css";

initTelegramMiniApp();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
