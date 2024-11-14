import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

interface LeaderboardEntry {
  name: string;
  score: number;
  streak: number;
}

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 这里可以接入真实的后端API
    const mockData: LeaderboardEntry[] = [
      { name: "玩家1", score: 1200, streak: 5 },
      { name: "玩家2", score: 1000, streak: 4 },
      { name: "玩家3", score: 800, streak: 3 },
    ];
    
    setLeaderboard(mockData);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-white/60">加载中...</div>;
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h2 className="text-white text-xl font-bold">排行榜</h2>
      </div>
      
      <div className="space-y-2">
        {leaderboard.map((entry, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="text-white/60 w-6 text-center">{index + 1}</span>
              <span className="text-white">{entry.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white/80">{entry.score}分</span>
              <span className="text-white/60">连胜{entry.streak}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 