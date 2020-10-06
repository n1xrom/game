import { EQUILATERAL_TRIANGLE_RATIO } from "../constants";

export function updateSize(container: HTMLElement) {
  const width = container.offsetWidth;
  const height = container.offsetHeight;

  let proportionalWidth = width;
  let proportionalHeight = width * EQUILATERAL_TRIANGLE_RATIO;

  if (height / EQUILATERAL_TRIANGLE_RATIO < width) {
    proportionalWidth = height / EQUILATERAL_TRIANGLE_RATIO;
    proportionalHeight = height;
  }

  const canvas = container.getElementsByTagName("canvas")[0];

  if (!canvas) {
    return;
  }

  canvas.setAttribute(
    "style",
    `width:${proportionalWidth}px; height:${proportionalHeight}px;`
  );
}

export default (container: HTMLElement) => {
  updateSize(container);
  window.onresize = () => updateSize(container);
};
