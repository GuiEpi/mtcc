import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
