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
const job = new SimpleIntervalJob({ minutes: 1 }, task)
scheduler.addSimpleIntervalJob(job)


let previousCount = 0
function handleScrapeResult(scrapeRes) {

  let dateString = (new Date).toLocaleString()
  console.log(`Handling result for ${dateString}:`)  

  if (scrapeRes.resultsFound) {   
    let count = scrapeRes.props
    console.log(`Currently listing ${count} studios`)

    if (previousCount < count) {
      console.log('Result found, sending email')
      mailer(count)
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