import { Workspace } from "./prepareVariables";
import Basket from "../bodies/Basket";

interface Props {
  multipliers: number[];
  workSpace: Workspace;
  renderer: PIXI.Renderer;
  stage: PIXI.Container;
}

const createBaskets = ({
  multipliers,
  workSpace,

  renderer,
  stage,
}: Props) => {
  const {
    rows,
    verticalMargin,
    horizontalMargin,
    verticalWorkSpaceMargin,
    horizontalWorkSpaceMargin,
    rowSpacing,
    colSpacing,
  } = workSpace;

  const basketMargin = 4;

  const basketHeight = rowSpacing / 2 + basketMargin;
  const basketWidth = colSpacing - basketMargin * 2;

  return multipliers.map((multiplier, key) => {
    const y =
      verticalWorkSpaceMargin +
      verticalMargin +
      (rows - 1) * rowSpacing +
      basketMargin * 2;
    const x =
      horizontalWorkSpaceMargin +
      horizontalMargin +
      colSpacing / 2 +
      key * colSpacing +
      basketMargin;

    const basket = new Basket({
      x,
      y,
      height: basketHeight,
      width: basketWidth,
      stage,
      value: `${multiplier}`,
      renderer,
    });

    return basket;
  });
};

export default createBaskets;
