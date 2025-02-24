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

const ArticleSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  pageid: { type: Number, required: true },
  title: { type: String, required: true },
  extract: { type: String, required: true },
  thumbnail: String,
  url: { type: String, required: true },
}, {
  collection: 'MyData'
});

// Important: Change unique constraint to be compound of user_id and pageid
ArticleSchema.index({ user_id: 1, pageid: 1 }, { unique: true });

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

    const { user_id, pageid, title, extract, thumbnail, url } = req.body;

    // Validate input including user_id
    if (!user_id || !pageid || !title || !extract || !url) {
      console.log("❌ Missing required fields!");
      return res.status(400).json({ 
        message: "Missing required fields",
        received: { user_id, pageid, title, extract, url }
      });
    }

    // Check if article already exists for this user
    const existingArticle = await Article.findOne({ user_id, pageid });
    if (existingArticle) {
      console.log("⚠ Article already exists in favorites for this user.");
      return res.status(400).json({ message: "Already added to favorites" });
    }

    const article = new Article({ user_id, pageid, title, extract, thumbnail, url });
    const savedArticle = await article.save();

    console.log("✅ Article saved successfully:", savedArticle);
    res.status(201).json({ message: "Added to favorites", article: savedArticle });
  } catch (error) {
    console.error("❌ Error saving favorite:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get user-specific favorites
app.get("/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching favorites for user:", userId);
    const favorites = await Article.find({ user_id: userId });
    console.log("Fetched favorites:", favorites);
    res.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: error.message });
  }
});

// Remove a user-specific article from favorites
app.delete("/favorites/:userId/:pageid", async (req, res) => {
  try {
    const { userId, pageid } = req.params;
    console.log("Deleting article for user:", userId, "pageid:", pageid);

    const deletedArticle = await Article.findOneAndDelete({ 
      user_id: userId,
      pageid: pageid 
    });

    if (!deletedArticle) {
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀🚀`));