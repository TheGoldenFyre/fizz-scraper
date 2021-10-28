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
const job = new SimpleIntervalJob({ minutes: 2 }, task)
scheduler.addSimpleIntervalJob(job)


let waitingForReset = false
function handleScrapeResult(available) {
  let dateString = (new Date).toLocaleString()
  console.log(`Handling result for ${dateString}:`)
  if (available) {
    if (!waitingForReset) {
      console.log('Result found, sending email')
      mailer()
      //scheduler.stop()
      waitingForReset = true;
    }
    else {
      console.log("Email already sent for this update.")
    }
  }
  else {
    console.log('Nothing found.')
    waitingForReset = false
  }
}