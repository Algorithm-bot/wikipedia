const express = require('express');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');

const app = express();
const port = 3190;

// Middleware to parse JSON request body
app.use(bodyParser.json());

// API endpoint to classify article content
app.post('/classify', (req, res) => {
  const articleContent = req.body.content;



  // Spawn a Python process to run the topic_classifier.py script
  const pythonProcess = spawn('python3', ['topic_classifier.py', articleContent]);

  pythonProcess.stdout.on('data', (data) => {
    // Parse the response from the Python script
    const response = JSON.parse(data.toString());
    res.json(response);  // Send the tags back to the client
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.log(`Python script exited with code ${code}`);
      res.status(500).send('Error classifying the article');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
