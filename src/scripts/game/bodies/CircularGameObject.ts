import * as PIXI from "pixi.js";
import { Bodies, Body } from "matter-js";

import GameObject, { GameObjectParams } from "./GameObject";

interface CircularGameObjectParams extends GameObjectParams {
  restitution: number;
  friction: number;
  radius: number;
  density: number;
  type: string;
  isStatic?: boolean;
  tint?: number;
  renderer?: PIXI.Renderer;
}

export default class CircularGameObject extends GameObject {
  type: string;
  restitution: number;
  friction: number;
  radius: number;
  density: number;
  isStatic: boolean;
  body: Body;
  sprite?: PIXI.DisplayObject;

  constructor({
    restitution,
    friction,
    radius,
    density,
    type,
    isStatic,
    tint,
    renderer,
    ...params
  }: CircularGameObjectParams) {
    super(params);

    this.restitution = restitution;
    this.friction = friction;
    this.radius = radius;
    this.density = density;
    this.type = type;
    this.isStatic = !!isStatic;

    this.body = this.createPhysics();
    this.body.parent = this.body;

    if (!this.withoutRenderer && renderer) {
      this.sprite = this.createSprite(tint);
    }
  }

  createPhysics = (): Body => {
    const options = {
      restitution: this.restitution,
      friction: this.friction,
    };

    const preparedBody = Bodies.circle(this.x, this.y, this.radius, options);
    Body.setDensity(preparedBody, this.density);

    preparedBody.label = this.type;
    preparedBody.position.x = this.x;
    preparedBody.position.y = this.y;
    preparedBody.isStatic = this.isStatic;

    return preparedBody;
  };

  createSprite = (tint?: number): PIXI.Graphics => {
    const gr = new PIXI.Graphics();
    gr.beginFill(tint);
    gr.lineStyle(0);
    gr.drawCircle(0, 0, this.radius);
    gr.endFill();

    const diameter = this.radius * 2;

    gr.position.x = this.x;
    gr.position.y = this.y;
    gr.height = diameter;
    gr.width = diameter;

    return gr;
  };
}
