import React, { useState, useEffect } from "react";
import { getCSRFTokenFromCookie } from "./getcsrf";
import { useUser } from "./context/UserContext";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import { GrNotes } from "react-icons/gr";
import { useNavigate } from "react-router-dom";



const Dashboard = () => {
  const [Folders, setFolders] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const { user, setIsAuthenticated } = useUser();
  const [expandedFolders, setExpandedFolders] = useState({});
  
    const navigate = useNavigate();

  const handleNoteselect = (note) => {
    setSelectedNote(note);
  };



  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFTokenFromCookie(),
        },
        credentials: "include",
      });
      if (response.ok) {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log("Logout failed", error);
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await fetch("http://localhost:8000/items/folders/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFTokenFromCookie(),
        },
        credentials: "include",
      });

      if (!response.ok) {
        console.log("Failed to fetch folders");
      }

      const data = await response.json();
      setFolders(data);
      console.log("folders are:", data);
    } catch (error) {
      console.log("Could not fetch folders", error);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);


  const handleDeleteFolder=()=>{
    navigate('/deleteFolder')
  }
  const handleDeleteNote=()=>{
    navigate('/deleteNote')
  }



  const toggleFolder = (folderId) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  console.log(user);

  const handleUploadPdf =()=>{
    navigate('/uploadpdf')
  }
  const handleCreateNote=()=>{
    navigate('/CreateManualNote')
  }
  const handleCreatefolder=()=>{
    navigate('/createFolder')
  }

  return (
    <div className="bg-black w-full h-screen flex flex-col">
      <div className="Navbar bg-violet-600 flex items-center p-5">
        <p className='text-white font-bold text-5xl font-["Tektur"] drop-shadow-[3px_3px_0_black]'>
          Waddle
        </p>

        <p className='text-white ml-auto font-semibold text-xl font-["Tektur"]'>
          Hello, {user ? user.username : "Guest"}
        </p>
        <button
          className="cursor-pointer bg-gray-800 hover:bg-gray-700 p-1.5 rounded-lg ml-5 text-white font-semibold transition-all 
                shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_3px_0_0_rgba(0,0,0,0.8)] active:translate-y-1 active:shadow-none"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      
      <div className="flex h-full">
        
        <div className="LeftBar w-1/6 h-full p-3 bg-gray-900 text-white">
          <h2 className='text-xl font-bold pt-5 sm:text-2xl font-["Tektur"] '>
            Your Folders
          </h2>
          <ul className="pt-3">
            {Folders.map((folder) => (
              <li key={folder.id}>
                <div
                  className="cursor-pointer flex items-center"
                  onClick={() => toggleFolder(folder.id)}
                >
                  <span className="mr-2">
                    {expandedFolders[folder.id] ? (
                      <IoMdArrowDropdown size={30} />
                    ) : (
                      <IoMdArrowDropright size={30} />
                    )}
                  </span>
                  <span className="font-semibold">{folder.name}</span>
                </div>
                {expandedFolders[folder.id] && (
                  <ul className="ml-6 mt-1">
                    {folder.notes.map((note) => (
                      <li
                        key={note.id}
                        className="cursor-pointer flex items-center text-gray-300 hover:text-white"
                        onClick={() => handleNoteselect(note)}
                      >
                        <GrNotes size={15} />
                        <span className="ml-2">{note.title}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mainContentArea bg-black flex p-3 h-full w-5/6">
          {selectedNote ? (
            <div className="bigBox flex-1 bg-white w-5/6 p-5 rounded-lg shadow-lg flex flex-col">
              <h2 className="text-xl font-bold text-gray-900">Original Text</h2>
              <div className="border border-gray-300 p-3 h-1/2 overflow-auto rounded-lg mt-2">
                {selectedNote.content.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>

              <h2 className="text-xl font-bold text-gray-900 mt-5">
                Summarised Text
              </h2>
              <div className="border border-gray-300 p-3 h-1/2 overflow-auto rounded-lg mt-2">
                {selectedNote.summary.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-white w-5/6">Nothing to see</div>
          )}

          <div className="buttonArea w-1/6 gap-y-5 flex flex-col gap-3 ml-3">
            <button
              className="bg-violet-600 text-white rounded-lg p-1 cursor-pointer transition-all 
                shadow-[4px_4px_0_0_rgba(109,40,217,1)] hover:bg-violet-500 
                active:translate-y-1 active:shadow-none font-bold "
                onClick={handleUploadPdf}
            >
              Upload Pdf
            </button>
            <button
              className="bg-violet-600 text-white rounded-lg p-1 cursor-pointer transition-all 
                shadow-[4px_4px_0_0_rgba(109,40,217,1)] hover:bg-violet-500 
                active:translate-y-1 active:shadow-none font-bold "
                onClick={handleCreateNote}
            >
              Create Note
            </button>
            <button
              className="bg-violet-600 text-white rounded-lg p-1 cursor-pointer transition-all 
                shadow-[4px_4px_0_0_rgba(109,40,217,1)] hover:bg-violet-500 
                active:translate-y-1 active:shadow-none font-bold "
                onClick={handleCreatefolder}
            >
              Create Folder
            </button>
            <button
              className="bg-red-600 text-white rounded-lg p-1 cursor-pointer transition-all 
                shadow-[4px_4px_0_0_#fb2c36] hover:bg-red-500 
                active:translate-y-1 active:shadow-none font-bold "
                onClick={handleDeleteFolder}
            >
              Delete folder
            </button>
            <button
              className="bg-red-600 text-white rounded-lg p-1 cursor-pointer transition-all 
                shadow-[4px_4px_0_0_#fb2c36] hover:bg-red-500 
                active:translate-y-1 active:shadow-none font-bold "
                onClick={handleDeleteNote}
            >
              Delete Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
