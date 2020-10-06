import * as PIXI from "pixi.js";
import { PEG } from "../../shared/constants/bodies";

interface PulseParams {
  renderer: PIXI.Renderer;
  stage: PIXI.Container;
  radius: number;
  x: number;
  y: number;
}

export default class Pulse {
  sprite: PIXI.Graphics;
  stage: PIXI.Container;
  radius: number;
  x: number;
  y: number;
  animationId?: number;

  constructor({ x, y, radius, stage }: PulseParams) {
    this.radius = radius;
    this.stage = stage;
    this.x = x;
    this.y = y;

    this.sprite = this.createSprite();
    this.addToRenderer();
    this.rise();
  }

  createSprite = (): PIXI.Graphics => {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(PEG.COLOR);
    graphics.lineStyle(0);
    graphics.drawCircle(0, 0, this.radius);
    graphics.endFill();

    graphics.position.x = this.x;
    graphics.position.y = this.y;

    const diameter = this.radius * 2;

    graphics.position.x = this.x;
    graphics.position.y = this.y;
    graphics.height = diameter;
    graphics.width = diameter;

    return graphics;
  };

  rise = () => {
    const riseFactor = 1.05;
    const targetWidth = this.radius * 6;

    this.sprite.scale.x *= riseFactor;
    this.sprite.scale.y *= riseFactor;

    this.sprite.alpha = Math.max(
      0,
      ((this.sprite.width - this.radius) / (targetWidth - this.radius)) * -1 + 1
    );

    if (this.sprite.width > targetWidth) {
      this.remove();

      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }

      return;
    }

    this.animationId = requestAnimationFrame(this.rise);
  };

  addToRenderer = () => {
    this.stage.addChild(this.sprite);
  };

  remove = () => {
    this.stage.removeChild(this.sprite);
  };
}
