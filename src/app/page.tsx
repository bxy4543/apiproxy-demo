"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Bell, 
  Settings, 
  LogOut, 
  Home, 
  Database, 
  Command,
  Book,
  Github,
  ChevronRight,
  Copy,
  Clock,
  CreditCard
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GameState, PoemHistory } from '@/types/game';
import { StorageService } from '@/services/storage';
import { GAME_CONFIG } from '@/config/gameConfig';
import { LoginModal } from '@/components/LoginModal';
import { Tutorial } from '@/components/Tutorial';
import { AuthService } from '@/services/auth';
import { SoundService } from '@/services/sound';
import { useResponsive } from '@/utils/responsive';
import { API_CONFIG } from '@/config/api';

interface ApiResponse {
  poem: string;
  code: string;
}

interface GameStats {
  score: number;
  streak: number;
  accuracy: string;
}

interface SelectedChar {
  char: string;
  index: number;
}

export default function GlassGameUi() {
  const [difficulty, setDifficulty] = useState<'easy' | 'hard'>('easy')
  const [level, setLevel] = useState(1)
  const [selectedChars, setSelectedChars] = useState<SelectedChar[]>([])
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes
  const timePercentage = (timeLeft / 180) * 100
  const [poem, setPoem] = useState<string[]>([])
  const [codeSnippet, setCodeSnippet] = useState('')
  const [loading, setLoading] = useState(false)
  const [retryCount, setRetryCount] = useState(3)
  const [showAnswer, setShowAnswer] = useState(false)
  const [shuffledChars, setShuffledChars] = useState<string[]>([])
  const [usedPoems, setUsedPoems] = useState<string[]>(StorageService.getUsedPoems());
  const [gameState, setGameState] = useState<GameState>(StorageService.getGameState());
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    streak: 0,
    accuracy: '0%'
  });
  const [showLogin, setShowLogin] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [authState, setAuthState] = useState(AuthService.getAuthState());
  const { isMobile, isTablet } = useResponsive();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    SoundService.init();
  }, []);

  const shuffleArray = (array: string[]) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const getRandomChars = (targetTotal: number) => {
    const commonChars = '山水春秋风雨花月日月星云天地人情思归去来高低远近明暗静动';
    const result: string[] = [];
    
    for (let i = 0; i < targetTotal; i++) {
      const randomIndex = Math.floor(Math.random() * commonChars.length);
      result.push(commonChars[randomIndex]);
    }
    return result;
  };

  const fetchPoemAndCode = useCallback(async (difficulty: 'easy' | 'hard') => {
    if (!initialLoading) {
      setLoading(true);
    }
    
    try {
      const allUsedPoems = StorageService.getUsedPoems();
      const prompt = difficulty === 'easy' 
        ? `请生成一句简单的中国古诗名句（不超过5字）和相关代码，要求：
           1. 必须是最家喻户晓的经典诗词名句
           2. 诗句要朗朗上口、易于记忆
           3. 不能是以下诗句：${allUsedPoems.join('、')}
           
           请按照以下JSON格式返回：
           {
             "poem": "举头望明月",
             "code": "if(moon.isShining()) { const reflection = window.getReflection(); }"
           }`
        : `请生成一句较难的中国古诗名句（不超过5字）和相关代码，要求：
           1. 必须是较为典雅的经典诗词名句
           2. 诗句要有一定的文学性和意境美
           3. 不能是以下诗句：${allUsedPoems.join('、')}
           
           请按照以下JSON格式返回：
           {
             "poem": "不识庐山真面目",
             "code": "const mountain = new Mountain('lushan'); mountain.observe('front');"
           }`;

      const response = await fetch(API_CONFIG.AI_API_URL || '', {
        method: 'POST',
        headers: API_CONFIG.getAuthHeaders(),
        body: JSON.stringify({
          model: API_CONFIG.AI_MODEL,
          messages: [
            { 
              role: "system", 
              content: "你是一个诗词游戏助手。请严格按照JSON格式返回数据。" 
            },
            { 
              role: "user", 
              content: prompt
            }
          ],
          max_tokens: 2048,
          temperature: 0.7,
          presence_penalty: 1.0,
          frequency_penalty: 1.0,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content in response');
      }

      // 使用正则表达式提取JSON部分
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsedData = JSON.parse(jsonMatch[0]);
      
      if (!parsedData.poem || !parsedData.code) {
        throw new Error('Invalid response format');
      }

      const cleanPoem = parsedData.poem
        .replace(/[\n\r]/g, '')
        .replace(/[，。！？；：、]/g, '')
        .trim();
      
      // 检查是否重复
      if (allUsedPoems.includes(cleanPoem)) {
        throw new Error('重复的诗句，重新获取');
      }

      const poemChars = cleanPoem.split('');
      
      // 计算需要的行数
      const rowCount = Math.ceil(poemChars.length / 7);
      // 计算总共需要的字符数
      const totalNeeded = rowCount * 7;
      // 计算需要添加的额外字符数
      const extraNeeded = totalNeeded - poemChars.length;
      
      // 获取额外的随机字符
      const extraChars = getRandomChars(extraNeeded);
      
      // 合并并打乱所有字符
      const allChars = shuffleArray([...poemChars, ...extraChars]);
      
      // 如果总字符数不足最小要求（简单模式21个，困难模式28个），继续添加字符
      const minChars = difficulty === 'easy' ? 21 : 28;
      if (allChars.length < minChars) {
        const additionalNeeded = minChars - allChars.length;
        const additionalChars = getRandomChars(additionalNeeded);
        allChars.push(...additionalChars);
      }
      
      // 确保总字符数是7的倍数
      const finalRowCount = Math.ceil(allChars.length / 7);
      const finalTotalNeeded = finalRowCount * 7;
      if (allChars.length < finalTotalNeeded) {
        const finalExtra = getRandomChars(finalTotalNeeded - allChars.length);
        allChars.push(...finalExtra);
      }

      await Promise.all([
        new Promise(resolve => {
          setPoem(poemChars);
          resolve(null);
        }),
        new Promise(resolve => {
          setShuffledChars(allChars);
          resolve(null);
        }),
        new Promise(resolve => {
          setCodeSnippet(parsedData.code);
          resolve(null);
        })
      ]);

      // 保存到本地存储
      StorageService.addUsedPoem(cleanPoem);
      setUsedPoems(StorageService.getUsedPoems());

    } catch (error: any) {
      console.error('获取诗词和代码失败:', error);
      
      if (error.message === '重复的诗句，重新获取') {
        await fetchPoemAndCode(difficulty);
        return;
      }

      // 其他错误使用默认诗句
      const defaultPoems = [
        {
          poem: '床前明月光',
          code: `if(moon.isShining()) {
  const reflection = window.getReflection();
  heart.remember(hometown);
}`
        },
        {
          poem: '春眠不觉晓',
          code: `while(spring.morning()) {
  sleep.deep();
  birds.singing.listen();
}`
        },
        {
          poem: '孤帆远影碧空尽',
          code: `const horizon = sea.getHorizon();
if(sail.distance > horizon.limit) {
  sail.fadeInto(sky.blue);
}`
        }
      ];
      
      // 过滤掉已使用的默认诗句
      const availablePoems = defaultPoems.filter(p => !usedPoems.includes(p.poem));
      
      if (availablePoems.length === 0) {
        // 如果所有默认诗句都用完了，清空历史重新开始
        StorageService.clearUsedPoems();
        setUsedPoems([]);
        await fetchPoemAndCode(difficulty);
        return;
      }

      const fallback = availablePoems[Math.floor(Math.random() * availablePoems.length)];
      const poemChars = fallback.poem.split('');
      const randomChars = getRandomChars(14);
      const allChars = shuffleArray([...poemChars, ...randomChars]);
      
      setPoem(poemChars);
      setShuffledChars(allChars);
      setCodeSnippet(fallback.code);
      
      // 保存默认诗句到历史
      StorageService.addUsedPoem(fallback.poem);
      setUsedPoems(StorageService.getUsedPoems());
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [difficulty, initialLoading]);

  useEffect(() => {
    let mounted = true;

    const initGame = async () => {
      if (mounted) {
        await fetchPoemAndCode(difficulty);
      }
    };

    initGame();

    return () => {
      mounted = false;
    };
  }, [difficulty, fetchPoemAndCode]);

  useEffect(() => {
    console.log('Current poem:', poem);
  }, [poem]);

  const handleDifficultyChange = async (newDifficulty: 'easy' | 'hard') => {
    setDifficulty(newDifficulty);
    // 不清空历史诗句，保持全局不重复
    await fetchPoemAndCode(newDifficulty);
    setSelectedChars([]);
    setShowResult(false);
    setTimeLeft(180);
  };

  useEffect(() => {
    fetchPoemAndCode(difficulty);
    
    return () => {
      setPoem([]);
      setCodeSnippet('');
      setSelectedChars([]);
    };
  }, [difficulty, fetchPoemAndCode]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timerId)
    } else if (timeLeft === 0 && !showResult) {
      setShowResult(true)
      setIsCorrect(false)
    }
  }, [timeLeft, showResult])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  const calculateScore = (timeLeft: number, difficulty: 'easy' | 'hard') => {
    const config = GAME_CONFIG.scoring[difficulty];
    const baseScore = config.correct;
    const timeBonus = timeLeft * config.timeBonus;
    const streakBonus = gameState.currentStreak >= 3 ? config.streak : 0;
    
    return baseScore + timeBonus + streakBonus;
  };

  const updateGameState = (isCorrect: boolean, timeSpent: number) => {
    const newState = {
      ...gameState,
      gamesPlayed: gameState.gamesPlayed + 1,
      correctAnswers: gameState.correctAnswers + (isCorrect ? 1 : 0),
      wrongAnswers: gameState.wrongAnswers + (isCorrect ? 0 : 1),
    };

    if (isCorrect) {
      const score = calculateScore(timeLeft, difficulty);
      newState.score = gameState.score + score;
      newState.highScore = Math.max(newState.score, gameState.highScore);
      newState.currentStreak = gameState.currentStreak + 1;
      newState.bestStreak = Math.max(newState.currentStreak + 1, gameState.bestStreak);
    } else {
      newState.currentStreak = 0;
    }

    setGameState(newState);
    StorageService.saveGameState(newState);

    // 保存本局记录
    const poemHistory: PoemHistory = {
      poem: poem.join(''),
      timestamp: Date.now(),
      isCorrect,
      timeSpent,
      difficulty
    };
    const history = StorageService.getPoemHistory();
    StorageService.savePoemHistory([poemHistory, ...history].slice(0, 50));
  };

  const handleCharacterSelect = (char: string, index: number) => {
    SoundService.playSound('click');
    
    // 检查是否已经���择了这个字符
    const selectedIndex = selectedChars.findIndex(item => item.index === index);
    
    if (selectedIndex !== -1) {
      // 允许取消任何已选择的字符
      setSelectedChars(prev => prev.filter(item => item.index !== index));
    } else {
      // 允许随机选择字符
      setSelectedChars(prev => [...prev, { char, index }]);
    }
  };

  const handleSubmitAnswer = () => {
    setShowResult(true);
    const selectedAnswer = selectedChars.map(item => item.char).join('');
    const correctAnswer = poem.join('');
    const correct = selectedAnswer === correctAnswer;
    
    setIsCorrect(correct);
    updateGameState(correct, 180 - timeLeft);
    
    SoundService.playSound(correct ? 'correct' : 'wrong');
    
    if (!correct) {
      setRetryCount(prev => prev - 1);
      if (retryCount <= 1) {
        setShowAnswer(true);
      }
    }
  };

  const resetGame = async () => {
    setShowResult(false)
    setSelectedChars([])
    setTimeLeft(180)
    setShowAnswer(false)
    setRetryCount(3) // 重置重试次数
    
    if (isCorrect) {
      setLevel(level + 1)
      await fetchPoemAndCode(difficulty)
    }
  }

  // 根据屏幕大小调整布局
  const getGridColumns = () => {
    if (isMobile) return 5;
    if (isTablet) return 6;
    return 7;
  };

  return (
    <div 
      className="min-h-screen bg-no-repeat bg-cover bg-center p-6"
      style={{ backgroundImage: 'url(https://hzh.sealos.run/images/bg-blue.svg)' }}
    >
      {/* Loading Overlay */}
      {initialLoading && (
        <div className="fixed inset-0 bg-[#1e3a8a] flex items-center justify-center z-50">
          <div className="text-white text-xl">加载中...</div>
        </div>
      )}

      <AnimatePresence>
        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onSuccess={() => {
              setShowLogin(false);
              setAuthState(AuthService.getAuthState());
            }}
          />
        )}
        
        {showTutorial && (
          <Tutorial onClose={() => setShowTutorial(false)} />
        )}
      </AnimatePresence>

      <div className={`max-w-4xl mx-auto pb-24 ${isMobile ? 'px-2' : 'px-6'}`}>
        {/* Header */}
        <div className={`${isMobile ? 'space-y-4' : 'flex justify-between items-center'} mb-6`}>
          {/* 计时器和关卡显示 */}
          <div className={`flex items-center gap-4 ${isMobile ? 'justify-between w-full' : ''}`}>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 md:w-20 md:h-20">
                <div className="absolute inset-0 rounded-full bg-[#06b6d4]/20 backdrop-blur-sm" />
                <div 
                  className="absolute inset-0 rounded-full overflow-hidden"
                  style={{
                    background: `conic-gradient(from 0deg, #06b6d4 ${timePercentage}%, transparent ${timePercentage}%)`
                  }}
                />
                <div className="absolute inset-2 rounded-full bg-[#172554]/80 backdrop-blur flex items-center justify-center">
                  <span className="text-white font-bold text-sm md:text-base">{formatTime(timeLeft)}</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 md:px-6 py-2 md:py-3">
                <span className="text-white/60 text-xs md:text-sm">当前关卡</span>
                <div className="text-white text-xl md:text-2xl font-bold">{level}</div>
              </div>
            </div>
            
            {/* 移动端的设置和通知按钮 */}
            {isMobile && (
              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-lg bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 transition-colors">
                      <Bell className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-[calc(100vw-2rem)] mr-4 mt-2 bg-[#1e3a8a]/90 backdrop-blur-md border-none text-white md:w-80"
                    align="end"
                  >
                    <div className="flex items-center gap-3 p-4 border-b border-white/10">
                      <Avatar className="h-10 w-10 bg-white/10">
                        <AvatarImage src="https://www.sealos.io/img/sealos-left.png" />
                        <AvatarFallback>SE</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">sealos</span>
                        <div className="flex items-center gap-1 text-sm text-white/60">
                          ID:WeLTOW4TLy
                          <button className="hover:text-white">
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2 flex gap-2">
                      <button className="flex-1 aspect-square rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        <Book className="h-5 w-5" />
                      </button>
                      <button className="flex-1 aspect-square rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        <span className="text-lg">中</span>
                      </button>
                      <button className="flex-1 aspect-square rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        <Github className="h-5 w-5" />
                      </button>
                      <button className="flex-1 aspect-square rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        <Bell className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="p-2 space-y-1">
                      <button 
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                        onClick={() => window.location.href = 'https://hzh.sealos.run'}
                      >
                        <Database className="h-5 w-5" />
                        <span className="flex-1 text-left">杭州H</span>
                        <ChevronRight className="h-4 w-4 text-white/60" />
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                        <Command className="h-5 w-5" />
                        <span className="flex-1 text-left">环界云计算</span>
                        <ChevronRight className="h-4 w-4 text-white/60" />
                      </button>
                    </div>

                    <div className="p-2 space-y-1 border-t border-white/10">
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors">
                        <Settings className="h-5 w-5" />
                        <span className="flex-1 text-left">账户设置</span>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors">
                        <Database className="h-5 w-5" />
                        <span className="flex-1 text-left">工单</span>
                        <ChevronRight className="h-4 w-4 text-white/60" />
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors">
                        <Command className="h-5 w-5" />
                        <span className="flex-1 text-left">Kubeconfig</span>
                        <div className="flex gap-2">
                          <Copy className="h-4 w-4 text-white/60" />
                          <Copy className="h-4 w-4 text-white/60" />
                        </div>
                      </button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* 桌面端的设置和通知按钮 */}
          {!isMobile && (
            <div className="flex gap-4">
              <button className="p-2 rounded-lg bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 transition-colors">
                <Settings className="w-6 h-6" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-lg bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 transition-colors">
                    <Bell className="w-6 h-6" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 mr-4 mt-2 bg-[#1e3a8a]/90 backdrop-blur-md border-none text-white">
                  <div className="flex items-center gap-3 p-4 border-b border-white/10">
                    <Avatar className="h-10 w-10 bg-white/10">
                      <AvatarImage src="https://www.sealos.io/img/sealos-left.png" />
                      <AvatarFallback>SE</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">sealos</span>
                      <div className="flex items-center gap-1 text-sm text-white/60">
                        ID:WeLTOW4TLy
                        <button className="hover:text-white">
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2 flex gap-2">
                    <button className="flex-1 aspect-square rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                      <Book className="h-5 w-5" />
                    </button>
                    <button className="flex-1 aspect-square rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                      <span className="text-lg">中</span>
                    </button>
                    <button className="flex-1 aspect-square rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                      <Github className="h-5 w-5" />
                    </button>
                    <button className="flex-1 aspect-square rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                      <Bell className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="p-2 space-y-1">
                    <button 
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                      onClick={() => window.location.href = 'https://hzh.sealos.run'}
                    >
                      <Database className="h-5 w-5" />
                      <span className="flex-1 text-left">杭州H</span>
                      <ChevronRight className="h-4 w-4 text-white/60" />
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                      <Command className="h-5 w-5" />
                      <span className="flex-1 text-left">环界云计算</span>
                      <ChevronRight className="h-4 w-4 text-white/60" />
                    </button>
                  </div>

                  <div className="p-2 space-y-1 border-t border-white/10">
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors">
                      <Settings className="h-5 w-5" />
                      <span className="flex-1 text-left">账户设置</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors">
                      <Database className="h-5 w-5" />
                      <span className="flex-1 text-left">工单</span>
                      <ChevronRight className="h-4 w-4 text-white/60" />
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors">
                      <Command className="h-5 w-5" />
                      <span className="flex-1 text-left">Kubeconfig</span>
                      <div className="flex gap-2">
                        <Copy className="h-4 w-4 text-white/60" />
                        <Copy className="h-4 w-4 text-white/60" />
                      </div>
                    </button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid gap-6">
          {/* Difficulty Toggle */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1.5 flex justify-center w-64 mx-auto">
            {['easy', 'hard'].map((level) => (
              <button
                key={level}
                onClick={() => handleDifficultyChange(level as 'easy' | 'hard')}
                className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  difficulty === level
                    ? 'bg-[#06b6d4] text-white'
                    : 'text-white/60 hover:text-white'
                }`}
                disabled={loading}
              >
                {level === 'easy' ? '简单' : '困难'}
              </button>
            ))}
          </div>

          {/* Code Preview */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            {loading && !initialLoading ? (
              <div className="text-white/60">加载中...</div>
            ) : (
              <pre className="font-mono text-sm text-white/90 whitespace-pre-wrap">{codeSnippet}</pre>
            )}
          </div>

          {/* Character Grid */}
          <div 
            className="grid gap-3" 
            style={{
              gridTemplateColumns: `repeat(${getGridColumns()}, minmax(0, 1fr))`
            }}
          >
            {loading && !initialLoading ? (
              <div className="text-white/60">加载中...</div>
            ) : (
              shuffledChars.map((char, index) => {
                const isSelected = selectedChars.some(item => item.index === index);
                return (
                  <motion.button
                    key={`${char}-${index}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`aspect-square flex items-center justify-center text-xl font-medium rounded-2xl backdrop-blur-md transition-all
                      ${isSelected
                        ? 'bg-[#06b6d4] text-white'
                        : 'bg-white/10 text-white/90 hover:bg-white/20'}`}
                    onClick={() => handleCharacterSelect(char, index)}
                    disabled={showResult || timeLeft === 0}
                  >
                    {char}
                  </motion.button>
                );
              })
            )}
          </div>

          {/* Selected Characters */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <div className="text-white/60 mb-3">已选择:</div>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {selectedChars.map((item, index) => (
                  <motion.div
                    key={`selected-${item.char}-${item.index}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="bg-white/20 text-white px-4 py-2 rounded-xl"
                  >
                    {item.char}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button 
              className={`w-full py-4 rounded-2xl text-white text-lg font-medium transition-all backdrop-blur-md
                ${(!selectedChars.length || showResult || timeLeft === 0 || showAnswer)
                  ? 'bg-white/20 cursor-not-allowed'
                  : 'bg-[#06b6d4] hover:bg-[#06b6d4]/80'}`}
              disabled={!selectedChars.length || showResult || timeLeft === 0 || showAnswer}
              onClick={handleSubmitAnswer}
            >
              提交答案
            </button>

            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className={`p-6 rounded-2xl text-center font-medium backdrop-blur-md ${
                  isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {isCorrect 
                    ? '回答正确！' 
                    : timeLeft === 0 
                      ? '时间到！' 
                      : showAnswer 
                        ? '已用完所有重试机会' 
                        : `回答错误，还有 ${retryCount - 1} 次机会`}
                </div>
                
                {/* 显示正确答案 */}
                {showAnswer && !isCorrect && (
                  <div className="p-6 rounded-2xl bg-white/10 text-white backdrop-blur-md">
                    <div className="text-white/60 mb-2">正确答案：</div>
                    <div className="font-medium">
                      {poem.join('')}
                    </div>
                  </div>
                )}

                <button 
                  className="w-full py-4 rounded-2xl bg-white/10 text-white text-lg font-medium hover:bg-white/20 transition-all backdrop-blur-md"
                  onClick={resetGame}
                >
                  {isCorrect || showAnswer ? '下一题' : '重试'}
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 flex gap-1">
            <button className="p-2 rounded-xl bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors">
              <Home className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-xl bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors">
              <Command className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-xl bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors">
              <Database className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-xl bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors">
              <CreditCard className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-xl bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors">
              <Clock className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-xl bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors">
              <Database className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}