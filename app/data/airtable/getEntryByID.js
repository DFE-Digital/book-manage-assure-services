

  var Airtable = require('airtable')
var axios = require('axios')
var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE,
)

async function GetEntryByID(id) {
    return await base('Reviews')
      .select({ maxRecords: 1, filterByFormula: `{ID} = "${id}"` })
      .firstPage()
  }


module.exports = GetEntryByID

