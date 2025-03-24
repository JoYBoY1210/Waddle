import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import { UserContextProvider, useUser } from "./components/context/UserContext";
import UploadPdfPage from "./pages/UploadPdfPage";
import CreateNotefrompdfPage from "./pages/CreateNotefrompdfPage";
import CreateManualNotePage from "./pages/CreateManualNotePage";
import DeleteFolderPage from "./pages/DeleteFolderPage";
import DeleteNotePage from "./pages/DeleteNotePage";
import CreateFolderpage from "./pages/CreateFolderpage";

function App() {
  const { isAuthenticated } = useUser(); 

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <DashboardPage /> : <AuthPage />} />
        <Route path="/uploadPdf" element={<UploadPdfPage />} />
        <Route path="/createNote" element={<CreateNotefrompdfPage />} />
        <Route path="/CreateManualNote" element={<CreateManualNotePage />} />
        <Route path="/deleteFolder" element={<DeleteFolderPage />} />
        <Route path="/deleteNote" element={<DeleteNotePage />} />
        <Route path="/createFolder" element={<CreateFolderpage />} />


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
