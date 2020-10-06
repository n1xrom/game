import * as PIXI from "pixi.js";
import { World, Body } from "matter-js";

export interface GameObjectParams {
  id: number;
  x: number;
  y: number;
  withoutRenderer?: boolean;
}

export default class GameObject {
  id: number;
  body?: Body;
  sprite?: PIXI.DisplayObject;
  withoutRenderer?: boolean;
  x: number;
  y: number;

  constructor({ id, x, y, withoutRenderer }: GameObjectParams) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.withoutRenderer = withoutRenderer;
  }

  addToEngine(world: World) {
    if (!this.body) {
      return;
    }

    World.add(world, this.body);
  }

  addToRenderer = (stage: PIXI.Container) => {
    if (!this.sprite) {
      return;
    }

    stage.addChild(this.sprite);
  };

  init = (world: World, stage: PIXI.Container) => {
    this.addToEngine(world);

    if (!this.withoutRenderer) {
      this.addToRenderer(stage);
    }
  };
}
