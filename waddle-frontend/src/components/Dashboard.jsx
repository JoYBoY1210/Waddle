import React, { useState, useEffect } from 'react';
import { getCSRFTokenFromCookie } from './getcsrf';
import { useUser } from './context/UserContext';


const Dashboard = () => {
    const [Folders, setFolders] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const { user } = useUser();
    const { setIsAuthenticated } = useUser();
    const [expandedFolders, setExpandedFolders] = useState({});

    const handleLogout = async() =>{
        try{
            const response= await fetch("http://localhost:8000/auth/logout/",{

                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    'X-CSRFToken': getCSRFTokenFromCookie(),

                },
                credentials: "include",
            });
            if(response.ok){
                setIsAuthenticated(false);

            }
            
            
        }catch (error) {
            console.log("Logout failed", error);
        }
    }

    const fetchFolders = async () => {
        try {
            const response = await fetch("http://localhost:8000/items/folders/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'X-CSRFToken': getCSRFTokenFromCookie.csrfToken,
                },
                credentials: "include",
            });

            if (!response.ok) {
                console.log("Failed to fetch folders");
            }

            const data = await response.json();
            setFolders(data);
            console.log("folders are :", data);
        } catch (error) {
            console.log("could not fetch folders ", error);
        }
    };



    useEffect(() => { fetchFolders(); }, []);

    const toggleFolder =(folderId) => {
        setExpandedFolders((prev)=>({
            ...prev,
            [folderId]:!prev[folderId]
        }))
    }

    return (
        <div className='bg-black w-full h-screen flex flex-col'>
            <div className='Navbar bg-violet-600  flex items-center p-5'>
            <p className='text-white font-bold text-5xl font-["Tektur"] drop-shadow-[3px_3px_0_black]'>
                Waddle
            </p>

                <p className='text-white ml-auto font-semibold text-xl  font-["Tektur"]'>
                    Hello, {user ? user.username : "Guest"}
                </p>
                <button
                className="cursor-pointer bg-gray-800 hover:bg-gray-700 p-1.5 rounded-lg ml-5 text-white font-semibold transition-all 
                shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_3px_0_0_rgba(0,0,0,0.8)] active:translate-y-1 active:shadow-none" onClick={handleLogout}
                >
                     Logout
                </button>



            </div>


            <div className='LeftBar w-1/6 h-full p-3 bg-gray-900 text-white'>
                <h2 className='text-xl font-bold pt-5 sm:text-2xl font-["Tektur"] '>
                    Your Folders
                </h2>
                <ul className='pt-3'>
                    {Folders.map((folder)=>(
                        <li key={folder.id} >
                            <div
                                className="cursor-pointer flex items-center"
                                onClick={() => toggleFolder(folder.id)}
                            >
                                <span className="mr-2">{expandedFolders[folder.id] ? "▼" : "▶"}</span>
                                <span className="font-semibold">{folder.name}</span>
                            </div>
                        </li>
                    ))}

                </ul>





            </div>
        </div>
    );
};

export default Dashboard;
