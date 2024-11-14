export const API_CONFIG = {
  AI_API_URL: process.env.NEXT_PUBLIC_AI_API_URL,
  AI_API_KEY: process.env.NEXT_PUBLIC_AI_API_KEY,
  AI_MODEL: "Doubao-lite-4k",
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  getAuthHeaders() {
    return {
      ...this.DEFAULT_HEADERS,
      'Authorization': `Bearer ${this.AI_API_KEY}`
    };
  }
}; 