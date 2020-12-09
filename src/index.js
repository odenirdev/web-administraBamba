import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { NotificationContainer } from "react-notifications";

ReactDOM.render(
    <React.StrictMode>
        <NotificationContainer />
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
