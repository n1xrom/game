import * as PIXI from "pixi.js";

import { Bodies, World, Vector } from "matter-js";
import { isNumber } from "../../shared/utils/math";

export interface WallParams {
  x: number;
  y: number;
  width: number;
  height: number;
  lineFrom: Vector;
  lineTo: Vector;
  angle?: number;
}

export interface VerticalWallParams {
  x: number;
  y: number;
  height: number;
  lineFrom: Vector;
  lineTo: Vector;
  angle?: number;
}

export interface HorizontalWallParams {
  x: number;
  y: number;
  width: number;
  height?: number;
  lineFrom: Vector;
  lineTo: Vector;
}

export class Wall {
  x: number;
  y: number;
  width: number;
  height: number;
  angle?: number;
  body: Matter.Body;
  lineFrom: Vector;
  lineTo: Vector;

  line: PIXI.Graphics;

  constructor({ x, y, width, height, lineFrom, lineTo, angle }: WallParams) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.lineFrom = lineFrom;
    this.lineTo = lineTo;
    this.angle = angle;

    this.body = this.createPhysics();
    this.line = this.createLine();
  }

  createPhysics() {
    const body = Bodies.rectangle(0, 0, this.width, this.height, {
      angle: this.angle || 0,
      isStatic: true,
      position: {
        x: this.x,
        y: this.y,
      },
    });

    return body;
  }

  createLine = () => {
    const linksGraphics = new PIXI.Graphics();
    linksGraphics.clear();
    linksGraphics.alpha = 1;

    linksGraphics.lineStyle(4, 0x000000);
    linksGraphics.moveTo(this.lineFrom.x, this.lineFrom.y);
    linksGraphics.lineTo(this.lineTo.x, this.lineTo.y);
    linksGraphics.endFill();

    return linksGraphics;
  };

  addToEngine(world: World) {
    World.add(world, this.body);
  }

  addToRenderer = (stage: PIXI.Container) => {
    stage.addChild(this.line);
  };
}

export class VerticalWall extends Wall {
  constructor({ x, y, height, lineFrom, lineTo, angle }: VerticalWallParams) {
    super({ x, y, width: 4, height, lineFrom, lineTo, angle });
  }
}

export class HorizontalWall extends Wall {
  constructor({ x, y, width, height, lineFrom, lineTo }: HorizontalWallParams) {
    super({
      x,
      y,
      width,
      height: isNumber(height) ? height : 10,
      lineFrom,
      lineTo,
    });
    this.body.label = "ground";
  }
}
