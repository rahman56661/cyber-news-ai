const SUPPORTED_LANGS = ["en", "ta", "hi", "ml"];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildPrompt(newsItem) {
  return `You are a cybersecurity news explainer for a general tech-aware audience in India.

News headline: "${newsItem.title}"
Source: ${newsItem.sourceName}
Short context: "${newsItem.originalSummary}"

Task: Write a detailed, easy-to-understand explanation of this cybersecurity news in your OWN WORDS (do not copy phrases from the context above). Cover ALL of the following clearly:
1. WHAT happened — the specific vulnerability, attack technique, or incident (name it, mention CVE numbers and affected software/versions if known)
2. HOW it works — a brief technical explanation of the attack mechanism, in plain language
3. WHO is affected — scale of impact (number of systems/users, industries, regions if mentioned)
4. WHAT TO DO — concrete recommended action for readers (update software, change settings, etc.)

Provide the explanation in ALL 4 languages: English (en), Tamil (ta), Hindi (hi), Malayalam (ml). Each explanation should be STRICTLY 180-220 words, written naturally in that language (not transliterated), suitable for text-to-speech narration. Do not exceed 220 words per language under any circumstance.

Respond with ONLY valid JSON, no markdown, no code fences, no extra text, in this exact format:
{
  "en": "...",
  "ta": "...",
  "hi": "...",
  "ml": "..."
}`;
}

function cleanJsonResponse(raw) {
  let cleaned = raw.trim();
  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "");
  return cleaned.trim();
}

async function callGroq(prompt) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 5000, // increased for more detailed 180-220 word explanations
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    const error = new Error(`Groq API error ${response.status}: ${errText}`);
    error.status = response.status;
    throw error;
  }
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callGroqWithRetry(prompt, retries = 1) {
  try {
    return await callGroq(prompt);
  } catch (error) {
    if (error.status === 429 && retries > 0) {
      console.warn(`⏳ Groq rate limited, waiting 15s before retry...`);
      await sleep(15000);
      return callGroqWithRetry(prompt, retries - 1);
    }
    throw error;
  }
}

async function callGemini(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 5000 },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    const error = new Error(`Gemini API error ${response.status}: ${errText}`);
    error.status = response.status;
    throw error;
  }
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function callGeminiWithRetry(prompt, retries = 1) {
  try {
    return await callGemini(prompt);
  } catch (error) {
    if (error.status === 503 && retries > 0) {
      console.warn(`⏳ Gemini overloaded, waiting 10s before retry...`);
      await sleep(10000);
      return callGeminiWithRetry(prompt, retries - 1);
    }
    throw error;
  }
}

async function generateExplanations(newsItem) {
  const prompt = buildPrompt(newsItem);
  let rawText;
  let provider;

  try {
    rawText = await callGroqWithRetry(prompt);
    provider = "groq";
  } catch (groqError) {
    console.warn(`⚠️  Groq failed, falling back to Gemini: ${groqError.message}`);
    try {
      rawText = await callGeminiWithRetry(prompt);
      provider = "gemini";
    } catch (geminiError) {
      console.error(`❌ Both providers failed: ${geminiError.message}`);
      throw new Error("All AI providers failed to generate explanation");
    }
  }

  let parsed;
  try {
    parsed = JSON.parse(cleanJsonResponse(rawText));
  } catch (parseError) {
    console.error(`❌ Failed to parse AI JSON (length: ${rawText.length}): ${rawText.slice(0, 200)}`);
    throw new Error("AI response was not valid JSON");
  }

  for (const lang of SUPPORTED_LANGS) {
    if (!parsed[lang] || typeof parsed[lang] !== "string") {
      throw new Error(`Missing explanation for language: ${lang}`);
    }
  }

  return { explanations: parsed, provider };
}

module.exports = { generateExplanations };