
const Airtable = require('airtable')
const axios = require('axios')
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE,
)

const GetRequestsByType = require('../data/airtable/getRequestsByType')

exports.get_reports = async function (req, res) {
    axios
        .all([
            GetRequestsByType('Published'),
        ])
        .then(
            axios.spread(
                (
                    entries
                ) => {

                    return res.render('reports/index', {
                        entries
                    })
                },
            ),
        )

}