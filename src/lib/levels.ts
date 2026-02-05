// 关卡数据结构
export interface Level {
  id: number;
  name: string;
  targetScore: number;  // 目标分数
  maxMoves: number;     // 最大步数
  gridSize: number;     // 网格大小（暂时都是8x8）
  description: string;  // 关卡描述
}

// 10个关卡配置
export const levels: Level[] = [
  {
    id: 1,
    name: "初入萌宠世界",
    targetScore: 100,
    maxMoves: 15,
    gridSize: 8,
    description: "新手关卡，熟悉游戏规则"
  },
  {
    id: 2,
    name: "狗狗乐园",
    targetScore: 200,
    maxMoves: 15,
    gridSize: 8,
    description: "提高难度，挑战更高分数"
  },
  {
    id: 3,
    name: "萌宠聚会",
    targetScore: 300,
    maxMoves: 14,
    gridSize: 8,
    description: "步数减少，需要更精准的操作"
  },
  {
    id: 4,
    name: "爪印森林",
    targetScore: 400,
    maxMoves: 14,
    gridSize: 8,
    description: "更多萌宠，更多乐趣"
  },
  {
    id: 5,
    name: "骨头寻宝",
    targetScore: 500,
    maxMoves: 13,
    gridSize: 8,
    description: "挑战高分，展现你的实力"
  },
  {
    id: 6,
    name: "贵宾犬派对",
    targetScore: 600,
    maxMoves: 13,
    gridSize: 8,
    description: "步数紧张，策略至上"
  },
  {
    id: 7,
    name: "萌宠狂欢",
    targetScore: 750,
    maxMoves: 12,
    gridSize: 8,
    description: "节奏加快，反应要快"
  },
  {
    id: 8,
    name: "狐狸的挑战",
    targetScore: 900,
    maxMoves: 12,
    gridSize: 8,
    description: "需要技巧和运气的结合"
  },
  {
    id: 9,
    name: "萌宠大师",
    targetScore: 1100,
    maxMoves: 11,
    gridSize: 8,
    description: "接近完美，证明你的实力"
  },
  {
    id: 10,
    name: "萌宠传说",
    targetScore: 1300,
    maxMoves: 10,
    gridSize: 8,
    description: "终极挑战，成为真正的萌宠大师"
  }
];

// 获取指定关卡
export const getLevel = (levelId: number): Level | undefined => {
  return levels.find(level => level.id === levelId);
};
