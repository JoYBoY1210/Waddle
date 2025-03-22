import React, { useEffect, useState } from "react";
import { useUser } from "./context/UserContext";
import { useNavigate } from "react-router-dom";
import { getCSRFTokenFromCookie } from "./getcsrf";


const UploadPdf = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [originalText, setOriginalText] = useState("");
  const [summarisedText, setSummarisedText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
    console.log(getCSRFTokenFromCookie())
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

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const formData = new FormData();
  const handlePdfUploadExtraction = async () => {
    if (!selectedFile) {
      alert("Please select a PDF file.");
      return;
    }

    
   
    console.log(formData.get("pdf_file"))

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/items/pdf/upload/", {
        method: "POST",
        headers: {
        //   "Content-Type": "multipart/form-data",
          "X-CSRFToken": getCSRFTokenFromCookie(),
        },
        body: formData,
        credentials: "include",
      });

      
      if (!response.ok) {
        const text = await response.text(); 
        console.error("Server Error:", text);
        throw new Error("Failed to upload PDF");
      }

      
      const data = await response.json();
      setOriginalText(data.extracted_text);
      setSummarisedText(data.summary_text);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    formData.append("pdf_file", selectedFile);
    formData.append("min_length", 50);
    formData.append("max_length", 200);
   },[selectedFile])

  return (
    <div className="bg-black flex flex-col h-screen w-screen">
      
      <div className="Navbar bg-violet-600 flex items-center p-5">
        <p className='text-white font-bold text-5xl font-["Tektur"] drop-shadow-[3px_3px_0_black]'>
          Waddle
        </p>

        <p className='text-white ml-auto font-semibold text-xl font-["Tektur"]'>
          Hello, {user ? user.username : "Guest"}
        </p>

        <button
          className="bg-gray-800 text-white p-1.5 rounded-lg ml-5 font-semibold shadow-md hover:bg-gray-700 active:translate-y-1 transition-all"
          onClick={() => navigate("/")}
        >
          Dashboard
        </button>

        <button
          className="bg-gray-800 text-white p-1.5 rounded-lg ml-5 font-semibold shadow-md hover:bg-gray-700 active:translate-y-1 transition-all"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      
      <div className="h-full p-7 bg-black w-5/6 flex">
        <div className="bigBox flex-1 bg-white w-5/6 p-5 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-xl font-bold text-gray-900">Original Text</h2>
          <div className="border border-gray-300 p-3 h-1/2 overflow-auto rounded-lg mt-2">
            {originalText ? (
              originalText
                .split("\n")
                .map((line, index) => <p key={index}>{line}</p>)
            ) : (
              <p className="text-gray-500">No extracted text yet.</p>
            )}
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-5">
            Summarised Text
          </h2>
          <div className="border border-gray-300 p-3 h-1/2 overflow-auto rounded-lg mt-2">
            {summarisedText ? (
              summarisedText
                .split("\n")
                .map((line, index) => <p key={index}>{line}</p>)
            ) : (
              <p className="text-gray-500">No summary yet.</p>
            )}
          </div>
        </div>

        
        <div className="pl-7 flex flex-col gap-5">
          <label className="bg-gray-800 text-white py-2 px-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition-all">
            Select PDF
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {selectedFile && (
            <p className="text-white text-sm">Selected: {selectedFile.name}</p>
          )}

          <button
            onClick={handlePdfUploadExtraction}
            disabled={loading}
            className="bg-violet-600 text-white rounded-lg p-2 cursor-pointer transition-all 
              shadow-md hover:bg-violet-500 active:translate-y-1 active:shadow-none font-bold w-40 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="white"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3v-4z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : (
              "Upload File"
            )}
          </button>

          <button
            onClick={() =>
              navigate("/create-note", {
                state: { originalText, summarisedText },
              })
            }
            className="bg-violet-600 text-white rounded-lg p-2 cursor-pointer transition-all 
              shadow-md hover:bg-violet-500 active:translate-y-1 active:shadow-none font-bold w-40"
          >
            Save as Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPdf;
