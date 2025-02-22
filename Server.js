const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb+srv://sahil:$AHIL_sawant07@wikipedia.dajnn.mongodb.net/library?retryWrites=true&w=majority&appName=wikipedia")
  .then(() => console.log("Connected to MongoDB ✅"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const db = mongoose.connection;

// Check if MongoDB connection is successful
db.on("error", (error) => console.error("MongoDB Connection Error:", error));
db.once("open", () => console.log("Connected to MongoDB ✅"));

// Define the schema
const ArticleSchema = new mongoose.Schema({
  pageid: { type: Number, unique: true, required: true },
  title: { type: String, required: true },
  extract: { type: String, required: true },
  thumbnail: String,
  url: { type: String, required: true },
});

// Create the model with the collection name "MyData"
const Article = mongoose.model("Article", ArticleSchema, "MyData");

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Save an article to favorites
app.post("/favorites", async (req, res) => {
  try {
    console.log("Received POST request to /favorites");
    console.log("Request body:", req.body);

    const { pageid, title, extract, thumbnail, url } = req.body;

    // Validate input
    if (!pageid || !title || !extract || !url) {
      console.log("❌ Missing required fields!");
      return res.status(400).json({ 
        message: "Missing required fields",
        received: { pageid, title, extract, url }
      });
    }

    const existingArticle = await Article.findOne({ pageid });
    console.log("Existing article check result:", existingArticle);

    if (existingArticle) {
      console.log("⚠ Article already exists in favorites.");
      return res.status(400).json({ message: "Already added to favorites" });
    }

    const article = new Article({ pageid, title, extract, thumbnail, url });
    const savedArticle = await article.save();

    console.log("✅ Article saved successfully:", savedArticle);
    res.status(201).json({ message: "Added to favorites", article: savedArticle });
  } catch (error) {
    console.error("❌ Error saving favorite:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all favorite articles
app.get("/favorites", async (req, res) => {
  try {
    console.log("Received GET request to /favorites");
    const favorites = await Article.find();
    console.log("Fetched favorites:", favorites);
    res.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: error.message });
  }
});

// Remove an article from favorites
app.delete("/favorites/:pageid", async (req, res) => {
  try {
    console.log("Received DELETE request to /favorites/:pageid");
    console.log("Request params:", req.params);

    const { pageid } = req.params;

    const deletedArticle = await Article.findOneAndDelete({ pageid });
    console.log("Deleted article result:", deletedArticle);

    if (!deletedArticle) {
      console.log("⚠ Article not found in favorites.");
      return res.status(404).json({ message: "Article not found in favorites" });
    }

    console.log("✅ Article removed successfully:", deletedArticle);
    res.json({ message: "Removed from favorites", deletedArticle });
  } catch (error) {
    console.error("❌ Error removing favorite:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(5000, () => console.log("Server running on port 5000 🚀"));