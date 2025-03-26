# Waddle 🐧✨  
### Your AI-Powered Notes Summarizer 📄➡️📝

Waddle is an **AI-powered** notes summarizer that helps you **upload PDFs**, **summarize notes using AI (BART)**, and **organize them in folders** for easy access. Built with a sleek and structured approach, Waddle ensures that your notes stay **neatly organized** while giving you quick and efficient summaries! 🚀🐧

---

## 🌟 Features

✅ **Session-Based Authentication** 🔐  
✅ **AI-Powered Summarization (BART Model)** 🤖✍️  
✅ **Upload PDFs & Extract Text** 📂📑  
✅ **Save Summarized Notes in Folders** 🗂️✨  
✅ **Well-Organized Note Management** 📌📋  
✅ **Sleek & User-Friendly Interface** 🎨💡  

---

## 🛠️ Tech Stack

🔹 **Backend:** Django + Django REST Framework 🐍🎯  
🔹 **Frontend:** React (Vite) ⚛️🚀  
🔹 **AI Model:** BART (for Summarization) 🧠📖  
🔹 **Database:** SQLite 🗄️  
🔹 **Authentication:** Session-Based Auth 🔐  

---

## 🏗️ How to Run Waddle Locally 🏡🐧

Follow these steps to set up Waddle on your own machine! 🖥️✨

### 1️⃣ Clone the Repository 📂
```bash
 git clone https://github.com/yourusername/waddle.git
 cd waddle
```

### 2️⃣ Backend Setup 🛠️
Make sure you have **Python (>=3.8) & pip** installed.

```bash
 cd backend
 python -m venv venv  # Create a virtual environment
 source venv/bin/activate  # Activate (Mac/Linux)
 venv\Scripts\activate  # Activate (Windows)
 pip install -r requirements.txt  # Install dependencies
```

Setup the database & migrations:
```bash
 python manage.py makemigrations
 python manage.py migrate
```

Create a superuser (optional, for admin access):
```bash
 python manage.py createsuperuser
```

Run the backend server:
```bash
 python manage.py runserver
```

### 3️⃣ Frontend Setup ⚛️
Make sure you have **Node.js (>=16) & npm** installed.

```bash
 cd frontend
 npm install  # Install dependencies
 npm run dev  # Start the development server
```

### 4️⃣ Access Waddle 🌍🐧
Backend: http://127.0.0.1:8000/  
Frontend: http://localhost:5173/  

🎉 **Congratulations! Waddle is now running on your local machine!** 🚀🐧

---

## 🤝 Contributing
Want to improve Waddle? Feel free to **fork, clone, and contribute!** 🛠️✨

1. **Fork the repository** 🍴
2. **Create a new branch** (`feature-branch`) 🌿
3. **Commit your changes** 💾
4. **Push to your branch** 🚀
5. **Open a Pull Request** 🔄

---

## 📜 License
Waddle is open-source and available under the **MIT License**. 📝✨

🐧 **Happy Summarizing! Keep Waddling!** 🐾❄️

