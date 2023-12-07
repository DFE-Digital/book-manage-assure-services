// Global

const Airtable = require('airtable')
const axios = require('axios')
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE,
)

const getEntryByID = require('../data/airtable/getEntryByID')
const GetRequestsByType = require('../data/airtable/getRequestsByType')


async function getArtefacts(id) {
    return await base('Artefacts')
        .select({ view: 'Files', filterByFormula: `{ReviewID} = "${id}"` })
        .firstPage()
}

async function getPanel(id) {
    return await base('ReviewPanel')
        .select({ view: 'People', filterByFormula: `{ReviewID} = "${id}"` })
        .firstPage()
}

async function getObservers(id) {
    return await base('ReviewObservers')
        .select({ view: 'People', filterByFormula: `{ReviewID} = "${id}"` })
        .firstPage()
}

async function getTeam(id) {
    return await base('ReviewTeam')
        .select({ view: 'People', filterByFormula: `{ReviewID} = "${id}"` })
        .firstPage()
}

async function getAssessors(viewName) {
    return await base('Assessors').select({ view: viewName }).all()
}

async function getPerson(id) {
    return await base('ReviewTeam')
        .select({ maxRecords: 1, filterByFormula: `{ID} = "${id}"` })
        .firstPage()
}

async function getArtefact(id) {
    return await base('Artefacts')
        .select({ maxRecords: 1, filterByFormula: `{ID} = "${id}"` })
        .firstPage()
}

async function getDates(id) {
    return await base('ReviewDateOptions')
        .select({ view: 'All', filterByFormula: `{ReviewID} = "${id}"` })
        .firstPage()
}

async function getDate(id) {
    ////console.log(id)
    return await base('ReviewDateOptions')
        .select({ maxRecords: 1, filterByFormula: `{ID} = "${id}"` })
        .firstPage()
}


async function getPanelMember(id) {
    return await base('ReviewPanel')
        .select({ view: 'People', filterByFormula: `{ID} = "${id}"` })
        .firstPage()
}


async function getMyAssessments() {
    return await base('ReviewPanel').select({ view: 'Mine' }).all()
}

async function getActiveAssessments() {
    return await base('Reviews').select({ view: 'Recent' }).all()
}


async function getAllDoneWell(id) {
    return await base('DoneWell')
        .select({ view: 'All', filterByFormula: `{Assessment} = "${id}"` })
        .all()
}

async function getAllImprove(id) {
    return await base('Improve')
        .select({ view: 'All', filterByFormula: `{Assessment} = "${id}"` })
        .all()
}

async function getAllActions(id) {
    return await base('Actions')
        .select({ view: 'All', filterByFormula: `{Assessment} = "${id}"` })
        .all()
}

async function getDoneWell(point, id) {
    return await base('DoneWell')
        .select({ view: 'All', filterByFormula: `AND({Assessment} = "${id}",{Standard} = "${point}")` })
        .all()
}

async function getOutcome(point, id) {
    return await base('Outcomes')
        .select({ view: 'All', filterByFormula: `AND({Assessment} = "${id}",{Standard} = "${point}")` })
        .all()
}

async function getActionsForPointAndAssessment(point, id) {
    return await base('Actions')
        .select({ view: 'All', filterByFormula: `AND({Assessment} = "${id}",{Standard} = "${point}")` })
        .all()
}



async function getDoneWellByUID(id) {
    try {
        return await base('DoneWell').find(id)
    } catch (err) {
        //console.log(err)
    }
}

async function DeleteWell(id) {
    try {
        return await base('DoneWell').destroy([id])
    } catch (err) {
        //console.log(err)
    }
}

async function getActionsForAssessment(id) {
    return await base('Actions')
        .select({ view: 'All', filterByFormula: `AND({Assessment} = "${id}",{Track} = "Yes")` })
        .all()
}

async function getActions(point, id) {
    //console.log('getActions : ' + point + ' - ' + id)
    return await base('Actions')
        .select({ view: 'All', filterByFormula: `AND({Assessment} = "${id}",{Standard} = "${point}")` })
        .all()
}

async function getImprove(point, id) {
    return await base('Improve')
        .select({ view: 'All', filterByFormula: `AND({Assessment} = "${id}",{Standard} = "${point}")` })
        .all()
}


async function getImproveByUID(id) {
    try {
        return await base('Improve').find(id)
    } catch (err) {
        //console.log(err)
    }
}

async function DeleteImprove(id) {
    try {
        return await base('Improve').destroy([id])
    } catch (err) {
        //console.log(err)
    }
}

async function getActionByUID(id) {
    try {
        return await base('Actions').find(id)
    } catch (err) {
        //console.log(err)
    }
}

async function DeleteAction(id) {
    try {
        return await base('Actions').destroy([id])
    } catch (err) {
        //console.log(err)
    }
}



function wait(waitTime) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true)
        }, waitTime)
    })
}

function extractNumbersFromString(str) {
    if (!str) return null;
    const numStr = str.split('').filter(char => !isNaN(char)).join('');
    return numStr;
}

const filterAndExtractTitles = (jsonData, point) => {
    const filteredStandards = jsonData.standards.filter(standard => standard.point === point);
    const titles = filteredStandards.map(standard => standard.title);
    return titles;
};





// devuser


exports.get_dashboard = function (req, res) {


    axios.all([GetRequestsByType('All')]).then(
        axios.spread((active) => {
            return res.render('manage/index', { active })
        }),
    )
}


exports.get_entry = async function (req, res) {
    var id = req.params.id;
    var view = req.params.partial;
    var mainview = "overview";


    //console.log('Team - Get Request ' + id)
    axios
        .all([
            getEntryByID(id), getArtefacts(id), getPanel(id), getTeam(id)
        ])
        .then(
            axios.spread(
                (
                    entry, artefacts, panel, team
                ) => {
                    entry = entry[0]

                    return res.render('manage/entry/index', {
                        entry, artefacts, panel, team, view, mainview
                    })
                },
            ),
        )
}