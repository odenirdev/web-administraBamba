import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "./assets/styles/global.css";
import { NotificationContainer } from "react-notifications";

ReactDOM.render(
    <React.StrictMode>
        <NotificationContainer />
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
