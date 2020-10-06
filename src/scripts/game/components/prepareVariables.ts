import { EQUILATERAL_TRIANGLE_RATIO } from "../../shared/constants";
import { Dimensions } from "./getContainer";

export interface Props {
  dimensions: Dimensions;
  length: number;
}

export interface Workspace {
  rows: number;
  cols: number;
  width: number;
  height: number;
  verticalMargin: number;
  horizontalMargin: number;
  verticalWorkSpaceMargin: number;
  horizontalWorkSpaceMargin: number;
  rowSpacing: number;
  colSpacing: number;
  throwFromX: number;
  throwToX: number;
  ballDiameter: number;
  pegDiameter: number;
}

const prepareVariables = ({
  dimensions: { height, width },
  length,
}: Props): Workspace => {
  const rows = length;
  const cols = length + 1;

  let workspaceWidth = width;
  let workspaceHeight = width * EQUILATERAL_TRIANGLE_RATIO;

  if (height / EQUILATERAL_TRIANGLE_RATIO < width) {
    workspaceWidth = height / EQUILATERAL_TRIANGLE_RATIO;
    workspaceHeight = height;
  }

  const verticalMargin = workspaceHeight / (rows - 1);
  const horizontalMargin = 0;

  const rowSpacing = (workspaceHeight - verticalMargin) / rows;
  const colSpacing = (workspaceWidth - 2 * horizontalMargin) / cols;

  const ballDiameter = colSpacing / 3;
  const pegDiameter = colSpacing / 6;

  const verticalWorkSpaceMargin = 0;
  const horizontalWorkSpaceMargin = (width - workspaceWidth) / 2;

  const throwFromX =
    horizontalWorkSpaceMargin +
    horizontalMargin +
    (colSpacing * (rows - 1)) / 2 +
    ballDiameter;

  const throwToX = throwFromX + 2 * colSpacing - 2 * ballDiameter;

  return {
    rows,
    cols,
    width: workspaceWidth,
    height: workspaceHeight,
    verticalMargin,
    horizontalMargin,
    verticalWorkSpaceMargin,
    horizontalWorkSpaceMargin,
    rowSpacing,
    colSpacing,
    throwFromX,
    throwToX,
    ballDiameter,
    pegDiameter,
  };
};

export default prepareVariables;
