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
    //console.log(id)
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

async function getDoneWellByUID(id) {
    try {
        return await base('DoneWell').find(id)
    } catch (err) {
        console.log(err)
    }
}

async function DeleteWell(id) {
    try {
        return await base('DoneWell').destroy([id])
    } catch (err) {
        console.log(err)
    }
}

async function getActionsForAssessment(id) {
    return await base('Actions')
        .select({ view: 'All', filterByFormula: `{Assessment} = "${id}"` })
        .all()
}

async function getActions(point, id) {
    console.log('getActions : ' + point + ' - ' + id )
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
        console.log(err)
    }
}

async function DeleteImprove(id) {
    try {
        return await base('Improve').destroy([id])
    } catch (err) {
        console.log(err)
    }
}

async function getActionByUID(id) {
    try {
        return await base('Actions').find(id)
    } catch (err) {
        console.log(err)
    }
}

async function DeleteAction(id) {
    try {
        return await base('Actions').destroy([id])
    } catch (err) {
        console.log(err)
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



exports.get_assessor_dashboard = async function (req, res) {

    var assessorType = req.params.type;
    if (!req.session.data) {
        req.session.data = {};
      }
    
    

    if (assessorType === "lead") {
        req.session.data['assessorType'] = "lead"

        axios.all([GetRequestsByType('activelead')]).then(
            axios.spread((entries) => {
                return res.render('assess/index', { entries })
            }),
        )
    }

    if (assessorType === "design") {
        req.session.data['assessorType'] = "design"



        axios.all([GetRequestsByType('activedesign')]).then(
            axios.spread((entries) => {
                return res.render('assess/index', { entries })
            }),
        )
    }

    if (assessorType === "research") {
        req.session.data['assessorType'] = "research"


        axios.all([GetRequestsByType('activeresearch')]).then(
            axios.spread((entries) => {
                return res.render('assess/index', { entries })
            }),
        )
    }

    if (assessorType === "tech") {
        req.session.data['assessorType'] = "tech"


        axios.all([GetRequestsByType('activetech')]).then(
            axios.spread((entries) => {
                return res.render('assess/index', { entries })
            }),
        )
    }

}


exports.get_entry = async function (req, res) {
    var id = req.params.id;
    var view = req.params.partial;
    var mainview = "overview";


    console.log('Panel - Get Request ' + id)
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

                    var standards = require('../data/standards.json');

                    if (entry.fields.Type === "Peer review") {
                        standards = require('../data/peerreview.json');
                    }
                    return res.render('assess/entry/index', {
                        entry, artefacts, panel, team, view, mainview, standards
                    })
                },
            ),
        )
}


exports.get_deletewell = async function (req, res) {
    var id = req.params.id
    var uid = req.params.uid
    var view = req.params.partial;
    var point = extractNumbersFromString(req.params.point)
    var mainview = "report"
    var subView = "delete-well"

    axios
        .all([
            getEntryByID(id), getArtefacts(id), getPanel(id), getTeam(id), getDoneWellByUID(uid)
        ])
        .then(
            axios.spread(
                (
                    entry, artefacts, panel, team, donewell
                ) => {
                    entry = entry[0]

                    var standards = require('../data/standards.json');

                    if (entry.fields.Type === "Peer Review") {
                        standards = require('../data/peerreview.json');
                    }
                    return res.render('assess/entry/index', {
                        entry, artefacts, panel, team, view, mainview, standards, subView, point, donewell
                    })
                },
            ),
        )


}

exports.post_deletewell_confirm = async function (req, res) {
    var id = req.params.id
    var uid = req.params.uid
    var point = req.params.point;

    DeleteWell(uid)

    await wait(500)

    return res.redirect('/assess/entry/sspoint' + point + '/pwell/' + id)
}

