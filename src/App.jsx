import { Routes, Route } from "react-router-dom";
import { Starfield } from "./components/Starfield";
import { BottomNav } from "./components/BottomNav";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <div className="app-shell">
      <Starfield />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}
