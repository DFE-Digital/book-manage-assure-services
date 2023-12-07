const Airtable = require('airtable');

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE);

async function getPanelsByType(view) {
  try {
    //console.log('Selected view:', view);
    const panels = await base('ReviewPanel').select({ view }).all();
    return panels;
  } catch (error) {
    console.error('Error retrieving panels:', error.message);
    throw error;
  }
}

module.exports = getPanelsByType;
