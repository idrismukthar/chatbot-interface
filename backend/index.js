const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Free Hugging Face model (no API key needed)
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
      { inputs: message },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      reply: response.data.generated_text,
    });
  } catch (error) {
    console.error("AI Error:", error);
    res.json({
      reply: "I'm a free AI and might be slow. Try again in 10 seconds!",
    });
  }
});

app.listen(5000, () => {
  console.log("🚀 Free AI server running on http://localhost:5000");
});
