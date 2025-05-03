const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

app.post("/ask", async (req, res) => {
  const prompt = req.body.prompt;
  
  try {
    const response = await axios.post("http://localhost:11434/api/chat", {
      model: "llama3",
      messages: [{ role: "user", content: prompt }],
      stream: false
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error contacting Ollama:", error);
    res.status(500).send({ message: "Error contacting Ollama: " + error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
