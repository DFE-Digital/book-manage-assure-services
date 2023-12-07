
const Airtable = require('airtable')
const axios = require('axios')
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE,
)

const GetRequestsByType = require('../data/airtable/getRequestsByType')

exports.get_assessments = async function (req, res) {
    axios
        .all([
            GetRequestsByType('Active'),
        ])
        .then(
            axios.spread(
                (
                    entries, panels
                ) => {

                    return res.render('assessments/index', {
                        entries, panels
                    })
                },
            ),
        )
}