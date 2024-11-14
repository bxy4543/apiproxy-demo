declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_AI_API_KEY: string;
    NEXT_PUBLIC_AI_API_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
} 