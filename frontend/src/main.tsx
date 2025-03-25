import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import FeaturePage from "./pages/FeaturePage";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <HashRouter basename={"/"}>
    {/* The rest of your app goes here */}
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<FeaturePage />} />
      </Route>
    </Routes>
  </HashRouter>
);
