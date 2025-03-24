import React, { useState } from "react";
import { useUser } from "./context/UserContext";
import { useNavigate } from "react-router-dom";
import { getCSRFTokenFromCookie } from "./getcsrf";

const CreateFolder = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [folderName, setFolderName] = useState("");

  // Logout Function
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

  
  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      alert("Folder name cannot be empty.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/items/folders/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFTokenFromCookie(),
        },
        credentials: "include",
        body: JSON.stringify({ name: folderName }),
      });

      if (response.ok) {
        alert("Folder created successfully!");
        navigate("/"); 
      } else {
        alert("Failed to create folder.");
      }
    } catch (error) {
      console.log("Error creating folder:", error);
    }
  };

  return (
    <div className="bg-black flex flex-col w-screen h-screen">
      {/* Navbar */}
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

      
      <div className="p-10 flex flex-col items-center">
        <label className='text-white text-lg font-["Tektur"] mb-2'>
          Folder Name
        </label>
        <input
          type="text"
          className="bg-white text-black p-2 rounded-lg border-2 w-1/2 focus:border-violet-600"
          placeholder="Enter folder name..."
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <button
          onClick={handleCreateFolder}
          className="mt-4 cursor-pointer bg-green-600 hover:bg-green-500 p-2 rounded-lg text-white font-semibold transition-all 
                    shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_3px_0_0_rgba(0,0,0,0.8)] active:translate-y-1 active:shadow-none"
        >
          Create Folder
        </button>
      </div>
    </div>
  );
};

export default CreateFolder;
