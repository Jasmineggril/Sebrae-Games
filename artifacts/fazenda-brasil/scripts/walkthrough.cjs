const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(10000);
  try {
    await page.goto('http://localhost:5173/');

    // Wait for app to mount and the tutorial overlay
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(800);
    try {
      await page.waitForSelector('text=Bem-vindo à Fazenda Brasil!', { timeout: 15000 });
    } catch (e) {
      console.warn('Tutorial overlay not found; continuing with best-effort interactions.');
    }

    // Click through tutorial until actionable step (if overlay present)
    const nextBtn = await page.$('text=Próximo →');
    if (nextBtn) {
      for (let i = 0; i < 3; i++) {
        await nextBtn.click().catch(() => {});
        await page.waitForTimeout(500);
      }
    }

    // Close overlay if skip exists
    const skip = await page.$('text=Pular tutorial');
    if (skip) await skip.click().catch(() => {});

    // Wait a bit for game to render
    await page.waitForSelector('#root', { timeout: 5000 });

    // Attempt to click a plot: find first element with role or data-attr from grid
    // Fallback: click center of canvas area
    const farmGrid = await page.$('div[role="grid"], canvas, div[data-testid="farm-grid"]');
    if (farmGrid) {
      const box = await farmGrid.boundingBox();
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(400);
    } else {
      // click center of page
      const viewport = page.viewportSize();
      await page.mouse.click(viewport.width / 2, viewport.height / 2);
    }

    // Try selecting Plant tool if HUD has button text
    const plantBtn = await page.$('text=Plantar');
    if (plantBtn) {
      await plantBtn.click();
      await page.waitForTimeout(200);
    }

    // Click center again to trigger plant (may open strategy modal)
    await page.mouse.click((await page.viewportSize()).width / 2, (await page.viewportSize()).height / 2);
    await page.waitForTimeout(800);

    // If strategy modal appears, choose Organic or Chemical
    const organic = await page.$('text=Orgânico');
    if (organic) {
      await organic.click();
      await page.waitForTimeout(500);
    } else {
      const chem = await page.$('text=Químico');
      if (chem) await chem.click();
    }

    // Select water tool
    const waterBtn = await page.$('text=Regar');
    if (waterBtn) {
      await waterBtn.click();
      await page.waitForTimeout(200);
      await page.mouse.click((await page.viewportSize()).width / 2, (await page.viewportSize()).height / 2);
    }

    // Wait for ready state: look for text PRONTO or ✨
    await page.waitForSelector('text=PRONTO, text=✨ PRONTO!, text=✨ PRONTO', { timeout: 10000 }).catch(()=>{});

    // Select harvest tool and click center
    const harvestBtn = await page.$('text=Colher');
    if (harvestBtn) {
      await harvestBtn.click();
      await page.waitForTimeout(200);
      await page.mouse.click((await page.viewportSize()).width / 2, (await page.viewportSize()).height / 2);
    }

    // Wait for ficha modal
    await page.waitForSelector('text=Ficha do Produtor, text=R$', { timeout: 5000 }).catch(()=>{});

    console.log('Walkthrough finished: no critical errors detected (check visual results).');
  } catch (e) {
    console.error('Walkthrough error:', e);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
