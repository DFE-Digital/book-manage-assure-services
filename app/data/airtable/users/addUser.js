var Airtable = require('airtable')
var axios = require('axios')
var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE,
)

async function AddUser(firstName, lastName, emailAddress, status, notes, department) {

    return await base('Users').create(
        [
            {
                fields: {
                    FirstName: firstName,
                    LastName: lastName,
                    EmailAddress: emailAddress,
                    Status: status,
                    Notes: notes,
                    Department: department
                },
            }
        ]
    )
}

module.exports = AddUser
