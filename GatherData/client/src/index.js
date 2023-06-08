import React from "react";
import ReactDOM from "react-dom/client";
import "styles/index.css";
import Main from "pages/main/Main";
import Login from "pages/login/Login.js";
import Signup from "pages/signup/Signup.js";
import { store } from "./app/store.js";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Signup />
    </Provider>
  </React.StrictMode>
);
