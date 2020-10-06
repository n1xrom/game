const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const htmlContent = `
  <!doctype html>
  <html>
    <head><meta charset='UTF-8'><title>Test</title></head>
    <body>Test</body>
  </html>
`;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(
    `file://${path.resolve(__dirname, "resultTables/index.html")}`
  );

  await page.waitForSelector("#interval");
  const intervalElement = await page.$("#interval");
  const timeout = await page.evaluate(
    (element) => element.textContent,
    intervalElement
  );

  await page.waitForSelector("#resultTables", {
    timeout,
  });
  const element = await page.$("#resultTables");
  const text = await page.evaluate((element) => element.textContent, element);

  fs.writeFileSync("src/scripts/generated/resultTables.json", text, "utf8");

  await browser.close();
})();
