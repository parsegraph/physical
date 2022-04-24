export function alphaRandom(min: number, max: number) {
  return min + Math.round(Math.random() * (max - min));
}

const alphastartTime = new Date();
export function alphaGetTime() {
  return (new Date().getTime() - alphastartTime.getTime()) / 1000;
}

export function alphatoRadians(inDegrees: number) {
  return (inDegrees * Math.PI) / 180;
}
export const alphaToRadians = alphatoRadians;

export function alphatoDegrees(inRadians: number) {
  return (inRadians * 180) / Math.PI;
}
export const alphaToDegrees = alphatoDegrees;
