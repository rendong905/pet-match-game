'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { levels, type Level, getLevel } from '@/lib/levels';
import {
  GameProgress,
  defaultProgress,
  saveProgress,
  loadProgress,
  isLevelUnlocked,
  getHighScore,
  updateHighScore,
} from '@/lib/gameProgress';
import {
  dogEmojis,
  dogNames,
  dogTypes,
  Gem,
  createGem,
  findHint,
  specialEmojis,
  type Hint,
  type HistoryState,
} from '@/lib/gameUtils';

// 游戏配置
const MIN_MATCH = 3;

// 游戏状态
type GameState = 'menu' | 'playing' | 'won' | 'lost';

export default function MatchThreeGame() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [grid, setGrid] = useState<DogType[][]>([]);
  const [selectedGem, setSelectedGem] = useState<{ row: number; col: number } | null>(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<GameProgress>(defaultProgress);
  const [hintsRemaining, setHintsRemaining] = useState(3); // 每关3次提示
  const [hintGems, setHintGems] = useState<Hint | null>(null); // 当前提示的格子
  const [isWeChat, setIsWeChat] = useState(false); // 是否在微信浏览器中

  // 检测微信浏览器
  useEffect(() => {
    const ua = navigator.userAgent;
    setIsWeChat(/MicroMessenger/i.test(ua));
  }, []);

  // 页面加载时恢复进度
  useEffect(() => {
    const savedProgress = loadProgress();
    setProgress(savedProgress);
  }, []);

  // 初始化游戏网格
  const initializeGrid = useCallback((level: Level) => {
    const { rows, cols } = level.gridSize;
    const newGrid: Gem[][] = [];
    const levelDogTypes = dogTypes.slice(0, level.dogTypes);

    for (let row = 0; row < rows; row++) {
      newGrid[row] = [];
      for (let col = 0; col < cols; col++) {
        let dog: typeof levelDogTypes[number];
        do {
          dog = levelDogTypes[Math.floor(Math.random() * levelDogTypes.length)];
        } while (false); // 暂时禁用初始匹配检查，稍后修复
        newGrid[row][col] = createGem(dog);
      }
    }
    return newGrid;
  }, []);

  // 开始指定关卡
  const startLevel = (level: Level) => {
    // 增加游戏次数
    const newProgress = {
      ...progress,
      currentLevel: level.id,
      playCount: progress.playCount + 1,
    };
    saveProgress(newProgress);
    setProgress(newProgress);

    setCurrentLevel(level);
    setGrid(initializeGrid(level));
    setScore(0);
    setMoves(0);
    setSelectedGem(null);
    setIsProcessing(false);
    setHintsRemaining(3); // 重置提示次数
    setHintGems(null); // 清除提示
    setGameState('playing');
  };

  // 重新开始当前关卡
  const restartLevel = () => {
    if (currentLevel) {
      startLevel(currentLevel);
    }
  };

  // 提示功能
  const showHint = () => {
    if (hintsRemaining > 0 && currentLevel && !isProcessing) {
      const hint = findHint(grid, currentLevel);
      if (hint) {
        setHintGems(hint);
        setHintsRemaining(prev => prev - 1);
        // 3秒后清除提示
        setTimeout(() => {
          setHintGems(null);
        }, 3000);
      }
    }
  };

  // 清除提示（当玩家点击格子时）
  const clearHint = () => {
    if (hintGems) {
      setHintGems(null);
    }
  };

  // 下一关
  const nextLevel = () => {
    if (currentLevel) {
      // 保存当前关卡分数并解锁下一关
      const updatedProgress = updateHighScore(currentLevel.id, score, progress);

      // 解锁下一关
      const nextLevelId = currentLevel.id + 1;
      if (nextLevelId <= levels.length) {
        updatedProgress.unlockedLevel = Math.max(updatedProgress.unlockedLevel, nextLevelId);
      }

      saveProgress(updatedProgress);
      setProgress(updatedProgress);

      const nextLevelData = getLevel(nextLevelId);
      if (nextLevelData) {
        startLevel(nextLevelData);
      } else {
        setGameState('menu');
      }
    }
  };

  // 返回菜单
  const backToMenu = () => {
    setGameState('menu');
  };

  // 检查游戏状态
  const checkGameState = useCallback(() => {
    if (!currentLevel || gameState !== 'playing') return;

    if (score >= currentLevel.targetScore) {
      // 胜利：保存分数
      const updatedProgress = updateHighScore(currentLevel.id, score, progress);
      saveProgress(updatedProgress);
      setProgress(updatedProgress);
      setGameState('won');
    } else if (moves >= currentLevel.maxMoves) {
      // 失败：保存当前状态
      const updatedProgress = updateHighScore(currentLevel.id, score, progress);
      saveProgress(updatedProgress);
      setProgress(updatedProgress);
      setGameState('lost');
    }
  }, [currentLevel, score, moves, gameState, progress]);

  // 检查放置小狗是否会创建初始匹配
  const wouldCreateMatch = (
    grid: DogType[][],
    row: number,
    col: number,
    dog: DogType
  ): boolean => {
    if (col >= 2 && grid[row][col - 1] === dog && grid[row][col - 2] === dog) {
      return true;
    }
    if (row >= 2 && grid[row - 1]?.[col] === dog && grid[row - 2]?.[col] === dog) {
      return true;
    }
    return false;
  };

  // 查找所有匹配
  const findMatches = useCallback((currentGrid: DogType[][]): Set<string> => {
    const matches = new Set<string>();

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE - 2; col++) {
        const dog = currentGrid[row][col];
        if (dog && dog === currentGrid[row][col + 1] && dog === currentGrid[row][col + 2]) {
          matches.add(`${row},${col}`);
          matches.add(`${row},${col + 1}`);
          matches.add(`${row},${col + 2}`);
        }
      }
    }

    for (let row = 0; row < GRID_SIZE - 2; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const dog = currentGrid[row][col];
        if (dog && dog === currentGrid[row + 1][col] && dog === currentGrid[row + 2][col]) {
          matches.add(`${row},${col}`);
          matches.add(`${row + 1},${col}`);
          matches.add(`${row + 2},${col}`);
        }
      }
    }

    return matches;
  }, []);

  // 处理小狗点击
  const handleGemClick = async (row: number, col: number) => {
    if (isProcessing || gameState !== 'playing') return;

    // 清除提示
    clearHint();

    if (!selectedGem) {
      setSelectedGem({ row, col });
      return;
    }

    if (selectedGem.row === row && selectedGem.col === col) {
      setSelectedGem(null);
      return;
    }

    const rowDiff = Math.abs(selectedGem.row - row);
    const colDiff = Math.abs(selectedGem.col - col);

    if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
      setIsProcessing(true);

      const newGrid = grid.map(r => [...r]);
      const temp = newGrid[selectedGem.row][selectedGem.col];
      newGrid[selectedGem.row][selectedGem.col] = newGrid[row][col];
      newGrid[row][col] = temp;

      const matches = findMatches(newGrid);

      if (matches.size > 0) {
        setGrid(newGrid);
        setSelectedGem(null);
        setMoves(prev => prev + 1);
        await processMatches(newGrid);
      } else {
        await new Promise(resolve => setTimeout(resolve, 200));
        newGrid[selectedGem.row][selectedGem.col] = newGrid[row][col];
        newGrid[row][col] = temp;
        setGrid(newGrid);
        setSelectedGem(null);
      }

      setIsProcessing(false);
    } else {
      setSelectedGem({ row, col });
    }
  };

  // 处理匹配消除
  const processMatches = async (currentGrid: DogType[][]): Promise<void> => {
    let workingGrid = currentGrid.map(r => [...r]);
    let hasMatches = true;
    let roundMatches = findMatches(workingGrid);

    while (hasMatches) {
      roundMatches.forEach(key => {
        const [row, col] = key.split(',').map(Number);
        workingGrid[row][col] = null as any;
      });

      setScore(prev => prev + roundMatches.size * 10);

      await new Promise(resolve => setTimeout(resolve, 300));

      for (let col = 0; col < GRID_SIZE; col++) {
        let emptyRow = GRID_SIZE - 1;
        for (let row = GRID_SIZE - 1; row >= 0; row--) {
          if (workingGrid[row][col] !== null) {
            if (row !== emptyRow) {
              workingGrid[emptyRow][col] = workingGrid[row][col];
              workingGrid[row][col] = null as any;
            }
            emptyRow--;
          }
        }
      }

      for (let col = 0; col < GRID_SIZE; col++) {
        for (let row = 0; row < GRID_SIZE; row++) {
          if (workingGrid[row][col] === null) {
            workingGrid[row][col] = dogTypes[Math.floor(Math.random() * dogTypes.length)];
          }
        }
      }

      setGrid(workingGrid.map(r => [...r]));
      await new Promise(resolve => setTimeout(resolve, 300));

      roundMatches = findMatches(workingGrid);
      hasMatches = roundMatches.size > 0;
    }
  };

  // 检查游戏状态变化
  useEffect(() => {
    checkGameState();
  }, [checkGameState, score, moves]);

  // 首页关卡选择界面
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 p-4 py-8">
        <Card className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-lg border-orange-200 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 mb-4">
              🐕 萌宠消消乐 🐾
            </CardTitle>
            <p className="text-lg text-orange-700">选择关卡开始游戏</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {levels.map((level) => {
                const unlocked = isLevelUnlocked(level.id, progress);
                const highScore = getHighScore(level.id, progress);

                return (
                  <Button
                    key={level.id}
                    onClick={() => unlocked && startLevel(level)}
                    disabled={!unlocked}
                    className={`h-24 flex flex-col items-center justify-center border-2 transition-all duration-200 ${
                      unlocked
                        ? 'bg-gradient-to-br from-orange-100 to-amber-100 hover:from-orange-200 hover:to-amber-200 text-orange-700 border-orange-300 hover:border-orange-400 cursor-pointer'
                        : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-2xl mb-1">{unlocked ? '🐾' : '🔒'}</span>
                    <span className="text-lg font-bold">第 {level.id} 关</span>
                    <span className="text-xs text-orange-600 mt-1">{level.targetScore}分</span>
                    {highScore > 0 && (
                      <span className="text-xs text-orange-500 mt-1">最高: {highScore}</span>
                    )}
                    {!unlocked && (
                      <span className="text-xs text-gray-400 mt-1">
                        通关第{level.id - 1}关解锁
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 游戏界面
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-lg border-orange-200 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 mb-2">
            🐕 萌宠消消乐 🐾
          </CardTitle>
          <div className="text-lg text-orange-700 font-semibold mb-3">
            {currentLevel?.name}
          </div>
          <div className="flex items-center justify-center gap-6 mb-2">
            <div className="text-xl text-orange-700">
              得分: <span className="font-bold text-orange-500">{score}</span>
              <span className="text-sm text-orange-600 ml-2">/ {currentLevel?.targetScore}</span>
            </div>
            <div className="text-xl text-orange-700">
              步数: <span className="font-bold text-orange-500">{moves}</span>
              <span className="text-sm text-orange-600 ml-2">/ {currentLevel?.maxMoves}</span>
            </div>
          </div>
          {currentLevel && (
            <div className="text-sm text-orange-600 mb-3">
              历史最高: <span className="font-bold text-orange-500">{getHighScore(currentLevel.id, progress)}</span>
            </div>
          )}
          <div className="flex items-center justify-center gap-4 mt-3">
            <Button
              onClick={backToMenu}
              variant="outline"
              className="bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300"
            >
              返回菜单
            </Button>
            <Button
              onClick={restartLevel}
              variant="outline"
              className="bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300"
            >
              重新开始
            </Button>
            <Button
              onClick={showHint}
              disabled={hintsRemaining <= 0 || isProcessing}
              className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
              title={`剩余${hintsRemaining}次提示`}
            >
              💡 提示 ({hintsRemaining})
            </Button>
          </div>
          {/* 微信浏览器兼容性提示 */}
          {isWeChat && (
            <div className="mt-3 p-3 bg-amber-100 border-2 border-amber-300 rounded-lg text-sm text-amber-800">
              ⚠️ 检测到微信浏览器，部分动画效果可能无法正常显示
            </div>
          )}
        </CardHeader>
        <CardContent>
          {gameState === 'playing' && currentLevel && (
            <div className="grid gap-2 mx-auto" style={{ gridTemplateColumns: `repeat(${currentLevel.gridSize.cols}, minmax(0, 1fr))`, maxWidth: 'fit-content' }}>
              {grid.map((row, rowIndex) =>
                row.map((gem, colIndex) => {
                  const isSelected =
                    selectedGem?.row === rowIndex && selectedGem.col === colIndex;
                  const isAdjacent =
                    selectedGem &&
                    ((Math.abs(selectedGem.row - rowIndex) === 1 && selectedGem.col === colIndex) ||
                      (Math.abs(selectedGem.col - colIndex) === 1 && selectedGem.row === rowIndex));
                  // 检查是否是提示的格子
                  const isHinted = hintGems &&
                    ((hintGems.gem1.row === rowIndex && hintGems.gem1.col === colIndex) ||
                     (hintGems.gem2.row === rowIndex && hintGems.gem2.col === colIndex));

                  return (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleGemClick(rowIndex, colIndex)}
                      disabled={isProcessing}
                      className={`
                        w-12 h-12 sm:w-14 sm:h-14 rounded-xl transition-all duration-200 relative
                        bg-gradient-to-br from-orange-50 to-amber-50
                        border-2 ${isSelected ? 'border-orange-400' : 'border-orange-200'}
                        ${isSelected ? 'ring-4 ring-orange-300 scale-110 z-10' : ''}
                        ${isAdjacent ? 'ring-2 ring-orange-200 scale-105' : ''}
                        ${isHinted ? 'ring-4 ring-blue-400 scale-105 animate-pulse' : ''}
                        ${!isSelected && !isAdjacent && !isHinted ? 'hover:scale-105 hover:shadow-lg hover:border-orange-300' : ''}
                        disabled:opacity-50 disabled:cursor-not-allowed
                        shadow-md
                        flex items-center justify-center
                      `}
                      title={`${dogNames[gem.type]}${gem.special ? ' (' + gem.special + ')' : ''}`}
                    >
                      <span className="text-3xl sm:text-4xl select-none">
                        {dogEmojis[gem.type]}
                      </span>
                      {gem.special && (
                        <span className="absolute top-0 right-0 text-xs">
                          {specialEmojis[gem.special] || '⭐'}
                        </span>
                      )}
                      {isHinted && (
                        <div className="absolute inset-0 bg-blue-400/20 rounded-xl animate-pulse" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}

          {/* 胜利弹窗 */}
          {gameState === 'won' && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="bg-white p-8 text-center border-4 border-green-400 shadow-2xl">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-green-600 mb-4">恭喜过关！</h2>
                <p className="text-xl text-gray-700 mb-2">得分: {score}</p>
                <p className="text-lg text-gray-600 mb-6">消耗步数: {moves}</p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={restartLevel}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    重新挑战
                  </Button>
                  {currentLevel && currentLevel.id < levels.length && (
                    <Button
                      onClick={nextLevel}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      下一关
                    </Button>
                  )}
                  <Button
                    onClick={backToMenu}
                    variant="outline"
                    className="border-orange-300 text-orange-700"
                  >
                    返回菜单
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* 失败弹窗 */}
          {gameState === 'lost' && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="bg-white p-8 text-center border-4 border-red-400 shadow-2xl">
                <div className="text-6xl mb-4">😢</div>
                <h2 className="text-3xl font-bold text-red-600 mb-4">挑战失败</h2>
                <p className="text-xl text-gray-700 mb-2">得分: {score}</p>
                <p className="text-lg text-gray-600 mb-2">目标分数: {currentLevel?.targetScore}</p>
                <p className="text-lg text-gray-600 mb-6">步数已用完</p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={restartLevel}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    重新开始
                  </Button>
                  <Button
                    onClick={backToMenu}
                    variant="outline"
                    className="border-orange-300 text-orange-700"
                  >
                    返回菜单
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
