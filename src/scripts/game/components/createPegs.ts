import * as PIXI from "pixi.js";
import { Engine } from "matter-js";

import { Workspace } from "./prepareVariables";
import Peg from "../bodies/Peg";

interface Props {
  workSpace: Workspace;
  withoutRenderer?: boolean;
  engine: Engine;
  stage?: PIXI.Container;
  renderer?: PIXI.Renderer;
}

const createPegs = ({
  workSpace,
  engine,
  stage,
  withoutRenderer = false,
  renderer,
}: Props): Peg[] => {
  const {
    rows,
    cols,
    verticalMargin,
    horizontalMargin,
    verticalWorkSpaceMargin,
    horizontalWorkSpaceMargin,
    rowSpacing,
    colSpacing,
    pegDiameter,
  } = workSpace;

  let id = 0;
  const pegs = [];

  for (let row = 1; row < rows; row++) {
    const reversedIndex = rows - row;

    for (let col = 0; col <= cols - reversedIndex; col++) {
      const x =
        horizontalWorkSpaceMargin +
        horizontalMargin +
        (colSpacing * reversedIndex) / 2 + // leave extra horizontal space for staggered display
        col * colSpacing; // horizontal space between peg

      const y =
        verticalWorkSpaceMargin + // leave extra space at top of frame to drop balls
        verticalMargin + // leave extra space at top of frame to drop balls
        row * rowSpacing; // vertical space between peg

      const peg = new Peg({
        id,
        x,
        y,
        withoutRenderer,
        diameter: pegDiameter,
        renderer,
      });
      pegs[id] = peg;

      peg.addToEngine(engine.world);

      if (!withoutRenderer && stage) {
        peg.addToRenderer(stage);
      }

      id++;
    }
  }

  return pegs;
};

export default createPegs;
