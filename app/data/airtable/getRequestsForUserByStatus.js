const Airtable = require('airtable');

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE);

async function getRequestsForUserByStatus(view, userID) {
  try {
    const requests = await base('Assessments')
      .select({view: view, filterByFormula: `{UserUID} = "${userID}"` })
      .all();
    return requests;
  } catch (error) {
    console.error('Error retrieving requests:', error.message);
    throw error;
  }
}

module.exports = getRequestsForUserByStatus;
