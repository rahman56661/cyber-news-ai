const fs = require("fs");
const path = require("path");

const LOG_DIR = path.join(__dirname, "../logs");

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function getLogFilePath() {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  return path.join(LOG_DIR, `${today}.log`);
}

function writeLog(level, message) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] [${level}] ${message}\n`;

  if (level === "ERROR") {
    console.error(line.trim());
  } else {
    console.log(line.trim());
  }

  fs.appendFile(getLogFilePath(), line, (err) => {
    if (err) console.error(`Failed to write log: ${err.message}`);
  });
}

const logger = {
  info: (message) => writeLog("INFO", message),
  warn: (message) => writeLog("WARN", message),
  error: (message) => writeLog("ERROR", message),
};

module.exports = logger;