// 关卡数据结构
export interface Level {
  id: number;
  name: string;
  targetScore: number;  // 目标分数
  maxMoves: number;     // 最大步数
  gridSize: {          // 网格大小（支持不同形状）
    rows: number;
    cols: number;
  };
  description: string;  // 关卡描述
  difficulty: number;   // 难度星级（1-5）
}

// 20个关卡配置
export const levels: Level[] = [
  // === 新手阶段（1-5关）===
  {
    id: 1,
    name: "初入萌宠世界",
    targetScore: 100,
    maxMoves: 15,
    gridSize: { rows: 8, cols: 8 },
    description: "新手关卡，熟悉游戏规则",
    difficulty: 1
  },
  {
    id: 2,
    name: "狗狗乐园",
    targetScore: 200,
    maxMoves: 15,
    gridSize: { rows: 8, cols: 8 },
    description: "提高难度，挑战更高分数",
    difficulty: 2
  },
  {
    id: 3,
    name: "萌宠聚会",
    targetScore: 300,
    maxMoves: 14,
    gridSize: { rows: 8, cols: 8 },
    description: "步数减少，需要更精准的操作",
    difficulty: 2
  },
  {
    id: 4,
    name: "爪印森林",  // 爽关
    targetScore: 400,
    maxMoves: 16,  // 增加2步
    gridSize: { rows: 8, cols: 8 },
    description: "轻松的关卡，享受消除的乐趣",
    difficulty: 2  // 从3降到2
  },
  {
    id: 5,
    name: "骨头寻宝",
    targetScore: 500,
    maxMoves: 13,
    gridSize: { rows: 8, cols: 8 },
    description: "挑战高分，展现你的实力",
    difficulty: 3
  },

  // === 进阶阶段（6-10关）===
  {
    id: 6,
    name: "贵宾犬派对",
    targetScore: 600,
    maxMoves: 13,
    gridSize: { rows: 8, cols: 8 },
    description: "步数紧张，策略至上",
    difficulty: 3
  },
  {
    id: 7,
    name: "萌宠狂欢",
    targetScore: 750,
    maxMoves: 12,
    gridSize: { rows: 8, cols: 8 },
    description: "节奏加快，反应要快",
    difficulty: 3
  },
  {
    id: 8,
    name: "狐狸的挑战",  // 爽关
    targetScore: 900,
    maxMoves: 14,  // 增加2步
    gridSize: { rows: 8, cols: 8 },
    description: "放轻松，享受消除的快感",
    difficulty: 3  // 从4降到3
  },
  {
    id: 9,
    name: "萌宠大师",
    targetScore: 1100,
    maxMoves: 13,  // 从11降到13
    gridSize: { rows: 8, cols: 8 },
    description: "接近完美，证明你的实力",
    difficulty: 4  // 从5降到4
  },
  {
    id: 10,
    name: "萌宠传说",
    targetScore: 1300,
    maxMoves: 12,  // 从10降到12
    gridSize: { rows: 8, cols: 8 },
    description: "第一阶段的终极挑战",
    difficulty: 4  // 从5降到4
  },

  // === 中等难度阶段（11-15关）===
  {
    id: 11,
    name: "萌宠冒险",
    targetScore: 1500,
    maxMoves: 12,
    gridSize: { rows: 8, cols: 8 },
    description: "开启新的冒险旅程",
    difficulty: 4
  },
  {
    id: 12,
    name: "萌宠王国",
    targetScore: 1700,
    maxMoves: 12,
    gridSize: { rows: 8, cols: 8 },
    description: "在萌宠王国中探索",
    difficulty: 4
  },
  {
    id: 13,
    name: "萌宠城堡",  // 爽关
    targetScore: 1900,
    maxMoves: 14,
    gridSize: { rows: 8, cols: 8 },
    description: "在城堡中放松心情",
    difficulty: 3
  },
  {
    id: 14,
    name: "萌宠海岸",
    targetScore: 2100,
    maxMoves: 11,
    gridSize: { rows: 8, cols: 8 },
    description: "海边的美景与挑战",
    difficulty: 4
  },
  {
    id: 15,
    name: "萌宠天空",
    targetScore: 2300,
    maxMoves: 11,
    gridSize: { rows: 8, cols: 8 },
    description: "在云端挑战自我",
    difficulty: 4
  },

  // === 高难度阶段（16-20关，引入不同网格形状）===
  {
    id: 16,
    name: "萌宠迷宫",  // 7×9网格
    targetScore: 2500,
    maxMoves: 11,
    gridSize: { rows: 7, cols: 9 },
    description: "迷宫般的挑战",
    difficulty: 4
  },
  {
    id: 17,
    name: "萌宠山峰",  // 爽关
    targetScore: 2700,
    maxMoves: 13,
    gridSize: { rows: 9, cols: 7 },
    description: "登顶前的休憩",
    difficulty: 3
  },
  {
    id: 18,
    name: "萌宠深渊",  // 6×10网格
    targetScore: 2900,
    maxMoves: 10,
    gridSize: { rows: 6, cols: 10 },
    description: "深渊的试炼",
    difficulty: 4
  },
  {
    id: 19,
    name: "萌宠传说II",
    targetScore: 3200,
    maxMoves: 10,
    gridSize: { rows: 10, cols: 6 },
    description: "迈向巅峰的挑战",
    difficulty: 4
  },
  {
    id: 20,
    name: "萌宠神殿",  // 终极挑战
    targetScore: 3500,
    maxMoves: 10,
    gridSize: { rows: 8, cols: 8 },
    description: "真正的萌宠大师",
    difficulty: 4
  }
];

// 获取指定关卡
export const getLevel = (levelId: number): Level | undefined => {
  return levels.find(level => level.id === levelId);
};
