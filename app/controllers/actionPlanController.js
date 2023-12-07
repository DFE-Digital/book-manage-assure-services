
const Airtable = require('airtable')
const axios = require('axios')
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE,
)

const getEntryByID = require('../data/airtable/getEntryByID')
const GetActionPlans = require('../data/airtable/getActionPlans')
const GetRequestsByType = require('../data/airtable/getRequestsByType')

async function getActionByUID(id) {
    try {
        return await base('Actions').find(id)
    } catch (err) {
        //console.log(err)
    }
}



exports.get_dashboard = function (req, res) {

    axios.all([GetActionPlans(), GetRequestsByType('Actions')]).then(
        axios.spread((actionplans, requests) => {

            return res.render('action-plans/index', { actionplans, requests })
        }),
    )
}


exports.get_plan = function (req, res) {

    var id = req.params.id;

    axios.all([GetActionPlans('Active'), getEntryByID(id)]).then(
        axios.spread((actionplans, request) => {

            return res.render('action-plans/plan/index', { actionplans, request })
        }),
    )
}

exports.get_plan_action = function (req, res) {


    var id = req.params.id;
    var uid = req.params.uid;

    var standards = require('../data/standards.json');

    axios.all([getActionByUID(uid), getEntryByID(id)]).then(
        axios.spread((action, request) => {

            return res.render('action-plans/plan/action', { action, request, standards })
        }),
    )
}