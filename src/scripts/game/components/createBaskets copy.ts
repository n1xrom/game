import { Workspace } from "./prepareVariables";

interface Props {
  multipliers: number[];
  container: HTMLElement;
  workSpace: Workspace;
}

const createBaskets = ({ container, multipliers, workSpace }: Props) => {
  const {
    width,
    horizontalWorkSpaceMargin,
    verticalWorkSpaceMargin,
    verticalMargin,
    rowSpacing,
    colSpacing,
  } = workSpace;

  const wrapper = document.createElement("div");
  wrapper.classList.add("wrapper");
  const innerWrapper = document.createElement("div");
  innerWrapper.classList.add("innerWrapper");

  wrapper.style.marginTop = `${
    -verticalWorkSpaceMargin - verticalMargin - rowSpacing / 2
  }px`;
  innerWrapper.style.width = `${
    width - horizontalWorkSpaceMargin * 2 - colSpacing
  }px`;

  multipliers.forEach((value) => {
    const basket = document.createElement("div");
    basket.classList.add("payout");
    const text = document.createElement("span");
    text.classList.add("content");

    basket.appendChild(text);
    innerWrapper.appendChild(basket);

    text.innerHTML = `${value}`;
  });

  wrapper.appendChild(innerWrapper);
  container.appendChild(wrapper);
};

export default createBaskets;
