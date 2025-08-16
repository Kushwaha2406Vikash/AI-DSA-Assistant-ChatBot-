import ChatBot from "../utils/agentChat.js";



export const chatMessage = async (req, res) => {
  try {
   // console.log("Request body:", req.body);
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const aiResponse = await ChatBot(message);

    return res.status(201).json({
      success: true,
      reply: aiResponse
    });

  } catch (error) {
    console.error("ChatMessage Error:", error);
    res.status(500).json({
      error: "AI did not respond",
      details: error.message
    });
  }
};