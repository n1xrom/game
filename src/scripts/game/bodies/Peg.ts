import { PEG } from "../../shared/constants/bodies";
import { GameObjectParams } from "./GameObject";
import CircularGameObject from "./CircularGameObject";

interface PegParams extends GameObjectParams {
  diameter: number;
  renderer?: PIXI.Renderer;
}

export default class Peg extends CircularGameObject {
  constructor({ id, x, y, diameter, renderer, ...params }: PegParams) {
    super({
      ...params,
      id,
      x,
      y,
      restitution: PEG.RESTITUTION,
      friction: PEG.FRICTION,
      radius: diameter / 2,
      density: PEG.DENSITY,
      tint: PEG.COLOR,
      type: "peg",
      isStatic: true,
      renderer,
    });
  }
}
