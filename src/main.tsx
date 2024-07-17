import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";

//redux
import { Provider } from "react-redux";
import Store from "./store/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={Store}>
    <Router>
      <App />
    </Router>
  </Provider>
);
