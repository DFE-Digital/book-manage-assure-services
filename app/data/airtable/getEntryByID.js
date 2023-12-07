const Airtable = require('airtable');
const axios = require('axios');

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE
);

async function getAssessmentEntryByID(id) {
  try {
    const records = await base('Assessments')
      .select({ maxRecords: 1, filterByFormula: `{ID} = "${id}"` })
      .firstPage();

    if (records && records.length > 0) {
      return records[0];
    } else {
      throw new Error(`No assessment found with ID: ${id}`);
    }
  } catch (error) {
    console.error('Error retrieving assessment entry:', error.message);
    throw error;
  }
}

module.exports = getAssessmentEntryByID;
