let myIntervalCount: NodeJS.Timeout;
let isIntervalRunning = false;

export default (func: () => void, delay: number) => {
  const onFocus = () => {
    clearInterval(myIntervalCount);
    if (!isIntervalRunning) {
      myIntervalCount = setInterval(() => {
        isIntervalRunning = true;
        func();
      }, delay);
    }
  };

  const onBlur = () => {
    isIntervalRunning = false;
    clearInterval(myIntervalCount);
  };

  onFocus();
  window.addEventListener("focus", onFocus);
  window.addEventListener("blur", onBlur);
};
