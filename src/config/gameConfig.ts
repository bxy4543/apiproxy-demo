export const GAME_CONFIG = {
  timeLimit: {
    easy: 180, // 3分钟
    hard: 120  // 2分钟
  },
  scoring: {
    easy: {
      correct: 100,
      timeBonus: 1, // 每剩余1秒额外得1分
      streak: 50    // 连续答对奖励
    },
    hard: {
      correct: 200,
      timeBonus: 2,
      streak: 100
    }
  },
  retryCount: {
    easy: 3,
    hard: 2
  },
  charCount: {
    easy: {
      total: 21,    // 总字符数
      extra: 14     // 额外干扰字符
    },
    hard: {
      total: 28,
      extra: 21
    }
  }
}; 