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
const job = new SimpleIntervalJob({ minutes: 1, }, task)
scheduler.addSimpleIntervalJob(job)

function handleScrapeResult(available) {
  console.log(`Handling result for ${(new Date).toLocaleString()}:`)
  if (!available) {
    console.log('Result found, sending email')
    mailer()
    scheduler.stop()
  }
  else {
    console.log('Nothing found.')
  }
}