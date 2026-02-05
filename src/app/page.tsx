'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// 宝石类型
type GemType = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

// 宝石颜色映射
const gemColors: Record<GemType, string> = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
};

const gemTypes: GemType[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

// 游戏配置
const GRID_SIZE = 8;
const MIN_MATCH = 3;

export default function MatchThreeGame() {
  const [grid, setGrid] = useState<GemType[][]>([]);
  const [selectedGem, setSelectedGem] = useState<{ row: number; col: number } | null>(null);
  const [score, setScore] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // 初始化游戏网格
  const initializeGrid = useCallback(() => {
    const newGrid: GemType[][] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      newGrid[row] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        let gem: GemType;
        do {
          gem = gemTypes[Math.floor(Math.random() * gemTypes.length)];
        } while (wouldCreateMatch(newGrid, row, col, gem));
        newGrid[row][col] = gem;
      }
    }
    return newGrid;
  }, []);

  // 检查放置宝石是否会创建初始匹配
  const wouldCreateMatch = (
    grid: GemType[][],
    row: number,
    col: number,
    gem: GemType
  ): boolean => {
    // 检查水平方向
    if (col >= 2 && grid[row][col - 1] === gem && grid[row][col - 2] === gem) {
      return true;
    }
    // 检查垂直方向
    if (row >= 2 && grid[row - 1]?.[col] === gem && grid[row - 2]?.[col] === gem) {
      return true;
    }
    return false;
  };

  // 初始化游戏
  useEffect(() => {
    setGrid(initializeGrid());
  }, [initializeGrid]);

  // 查找所有匹配
  const findMatches = useCallback((currentGrid: GemType[][]): Set<string> => {
    const matches = new Set<string>();

    // 检查水平匹配
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE - 2; col++) {
        const gem = currentGrid[row][col];
        if (gem && gem === currentGrid[row][col + 1] && gem === currentGrid[row][col + 2]) {
          matches.add(`${row},${col}`);
          matches.add(`${row},${col + 1}`);
          matches.add(`${row},${col + 2}`);
        }
      }
    }

    // 检查垂直匹配
    for (let row = 0; row < GRID_SIZE - 2; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const gem = currentGrid[row][col];
        if (gem && gem === currentGrid[row + 1][col] && gem === currentGrid[row + 2][col]) {
          matches.add(`${row},${col}`);
          matches.add(`${row + 1},${col}`);
          matches.add(`${row + 2},${col}`);
        }
      }
    }

    return matches;
  }, []);

  // 处理宝石点击
  const handleGemClick = async (row: number, col: number) => {
    if (isProcessing) return;

    // 如果没有选中的宝石，选中当前宝石
    if (!selectedGem) {
      setSelectedGem({ row, col });
      return;
    }

    // 如果点击的是同一个宝石，取消选中
    if (selectedGem.row === row && selectedGem.col === col) {
      setSelectedGem(null);
      return;
    }

    // 检查是否是相邻宝石（水平或垂直）
    const rowDiff = Math.abs(selectedGem.row - row);
    const colDiff = Math.abs(selectedGem.col - col);

    if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
      setIsProcessing(true);

      // 交换宝石
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
      // 不是相邻宝石，选中新宝石
      setSelectedGem({ row, col });
    }
  };

  // 处理匹配消除
  const processMatches = async (currentGrid: GemType[][]): Promise<void> => {
    let workingGrid = currentGrid.map(r => [...r]);
    let hasMatches = true;
    let roundMatches = findMatches(workingGrid);

    while (hasMatches) {
      // 消除匹配的宝石
      roundMatches.forEach(key => {
        const [row, col] = key.split(',').map(Number);
        workingGrid[row][col] = null as any;
      });

      // 增加分数
      setScore(prev => prev + roundMatches.size * 10);

      // 等待消除动画
      await new Promise(resolve => setTimeout(resolve, 300));

      // 宝石下落
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
            workingGrid[row][col] = gemTypes[Math.floor(Math.random() * gemTypes.length)];
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-4xl font-bold text-white mb-2">
            💎 消消乐
          </CardTitle>
          <div className="flex items-center justify-center gap-4">
            <div className="text-xl text-white">
              得分: <span className="font-bold text-yellow-400">{score}</span>
            </div>
            <Button
              onClick={resetGame}
              variant="outline"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              重新开始
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1 mx-auto" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`, maxWidth: 'fit-content' }}>
            {grid.map((row, rowIndex) =>
              row.map((gem, colIndex) => {
                const isSelected =
                  selectedGem?.row === rowIndex && selectedGem?.col === colIndex;
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
                      w-12 h-12 sm:w-14 sm:h-14 rounded-lg transition-all duration-200
                      ${gemColors[gem]}
                      ${isSelected ? 'ring-4 ring-yellow-400 scale-110 z-10' : ''}
                      ${isAdjacent ? 'ring-2 ring-white/50 scale-105' : ''}
                      ${!isSelected && !isAdjacent ? 'hover:scale-105 hover:shadow-lg' : ''}
                      disabled:opacity-50 disabled:cursor-not-allowed
                      shadow-md
                    `}
                    style={{
                      boxShadow: isSelected ? '0 0 20px rgba(250, 204, 21, 0.8)' : undefined,
                    }}
                  >
                    <div className="w-full h-full rounded-lg bg-gradient-to-br from-white/30 to-black/30" />
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
