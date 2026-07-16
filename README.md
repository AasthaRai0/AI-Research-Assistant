# 🤖 AI Research Assistant — RAG Based Document Intelligence System

![AI Research Assistant Banner](https://img.shields.io/badge/AI-RAG%20Assistant-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![LLM](https://img.shields.io/badge/AI-LLM-purple)
![Vector DB](https://img.shields.io/badge/Database-ChromaDB-orange)

## 📌 Overview

AI Research Assistant is an intelligent document-based question answering system powered by **Large Language Models (LLMs), Retrieval Augmented Generation (RAG), Embeddings, and Vector Databases**.

The application allows users to upload documents such as research papers, notes, books, and PDFs. The AI understands the uploaded content and answers user queries with accurate context-aware responses and source references.

Instead of generating random answers, the system retrieves relevant information from user documents and provides grounded responses using RAG architecture.

---

# ✨ Features

## 📄 Document Intelligence

- Upload PDF documents
- Extract text automatically
- Split large documents into smaller chunks
- Generate semantic embeddings
- Store document knowledge in vector database
- Search documents using natural language


---

## 🧠 RAG Based AI Question Answering

Users can ask questions from uploaded documents.

Example:

```
User:
Explain gradient descent.

AI:
According to your uploaded Machine Learning notes,
gradient descent is an optimization algorithm...

Source:
ML_notes.pdf - Page 23
```

Features:

- Context-aware answers
- Semantic search
- Source citation
- Reduced hallucination


---

## 🔐 Authentication System

Secure user management:

- User registration
- Login system
- JWT authentication
- Password hashing
- Protected routes


---

## 💬 AI Chat Interface

- ChatGPT-like experience
- Conversation history
- Multiple document support
- Markdown responses
- Source references
- Real-time AI responses


---

## 🔎 Semantic Document Search

The system understands the meaning behind queries instead of matching only keywords.

Example:

Searching:

```
How does a neural network learn?
```

Can find:

```
Backpropagation and optimization techniques...
```

even if exact words are not present.

---

# 🏗️ System Architecture


```
                         USER
                           |
                           |
                    React Frontend
                           |
                           |
                    FastAPI Backend
                           |
        ------------------------------------------------
        |                      |                       |
   Authentication          RAG Pipeline           Database
        |                      |                       |
       JWT                LangChain              PostgreSQL
                               |
                 -----------------------------
                 |                           |
           Embedding Model             Vector Database
                 |                           |
       Sentence Transformers          ChromaDB
                 
                               |
                               |
                              LLM
                         GPT / Llama Model

```

---

# 🔄 RAG Pipeline Workflow


```
              PDF Upload

                  |
                  ↓

          Extract Text From PDF

                  |
                  ↓

            Text Chunking

                  |
                  ↓

        Generate Text Embeddings

                  |
                  ↓

        Store Vectors in ChromaDB

                  |
                  ↓

             User Question

                  |
                  ↓

       Convert Question Embedding

                  |
                  ↓

       Similarity Search Retrieval

                  |
                  ↓

       Retrieve Relevant Context

                  |
                  ↓

        Context + Question → LLM

                  |
                  ↓

            Final AI Answer

```

---

# 🛠️ Tech Stack


## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion
- Lucide Icons


## Backend

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- JWT Authentication


## AI / Machine Learning

- Large Language Models (LLMs)
- Retrieval Augmented Generation (RAG)
- LangChain
- Sentence Transformers
- Embeddings
- Prompt Engineering


## Vector Database

- ChromaDB


## Deployment

- Docker
- Render
- Vercel


---

# 📂 Project Structure


```
AI-Research-Assistant/

│
├── frontend/
│
│   ├── src/
│   │
│   ├── components/
│   │
│   ├── pages/
│   │
│   ├── services/
│   │
│   └── App.jsx
│
│
├── backend/
│
│   ├── app/
│   │
│   ├── main.py
│   │
│   ├── routers/
│   │      ├── auth.py
│   │      ├── documents.py
│   │      └── chat.py
│   │
│   ├── rag/
│   │      ├── embeddings.py
│   │      ├── retriever.py
│   │      ├── vector_store.py
│   │      └── llm.py
│   │
│   ├── database/
│   │      ├── database.py
│   │      └── models.py
│   │
│   ├── auth/
│   │      └── jwt.py
│   │
│   ├── services/
│   │
│   └── requirements.txt
│
│
├── docker-compose.yml
├── README.md
└── .env

```

---

# ⚙️ Installation & Setup


## 1. Clone Repository


```bash
git clone https://github.com/yourusername/AI-Research-Assistant.git

cd AI-Research-Assistant
```


---

# Backend Setup


Go to backend:

```bash
cd backend
```


Create virtual environment:

```bash
python -m venv venv
```


Activate:


Windows:

```bash
venv\Scripts\activate
```


Linux/Mac:

```bash
source venv/bin/activate
```


Install dependencies:


```bash
pip install -r requirements.txt
```


Run backend:


```bash
uvicorn app.main:app --reload
```


Backend:

```
http://localhost:8000
```


API Documentation:

```
http://localhost:8000/docs
```


---

# Frontend Setup


Go to frontend:


```bash
cd frontend
```


Install packages:


```bash
npm install
```


Start application:


```bash
npm run dev
```


Frontend:

```
http://localhost:5173
```

---

# 🔌 API Endpoints


## Authentication


### Register User

```
POST /auth/signup
```


### Login User


```
POST /auth/login
```


Returns JWT token.


---

# Documents API


## Upload Document


```
POST /documents/upload
```


Flow:


```
PDF
 |
Text Extraction
 |
Chunk Creation
 |
Embedding Generation
 |
Vector Storage

```


---

## Get Documents


```
GET /documents
```


---

# Chat API


## Ask Question


```
POST /chat
```


Request:


```json
{
"question":"Explain deep learning",
"document_id":1
}
```


Response:


```json
{
"answer":"Deep learning is...",
"sources":[
 {
  "document":"AI_notes.pdf",
  "page":15
 }
]
}

```

---

# 🧠 Core AI Concepts Used


## Large Language Models (LLMs)

LLMs are used for:

- Understanding user queries
- Generating human-like responses
- Reasoning over retrieved information


---

## Embeddings


Text is converted into numerical vectors.


Example:

```
"Machine Learning"

        ↓

[0.123,0.456,0.789...]

```


These vectors represent semantic meaning.


---

## Vector Database


Stores embeddings and performs similarity search.


```
Question Vector

        ↓

Vector Search

        ↓

Relevant Document Chunks

```


---

## Retrieval Augmented Generation


Traditional LLM:

```
Question
   |
   ↓
LLM
   |
   ↓
Answer

```


RAG:

```
Question

   ↓

Retrieve Knowledge

   ↓

LLM + Context

   ↓

Accurate Answer

```

---

# 🚀 Future Improvements


## AI Agents

Add autonomous AI agents capable of:

- Web searching
- Research automation
- Data analysis


---

## Voice Assistant

Add:

- Speech to Text
- Text to Speech


---

## Advanced Memory System

AI remembers:

- User preferences
- Previous conversations
- Research history
