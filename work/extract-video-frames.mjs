import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('/Users/charlesfinney/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const input = '/Users/charlesfinney/Downloads/kling_20260603_VIDEO_Scene_1__0_1843_0 (1)_Precise_Starlight_2_5_hyp_2.mp4';
const outputDir = path.resolve('public/frames');
const frameCount = 192;
const width = 1280;
const quality = 0.62;

await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--allow-file-access-from-files'],
});
const page = await browser.newPage({ viewport: { width, height: 720 } });

const extractorHtml = path.resolve('work/frame-extractor.html');
await fs.writeFile(extractorHtml, `<!doctype html>
<html>
  <body style="margin:0;background:#000">
    <video id="video" muted playsinline preload="auto" src="${pathToFileURL(input).href}"></video>
    <canvas id="canvas"></canvas>
  </body>
</html>`);
await page.goto(pathToFileURL(extractorHtml).href);

const metadata = await page.evaluate(
  async ({ width }) => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');

    await new Promise((resolve, reject) => {
      video.addEventListener('loadedmetadata', resolve, { once: true });
      video.addEventListener('error', () => reject(new Error('Video metadata failed to load')), { once: true });
      video.load();
    });

    const aspect = video.videoHeight / video.videoWidth;
    canvas.width = width;
    canvas.height = Math.round(width * aspect);

    return {
      duration: video.duration,
      sourceWidth: video.videoWidth,
      sourceHeight: video.videoHeight,
      outputWidth: canvas.width,
      outputHeight: canvas.height,
    };
  },
  { width },
);

for (let index = 0; index < frameCount; index += 1) {
  const time = (metadata.duration * index) / (frameCount - 1);
  const dataUrl = await page.evaluate(
    async ({ time, quality }) => {
      const video = document.getElementById('video');
      const canvas = document.getElementById('canvas');
      const context = canvas.getContext('2d');

      await new Promise((resolve) => {
        const handleSeeked = () => resolve();
        video.addEventListener('seeked', handleSeeked, { once: true });
        video.currentTime = Math.min(time, Math.max(0, video.duration - 0.01));
      });

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/webp', quality);
    },
    { time, quality },
  );

  const bytes = Buffer.from(dataUrl.replace(/^data:image\/webp;base64,/, ''), 'base64');
  const filename = `frame-${String(index + 1).padStart(4, '0')}.webp`;
  await fs.writeFile(path.join(outputDir, filename), bytes);
  if ((index + 1) % 12 === 0) {
    console.log(`Wrote ${index + 1}/${frameCount}`);
  }
}

await fs.writeFile(
  path.join(outputDir, 'manifest.json'),
  JSON.stringify({ frameCount, width: metadata.outputWidth, height: metadata.outputHeight, duration: metadata.duration }, null, 2),
);

await browser.close();
console.log(JSON.stringify(metadata, null, 2));
