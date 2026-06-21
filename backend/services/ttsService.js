const fs = require("fs");
const path = require("path");
const { Communicate } = require("edge-tts-universal");
const { SUPPORTED_LANGUAGES } = require("../config/sources");

const AUDIO_BASE_DIR = path.join(__dirname, "../public/audio");

/**
 * Generates audio for one language using edge-tts-universal's streaming API,
 * collects all audio chunks, and writes them to an mp3 file ourselves.
 */
async function generateAudioForLanguage(newsId, langCode, text) {
  const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
  if (!langConfig) throw new Error(`Unsupported language: ${langCode}`);

  const newsDir = path.join(AUDIO_BASE_DIR, newsId);
  if (!fs.existsSync(newsDir)) {
    fs.mkdirSync(newsDir, { recursive: true });
  }

  const communicate = new Communicate(text, { voice: langConfig.ttsVoice });
  const buffers = [];

  for await (const chunk of communicate.stream()) {
    if (chunk.type === "audio" && chunk.data) {
      buffers.push(chunk.data);
    }
  }

  if (buffers.length === 0) {
    throw new Error("No audio data received from TTS service");
  }

  const finalBuffer = Buffer.concat(buffers);
  const finalPath = path.join(newsDir, `${langCode}.mp3`);
  fs.writeFileSync(finalPath, finalBuffer);

  return `/audio/${newsId}/${langCode}.mp3`;
}

async function generateAllAudio(newsId, explanations) {
  const audioUrls = {};

  for (const lang of SUPPORTED_LANGUAGES) {
    try {
      const text = explanations[lang.code];
      if (!text) continue;
      audioUrls[lang.code] = await generateAudioForLanguage(newsId, lang.code, text);
      console.log(`🔊 Audio generated: ${newsId}/${lang.code}.mp3`);
    } catch (error) {
      const details =
        (error && error.message) ||
        (error && error.toString()) ||
        JSON.stringify(error) ||
        "Unknown error";
      console.error(`⚠️  TTS failed for ${lang.code}: ${details}`);
      audioUrls[lang.code] = "";
    }
  }

  return audioUrls;
}

module.exports = { generateAllAudio };