exports.get_editwell = async function (req, res) {
    var id = req.params.id
    var uid = req.params.uid
    var view = req.params.partial;
    var point = extractNumbersFromString(req.params.point)
    var mainview = "report"
    var subView = "edit-well"

    axios
        .all([
            getEntryByID(id), getArtefacts(id), getPanel(id), getTeam(id), getDoneWellByUID(uid)
        ])
        .then(
            axios.spread(
                (
                    entry, artefacts, panel, team, donewell
                ) => {
                    entry = entry[0]

                    var standards = require('../data/standards.json');

                    if (entry.fields.Type === "Peer Review") {
                        standards = require('../data/peerreview.json');
                    }
                    return res.render('assess/entry/index', {
                        entry, artefacts, panel, team, view, mainview, standards, subView, point, donewell
                    })
                },
            ),
        )


}

exports.post_editwell_confirm = async function (req, res) {
    var id = req.params.id
    var uid = req.params.uid
    var point = req.params.point;

    base('DoneWell').update(
        [
            {
                id: uid,
                fields: {
                    Comment: req.body.donewell,
                },
            },
        ]
    )
    return res.redirect('/assess/entry/sspoint' + point + '/pwell/' + id)

}



exports.get_deleteimprove = async function (req, res) {
    var id = req.params.id
    var uid = req.params.uid
    var view = req.params.partial;
    var point = extractNumbersFromString(req.params.point)
    var mainview = "report"
    var subView = "delete-improve"

    axios
        .all([
            getEntryByID(id), getArtefacts(id), getPanel(id), getTeam(id), getImproveByUID(uid)
        ])
        .then(
            axios.spread(
                (
                    entry, artefacts, panel, team, improve
                ) => {
                    entry = entry[0]

                    var standards = require('../data/standards.json');

                    if (entry.fields.Type === "Peer Review") {
                        standards = require('../data/peerreview.json');
                    }
                    return res.render('assess/entry/index', {
                        entry, artefacts, panel, team, view, mainview, standards, subView, point, improve
                    })
                },
            ),
        )


}

exports.post_deleteimprove_confirm = async function (req, res) {
    var id = req.params.id
    var uid = req.params.uid
    var point = req.params.point;

    DeleteImprove(uid)

    await wait(500)

    return res.redirect('/assess/entry/sspoint' + point + '/pimprove/' + id)
}

exports.get_editimprove = async function (req, res) {
    var id = req.params.id
    var uid = req.params.uid
    var view = req.params.partial;
    var point = extractNumbersFromString(req.params.point)
    var mainview = "report"
    var subView = "edit-improve"

    axios
        .all([
            getEntryByID(id), getArtefacts(id), getPanel(id), getTeam(id), getImproveByUID(uid)
        ])
        .then(
            axios.spread(
                (
                    entry, artefacts, panel, team, improve
                ) => {
                    entry = entry[0]

                    var standards = require('../data/standards.json');

                    if (entry.fields.Type === "Peer Review") {
                        standards = require('../data/peerreview.json');
                    }
                    return res.render('assess/entry/index', {
                        entry, artefacts, panel, team, view, mainview, standards, subView, point, improve
                    })
                },
            ),
        )


}

exports.post_editimprove_confirm = async function (req, res) {
    var id = req.params.id
    var uid = req.params.uid
    var point = req.params.point;

    base('Improve').update(
        [
            {
                id: uid,
                fields: {
                    Comment: req.body.improve,
                },
            },
        ]
    )
    return res.redirect('/assess/entry/sspoint' + point + '/pimprove/' + id)

}




exports.get_deleteaction = async function (req, res) {
    var id = req.params.id
    var uid = req.params.uid
    var view = req.params.partial;
    var point = extractNumbersFromString(req.params.point)
    var mainview = "report"
    var subView = "delete-action"

    axios
        .all([
            getEntryByID(id), getArtefacts(id), getPanel(id), getTeam(id), getActionByUID(uid)
        ])
        .then(
            axios.spread(
                (
                    entry, artefacts, panel, team, action
                ) => {
                    entry = entry[0]

                    var standards = require('../data/standards.json');

                    if (entry.fields.Type === "Peer Review") {
                        standards = require('../data/peerreview.json');
                    }
                    return res.render('assess/entry/index', {
                        entry, artefacts, panel, team, view, mainview, standards, subView, point, action
                    })
                },
            ),
        )


}

