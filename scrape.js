const puppeteer = require('puppeteer');

IsAvailable = async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://www.the-fizz.com/en/search-nl/#/searchcriteria=BUILDING:FIZZ_UTRECHT;AREA:UTRECHT'); 
  await page.waitForTimeout(8000);
  let r = await page.evaluate(() => {
    let res = document.getElementsByClassName("search-results")
    if (res.length > 0) return Promise.resolve(true);
    else return Promise.resolve(false);
  })
  await browser.close();
  return r;
}

module.exports = { IsAvailable: IsAvailable } 