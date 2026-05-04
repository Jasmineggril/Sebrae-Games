const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

(async () => {
  const outDir = path.resolve(process.cwd(), 'videos');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: outDir, size: { width: 1280, height: 720 } },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);

  try {
    await page.goto('http://localhost:5173/');
    await page.waitForSelector('#root', { timeout: 15000 });
    await page.waitForTimeout(800);

    // Try to advance tutorial if present
    const next = await page.$('text=Próximo →');
    if (next) {
      for (let i = 0; i < 3; i++) { await next.click().catch(()=>{}); await page.waitForTimeout(500); }
    }
    const skip = await page.$('text=Pular tutorial');
    if (skip) await skip.click().catch(()=>{});

    // Ensure HUD loaded
    await page.waitForSelector('text=Plantar', { timeout: 8000 }).catch(()=>{});

    // Select Plant tool, click center, choose strategy
    const plant = await page.$('text=Plantar');
    if (plant) { await plant.click().catch(()=>{}); await page.waitForTimeout(300); }
    await page.mouse.click(640, 360);
    await page.waitForTimeout(800);

    const organic = await page.$('text=Orgânico');
    if (organic) { await organic.click().catch(()=>{}); await page.waitForTimeout(600); }

    // Select water tool and water
    const water = await page.$('text=Regar');
    if (water) { await water.click().catch(()=>{}); await page.waitForTimeout(300); await page.mouse.click(640,360); }

    // Wait a bit to let growth timers or visuals appear
    await page.waitForTimeout(2500);

    // Attempt harvest: select harvest tool and click
    const harvest = await page.$('text=Colher');
    if (harvest) { await harvest.click().catch(()=>{}); await page.waitForTimeout(300); await page.mouse.click(640,360); }

    // Wait for ficha or results
    await page.waitForTimeout(2000);

    // Keep recording a short while for clarity
    await page.waitForTimeout(3000);

  } catch (e) {
    console.error('Error during walkthrough-video:', e);
  } finally {
    // close context to finalize video
    await context.close();
    await browser.close();

    // find the newest video file
    const files = fs.readdirSync(outDir).map(f => ({ f, t: fs.statSync(path.join(outDir, f)).mtimeMs }))
      .sort((a,b) => b.t - a.t);
    if (files.length === 0) {
      console.error('No video files found in', outDir);
      process.exit(2);
    }
    const videoPath = path.join(outDir, files[0].f);
    console.log('VIDEO_SAVED:' + videoPath);
  }
})();
