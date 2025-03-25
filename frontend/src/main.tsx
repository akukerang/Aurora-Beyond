import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import FeaturePage from "./pages/FeaturePage";
import MagicPage from "./pages/MagicPage";
import ItemPage from "./pages/ItemPage";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <HashRouter basename={"/"}>
    {/* The rest of your app goes here */}
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<FeaturePage />} />
        <Route path="magic" element={<MagicPage />} />
        <Route path="items" element={<ItemPage />} />
      </Route>
    </Routes>
  </HashRouter>
);
