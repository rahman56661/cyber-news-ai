const { Communicate } = require("edge-tts-universal");
const { SUPPORTED_LANGUAGES } = require("../config/sources");

/**
 * Generates audio for one language, returns base64 string (no disk write)
 */
async function generateAudioForLanguage(langCode, text) {
  const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
  if (!langConfig) throw new Error(`Unsupported language: ${langCode}`);

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
  return finalBuffer.toString("base64");
}

/**
 * Generates audio for ALL 4 languages, returns base64 strings
 */
async function generateAllAudio(newsId, explanations) {
  const audioData = {};

  for (const lang of SUPPORTED_LANGUAGES) {
    try {
      const text = explanations[lang.code];
      if (!text) continue;
      audioData[lang.code] = await generateAudioForLanguage(lang.code, text);
      console.log(`🔊 Audio generated: ${newsId}/${lang.code}`);
    } catch (error) {
      const details = (error && error.message) || error?.toString() || "Unknown error";
      console.error(`⚠️  TTS failed for ${lang.code}: ${details}`);
      audioData[lang.code] = "";
    }
  }

  return audioData;
}

module.exports = { generateAllAudio };