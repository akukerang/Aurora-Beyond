import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import FeaturePage from "./pages/FeaturePage";
import MagicPage from "./pages/MagicPage";
import ItemPage from "./pages/ItemPage";
import { CharacterProvider } from "./hooks/CharacterContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <CharacterProvider>
    <HashRouter basename={"/"}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<FeaturePage />} />
          <Route path="magic" element={<MagicPage />} />
          <Route path="items" element={<ItemPage />} />
        </Route>
      </Routes>
    </HashRouter>
  </CharacterProvider>
);
