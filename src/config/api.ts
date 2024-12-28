export const API_CONFIG = {
  AI_API_URL: process.env.NEXT_PUBLIC_AI_API_URL,
  AI_API_KEY: process.env.NEXT_PUBLIC_AI_API_KEY,
  AI_MODEL: process.env.NEXT_PUBLIC_AI_MODEL,
  DB_CONNECT: process.env.NEXT_PUBLIC_DB_CONNET,
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