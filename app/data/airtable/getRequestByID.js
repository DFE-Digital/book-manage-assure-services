const Airtable = require('airtable');

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE);

async function getRequestById(id) {
  try {
    const request = await base('Assessments').find(id);
    return request;
  } catch (error) {
    console.error('Error retrieving request:', error.message);
    throw error;
  }
}

module.exports = getRequestById;
