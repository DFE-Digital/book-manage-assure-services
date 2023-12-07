const Airtable = require('airtable');

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE);

async function getDDNames() {
  try {
    const ddnames = await base('admin_ddnames').select({ view: 'Enabled' }).all();
    return ddnames;
  } catch (error) {
    console.error('Error retrieving dd names', error.message);
    throw error;
  }
}

module.exports = getDDNames;