exports.post_deleteaction_confirm = async function (req, res) {
    var id = req.params.id
    var uid = req.params.uid
    var point = req.params.point;

    console.log('Delete action: ' + uid)

    DeleteAction(uid)

    await wait(500)

    return res.redirect('/assess/entry/sspoint' + point + '/pactions/' + id)
}

exports.get_editaction = async function (req, res) {
    var id = req.params.id
    var uid = req.params.uid
    var view = req.params.partial;
    var point = extractNumbersFromString(req.params.point)
    var mainview = "report"
    var subView = "edit-action"

    axios
        .all([
            getEntryByID(id), getArtefacts(id), getPanel(id), getTeam(id), getActionByUID(uid)
        ])
        .then(
            axios.spread(
                (
                    entry, artefacts, panel, team, action
                ) => {
                    entry = entry[0]

                    var standards = require('../data/standards.json');

                    if (entry.fields.Type === "Peer Review") {
                        standards = require('../data/peerreview.json');
                    }
                    return res.render('assess/entry/index', {
                        entry, artefacts, panel, team, view, mainview, standards, subView, point, action
                    })
                },
            ),
        )


}

exports.post_editaction_confirm = async function (req, res) {
    var id = req.params.id
    var uid = req.params.uid
    var point = req.params.point;

    base('Actions').update(
        [
            {
                id: uid,
                fields: {
                    Comment: req.body.action,
                    RAG: req.body.pointRating
                },
            },
        ]
    )
    return res.redirect('/assess/entry/sspoint' + point + '/pactions/' + id)

}





exports.get_entry_view = async function (req, res) {
    var id = req.params.id;
    var view = req.params.partial;
    var mainview = "overview";
    var subView = "";
    if (view === 'report' || view === 'done-well' || view === 'improve' || view === 'preview' || view === 'submit' || view === "outcome" || view.includes('sspoint')) {
        mainview = "report"
    }
    await wait(500)

    if(view === "report-submitted")
    {
        if(!req.session.data){
            req.session.data = {}
        }

        req.session.data['report-submitted'] = 'true';

    }

    console.log(view)

    console.log('get_entry_view ' + id)
    axios
        .all([
            getEntryByID(id), getArtefacts(id), getPanel(id), getTeam(id), getActionsForAssessment(id), getAllDoneWell(id), getAllImprove(id)
        ])
        .then(
            axios.spread(
                (
                    entry, artefacts, panel, team, actions, donewell, improve
                ) => {
                    entry = entry[0]

                    var standards = require('../data/standards.json');

                    if (entry.fields.Type === "Peer Review") {
                        standards = require('../data/peerreview.json');
                    }
                    return res.render('assess/entry/index', {
                        entry, artefacts, panel, team, view, mainview, standards, subView, actions, donewell, improve
                    })
                },
            ),
        )
}

exports.get_entry_subview = async function (req, res) {
    var id = req.params.id;
    var view = req.params.partial;
    var subView = req.params.sub;

    //Extract the standard from the partial
    await wait(500)

    var point = extractNumbersFromString(view)

    console.log('sub report view: ' + view + " - " + subView)


    var mainview = "overview";

    if (view === 'report' || view === 'done-well' || view === 'improve' || view === 'preview' || view === 'submit' || view === "outcome" || view.includes('sspoint')) {
        mainview = "report"
    }


    console.log('Panel - Get Request ' + id)
    axios
        .all([
            getEntryByID(id), getArtefacts(id), getPanel(id), getTeam(id), getDoneWell(point, id), getImprove(point, id), getActions(point,id), getOutcome(point, id)
        ])
        .then(
            axios.spread(
                (
                    entry, artefacts, panel, team, donewell, improve, actions, outcome
                ) => {
                    entry = entry[0]

                    var standards = require('../data/standards.json');

                    if (entry.fields.Type === "Peer Review") {
                        standards = require('../data/peerreview.json');
                    }
                    return res.render('assess/entry/index', {
                        entry, artefacts, panel, team, view, mainview, standards, subView, point, donewell, improve, actions, outcome
                    })
                },
            ),
        )
}

