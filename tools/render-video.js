// Renders the "how it works" animation from the design snapshot to PNG frames,
// using the stage's own frame-seek event (deterministic, not a screen capture).
//
//   cd tools && npm i && node render-video.js "../design-ref/Governance Landing.html" frames 30
//   ffmpeg -framerate 30 -i frames/f%05d.png -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -tune animation -movflags +faststart ../docs/video/how-it-works.mp4
//   ffmpeg -framerate 30 -i frames/f%05d.png -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -pix_fmt yuv420p ../docs/video/how-it-works.webm
//   ffmpeg -i frames/f00720.png -q:v 3 ../docs/video/how-it-works-poster.jpg
//
// usage: node render-video.js <html> <outDir> [fps] [comma-separated times, for spot checks]
// Requires Google Chrome installed (uses the "chrome" channel).

const { chromium } = require('playwright-core');
const fs = require('fs'), path = require('path');
const [html, outDir, fpsArg, only] = process.argv.slice(2);
const fps = +fpsArg || 30;
(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch({ channel: 'chrome' });
  const p = await b.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
  p.on('requestfailed', r => console.log('failed:', r.url().slice(0, 120)));
  await p.goto(require('url').pathToFileURL(path.resolve(html)).href);
  const sel = 'svg[data-om-exportable-video-with-duration-secs]';
  await p.waitForSelector(sel + '[data-om-fonts-inlined]', { timeout: 30000 });
  await p.evaluate(() => document.fonts.ready);
  await p.addStyleTag({ content: `${sel}{transform:none !important;box-shadow:none !important;position:fixed !important;left:0 !important;top:0 !important;z-index:2147483647 !important;margin:0 !important}` });
  const svg = await p.$(sel);
  const dur = +(await svg.getAttribute('data-om-exportable-video-with-duration-secs'));
  const times = only ? only.split(',').map(Number) : Array.from({ length: Math.round(dur * fps) }, (_, i) => i / fps);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(3000); // let the page's autoplay/visibility logic settle
  for (let i = 0; i < times.length; i++) {
    await p.evaluate(([s, t]) => {
      document.querySelector(s).dispatchEvent(new CustomEvent('data-om-seek-to-time-frame', { detail: { time: t, sync: true } }));
    }, [sel, times[i]]);
    await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    await p.screenshot({ path: path.join(outDir, `f${String(i).padStart(5, '0')}.png`), clip: { x: 0, y: 0, width: 1600, height: 900 }, animations: 'disabled' });
    if (i % 100 === 0) console.log(`frame ${i}/${times.length}`);
  }
  console.log('dur', dur, 'frames', times.length);
  await b.close();
})();
