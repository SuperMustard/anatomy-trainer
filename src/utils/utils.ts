/**
 * Fisher-Yates 洗牌算法
 * 接收一个数组，返回一个打乱顺序后的新数组（不影响原数组）
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array]; // 浅拷贝，避免副作用
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
