import axios from "axios";

app.post("/api/search", async (req, res) => {
  const { term } = req.body;
  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query: term, per_page: 20 },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });
    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching images", error });
  }
});
