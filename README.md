# Document Q&A System

## Overview
The Document Q&A system enables users to upload documents (PDF or text) and ask questions based on the uploaded content. The system processes the document's text and generates answers strictly according to the document's content. It also maintains a history of past questions and answers for reference.

### Tech Stack
- Frontend: React.js
- Backend: Node.js + Express.js
- Database: MongoDB
- AI API: OpenAI (Claude3 via RapidAPI)

### How to Initialize the Project

**Prerequisites**

Ensure you have the following installed:
- Node.js (latest LTS version recommended)
- MongoDB (local or cloud instance)
- npm or yarn

**Setup Instructions**

1. Clone the Repository
```bash
git clone https://github.com/saksham25022004/SkillRank.git
cd document-QA
```
2. Backend Setup

- Navigate to the backend directory:
```bash
cd backend
```
- Install dependencies:
```bash
npm install
```
- Configure environment variables (.env file):
```bash
MONGO_URI=your_mongodb_connection_string
```
- Start the backend server:
```bash
npm start
```
3. Frontend Setup

- Navigate to the frontend directory:
```bash
cd frontend
```
- Install dependencies:
```bash
npm install
```
- Start the frontend application:
```bash
npm start
```

### Usage
- Open the frontend in your browser (http://localhost:3000).
- Upload a document (PDF or text).
- Ask questions related to the uploaded document.
- View answers and previous Q&A history.