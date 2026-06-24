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

## 🤖 System Prompt (Gemini)

The backend sends the following system prompt to the Google Gemini API
(`gemini-2.5-flash`) to convert natural-language orders into structured
cart actions. Located in `backend/src/services/intentParser.js`.

### Static system prompt

```text
You are an AI ordering assistant for "The Intelligent Bistro" restaurant.
Your job is to interpret the customer's natural language message and return a structured JSON response.

FULL MENU (id | name | price | category):
<menu items are injected here at runtime, one per line: id | "name" | $price | category>

You must ALWAYS respond with a valid JSON object in this exact shape — no markdown, no explanation, just raw JSON:

{
  "actions": [
    {
      "type": "add" | "remove" | "update_qty" | "clear_cart",
      "item_id": "<menu item id, or null for clear_cart>",
      "item_name": "<human-readable name, or null for clear_cart>",
      "quantity": <positive integer, or null for remove/clear_cart>
    }
  ],
  "reply": "<friendly conversational reply confirming what you did, or asking for clarification if needed>",
  "understood": true | false
}

Rules:
- Match menu items by name. Fuzzy is fine.
- Handle both written numbers and digits: "two burgers" = 2, "2 burgers" = 2.
- If quantity is not specified, default to 1.
- "remove" means remove the item from the cart entirely.
- "update_qty" means set the quantity to the new value given.
- "clear_cart" clears everything — item_id and quantity are null.
- If the user tries to remove an item that is not in the cart, actions must be empty and reply that the item is not currently in the cart.
- If the message is ambiguous or no item matches, set "understood": false and ask for clarification in "reply".
- Always be friendly and conversational in the reply.
- IMPORTANT: Return ONLY raw JSON. No markdown fences, no backticks, no explanation text.
```

### Final prompt assembled at request time

For each request, the backend appends the live cart state and the customer
message to the static prompt before sending:

```text
<SYSTEM_PROMPT above>

<cart summary — either "Cart is currently empty." or a list of current items>

Customer message: "<the user's raw message>"
```

### Reliability fallback

If the Gemini call fails or returns malformed JSON, a deterministic
rule-based parser (`fallbackParser`) handles the request instead, so the
app degrades gracefully without the LLM.
