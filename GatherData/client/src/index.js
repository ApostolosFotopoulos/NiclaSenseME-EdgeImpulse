import React from "react";
import ReactDOM from "react-dom/client";
import "styles/index.css";
import { store } from "app/store.js";
import { Provider } from "react-redux";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import App from "app/App";

disableReactDevTools();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
