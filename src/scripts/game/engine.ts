import * as PIXI from "pixi.js-legacy";

import { Engine, Events, IEventCollision, World, Vector } from "matter-js";

import { CONTAINER_ID, FPS, CANVAS, GRAVITATION } from "../shared/constants";
import FpsMeter from "../shared/utils/fps-meter";

import Loader from "./loader";

import Peg from "./bodies/Peg";
import Ball, { BallBodyWithParentObject } from "./bodies/Ball";

import prepareVariables from "./components/prepareVariables";
import createWalls from "./components/createWalls";
import createPegs from "./components/createPegs";
import createBaskets from "./components/createBaskets";
import getContainer, { Dimensions } from "./components/getContainer";

import * as resultTables from "../generated/resultTables.json";
import Pulse from "./bodies/Pulse";
import Basket from "./bodies/Basket";
import updateSize from "../shared/utils/updateSize";

const isDevelopment = process.env.NODE_ENV === "development";

let fpsMeter: FpsMeter;

export const defaultOptions = {
  transparent: true,
  antialias: true,
  resolution: 1,
  autoDensity: true,
};

interface Map<T> {
  [key: string]: T;
}

export default class ClientEngine {
  container: HTMLElement;
  dimensions: Dimensions = {
    width: CANVAS.WIDTH,
    height: CANVAS.HEIGHT,
  };

  renderer: PIXI.Renderer;
  loader = PIXI.Loader.shared;
  stage = new PIXI.Container();
  fpsMax = FPS;

  engine = Engine.create(); // { timing: { timestamp: 0, timeScale: 2 } }

  balls: Map<Ball> = {};
  trajectories: Map<Vector[]> = {};
  pegs: Peg[] = [];
  baskets: Basket[] = [];
  multipliers: number[] = [];
  lastBallId = 0;
  numberOfMultipliers = 0;
  resourcesLoaded = false;
  rendered = false;
  lastTimestamp = 0;
  initCallback?: () => void;
  animationId?: number;

  workSpace = {
    rows: 0,
    cols: 0,
    height: 0,
    width: 0,
    verticalMargin: 0,
    horizontalMargin: 0,
    verticalWorkSpaceMargin: 0,
    horizontalWorkSpaceMargin: 0,
    rowSpacing: 0,
    colSpacing: 0,
    throwFromX: 0,
    throwToX: 0,
    ballDiameter: 0,
    pegDiameter: 0,
  };
  onGroundCollisionCallback?: (column: number) => void;
  delta = 0;
  lastFrameTime = 0;

  constructor() {
    const { container } = getContainer(CONTAINER_ID);
    this.container = container;

    this.renderer = PIXI.autoDetectRenderer({
      ...defaultOptions,
      ...this.dimensions,
    });

    Loader(() => {
      this.resourcesLoaded = true;

      if (this.initCallback) {
        this.initCallback();
        this.initCallback = undefined;
      }
    });

    this.engine.world.gravity.y = GRAVITATION;
  }

  private setupFPSMeter = () => {
    const fpsMeterItem = document.createElement("div");
    fpsMeterItem.classList.add("fps");

    this.container.appendChild(fpsMeterItem);
    fpsMeter = new FpsMeter(() => {
      fpsMeterItem.innerHTML = `FPS: ${
        fpsMeter.getFrameRate().toFixed(2).toString() || "NaN"
      }`;
    });

    setInterval(() => fpsMeter.updateTime(), 1000.0 / this.fpsMax);
  };

  private setup = () => {
    this.clearEnvironment();

    if (isDevelopment) {
      this.setupFPSMeter();
    }

    this.createEnvironment();
    this.registerPhysicsEvents();

    if (!this.rendered) {
      this.render();
    }
  };

  init = (value: number[]) => {
    if (!value) {
      return;
    }

    this.multipliers = value;
    this.trajectories = (resultTables as Map<Map<Vector[]>>)[value.length];

    if (this.resourcesLoaded) {
      return this.setup();
    }

    this.initCallback = this.setup;
  };

