const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler')
const scraper = require("./scrape");
const mailer = require("./mailjet")

const scheduler = new ToadScheduler()

const task = new AsyncTask(
    'Scraping Website', 
    () => { return scraper.IsAvailable().then((result) => { handleScrapeResult(result) }) },
    (err) => { console.error(err) }
)

// Schedule run to run every 5 minutes
const job = new SimpleIntervalJob({ seconds: 30 }, task)
scheduler.addSimpleIntervalJob(job)


let previousCount = 0
function handleScrapeResult(scrapeRes) {

  let dateString = (new Date).toLocaleString()
  console.log(`Handling result for ${dateString}:`)  

  if (scrapeRes.resultsFound) {   
    let count = scrapeRes.props
    let priceString = ""
    for (let p of scrapeRes.prices) priceString += `${p}, `
    console.log(`Currently listing ${count} studios`)
    console.log(`Prices: ${priceString}`)

    if (previousCount < count) {
      console.log('Result found, sending email')
      mailer(count, priceString)
      //scheduler.stop()
    }
    else {
      console.log("Email already sent for this update.")
    }

    previousCount = count;

  }
  else {
    console.log('Nothing found.')
    previousCount = 0
  }
}
