const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
require('dotenv').config();
const app = express();
const port = 3290;

// Hugging Face API settings
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const MODEL = 'cardiffnlp/tweet-topic-21-multi';

// Middleware to parse JSON bodies
app.use(express.json());

console.log('Hugging Face API Token:', HUGGINGFACE_API_KEY);

// Fetch Wikipedia article content
const fetchWikipediaArticle = async (title) => {
    try {
        const response = await axios.get('https://en.wikipedia.org/w/api.php', {
            params: {
                action: 'query',
                prop: 'extracts',
                exintro: true,
                exchars: 1000,
                titles: title,
                format: 'json'
            }
        });
        
        const pages = response.data.query.pages;
        const pageId = Object.keys(pages)[0];

        // Check if the article exists
        if (pageId === '-1') {
            return null; // Article not found
        }

        return pages[pageId].extract; // Return the article content
    } catch (error) {
        console.error("Error fetching Wikipedia article:", error);
        return null;
    }
};

// Classify the text using Hugging Face model
const classifyText = async (text) => {
    try {
        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${MODEL}`,
            { inputs: text },
            {
                headers: { Authorization: `Bearer ${HUGGINGFACE_API_KEY}` }
            }
        );

        // Hugging Face response handling: Check for label in prediction
        if (response.data && response.data[0] && response.data[0].label) {
            return response.data[0].label;
        }
        return null; // In case no label is found
    } catch (error) {
        console.error("Error classifying text:", error);
        return null;
    }
};

// API endpoint to classify a Wikipedia article
app.get('/classify-article', async (req, res) => {
    const title = req.query.title;

    // Validate the title parameter
    if (!title) {
        return res.status(400).json({ error: "Title parameter is required" });
    }

    // Fetch article content from Wikipedia
    const articleContent = await fetchWikipediaArticle(title);
    if (!articleContent) {
        return res.status(404).json({ error: "Article not found" });
    }

    // Classify the article content
    const predictedTag = await classifyText(articleContent);
    if (!predictedTag) {
        return res.status(500).json({ error: "Error classifying the article" });
    }

    // Return the classification result
    res.json({ title, tag: predictedTag });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
