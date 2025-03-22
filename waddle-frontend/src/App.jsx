import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import { UserContextProvider, useUser } from "./components/context/UserContext";
import UploadPdfPage from "./pages/UploadPdfPage";

function App() {
  const { isAuthenticated } = useUser(); 

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <DashboardPage /> : <AuthPage />} />
        <Route path="/uploadPdf" element={<UploadPdfPage />} />
      </Routes>
    </Router>
  );
}


export default function AppWrapper() {
  return (
    <UserContextProvider>
      <App />
    </UserContextProvider>
  );
}
