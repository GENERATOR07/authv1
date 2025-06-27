// In-memory token blacklist
const blacklistedTokens = new Set<string>();

export function blacklistToken(token: string) {
  blacklistedTokens.add(token);
}

export function isTokenBlacklisted(token: string): boolean {
  return blacklistedTokens.has(token);
}

// Optional: Clean up old tokens periodically
setInterval(() => {
  // Clear blacklist every hour
  blacklistedTokens.clear();
}, 60 * 60 * 1000);
