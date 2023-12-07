const Airtable = require('airtable');
const { v4: uuidv4 } = require('uuid');

// Initialize Airtable
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE
);

const USERS_TABLE = 'Users';
const EMAIL_FIELD = 'EmailAddress';
const TOKEN_FIELD = 'Token';
const EXPIRY_FIELD = 'Expiry';
const NAME_FIELD = 'Name';

async function ValidateToken(token) {
    try {
        // Check if email already exists
        const existingRecords = await base(USERS_TABLE).select({
            filterByFormula: `{${TOKEN_FIELD}} = '${token}'`,
            maxRecords: 1,
        }).firstPage();

        let userData;
        const newToken = uuidv4();
        const newExpiry = new Date(Date.now()).toISOString();

        const existingRecord = existingRecords[0];
        await base(USERS_TABLE).update([
            {
                id: existingRecord.id,
                fields: {
                    [TOKEN_FIELD]: '',
                    [EXPIRY_FIELD]: newExpiry,
                },
            },
        ]);
        userData = {
            ...existingRecord.fields,
            [TOKEN_FIELD]: newToken,
            [EXPIRY_FIELD]: newExpiry,
        };


        return {
            email: existingRecord.fields[EMAIL_FIELD],
            firstName: existingRecord.fields['FirstName'],
            lastName: existingRecord.fields['LastName'],
            isLeadAdmin: Boolean(existingRecord.fields['LeadForDepartment']),
            isAdmin: '',
            uID: existingRecord.id,
            token: newToken,
            expiry: newExpiry,
        };

    } catch (error) {
        console.error('Error validating token:', error);
        throw error;
    }
}

module.exports = ValidateToken;
