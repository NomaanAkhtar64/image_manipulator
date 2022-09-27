export function getDiagonalPercent(wp: number, hp: number) {
  return 1 - Math.sqrt((1 - wp) ** 2 + (1 - hp) ** 2);
}

