import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import ThemeProvider from "./context/ThemeProvider.jsx";
import NotificationProvider from "./context/NotificationProvider.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import { BrowserRouter } from "react-router-dom";
import SearchProvider from "./context/SearchProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <ThemeProvider>
          <SearchProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </SearchProvider>
        </ThemeProvider>
      </NotificationProvider>
    </BrowserRouter>
  </StrictMode>
);
