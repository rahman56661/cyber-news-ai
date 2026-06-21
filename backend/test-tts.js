require("dotenv").config();
const { Communicate } = require("edge-tts-universal");
const fs = require("fs");

(async () => {
  console.log("Testing edge-tts-universal connection...");
  try {
    const communicate = new Communicate("Hello, this is a test.", {
      voice: "en-US-AriaNeural",
    });
    const buffers = [];

    for await (const chunk of communicate.stream()) {
      if (chunk.type === "audio" && chunk.data) {
        buffers.push(chunk.data);
      }
    }

    if (buffers.length === 0) {
      throw new Error("No audio chunks received");
    }

    const finalBuffer = Buffer.concat(buffers);
    if (!fs.existsSync("./test-output")) {
      fs.mkdirSync("./test-output");
    }
    fs.writeFileSync("./test-output/test.mp3", finalBuffer);

    console.log("✅ SUCCESS! Audio saved to ./test-output/test.mp3");
  } catch (error) {
    console.log("❌ FAILED:", error?.message || error);
    console.log(error?.stack);
  }
})();