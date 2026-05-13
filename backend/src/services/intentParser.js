require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const menu = require("../data/menu");
 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
 
// Build a compact menu reference string for the prompt
const menuSummary = menu
  .map((item) => `${item.id} | "${item.name}" | $${item.price} | ${item.category}`)
  .join("\n");
 
const SYSTEM_PROMPT = `You are an AI ordering assistant for "The Intelligent Bistro" restaurant.
Your job is to interpret the customer's natural language message and return a structured JSON response.
 
FULL MENU (id | name | price | category):
${menuSummary}
 
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
- Match menu items by name (fuzzy is fine — "chicken sandwich" matches "Spicy Chicken Sandwich").
- If quantity is not specified, default to 1.
- "remove" means remove the item from the cart entirely.
- "update_qty" means set the quantity to the new value given.
- "clear_cart" clears everything — item_id and quantity are null.
- If the message is ambiguous or no item matches, set "understood": false and ask for clarification in "reply".
- If it's just a greeting or unrelated message, return an empty actions array and reply helpfully.
- Always be friendly and conversational in the reply.
- IMPORTANT: Return ONLY raw JSON. No markdown fences, no backticks, no explanation text.`;
 
/**
 * Parse a natural language order message into structured cart actions.
 * @param {string} userMessage - The customer's message
 * @param {Array}  cartContext  - Current cart items (optional, for context)
 * @returns {Promise<{actions, reply, understood}>}
 */
async function parseOrderIntent(userMessage, cartContext = []) {
  const cartSummary =
    cartContext.length === 0
      ? "Cart is currently empty."
      : "Current cart:\n" +
        cartContext
          .map((item) => `- ${item.item_name} x${item.quantity} ($${item.price})`)
          .join("\n");
 
  const fullPrompt = `${SYSTEM_PROMPT}
 
${cartSummary}
 
Customer message: "${userMessage}"`;
 
  try {
    const result = await model.generateContent(fullPrompt);
    const rawText = result.response.text().trim();
 
    // Strip markdown code fences if Gemini wraps the JSON
    const jsonText = rawText
      .replace(/^```(?:json)?\n?/, "")
      .replace(/\n?```$/, "")
      .trim();
 
    const parsed = JSON.parse(jsonText);
 
    // Validate shape
    if (!parsed.actions || !Array.isArray(parsed.actions)) {
      throw new Error("Invalid response shape from Gemini");
    }
 
    // Enrich each action with price from menu
    parsed.actions = parsed.actions.map((action) => {
      if (action.item_id) {
        const menuItem = menu.find((m) => m.id === action.item_id);
        if (menuItem) action.price = menuItem.price;
      }
      return action;
    });
 
    return parsed;
  } catch (err) {
    console.error("[intentParser] Error:", err.message);
    return {
      actions: [],
      reply:
        "Sorry, I had trouble understanding that. Could you rephrase? For example: \"Add two spicy chicken sandwiches and a lemonade.\"",
      understood: false,
    };
  }
}
 
module.exports = { parseOrderIntent };