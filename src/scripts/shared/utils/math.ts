export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && isFinite(value);
}
