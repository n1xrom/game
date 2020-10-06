import * as PIXI from "pixi.js";

export const enum Sprite {}

export default (callback?: () => any) => {
  PIXI.Loader.shared.add([]).load(callback);
};
