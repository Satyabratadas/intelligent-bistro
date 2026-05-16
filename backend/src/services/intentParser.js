require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const menu = require("../data/menu");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Safer for free quota than gemini-2.5-flash
// const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
- Match menu items by name. Fuzzy is fine.
- Handle both written numbers and digits: "two burgers" = 2, "2 burgers" = 2.
- If quantity is not specified, default to 1.
- "remove" means remove the item from the cart entirely.
- "update_qty" means set the quantity to the new value given.
- "clear_cart" clears everything — item_id and quantity are null.
- If the user tries to remove an item that is not in the cart, actions must be empty and reply that the item is not currently in the cart.
- If the message is ambiguous or no item matches, set "understood": false and ask for clarification in "reply".
- Always be friendly and conversational in the reply.
- IMPORTANT: Return ONLY raw JSON. No markdown fences, no backticks, no explanation text.`;

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getQuantity(text) {
  const normalized = normalizeText(text);

  const digitMatch = normalized.match(/\b\d+\b/);
  if (digitMatch) return Number(digitMatch[0]);

  const numberWords = {
    a: 1,
    an: 1,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
  };

  for (const [word, value] of Object.entries(numberWords)) {
    if (normalized.includes(` ${word} `) || normalized.startsWith(`${word} `)) {
      return value;
    }
  }

  return 1;
}

function matchMenuItem(text) {
  const normalized = normalizeText(text);

  return menu.filter((item) => {
    const itemName = normalizeText(item.name);

    if (normalized.includes(itemName)) return true;

    const words = itemName.split(" ").filter((word) => word.length > 3);

    return words.some((word) => normalized.includes(word));
  });
}

function fallbackParser(userMessage, cartContext = []) {
  const text = normalizeText(userMessage);
  const actions = [];

  const isClear =
    text.includes("clear") ||
    text.includes("empty cart") ||
    text.includes("remove everything");

  if (isClear) {
    return {
      actions: [
        {
          type: "clear_cart",
          item_id: null,
          item_name: null,
          quantity: null,
        },
      ],
      reply: "Sure — I've cleared your cart.",
      understood: true,
    };
  }

  const isRemove =
    text.includes("remove") ||
    text.includes("delete") ||
    text.includes("take out");

  const isUpdate =
    text.includes("change") ||
    text.includes("update") ||
    text.includes("make") ||
    text.includes("set");

  const isAdd =
    text.includes("add") ||
    text.includes("want") ||
    text.includes("get") ||
    text.includes("order") ||
    text.includes("include");

  const matchedItems = matchMenuItem(userMessage);

  if (matchedItems.length === 0) {
    return {
      actions: [],
      reply:
        'Sorry, I could not find that item on the menu. Try something like "Add fries" or "Add one lemonade."',
      understood: false,
    };
  }

  const quantity = getQuantity(userMessage);

  for (const item of matchedItems) {
    const cartItem = cartContext.find(
      (cart) =>
        cart.item_id === item.id ||
        normalizeText(cart.item_name || "") === normalizeText(item.name)
    );

    if (isRemove) {
      if (!cartItem) {
        return {
          actions: [],
          reply: `${item.name} is not currently in your cart.`,
          understood: true,
        };
      }

      actions.push({
        type: "remove",
        item_id: item.id,
        item_name: item.name,
        quantity: null,
        price: item.price,
      });

      continue;
    }

    if (isUpdate) {
      if (!cartItem) {
        return {
          actions: [],
          reply: `${item.name} is not currently in your cart, so I can't update its quantity.`,
          understood: true,
        };
      }

      actions.push({
        type: "update_qty",
        item_id: item.id,
        item_name: item.name,
        quantity,
        price: item.price,
      });

      continue;
    }

    if (isAdd || (!isRemove && !isUpdate)) {
      actions.push({
        type: "add",
        item_id: item.id,
        item_name: item.name,
        quantity,
        price: item.price,
      });
    }
  }

  if (actions.length === 0) {
    return {
      actions: [],
      reply:
        'Sorry, I had trouble understanding that. Try "Add two burgers" or "Remove lemonade."',
      understood: false,
    };
  }

  const itemNames = actions.map((a) => a.item_name).join(", ");

  return {
    actions,
    reply: `Done! I've updated your cart for ${itemNames}.`,
    understood: true,
  };
}

function validateCartActions(parsed, cartContext = []) {
  const validatedActions = [];

  for (const action of parsed.actions || []) {
    if (action.type === "clear_cart") {
      validatedActions.push(action);
      continue;
    }

    if (!action.item_id) continue;

    const menuItem = menu.find((m) => m.id === action.item_id);
    if (!menuItem) continue;

    const cartItem = cartContext.find(
      (cart) =>
        cart.item_id === action.item_id ||
        normalizeText(cart.item_name || "") === normalizeText(menuItem.name)
    );

    if (
      (action.type === "remove" || action.type === "update_qty") &&
      !cartItem
    ) {
      return {
        actions: [],
        reply: `${menuItem.name} is not currently in your cart.`,
        understood: true,
      };
    }

    validatedActions.push({
      ...action,
      item_name: menuItem.name,
      price: menuItem.price,
    });
  }

  return {
    ...parsed,
    actions: validatedActions,
  };
}

async function parseOrderIntent(userMessage, cartContext = []) {
  const cartSummary =
    cartContext.length === 0
      ? "Cart is currently empty."
      : "Current cart:\n" +
        cartContext
          .map((item) => `- [id:${item.item_id}] ${item.item_name} x${item.quantity} ($${item.price})`)
          .join("\n");

  const fullPrompt = `${SYSTEM_PROMPT}

${cartSummary}

Customer message: "${userMessage}"`;

  try {
    const result = await model.generateContent(fullPrompt);
    const rawText = result.response.text().trim();

    const jsonText = rawText
      .replace(/^```(?:json)?\n?/, "")
      .replace(/\n?```$/, "")
      .trim();

    const parsed = JSON.parse(jsonText);

    if (!parsed.actions || !Array.isArray(parsed.actions)) {
      throw new Error("Invalid response shape from Gemini");
    }

    return validateCartActions(parsed, cartContext);
  } catch (err) {
    console.error("[intentParser] Error:", err.message);

    return fallbackParser(userMessage, cartContext);
  }
}

module.exports = { parseOrderIntent };