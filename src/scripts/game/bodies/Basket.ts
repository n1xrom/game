import * as PIXI from "pixi.js";
import { BASKET } from "../../shared/constants/bodies";

interface BasketParams {
  renderer: PIXI.Renderer;
  stage: PIXI.Container;
  value: string;
  height: number;
  width: number;
  x: number;
  y: number;
}

export default class Basket {
  sprite: PIXI.Graphics;
  text: PIXI.Text;
  stage: PIXI.Container;
  value: string;
  height: number;
  width: number;
  x: number;
  y: number;
  isShakeDown: boolean = false;
  targetYPosition: number = 0;
  step: number = 0;
  animationId?: number;

  constructor({ x, y, height, width, stage, value }: BasketParams) {
    this.stage = stage;
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
    this.value = value;

    this.sprite = this.createSprite();
    this.text = this.createText();

    this.addToRenderer();
  }

  createSprite = (): PIXI.Graphics => {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(BASKET.COLOR);
    graphics.lineStyle(0);
    graphics.drawRoundedRect(0, 0, this.width, this.height, BASKET.RADIUS);
    graphics.endFill();

    graphics.position.x = this.x;
    graphics.position.y = this.y;
    graphics.height = this.height;
    graphics.width = this.width;

    return graphics;
  };

  createText = (): PIXI.Text => {
    const text = new PIXI.Text(this.value, {
      fontFamily: BASKET.FONT_FAMILY,
      fontSize: this.height - 10,
      fill: BASKET.FONT_COLOR,
    });

    text.position.x = this.x + this.width / 2;
    text.position.y = this.y + this.height / 2;

    text.anchor.set(0.5, 0.5);

    return text;
  };

  shake = () => {
    this.isShakeDown = true;
    this.targetYPosition = this.sprite.y + 10;
    this.step = 2;

    requestAnimationFrame(this.shakeAnimation);
  };

  shakeAnimation = () => {
    if (this.isShakeDown && this.sprite.y >= this.targetYPosition) {
      this.isShakeDown = false;
    }

    this.sprite.position.y = this.isShakeDown
      ? this.sprite.y + this.step
      : this.sprite.y - this.step;
    this.text.position.y = this.isShakeDown
      ? this.text.y + this.step
      : this.text.y - this.step;

    if (!this.isShakeDown && this.sprite.y <= this.y) {
      this.sprite.y = this.y;
      this.text.y = this.y + this.height / 2;

      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }

      return;
    }

    this.animationId = requestAnimationFrame(this.shakeAnimation);
  };

  addToRenderer = () => {
    this.stage.addChild(this.sprite);
    this.stage.addChild(this.text);
  };
}
