import React from "react";
import ReactDOM from "react-dom";

import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Config, DAppProvider } from "@usedapp/core";
import { ToastContainer } from "react-toastify";

import '../src/styles/components/style.css';



const config: Config = {
  supportedChains: [4, 97, 80001, 1, 56, 137, 1285, 100009],
  notifications: {
    expirationPeriod: 1000,
    checkInterval: 1000,
  },
};


ReactDOM.render(
  <React.StrictMode>
          <ToastContainer />
          <DAppProvider config={config}>
            <App />
          </DAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
