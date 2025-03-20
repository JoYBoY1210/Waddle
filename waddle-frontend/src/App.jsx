import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import { UserContextProvider, useUser } from "./components/context/UserContext";

function App() {
  const { isAuthenticated } = useUser(); 

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <DashboardPage /> : <AuthPage />} />
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