  private clearEnvironment = () => {
    if (this.animationId) {
      this.rendered = false;
      cancelAnimationFrame(this.animationId);
    }

    World.clear(this.engine.world, false);
    Engine.clear(this.engine);

    let fpsMeter = this.container.getElementsByClassName("fps");
    for (let i = fpsMeter.length - 1; i >= 0; --i) {
      fpsMeter[i].remove();
    }

    this.renderer.view.remove();

    for (var i = this.stage.children.length - 1; i >= 0; i--) {
      this.stage.removeChild(this.stage.children[i]);
    }

    this.pegs = [];
    this.balls = {};
  };

  private createEnvironment = () => {
    this.container.appendChild(this.renderer.view);
    updateSize(this.container);

    this.workSpace = prepareVariables({
      dimensions: this.dimensions,
      length: this.multipliers.length,
    });
    this.pegs = createPegs({
      workSpace: this.workSpace,
      engine: this.engine,
      stage: this.stage,
      renderer: this.renderer,
    });
    createWalls({
      workSpace: this.workSpace,
      dimensions: this.dimensions,
      engine: this.engine,
    });
    this.baskets = createBaskets({
      multipliers: this.multipliers,
      workSpace: this.workSpace,
      renderer: this.renderer,
      stage: this.stage,
    });
  };

  onGroundCollision = (callback: (column: number) => void) => {
    this.onGroundCollisionCallback = callback;
  };

  private trigger = (column: number) => {
    if (!this.onGroundCollisionCallback) {
      return;
    }

    this.onGroundCollisionCallback(column);
  };

  private onCollisionStart = ({ pairs }: IEventCollision<Engine>) => {
    const {
      horizontalMargin,
      horizontalWorkSpaceMargin,
      colSpacing,
      pegDiameter,
    } = this.workSpace;

    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const { bodyA, bodyB } = pair;

      if (bodyA.label === "ball" && bodyB.label === "ball") {
        pair.isActive = false;
      }

      if (bodyA.label === "peg" && bodyB.label === "ball") {
        new Pulse({
          renderer: this.renderer,
          stage: this.stage,
          radius: pegDiameter / 2,
          x: bodyA.position.x,
          y: bodyA.position.y,
        });
      }

      if (bodyA.label === "ground" && bodyB.label === "ball") {
        // remove the ball after ground collision
        const ball = (bodyB as BallBodyWithParentObject)?.parentObject;
        const { x } = bodyB.position;

        const column = Math.floor(
          (x - horizontalWorkSpaceMargin - horizontalMargin - colSpacing / 2) /
            colSpacing
        );

        this.trigger(ball?.body.predictedResult || column);

        if (!ball) {
          return;
        }

        this.baskets[column].shake();

        const currentBall = this.balls[ball.id];

        ball.remove(() => {
          World.remove(this.engine.world, ball.body);
          if (currentBall.sprite) {
            this.stage.removeChild(currentBall.sprite);
          }
          delete this.balls[ball.id];
        });
      }
    }
  };

  private registerPhysicsEvents = () => {
    Events.on(this.engine, "collisionStart", this.onCollisionStart);
  };

  playBet = (predictedResult: number) => {
    const { ballDiameter } = this.workSpace;

    const resultTrajectories = this.trajectories[predictedResult];

    const { x, y } = resultTrajectories[
      Math.floor(Math.random() * resultTrajectories.length)
    ];

    const id = this.lastBallId++ % 255;

    let ball = new Ball({
      id,
      x,
      y,
      predictedResult,
      diameter: ballDiameter,
      renderer: this.renderer,
    });

    ball.init(this.engine.world, this.stage);

    let ballId = String(ball.id);

    this.balls[ballId] = ball;
  };

  private animate = () => {
    for (const id in this.balls) {
      if (Object.prototype.hasOwnProperty.call(this.balls, id)) {
        const ball = this.balls[id];

        if (ball.sprite) {
          ball.sprite.position.x = ball.body.position.x;
          ball.sprite.position.y = ball.body.position.y;
        }

        this.balls[id] = ball;
      }
    }
  };

  private render = () => {
    this.rendered = true;

    if (isDevelopment) {
      fpsMeter.tick();
    }

    this.animate();
    this.renderer.render(this.stage);
    Engine.update(this.engine);
    this.animationId = requestAnimationFrame(this.render);
  };
}
