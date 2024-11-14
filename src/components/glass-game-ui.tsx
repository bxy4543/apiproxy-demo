"use client"

import { useState, useEffect } from "react"
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

export function GlassGameUi() {
  const [difficulty, setDifficulty] = useState<'easy' | 'hard'>('easy')
  const [level, setLevel] = useState(1)
  const [selectedChars, setSelectedChars] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes
  const timePercentage = (timeLeft / 180) * 100

  const characters = [
    "星", "此", "天", "生", "月", "时", "月",
    "雅", "溪", "草", "海", "山", "北", "思",
    "家", "上", "湖", "云", "明", "河", "共"
  ]

  const sampleCode = `class Moon:
    def __init__(self, position):
        self.position = position
        
    def rise(self):
        self.position = self.position[0] + 1`

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

  const resetGame = () => {
    setShowResult(false)
    setSelectedChars([])
    setTimeLeft(180)
    if (isCorrect) {
      setLevel(level + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e3a8a] to-[#172554] p-6">
      <div className="max-w-4xl mx-auto pb-24">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-[#06b6d4]/20 backdrop-blur-sm" />
              <div 
                className="absolute inset-0 rounded-full overflow-hidden"
                style={{
                  background: `conic-gradient(from 0deg, #06b6d4 ${timePercentage}%, transparent ${timePercentage}%)`
                }}
              />
              <div className="absolute inset-2 rounded-full bg-[#172554]/80 backdrop-blur flex items-center justify-center">
                <span className="text-white font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3">
              <span className="text-white/60 text-sm">当前关卡</span>
              <div className="text-white text-2xl font-bold">{level}</div>
            </div>
          </div>
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
                    <AvatarImage src="/placeholder.svg" />
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
        </div>

        {/* Main Content */}
        <div className="grid gap-6">
          {/* Difficulty Toggle */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1.5 flex justify-center w-64 mx-auto">
            {['easy', 'hard'].map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level as 'easy' | 'hard')}
                className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  difficulty === level
                    ? 'bg-[#06b6d4] text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {level === 'easy' ? '简单' : '困难'}
              </button>
            ))}
          </div>

          {/* Code Preview */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <pre className="font-mono text-sm text-white/90 whitespace-pre-wrap">{sampleCode}</pre>
          </div>

          {/* Character Grid */}
          <div className="grid grid-cols-7 gap-3">
            {characters.map((char, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`aspect-square flex items-center justify-center text-xl font-medium rounded-2xl backdrop-blur-md transition-all
                  ${selectedChars.includes(char) 
                    ? 'bg-[#06b6d4] text-white'
                    : 'bg-white/10 text-white/90 hover:bg-white/20'}`}
                onClick={() => {
                  if (selectedChars.includes(char)) {
                    setSelectedChars(selectedChars.filter(c => c !== char))
                  } else {
                    setSelectedChars([...selectedChars, char])
                  }
                }}
              >
                {char}
              </motion.button>
            ))}
          </div>

          {/* Selected Characters */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <div className="text-white/60 mb-3">已选择:</div>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {selectedChars.map((char, index) => (
                  <motion.div
                    key={char + index}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="bg-white/20 text-white px-4 py-2 rounded-xl"
                  >
                    {char}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button 
              className={`w-full py-4 rounded-2xl text-white text-lg font-medium transition-all backdrop-blur-md
                ${!selectedChars.length || showResult || timeLeft === 0
                  ? 'bg-white/20 cursor-not-allowed'
                  : 'bg-[#06b6d4] hover:bg-[#06b6d4]/80'}`}
              disabled={!selectedChars.length || showResult || timeLeft === 0}
              onClick={() => {
                setShowResult(true)
                setIsCorrect(Math.random() > 0.5)
              }}
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
                  {isCorrect ? '回答正确！' : timeLeft === 0 ? '时间到！' : '回答错误，请重试！'}
                </div>
                <button 
                  className="w-full py-4 rounded-2xl bg-white/10 text-white text-lg font-medium hover:bg-white/20 transition-all backdrop-blur-md"
                  onClick={resetGame}
                >
                  下一题
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