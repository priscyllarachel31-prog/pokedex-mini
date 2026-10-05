import { HashRouter, Routes, Route } from "react-router-dom";
import FavoritesProvider from "./components/FavoritesProvider.jsx";
import Layout from "./components/Layout.jsx";
import ListPage from "./pages/ListPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import DetailPage from "./pages/DetailPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function App() {
  return (
    <FavoritesProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<ListPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/pokemon/:name" element={<DetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </FavoritesProvider>
  );
}

export default App;