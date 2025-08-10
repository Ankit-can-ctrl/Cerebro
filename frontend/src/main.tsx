import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { startParticles } from "./particles";

const rootElement = document.getElementById("root")!;

// Start background particles behind the app
const canvas = document.getElementById(
  "bg-particles"
) as HTMLCanvasElement | null;
if (canvas) {
  startParticles(canvas);
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
