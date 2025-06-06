// Tự động detect URL hiện tại
function getCurrentURL() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // Fallback URLs cho các trường hợp phổ biến
  return "http://127.0.0.1:5500";
}

// Spotify API Configuration
const SPOTIFY_CONFIG = {
  CLIENT_ID: "999e26b2b90447249044ec6844c52d83",
  CLIENT_SECRET: "091367f0457848e88a0b1bb0ca941dae",
  get REDIRECT_URI() {
    return getCurrentURL();
},

};

console.log(`
🎵 SPORTIFY WEB PLAYER
📝 Cấu hình:
- Client ID: ${SPOTIFY_CONFIG.CLIENT_ID ? "✅" : "❌"}
- Client Secret: ${SPOTIFY_CONFIG.CLIENT_SECRET ? "✅" : "❌"}
- Redirect URI: ${SPOTIFY_CONFIG.REDIRECT_URI}
`);