import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface TutorialProps {
  onClose: () => void;
}

const tutorialSteps = [
  {
    title: '游戏规则',
    content: '根据代码提示猜出对应的诗句。每个关卡都有时间限制，越快完成得分越高！'
  },
  {
    title: '选择难度',
    content: '简单模式：常见诗句，更多时间\n困难模式：较难诗句，更少时间，更高分数'
  },
  {
    title: '连胜奖励',
    content: '连续答对可以获得额外分数！保持连胜来获得更高分数。'
  },
  {
    title: '开始游戏',
    content: '准备好了吗？让我们开始吧！'
  }
];

export function Tutorial({ onClose }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-2xl font-bold">
            {tutorialSteps[currentStep].title}
          </h2>
          <div className="text-white/60">
            {currentStep + 1} / {tutorialSteps.length}
          </div>
        </div>

        <div className="text-white/80 mb-8 whitespace-pre-line">
          {tutorialSteps[currentStep].content}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            上一步
          </button>
          
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#06b6d4] text-white"
          >
            {currentStep === tutorialSteps.length - 1 ? '开始游戏' : '下一步'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
} 