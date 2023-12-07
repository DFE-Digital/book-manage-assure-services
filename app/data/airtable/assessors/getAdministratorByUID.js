var Airtable = require('airtable');
var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE
);

async function GetAdministratorByUID(id) {
  try {
    //console.log('Searching for record with ID:', id);
    const record = await base('Administrators').find(id);
    //console.log('Found record:');
    return record;
  } catch (err) {
    console.error('Error:', err);
  }
}

module.exports = GetAdministratorByUID;