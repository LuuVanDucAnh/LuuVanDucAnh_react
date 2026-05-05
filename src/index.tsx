import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import { BrowserRouter } from "react-router-dom"; // Không cần dòng này vì App.tsx đã có rồi

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// XÓA BỎ ĐOẠN DƯỚI NÀY:
// ReactDOM.createRoot(document.getElementById("root")!).render(
//     <App />
// );

reportWebVitals();

