import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import NewsDetailPage from "./pages/NewsDetailPage.jsx";

function App() {
  return (
    <>
      <Header />
      <main className="container" style={{ paddingTop: "32px", paddingBottom: "60px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;