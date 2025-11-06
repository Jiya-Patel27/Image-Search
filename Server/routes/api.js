import express from "express";
import fetch from "node-fetch";
import Search from "../models/Search.js";
import User from "../models/User.js";
const router = express.Router();

function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: "Unauthorized" });
}

// POST /api/search { term }
router.post("/search", ensureAuth, async (req, res) => {
  try {
    const { term } = req.body;
    if (!term) return res.status(400).json({ error: "term required" });

    // store search
    await Search.create({ userId: req.user._id, term });

    // call Unsplash
    const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
    const per_page = 30;
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(term)}&per_page=${per_page}`;
    const r = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });
    const data = await r.json();
    const results = (data.results || []).map(img => ({
      id: img.id,
      thumb: img.urls.small,
      full: img.urls.full,
      alt: img.alt_description
    }));
    res.json({ term, count: results.length, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// GET /api/top-searches
router.get("/top-searches", async (req, res) => {
  // aggregate top 5 terms across all users
  const top = await Search.aggregate([
    { $group: { _id: "$term", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  res.json(top.map(x => ({ term: x._id, count: x.count })));
});

// GET /api/history
router.get("/history", ensureAuth, async (req, res) => {
  const history = await Search.find({ userId: req.user._id }).sort({ timestamp: -1 }).limit(100);
  res.json(history.map(h => ({ term: h.term, timestamp: h.timestamp })));
});

export default router;
