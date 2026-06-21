// 5 RSS sources for cybersecurity news
const RSS_SOURCES = [
  {
    name: "The Hacker News",
    url: "https://feeds.feedburner.com/TheHackersNews",
  },
  {
    name: "BleepingComputer",
    url: "https://www.bleepingcomputer.com/feed/",
  },
  {
    name: "Krebs on Security",
    url: "https://krebsonsecurity.com/feed/",
  },
  {
    name: "Dark Reading",
    url: "https://www.darkreading.com/rss.xml",
  },
  {
    name: "SecurityWeek",
    url: "https://www.securityweek.com/feed/",
  },
];

// 4 supported languages
const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", ttsVoice: "en-US-AriaNeural" },
  { code: "ta", name: "Tamil", ttsVoice: "ta-IN-PallaviNeural" },
  { code: "hi", name: "Hindi", ttsVoice: "hi-IN-SwaraNeural" },
  { code: "ml", name: "Malayalam", ttsVoice: "ml-IN-SobhanaNeural" },
];

module.exports = { RSS_SOURCES, SUPPORTED_LANGUAGES };