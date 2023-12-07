const Airtable = require('airtable');

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE);

async function deleteReviewById(id) {
  try {
    await base('Assessments').destroy([id]);
    //console.log(`Review with ID ${id} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting review:', error.message);
    throw error;
  }
}

module.exports = deleteReviewById;
