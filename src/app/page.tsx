'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// 小狗类型
type DogType = 'puppy' | 'dog' | 'poodle' | 'bone' | 'paw' | 'fox';

// 小狗emoji映射
const dogEmojis: Record<DogType, string> = {
  puppy: '🐶',
  dog: '🐕',
  poodle: '🐩',
  bone: '🦴',
  paw: '🐾',
  fox: '🦊',
};

const dogNames: Record<DogType, string> = {
  puppy: '小狗',
  dog: '狗狗',
  poodle: '贵宾',
  bone: '骨头',
  paw: '爪子',
  fox: '狐狸',
};

const dogTypes: DogType[] = ['puppy', 'dog', 'poodle', 'bone', 'paw', 'fox'];

// 游戏配置
const GRID_SIZE = 8;
const MIN_MATCH = 3;

export default function MatchThreeGame() {
  const [grid, setGrid] = useState<DogType[][]>([]);
  const [selectedGem, setSelectedGem] = useState<{ row: number; col: number } | null>(null);
  const [score, setScore] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // 初始化游戏网格
  const initializeGrid = useCallback(() => {
    const newGrid: DogType[][] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      newGrid[row] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        let dog: DogType;
        do {
          dog = dogTypes[Math.floor(Math.random() * dogTypes.length)];
        } while (wouldCreateMatch(newGrid, row, col, dog));
        newGrid[row][col] = dog;
      }
    }
    return newGrid;
  }, []);

  // 检查放置小狗是否会创建初始匹配
  const wouldCreateMatch = (
    grid: DogType[][],
    row: number,
    col: number,
    dog: DogType
  ): boolean => {
    // 检查水平方向
    if (col >= 2 && grid[row][col - 1] === dog && grid[row][col - 2] === dog) {
      return true;
    }
    // 检查垂直方向
    if (row >= 2 && grid[row - 1]?.[col] === dog && grid[row - 2]?.[col] === dog) {
      return true;
    }
    return false;
  };

  // 初始化游戏
  useEffect(() => {
    setGrid(initializeGrid());
  }, [initializeGrid]);

  // 查找所有匹配
  const findMatches = useCallback((currentGrid: DogType[][]): Set<string> => {
    const matches = new Set<string>();

    // 检查水平匹配
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

    // 检查垂直匹配
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
    if (isProcessing) return;

    // 如果没有选中的小狗，选中当前小狗
    if (!selectedGem) {
      setSelectedGem({ row, col });
      return;
    }

    // 如果点击的是同一个小狗，取消选中
    if (selectedGem.row === row && selectedGem.col === col) {
      setSelectedGem(null);
      return;
    }

    // 检查是否是相邻小狗（水平或垂直）
    const rowDiff = Math.abs(selectedGem.row - row);
    const colDiff = Math.abs(selectedGem.col - col);

    if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
      setIsProcessing(true);

      // 交换小狗
      const newGrid = grid.map(r => [...r]);
      const temp = newGrid[selectedGem.row][selectedGem.col];
      newGrid[selectedGem.row][selectedGem.col] = newGrid[row][col];
      newGrid[row][col] = temp;

      // 检查交换后是否有匹配
      const matches = findMatches(newGrid);

      if (matches.size > 0) {
        // 有匹配，执行消除
        setGrid(newGrid);
        setSelectedGem(null);
        await processMatches(newGrid);
      } else {
        // 没有匹配，换回去
        await new Promise(resolve => setTimeout(resolve, 200));
        newGrid[selectedGem.row][selectedGem.col] = newGrid[row][col];
        newGrid[row][col] = temp;
        setGrid(newGrid);
        setSelectedGem(null);
      }

      setIsProcessing(false);
    } else {
      // 不是相邻小狗，选中新小狗
      setSelectedGem({ row, col });
    }
  };

  // 处理匹配消除
  const processMatches = async (currentGrid: DogType[][]): Promise<void> => {
    let workingGrid = currentGrid.map(r => [...r]);
    let hasMatches = true;
    let roundMatches = findMatches(workingGrid);

    while (hasMatches) {
      // 消除匹配的小狗
      roundMatches.forEach(key => {
        const [row, col] = key.split(',').map(Number);
        workingGrid[row][col] = null as any;
      });

      // 增加分数
      setScore(prev => prev + roundMatches.size * 10);

      // 等待消除动画
      await new Promise(resolve => setTimeout(resolve, 300));

      // 小狗下落
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

      // 填充空位
      for (let col = 0; col < GRID_SIZE; col++) {
        for (let row = 0; row < GRID_SIZE; row++) {
          if (workingGrid[row][col] === null) {
            workingGrid[row][col] = dogTypes[Math.floor(Math.random() * dogTypes.length)];
          }
        }
      }

      // 更新网格
      setGrid(workingGrid.map(r => [...r]));
      await new Promise(resolve => setTimeout(resolve, 300));

      // 检查是否还有新的匹配
      roundMatches = findMatches(workingGrid);
      hasMatches = roundMatches.size > 0;
    }
  };

  // 重置游戏
  const resetGame = () => {
    setGrid(initializeGrid());
    setScore(0);
    setSelectedGem(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-lg border-orange-200 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 mb-2">
            🐕 萌宠消消乐 🐾
          </CardTitle>
          <div className="flex items-center justify-center gap-4">
            <div className="text-xl text-orange-700">
              得分: <span className="font-bold text-orange-500">{score}</span>
            </div>
            <Button
              onClick={resetGame}
              variant="outline"
              className="bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300"
            >
              重新开始
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 mx-auto" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`, maxWidth: 'fit-content' }}>
            {grid.map((row, rowIndex) =>
              row.map((dog, colIndex) => {
                const isSelected =
                  selectedGem?.row === rowIndex && selectedGem.col === colIndex;
                const isAdjacent =
                  selectedGem &&
                  ((Math.abs(selectedGem.row - rowIndex) === 1 && selectedGem.col === colIndex) ||
                    (Math.abs(selectedGem.col - colIndex) === 1 && selectedGem.row === rowIndex));

                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleGemClick(rowIndex, colIndex)}
                    disabled={isProcessing}
                    className={`
                      w-12 h-12 sm:w-14 sm:h-14 rounded-xl transition-all duration-200
                      bg-gradient-to-br from-orange-50 to-amber-50
                      border-2 ${isSelected ? 'border-orange-400' : 'border-orange-200'}
                      ${isSelected ? 'ring-4 ring-orange-300 scale-110 z-10' : ''}
                      ${isAdjacent ? 'ring-2 ring-orange-200 scale-105' : ''}
                      ${!isSelected && !isAdjacent ? 'hover:scale-105 hover:shadow-lg hover:border-orange-300' : ''}
                      disabled:opacity-50 disabled:cursor-not-allowed
                      shadow-md
                      flex items-center justify-center
                    `}
                    title={dogNames[dog]}
                  >
                    <span className="text-3xl sm:text-4xl select-none">
                      {dogEmojis[dog]}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
