export const SoundService = {
  correct: new Audio('/sounds/correct.mp3'),
  wrong: new Audio('/sounds/wrong.mp3'),
  click: new Audio('/sounds/click.mp3'),
  success: new Audio('/sounds/success.mp3'),
  
  playSound(type: 'correct' | 'wrong' | 'click' | 'success') {
    const sound = this[type];
    sound.currentTime = 0;
    sound.play().catch(() => {
      // 忽略自动播放限制错误
    });
  },
  
  init() {
    // 预加载所有音效
    Object.values(this).forEach(audio => {
      if (audio instanceof Audio) {
        audio.load();
      }
    });
  }
}; 