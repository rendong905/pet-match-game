import type { Level } from './levels';

// 小狗类型（扩展到8种）
export type DogType = 'puppy' | 'dog' | 'poodle' | 'bone' | 'paw' | 'fox' | 'mink' | 'duck';

// 小狗emoji映射
export const dogEmojis: Record<DogType, string> = {
  puppy: '🐶',
  dog: '🐕',
  poodle: '🐩',
  bone: '🦴',
  paw: '🐾',
  fox: '🦊',
  mink: '🦦',  // 貂
  duck: '🦆',  // 鸭子
};

// 小狗名称映射
export const dogNames: Record<DogType, string> = {
  puppy: '小狗',
  dog: '狗狗',
  poodle: '贵宾',
  bone: '骨头',
  paw: '爪子',
  fox: '狐狸',
  mink: '貂',
  duck: '鸭子',
};

// 所有萌宠类型
export const dogTypes: DogType[] = ['puppy', 'dog', 'poodle', 'bone', 'paw', 'fox', 'mink', 'duck'];

// 特殊道具类型
export type SpecialType = 'bomb' | 'rainbow' | 'rocket' | null;

// 特殊道具信息
export const specialEmojis: Record<string, string> = {
  bomb: '💣',
  rainbow: '🌈',
  rocket: '🚀',
};

// 游戏网格类型（包含特殊道具）
export interface Gem {
  type: DogType;
  special: SpecialType;
}

// 创建默认萌宠
export const createGem = (type: DogType): Gem => ({
  type,
  special: null,
});

// 创建特殊萌宠
export const createSpecialGem = (type: DogType, special: SpecialType): Gem => ({
  type,
  special,
});

// 提示查找结果
export interface Hint {
  gem1: { row: number; col: number };
  gem2: { row: number; col: number };
}

// 历史状态（用于撤销）
export interface HistoryState {
  grid: Gem[][];
  score: number;
  moves: number;
}

// 查找可交换的对（提示功能）
export const findHint = (grid: Gem[][], level: Level): Hint | null => {
  const rows = level.gridSize.rows;
  const cols = level.gridSize.cols;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // 检查右侧交换
      if (col < cols - 1) {
        const newGrid = simulateSwap(grid, row, col, row, col + 1);
        if (hasMatch(newGrid, rows, cols)) {
          return {
            gem1: { row, col },
            gem2: { row, col: col + 1 },
          };
        }
      }
      // 检查下方交换
      if (row < rows - 1) {
        const newGrid = simulateSwap(grid, row, col, row + 1, col);
        if (hasMatch(newGrid, rows, cols)) {
          return {
            gem1: { row, col },
            gem2: { row: row + 1, col },
          };
        }
      }
    }
  }
  return null;
};

// 模拟交换
const simulateSwap = (grid: Gem[][], r1: number, c1: number, r2: number, c2: number): Gem[][] => {
  const newGrid = grid.map(row => [...row]);
  const temp = newGrid[r1][c1];
  newGrid[r1][c1] = newGrid[r2][c2];
  newGrid[r2][c2] = temp;
  return newGrid;
};

// 检查是否有匹配
const hasMatch = (grid: Gem[][], rows: number, cols: number): boolean => {
  // 检查水平匹配
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols - 2; col++) {
      const gem = grid[row][col];
      if (gem && gem.type === grid[row][col + 1].type && gem.type === grid[row][col + 2].type) {
        return true;
      }
    }
  }
  // 检查垂直匹配
  for (let row = 0; row < rows - 2; row++) {
    for (let col = 0; col < cols; col++) {
      const gem = grid[row][col];
      if (gem && gem.type === grid[row + 1][col].type && gem.type === grid[row + 2][col].type) {
        return true;
      }
    }
  }
  return false;
};

// 检测是否生成特殊道具
export const detectSpecial = (matches: Set<string>, rows: number, cols: number): { special: SpecialType; position: { row: number; col: number } } | null => {
  const matchArray = Array.from(matches).map(s => {
    const [r, c] = s.split(',').map(Number);
    return { row: r, col: c };
  });

  if (matchArray.length >= 5) {
    // 5连 → 彩虹
    return { special: 'rainbow', position: matchArray[2] }; // 取中间位置
  } else if (matchArray.length === 4) {
    // 4连 → 炸弹
    return { special: 'bomb', position: matchArray[1] }; // 取中间位置
  } else if (isTOrLShape(matchArray)) {
    // T型或L型 → 火箭
    return { special: 'rocket', position: matchArray[1] };
  }

  return null;
};

// 检查是否为T型或L型
const isTOrLShape = (matches: Array<{ row: number; col: number }>): boolean => {
  if (matches.length !== 4) return false;

  // 检查是否有共同的交叉点
  for (const m1 of matches) {
    const horizontal = matches.filter(m => m.row === m1.row).length;
    const vertical = matches.filter(m => m.col === m1.col).length;
    if (horizontal >= 2 && vertical >= 2) {
      return true;
    }
  }
  return false;
};

// 炸弹爆炸效果（3×3范围）
export const getBombExplosion = (centerRow: number, centerCol: number, rows: number, cols: number): Set<string> => {
  const explosions = new Set<string>();
  for (let r = centerRow - 1; r <= centerRow + 1; r++) {
    for (let c = centerCol - 1; c <= centerCol + 1; c++) {
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        explosions.add(`${r},${c}`);
      }
    }
  }
  return explosions;
};

// 彩虹爆炸效果（所有同色）
export const getRainbowExplosion = (grid: Gem[][], targetType: DogType, rows: number, cols: number): Set<string> => {
  const explosions = new Set<string>();
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col].type === targetType) {
        explosions.add(`${row},${col}`);
      }
    }
  }
  return explosions;
};

// 火箭爆炸效果（整行或整列）
export const getRocketExplosion = (row: number, col: number, rows: number, cols: number): Set<string> => {
  const explosions = new Set<string>();
  // 消除整行
  for (let c = 0; c < cols; c++) {
    explosions.add(`${row},${c}`);
  }
  // 消除整列
  for (let r = 0; r < rows; r++) {
    explosions.add(`${r},${col}`);
  }
  return explosions;
};
