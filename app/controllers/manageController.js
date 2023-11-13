// Global
var Airtable = require('airtable')
var axios = require('axios')
var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE,
)

var urlencode = require('urlencode')

const GetRequestsByType = require('../data/airtable/getRequestsByType')

exports.get_dashboard = function (req, res) {

    req.session.data = {}

    axios.all([GetRequestsByType('Active')]).then(
        axios.spread((active) => {
            return res.render('manage/index', { active })
        }),
    )
}