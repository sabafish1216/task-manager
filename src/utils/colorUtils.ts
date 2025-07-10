// 16進数カラーコードをRGB値に変換
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

// 2つのRGB値のユークリッド距離を計算
export const calculateColorDistance = (
  color1: { r: number; g: number; b: number },
  color2: { r: number; g: number; b: number }
): number => {
  const dr = color1.r - color2.r;
  const dg = color1.g - color2.g;
  const db = color1.b - color2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
};

// 類似色かどうかを判定（閾値: 50）
export const isSimilarColor = (color1: string, color2: string, threshold: number = 50): boolean => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const distance = calculateColorDistance(rgb1, rgb2);
  return distance <= threshold;
};

// 既存の色リストから類似色を検索
export const findSimilarColors = (
  newColor: string,
  existingColors: string[],
  threshold: number = 50
): string[] => {
  return existingColors.filter(existingColor => 
    isSimilarColor(newColor, existingColor, threshold)
  );
};

// ランダムな16進カラーコードを生成
export const getRandomColor = (): string => {
  const hex = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
  return `#${hex}`;
}; 