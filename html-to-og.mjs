import puppeteer from 'puppeteer';
import { resolve } from 'path';
import { pathToFileURL } from 'url';
import { existsSync } from 'fs';

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

const filePath = pathToFileURL(resolve('./template/og.html')).href;
await page.goto(filePath);

await page.evaluate(() => {
  document.querySelectorAll('.wrapper').forEach(el => {
    el.style.transform = 'none';
    el.style.marginBottom = '0';
  });
});

// Find next available filename
let counter = 1;
let outputPath;
do {
  outputPath = `./output/og-card${counter}.png`;
  counter++;
} while (existsSync(outputPath));

const cards = await page.$$('.og-card');
await cards[0].screenshot({ path: outputPath });

await browser.close();
console.log(`Saved to ${outputPath}`);
