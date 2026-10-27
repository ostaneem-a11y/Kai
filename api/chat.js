
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "AI key is not configured on the server."
    });
  }

  try {
    const message = req.body?.message;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Message is required."
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-6-astra",
          instructions:
            "You are Kai, a helpful and friendly voice assistant. Keep spoken replies natural and concise.",
          input: message.trim()
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("AI request failed:", data);
      return res.status(502).json({
        error: "The AI service could not answer. Check the API setup."
      });
    }

    return res.status(200).json({
      reply: data.output_text || "Sorry, I couldn't form a reply."
    });
  } catch (error) {
    console.error("Kai backend error:", error);
    return res.status(500).json({
      error: "Kai had a server error."
    });
  }
}
