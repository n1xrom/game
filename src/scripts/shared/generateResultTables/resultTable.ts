import {
  Engine,
  Events,
  IEventCollision,
  World,
  Render,
  Vector,
  Composite,
} from "matter-js";

import Peg from "../../game/bodies/Peg";
import Ball, { BallBodyWithParentObject } from "../../game/bodies/Ball";

import prepareVariables from "../../game/components/prepareVariables";
import createWalls from "../../game/components/createWalls";
import createPegs from "../../game/components/createPegs";
import getContainer, { Dimensions } from "../../game/components/getContainer";
import { CONTAINER_ID, TABLE_SIZES, GRAVITATION } from "../constants/game";
import { CANVAS } from "../constants/canvas";
import { GENERATION_TIMEOUT } from "../constants/game";

interface Map<T> {
  [key: string]: T;
}

class ResultTable {
  dimensions: Dimensions = {
    width: CANVAS.WIDTH,
    height: CANVAS.HEIGHT,
  };

  engine = Engine.create();

  balls: Map<Ball> = {};
  trajectories: Map<Vector[]> = {};
  pegs: Peg[] = [];
  lastFrameTime = 0;
  multipliersLength: number = 0;
  lastBallId = 0;
  stopCalculatingTrajectories = false;

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
  renderMatter?: Render;

  constructor(value: number) {
    this.multipliersLength = value;
    const { container } = getContainer(CONTAINER_ID);

    this.createEnvironment();
    this.registerPhysicsEvents();

    this.render();

    this.renderMatter = Render.create({
      element: container,
      engine: this.engine,
      options: {
        width: this.workSpace.width,
        height: this.workSpace.height,
        wireframes: false,
      },
    });

    this.engine.world.gravity.y = GRAVITATION;

    Render.run(this.renderMatter);
  }

  private createEnvironment = () => {
    this.workSpace = prepareVariables({
      dimensions: this.dimensions,
      length: this.multipliersLength,
    });
    this.pegs = createPegs({
      workSpace: this.workSpace,
      engine: this.engine,
      withoutRenderer: true,
    });
    createWalls({
      workSpace: this.workSpace,
      dimensions: this.dimensions,
      engine: this.engine,
    });
  };

  private onCollisionStart = ({ pairs }: IEventCollision<Engine>) => {
    const {
      horizontalMargin,
      horizontalWorkSpaceMargin,
      colSpacing,
    } = this.workSpace;

    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const { bodyA, bodyB } = pair;

      if (bodyA.label === "ball" && bodyB.label === "ball") {
        pair.isActive = false;
      }

      if (bodyA.label === "ground" && bodyB.label === "ball") {
        const ball = (bodyB as BallBodyWithParentObject)?.parentObject;

        if (!ball) {
          break;
        }

        const { x } = bodyB.position;
        const column = Math.floor(
          (x - horizontalWorkSpaceMargin - horizontalMargin - colSpacing / 2) /
            colSpacing
        );

        const percentageX = ball.x;
        const percentageY = ball.y;

        if (this.trajectories[column]?.every((trj) => trj.x !== ball.x)) {
          this.trajectories[column] = [
            ...this.trajectories[column],
            {
              x: percentageX,
              y: percentageY,
            },
          ];

          this.stopCalculatingTrajectories = Object.keys(this.trajectories)
            .map((key) => this.trajectories[key])
            .every((trj) => trj?.length > 3);
        }

        ball.remove(() => {
          World.remove(this.engine.world, ball.body);
        });
      }
    }
  };

  private registerPhysicsEvents = () => {
    Events.on(this.engine, "collisionStart", this.onCollisionStart);
  };

  private assignRandomValue = (from: number, to: number): number => {
    const { width } = this.workSpace;
    const randomValueInRange = from + (to - from) * Math.random();

    const isUniqueValue = Object.keys(this.trajectories)
      .map((key) => this.trajectories[key])
      .every((trajectories) =>
        trajectories.every(
          (trj) => (randomValueInRange * 100) / width !== trj.x
        )
      );

    if (isUniqueValue) {
      return randomValueInRange;
    }

    return this.assignRandomValue(from, to);
  };

  createTrajectoryBall = () => {
    const {
      verticalWorkSpaceMargin,
      verticalMargin,
      throwFromX,
      throwToX,
      ballDiameter,
    } = this.workSpace;

    if (
      Composite.allBodies(this.engine.world).length >
      this.pegs.length + 100
    ) {
      return;
    }

    const x = this.assignRandomValue(throwFromX, throwToX);
    const y = Math.floor(verticalWorkSpaceMargin + verticalMargin);

    const id = this.lastBallId++;

    let ball = new Ball({
      id,
      x,
      y,
      withoutRenderer: true,
      diameter: ballDiameter,
    });

    ball.addToEngine(this.engine.world);
  };

  generateResultsTable = () => {
    this.trajectories = Array(this.multipliersLength)
      .fill(null)
      .reduce((acc, _val, key) => {
        return {
          ...acc,
          [key]: [],
        };
      }, {});

    return new Promise<Map<Vector[]>>((resolve) => {
      const interval = setInterval(() => {
        if (this.stopCalculatingTrajectories) {
          clearInterval(interval);
          resolve(this.trajectories);
        }

        this.createTrajectoryBall();
      }, 30);
    });
  };

  private render = () => {
    Engine.update(this.engine);
    requestAnimationFrame(this.render);
  };
}

const createTable = async (value: number) => {
  return await new ResultTable(value).generateResultsTable();
};

const setValue = (id: string, value: string) => {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("id", id);
  document.body.appendChild(wrapper);

  wrapper.innerHTML = value;
};

(async () => {
  setValue("interval", `${GENERATION_TIMEOUT}`);

  const resultTables = await Promise.all(
    TABLE_SIZES.map((count) => createTable(count))
  );

  setValue(
    "resultTables",
    JSON.stringify(
      resultTables.reduce(
        (acc, cur) => ({
          ...acc,
          [Object.keys(cur).length]: cur,
        }),
        {}
      )
    )
  );
})();
