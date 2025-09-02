// scripts/e2e_isbn_test.js
// Headless test using puppeteer: open dev server, navigate to form, fill ISBN and click search
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for APISearch input to appear
  await page.waitForSelector('input[placeholder="ISBN (10桁または13桁)"]', { timeout: 10000 });
  await page.type('input[placeholder="ISBN (10桁または13桁)"]', '978-4798918945');
    // find button by text using XPath via page.evaluate
    const clicked = await page.evaluate(() => {
      const xpath = "//button[contains(normalize-space(.), '検索')]";
      const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      const btn = result.singleNodeValue;
      if (btn) { btn.click(); return true; }
      return false;
    });
    if (!clicked) throw new Error('検索ボタンが見つかりません');

    // Wait for modal to appear
    await page.waitForSelector('.modal-content', { timeout: 10000 });
    // take screenshot
    await page.screenshot({ path: '/tmp/mapping_modal.png' });

    // extract modal text
    const modalText = await page.$eval('.modal-content', el => el.innerText);
    console.log('MODAL TEXT:\n', modalText);
  } catch (err) {
    console.error('E2E test failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
