const Airtable = require('airtable');
const { v4: uuidv4 } = require('uuid');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE
);

const USERS_TABLE = 'Users';
const EMAIL_FIELD = 'EmailAddress';
const TOKEN_FIELD = 'Token';
const EXPIRY_FIELD = 'Expiry';
const DEPARTMENT = 'Department';
const NOTES = 'Notes';

async function UpsertUser(email) {
  try {
    // Check if email already exists
    const existingRecords = await base(USERS_TABLE).select({
      filterByFormula: `{${EMAIL_FIELD}} = '${email}'`,
      maxRecords: 1,
    }).firstPage();

    let userData;
    const newToken = uuidv4();
    const newExpiry = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    if (existingRecords.length === 0) {
      // Email not found, create new record
      const createdRecords = await base(USERS_TABLE).create([
        {
          fields: {
            [EMAIL_FIELD]: email,
            [TOKEN_FIELD]: newToken,
            [EXPIRY_FIELD]: newExpiry,
            [DEPARTMENT]: 'Department for Education',
            [NOTES]: 'Created from sign in magic link - new user'
          },
        },
      ]);
      userData = createdRecords[0].fields;
    } else {
      // Email found, update existing record
      const existingRecord = existingRecords[0];
      await base(USERS_TABLE).update([
        {
          id: existingRecord.id,
          fields: {
            [TOKEN_FIELD]: newToken,
            [EXPIRY_FIELD]: newExpiry,
          },
        },
      ]);
      userData = {
        ...existingRecord.fields,
        [TOKEN_FIELD]: newToken,
        [EXPIRY_FIELD]: newExpiry,
      };
    }

    return {
      email: userData[EMAIL_FIELD],
      token: userData[TOKEN_FIELD],
      expiry: userData[EXPIRY_FIELD],
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

module.exports = UpsertUser;
