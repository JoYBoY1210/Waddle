import React, { useEffect, useState } from 'react';
import { useUser } from './context/UserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCSRFTokenFromCookie } from './getcsrf';

const CreateNoteFromPdf = () => {
  const location = useLocation();
  const { user } = useUser();
  const navigate = useNavigate();
  const { originalText, summarisedText, pdfPath } = location.state || {};

  const [title, setTitle] = useState('');
  const [content, setContent] = useState(originalText || '');
  const [summary, setSummary] = useState(summarisedText || '');
  const [folder, setFolder] = useState('');
  const [folders, setFolders] = useState([]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch('http://localhost:8000/items/folders/', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch folders');
        }

        const data = await response.json();
        setFolders(data); 
      } catch (error) {
        console.log('Error fetching folders:', error);
      }
    };

    fetchFolders();
  }, []);

  const handleSaveNote = async () => {
    if (!title.trim() || !folder.trim()) {
      alert('Title and Folder are required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/items/saveAsNote/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFTokenFromCookie(),
        },
        credentials: 'include',
        body: JSON.stringify({
          title,
          extracted_text: content,
          summary_text: summary,
          folder_name: folder,
          pdf_path: pdfPath,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save note');
      }

      navigate('/');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/logout/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (response.ok) navigate('/auth');
    } catch (error) {
      console.log('Logout failed', error);
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col">
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

      
      <div className="flex-grow bg-black p-4 md:p-8 flex flex-col items-center">
        <h1 className='text-white text-2xl md:text-3xl font-semibold mb-5 font-["Tektur"]'>Create a New Note</h1>

        <div className="w-full max-w-2xl bg-gray-900 p-6 rounded-lg shadow-lg">
          

          <div className="mb-4">
            <label className='text-white block text-lg font-["Tektur"] mb-1'>Title</label>
            <input
              type="text"
              className="bg-white w-full p-2 rounded-lg border-2 focus:border-violet-600"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
            />
          </div>

          
          <div className="mb-4">
            <label className='text-white block text-lg font-["Tektur"] mb-1'>Select Folder</label>
            <select
              className="bg-white w-full p-2 rounded-lg border-2 focus:border-violet-600"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
            >
              <option value="" disabled>
                Select a folder
              </option>
              {folders.map((folderItem) => (
                <option key={folderItem.id} value={folderItem.name}>
                  {folderItem.name}
                </option>
              ))}
            </select>
          </div>

          
          <div className="mb-4">
            <label className='text-white block text-lg font-["Tektur"] mb-1'>Content</label>
            <textarea
              rows={5}
              className="bg-white w-full p-2 rounded-lg border-2 focus:border-violet-600"
              placeholder="Enter content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>

          
          <div className="mb-4">
            <label className='text-white block text-lg font-["Tektur"] mb-1'>Summary</label>
            <textarea
              rows={5}
              className="bg-white w-full p-2 rounded-lg border-2 focus:border-violet-600"
              placeholder="Enter summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            ></textarea>
          </div>

          
          <button
            className={`w-full bg-violet-600 hover:bg-violet-500 p-3 text-white font-semibold rounded-lg transition-all ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleSaveNote}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNoteFromPdf;