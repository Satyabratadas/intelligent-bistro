const express = require("express");
const router = express.Router();
const { parseOrderIntent } = require("../services/intentParser");

/**
 * POST /api/ai/order
 * Body: { message: string, cart: Array }
 * Returns: { actions, reply, understood }
 */
router.post("/order", async (req, res) => {
  const { message, cart = [] } = req.body;

  if (!message || typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ error: "message is required and must be a non-empty string" });
  }

  try {
    const result = await parseOrderIntent(message.trim(), cart);
    return res.json(result);
  } catch (err) {
    console.error("[POST /api/ai/order]", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;