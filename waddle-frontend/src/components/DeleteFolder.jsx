import React, { useState, useEffect } from "react";
import { useUser } from "./context/UserContext";
import { useNavigate } from "react-router-dom";
import { getCSRFTokenFromCookie } from "./getcsrf";

const DeleteFolder = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [folder, setFolder] = useState(""); 
  const [folders, setFolders] = useState([]); 

  
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/logout/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) navigate("/auth");
    } catch (error) {
      console.log("Logout failed", error);
    }
  };

  
  const handleDeleteFolder = async () => {
    if (!folder) {
      alert("Please select a folder to delete.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/items/folders/${folder}/`, {
        method: "DELETE",
        headers: {
          "X-CSRFToken": getCSRFTokenFromCookie(),
        },
        credentials: "include",
      });

      if (response.ok) {
        alert("Folder deleted successfully!");
        setFolders(folders.filter((f) => f.id !== folder)); 
        setFolder(""); 
        navigate('/')
      } else {
        alert("Failed to delete folder.");
      }
    } catch (error) {
      console.log("Error deleting folder:", error);
    }
  };

  
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch("http://localhost:8000/items/folders/", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch folders");
        }

        const data = await response.json();
        setFolders(data);
      } catch (error) {
        console.log("Error fetching folders:", error);
      }
    };

    fetchFolders();
  }, []);

  return (
    <div className="bg-black flex flex-col w-screen h-screen">
      
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
          onClick={() => navigate("/")}
        >
          Dashboard
        </button>

        <button
          className="cursor-pointer bg-gray-800 hover:bg-gray-700 p-1.5 rounded-lg ml-5 text-white font-semibold transition-all 
                shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_3px_0_0_rgba(0,0,0,0.8)] active:translate-y-1 active:shadow-none"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      
      <div className="p-10">
        <label className='text-white block text-lg font-["Tektur"] mb-1'>
          Select Folder
        </label>
        <select
          className="bg-white w-full p-2 rounded-lg border-2 focus:border-violet-600"
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
        >
          <option value="" disabled>
            Select a folder
          </option>
          {folders.map((folderItem) => (
            <option key={folderItem.id} value={folderItem.id}>
              {folderItem.name}
            </option>
          ))}
        </select>

        
        <button
          onClick={handleDeleteFolder}
          className="mt-4 cursor-pointer bg-red-600 hover:bg-red-500 p-2 rounded-lg text-white font-semibold transition-all 
                    shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_3px_0_0_rgba(0,0,0,0.8)] active:translate-y-1 active:shadow-none"
        >
          Delete Folder
        </button>
      </div>
    </div>
  );
};

export default DeleteFolder;
