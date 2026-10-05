import { useState, useEffect } from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import { useFavorites } from "../favorites.js";
import { isMuted, setMuted, playSound } from "../sound.js";

function Layout() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );
  const [soundOff, setSoundOff] = useState(() => isMuted());
  const { favorites } = useFavorites();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    playSound("click");
    setTheme(theme === "light" ? "dark" : "light");
  }

  function toggleSound() {
    const next = !soundOff;
    setMuted(next);
    setSoundOff(next);
    if (!next) playSound("click"); // beri contoh suara saat dinyalakan
  }

  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="app-title-link">
          <h1>PokéDex Mini</h1>
        </Link>
        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={toggleSound}
            aria-label={soundOff ? "Turn sound on" : "Turn sound off"}
          >
            {soundOff ? "🔇" : "🔊"}
          </button>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      </header>

      <nav className="tabs">
        <NavLink to="/" end className="tab" onClick={() => playSound("click")}>
          Explore
        </NavLink>
        <NavLink to="/favorites" className="tab" onClick={() => playSound("click")}>
          ❤️ Favorites <span className="tab-count">{favorites.length}</span>
        </NavLink>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;