import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import 'bootstrap/dist/css/bootstrap.css';
import { AppProvider } from "./modalProvider/Modalprovider";
import { TicketProvider } from "./context/TicketContext";
// import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import ScrollUpButton from "./components/scrollupButton/ScrollupButton";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppProvider>
        <TicketProvider>
        <App />
        <ScrollUpButton/>
        {/* <ToastContainer  position="top-right" autoClose={3000} /> */}
      </TicketProvider>
    </AppProvider>
  </React.StrictMode>
);
