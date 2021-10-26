const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler')
const scraper = require("./scrape");
const mailer = require("./mailjet")

require('./mailjet')()

const scheduler = new ToadScheduler()

const task = new AsyncTask(
    'Scraping Website', 
    () => { return scraper.IsAvailable().then((result) => { handleScrapeResult(result) }) },
    (err) => { console.error(err) }
)

// Schedule run to run every 5 minutes
const job = new SimpleIntervalJob({ minutes: 5, }, task)
scheduler.addSimpleIntervalJob(job)

// TODO: Test the mailer, then transfer it to the server
function handleScrapeResult(available) {
  console.log(`Handling result for ${Date.now().toLocaleString()}:`)
  if (!available) {
    console.log('Result found, sending email')
    mailer()
    scheduler.stopById('Scraping Website');
  }
  else {
    console.log('Nothing found.')
  }
}