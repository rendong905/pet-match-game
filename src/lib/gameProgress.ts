// 游戏进度数据结构
export interface GameProgress {
  unlockedLevel: number;      // 已解锁关卡号
  levelScores: {              // 各关卡最高分记录
    [levelId: number]: number;
  };
  currentLevel: number;       // 当前关卡号
  playCount: number;          // 游戏次数
}

// 默认初始进度
export const defaultProgress: GameProgress = {
  unlockedLevel: 1,           // 首次进入默认第1关已解锁
  levelScores: {},
  currentLevel: 1,
  playCount: 0,
};

// 保存游戏进度
export const saveProgress = (progress: GameProgress): boolean => {
  try {
    const data = JSON.stringify(progress);
    localStorage.setItem('gameProgress', data);
    return true;
  } catch (error) {
    console.error('保存游戏进度失败:', error);
    return false;
  }
};

// 加载游戏进度
export const loadProgress = (): GameProgress => {
  try {
    const saved = localStorage.getItem('gameProgress');
    if (saved) {
      const parsed = JSON.parse(saved);
      // 确保数据结构完整
      return {
        unlockedLevel: parsed.unlockedLevel || 1,
        levelScores: parsed.levelScores || {},
        currentLevel: parsed.currentLevel || 1,
        playCount: parsed.playCount || 0,
      };
    }
  } catch (error) {
    console.error('加载游戏进度失败:', error);
  }
  // 返回默认进度
  return { ...defaultProgress };
};

// 判断关卡是否已解锁
export const isLevelUnlocked = (levelId: number, progress: GameProgress): boolean => {
  return levelId <= progress.unlockedLevel;
};

// 获取关卡历史最高分
export const getHighScore = (levelId: number, progress: GameProgress): number => {
  return progress.levelScores[levelId] || 0;
};

// 更新关卡最高分（如果当前分数更高）
export const updateHighScore = (levelId: number, score: number, progress: GameProgress): GameProgress => {
  const currentHigh = getHighScore(levelId, progress);
  if (score > currentHigh) {
    return {
      ...progress,
      levelScores: {
        ...progress.levelScores,
        [levelId]: score,
      },
    };
  }
  return progress;
};
