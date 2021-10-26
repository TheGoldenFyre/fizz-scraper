const mailjet = require('node-mailjet')
  .connect('598babc2efd1d866672ec59602528688', '03568f1fccf07c04224b4b8fe5996a57')

module.exports = () => {
  mailjet
    .post("send", { 'version': 'v3.1' })
    .request({
      "Messages": [
        {
          "From": {
            "Email": "thomasvanderplas.leiden@gmail.com",
            "Name": "Thomas"
          },
          "To": [
            {
              "Email": "thomasvanderplas.leiden@gmail.com",
              "Name": "Thomas van der Plas",
            }
          ],
          "Subject": `APPARTEMENT AVAILABLE - go to the fizz website`,
          "TextPart": `There is now an appartement available at the fizz! Go check it out before it's gone again`,
          "HTMLPart": `<h1> Hi Thomas! </h1> <p>There is now an appartement available at the fizz! Go check it out before it's gone again</p>`,
          "CustomID": "AppGettingStartedTest"
        }
      ]
    })
    .catch((err) => {
      console.log(err.statusCode)
    })
}

