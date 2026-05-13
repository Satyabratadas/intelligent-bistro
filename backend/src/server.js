require("dotenv").config();
const express = require("express");
const cors = require("cors");
const menu = require("./data/menu");
const aiRoutes = require("./routes/ai.routes");

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Request logger (dev only) ────────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Full menu
app.get("/api/menu", (_req, res) => {
  res.json(menu);
});

// Menu by category
app.get("/api/menu/category/:category", (req, res) => {
  const { category } = req.params;
  const filtered = menu.filter(
    (item) => item.category.toLowerCase() === category.toLowerCase()
  );
  if (filtered.length === 0) {
    return res.status(404).json({ error: `No items found for category: ${category}` });
  }
  res.json(filtered);
});

// AI intent parsing
app.use("/api/ai", aiRoutes);

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🍽️  Intelligent Bistro backend running on http://localhost:${PORT}`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/menu`);
  console.log(`   GET  /api/menu/category/:category`);
  console.log(`   POST /api/ai/order\n`);
});