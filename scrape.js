const puppeteer = require('puppeteer');

IsAvailable = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.the-fizz.com/en/search-nl/#/searchcriteria=BUILDING:FIZZ_UTRECHT;AREA:UTRECHT'); 
  await page.waitForTimeout(8000);
  let r = await page.evaluate(() => {
    let res = document.getElementsByClassName("search-results")
    if (res.length > 0) {
      let ss = document.getElementsByClassName("single-property")

      let priceContainers = document.getElementsByClassName("pex-offer")
      let priceTexts = []
      for (let priceContainer of priceContainers) {
        for (let child of priceContainer.childNodes) {
          if (child.getAttribute("data-title") == "All-in Rent") {
            priceTexts.push(child.textContent)
          }
        }
      }
      let ps = priceTexts.map(x => parseFloat(x.split(" ")[0]))

      return Promise.resolve( {resultsFound: true, props: ss.length, prices: ps} );
    } 
    else {
      return Promise.resolve( {resultsFound: false} );
    }
  })
  await browser.close();
  return r;
}

module.exports = { IsAvailable: IsAvailable } 