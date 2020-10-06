export interface Dimensions {
  width: number;
  height: number;
}

const getContainer = (containerId: string) => {
  const container = document.getElementById(containerId) || document.body;

  const dimensions = {
    height: container.offsetHeight,
    width: container.offsetWidth,
  };

  return { container, dimensions };
};

export default getContainer;
