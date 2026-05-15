# Intelligent Bistro 🍽️

AI-powered restaurant ordering experience built with React Native (Expo) and Node.js.

Users can browse menu items, manage their shopping cart, and interact with an AI assistant using natural language ordering.

## ✨ Features

### 📱 Frontend (React Native + Expo)

- Modern mobile restaurant UI
- Browse categorized menu items
- Add/remove/update cart items
- Dynamic quantity controls
- AI-powered conversational ordering assistant
- Real-time cart updates
- Responsive and clean user experience

### ⚙️ Backend (Node.js + Express)

- REST API for menu and AI order processing
- Natural language order understanding using Google Gemini API
- Structured JSON cart action responses
- Intelligent item matching and quantity parsing
- Rule-based fallback handling for improved reliability

## 🧠 AI Ordering Examples

Users can type:

- Add two spicy chicken sandwiches and one lemonade
- I want 3 burgers and 2 mango smoothies
- Remove the lemonade
- Clear my cart

The backend converts natural language into structured cart actions:

```json
{
  "actions": [
    {
      "type": "add",
      "item_id": "m1",
      "item_name": "Spicy Chicken Sandwich",
      "quantity": 2
    }
  ]
}
```

## 🏗️ Architecture

```
Frontend (Expo React Native)
        ↓
Axios API Calls
        ↓
Node.js Express Backend
        ↓
Gemini AI + Intent Parser
        ↓
Structured JSON Actions
        ↓
Zustand Cart Store Updates
```

## 🛠️ Tech Stack

### Frontend

- React Native
- Expo
- TypeScript
- Zustand
- Axios
- React Navigation

### Backend

- Node.js
- Express.js
- Google Gemini API
- dotenv
- CORS

## 📂 Project Structure

```
intelligent-bistro/
│
├── frontend/
│   ├── src/
│   │   ├── screens/
│   │   ├── store/
│   │   ├── components/
│   │   └── constants/
│   └── App.tsx
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── data/
│   │   └── server.js
│
└── README.md
```

## 🚀 Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd intelligent-bistro
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=3001
```

Run backend:

```bash
npm run dev
```

Backend runs on:

```
http://localhost:3001
```

### Frontend Setup

```bash
cd frontend
npm install
npx expo start
```

#### For iOS Simulator

Use:

```ts
const API_URL = "http://localhost:3001";
```

#### For Physical Device / Expo Go

Replace with your machine IP:

```ts
const API_URL = "http://YOUR_LOCAL_IP:3001";
```

Example:

```ts
const API_URL = "http://192.168.1.25:3001";
```

## 📡 API Endpoints

### Health Check

```
GET /api/health
```

### Get Menu

```
GET /api/menu
```

### AI Order Processing

```
POST /api/ai/order
```

Example request:

```json
{
  "message": "Add two burgers and one lemonade"
}
```

## 🎥 Demo Features

- Menu browsing
- Add/remove items manually
- AI conversational ordering
- Real-time cart updates
- Quantity controls
- Dynamic cart totals

## 💡 Development Notes

- Built with focus on clean UX and conversational commerce.
- AI parsing supports both numeric and written quantities.
- Zustand used for lightweight and scalable state management.
- Backend designed for extensibility with future LLM integrations.
