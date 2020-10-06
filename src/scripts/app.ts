import PlinkoEngine from "./game";
import intervalOnFocus from "./shared/utils/intervalOnFocus";

window.onload = load;

const Plinko = new PlinkoEngine();

const addBalls = () => {
  Plinko.playBet(2);
};

function load() {
  Plinko.init([
    1.01,
    2.02,
    5.1,
    1.45,
    14.3,
    1.01,
    2.02,
    5.1,
    1.45,
    2.02,
    5.1,
    1.45,
  ]);

  setTimeout(() => {
    Plinko.init([1.01, 2.02, 5.1, 1.45, 14.3, 1.01, 2.02, 5.1, 1.45, 2.02]);
  }, 3000);

  setTimeout(() => {
    Plinko.init([
      1.01,
      2.02,
      5.1,
      1.45,
      14.3,
      1.01,
      2.02,
      5.1,
      1.45,
      2.02,
      5.1,
      1.45,
      5.1,
      1.45,
    ]);
  }, 5000);

  setTimeout(() => {
    Plinko.init([
      1.01,
      2.02,
      5.1,
      1.45,
      14.3,
      1.01,
      2.02,
      5.1,
      1.45,
      2.02,
      5.1,
      1.45,
      5.1,
      1.45,
      1.45,
      1.45,
    ]);
  }, 7000);

  setTimeout(() => {
    Plinko.init([1.01, 2.02, 5.1, 1.45, 14.3, 1.01, 2.02, 5.1]);
  }, 10000);

  Plinko.onGroundCollision((column) => {
    console.log("column", column);
  });

  intervalOnFocus(() => addBalls(), 300);
}
