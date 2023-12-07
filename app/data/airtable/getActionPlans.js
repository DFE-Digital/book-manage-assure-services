const Airtable = require('airtable');

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE);

async function getActionPlans() {
  try {
    const actionPlans = await base('Actions').select({ view: 'Tracking' }).all();
    return actionPlans;
  } catch (error) {
    console.error('Error retrieving action plans:', error.message);
    throw error;
  }
}

module.exports = getActionPlans;
