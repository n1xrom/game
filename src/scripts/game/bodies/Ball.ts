import { Body } from "matter-js";

import { BALL } from "../../shared/constants";
import { GameObjectParams } from "./GameObject";
import CircularGameObject from "./CircularGameObject";

interface BallParams extends GameObjectParams {
  predictedResult?: number;
  diameter: number;
  renderer?: PIXI.Renderer;
}

export interface BallBodyWithParentObject extends Body {
  parentObject?: Ball;
  predictedResult?: number;
}

export default class Ball extends CircularGameObject {
  shrinking = false;
  body: BallBodyWithParentObject;

  constructor({
    id,
    x,
    y,
    predictedResult,
    diameter,
    renderer,
    ...params
  }: BallParams) {
    super({
      ...params,
      id,
      x,
      y,
      restitution: BALL.RESTITUTION,
      friction: BALL.FRICTION,
      radius: diameter / 2,
      density: BALL.DENSITY,
      type: "ball",
      tint: BALL.COLOR,
      renderer,
    });

    this.body = this.createPhysics();
    this.body.parent = this.body;
    this.body.parentObject = this;
    this.body.predictedResult = predictedResult;
  }

  remove = (callback: () => void) => {
    if (this.shrinking) {
      return;
    }
    this.shrinking = true;

    callback();
  };
}
