import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import Game from "./pages/Game";
import Register from "./pages/Register";
import Page from "./pages/activate-user-status";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* { <Route path="/" element={<Sayfa1 />} /> } */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/game" element={<Game />} />
        <Route path="/register" element={<Register />} />
        <Route path="/activate-user-mail" element={<Page />} />
        <Route path="/admin-page" element={<AdminPage />} />
        AdminPage
        {/* Use the element prop */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