exports.post_done_well = async function (req, res) {

    var point = req.params.point;
    var id = req.params.id;

    // save to the DB
    base('DoneWell').create(
        [
            {
                fields: {
                    Standard: point,
                    Assessment: id,
                    Comment: req.body.donewell,
                    Author: 'Andy Jones'
                },
            },
        ],
        function (err, records) {
            if (err) {
                console.error(err)
                return
            }
            records.forEach(function (record) {
                return res.redirect('/assess/entry/sspoint' + point + '/pwell/' + id)
            })
        },
    )
}

exports.post_improve = async function (req, res) {

    var point = req.params.point;
    var id = req.params.id;

    // save to the DB
    base('Improve').create(
        [
            {
                fields: {
                    Standard: point,
                    Assessment: id,
                    Comment: req.body.improve,
                    Author: 'Andy Jones'
                },
            },
        ],
        function (err, records) {
            if (err) {
                console.error(err)
                return
            }
            records.forEach(function (record) {
                return res.redirect('/assess/entry/sspoint' + point + '/pimprove/' + id)
            })
        },
    )
}

exports.post_action = async function (req, res) {

    var point = req.params.point;
    var id = req.params.id;

    // save to the DB
    base('Actions').create(
        [
            {
                fields: {
                    Standard: point,
                    Assessment: id,
                    Comment: req.body.action,
                    Author: 'Andy Jones',
                    RAG: req.body.pointRating
                },
            },
        ],
        function (err, records) {
            if (err) {
                console.error(err)
                return
            }
            records.forEach(function (record) {
                return res.redirect('/assess/entry/sspoint' + point + '/pactions/' + id)
            })
        },
    )
}

exports.post_outcome = async function (req, res) {

    var point = req.params.point;
    var id = req.params.id;
    const pointRating = req.body.pointRating;
    // save to the DB

    // If an Outcome exists for the point and assessment, update. If not, create.


// Check if the entry already exists in the "Outcomes" base
base('Outcomes').select({
    filterByFormula: `AND({Standard} = '${point}', {Assessment} = '${id}')`,
}).firstPage(function (err, records) {
    if (err) {
        console.error(err);
        return;
    }

    if (records.length > 0) {
        // If the entry exists, update it
        const existingRecord = records[0];
        base('Outcomes').update([
            {
                id: existingRecord.id,
                fields: {
                    RAG: pointRating,
                },
            },
        ], function (err, updatedRecords) {
            if (err) {
                console.error(err);
                return;
            }
            // Redirect after updating
            return res.redirect('/assess/entry/sspoint' + point + '/poutcome/' + id);
        });
    } else {
        // If the entry does not exist, create a new one
        base('Outcomes').create([
            {
                fields: {
                    Standard: point,
                    Assessment: id,
                    RAG: pointRating,
                },
            },
        ], function (err, newRecords) {
            if (err) {
                console.error(err);
                return;
            }
            // Redirect after creating
            newRecords.forEach(function (record) {
                return res.redirect('/assess/entry/sspoint' + point + '/poutcome/' + id);
            });
        });
    }
});
}

exports.post_overall_outcome = async function (req, res) {

   
    const uid = req.body.uid;
    var point = req.params.point;
    var id = req.params.id;
    const pointRating = req.body.pointRatingOverall;

    base('Reviews').update(
        [
            {
                id: uid,
                fields: {
                    Outcome: pointRating,
                },
            },
        ],
        function (err, records) {
            if (err) {
                console.error(err)
                return
            }
            records.forEach(function (record) {
                return res.redirect('/assess/entry/report-outcome/' + id);
            })
        },
    )


}
