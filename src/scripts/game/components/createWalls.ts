import { Engine } from "matter-js";

import { VerticalWall, HorizontalWall } from "../bodies/Wall";
import { Dimensions } from "./getContainer";
import { Workspace } from "./prepareVariables";

interface Props {
  workSpace: Workspace;
  dimensions: Dimensions;
  engine: Engine;
}

const createWalls = ({ workSpace, dimensions, engine }: Props) => {
  const {
    rows,
    cols,
    colSpacing,
    rowSpacing,
    verticalMargin,
    horizontalMargin,
    horizontalWorkSpaceMargin,
    verticalWorkSpaceMargin,
    ballDiameter,
  } = workSpace;

  const leftTop = {
    x:
      horizontalWorkSpaceMargin +
      horizontalMargin +
      (colSpacing * (rows - 1)) / 2,
    y: verticalWorkSpaceMargin + verticalMargin + rowSpacing,
  };

  const leftBottom = {
    x: horizontalWorkSpaceMargin + horizontalMargin,
    y: verticalWorkSpaceMargin + verticalMargin + (rows - 1) * rowSpacing,
  };

  const rightTop = {
    x:
      horizontalWorkSpaceMargin +
      horizontalMargin +
      (colSpacing * (rows + 1)) / 2 +
      colSpacing,
    y: verticalWorkSpaceMargin + verticalMargin + rowSpacing,
  };

  const rightBottom = {
    x: horizontalWorkSpaceMargin + horizontalMargin + cols * colSpacing,
    y: verticalWorkSpaceMargin + verticalMargin + (rows - 1) * rowSpacing,
  };

  const leftWallLength = Math.sqrt(
    (leftTop.x - leftBottom.x) ** 2 + (leftTop.y - leftBottom.y) ** 2
  );
  const rightWallLength = Math.sqrt(
    (rightTop.x - rightBottom.x) ** 2 + (rightTop.y - rightBottom.y) ** 2
  );
  const groundWallLength = Math.sqrt(
    (leftBottom.x - rightBottom.x) ** 2 + (leftBottom.y - rightBottom.y) ** 2
  );

  const leftWall = new VerticalWall({
    x: (leftTop.x + leftBottom.x) / 2,
    y: (leftTop.y + leftBottom.y) / 2,
    height: leftWallLength,
    angle: 0.5288073,
    lineFrom: leftTop,
    lineTo: leftBottom,
  });

  const rightWall = new VerticalWall({
    x: (rightTop.x + rightBottom.x) / 2,
    y: (rightTop.y + rightBottom.y) / 2,
    height: rightWallLength,
    angle: -0.5288073,
    lineFrom: rightTop,
    lineTo: rightBottom,
  });

  const leftNeckWall = new VerticalWall({
    x: leftTop.x,
    y: 0,
    height: leftTop.y * 2,
    lineFrom: { x: leftTop.x, y: 0 },
    lineTo: { x: leftTop.x, y: leftTop.y },
  });

  const rightNeckWall = new VerticalWall({
    x: rightTop.x,
    y: 0,
    height: rightTop.y * 2,
    lineFrom: { x: rightTop.x, y: 0 },
    lineTo: { x: rightTop.x, y: rightTop.y },
  });

  const ground = new HorizontalWall({
    x: dimensions.width / 2,
    y:
      verticalWorkSpaceMargin +
      verticalMargin +
      (rows - 1) * rowSpacing +
      ballDiameter,
    width: groundWallLength,
    lineFrom: leftBottom,
    lineTo: rightBottom,
  });

  [leftWall, rightWall, leftNeckWall, rightNeckWall, ground].forEach((wall) => {
    wall.addToEngine(engine.world);
  });
};

export default createWalls;
