// Global

const Airtable = require('airtable')
const axios = require('axios')
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE,
)

const getEntryByID = require('../data/airtable/getEntryByID')
const GetRequestsByType = require('../data/airtable/getRequestsByType')

async function getArtefacts(id) {
    try {
        return await base('Artefacts')
            .select({ view: 'All', filterByFormula: `{AssessmentID} = "${id}"` })
            .firstPage()
    } catch (err) {
        //console.log('getArtefacts');
        //console.log(err)
    }
}

async function getPanel(id) {
    try {
        return await base('AssessorPanel')
            .select({ view: 'All', filterByFormula: `{AssessmentID} = "${id}"` })
            .firstPage()
    } catch (err) {
        //console.log('getPanel');
        //console.log(err)
    }
}

async function getObservers(id) {
    try {
        return await base('ReviewObservers')
            .select({ view: 'People', filterByFormula: `{ReviewID} = "${id}"` })
            .firstPage()
    } catch (err) {
        //console.log('getObservers');
        //console.log(err)
    }
}

async function getTeam(id) {
    try {
        return await base('AssessmentTeam')
            .select({ view: 'All', filterByFormula: `{AssessmentID} = "${id}"` })
            .firstPage()
    } catch (err) {
        //console.log('getTeam');
        //console.log(err)
    }
}

async function getAssessors(viewName) {
    return await base('Assessors').select({ view: viewName }).all()
}

async function getPerson(id) {
    try {
        return await base('ReviewTeam')
            .select({ maxRecords: 1, filterByFormula: `{ID} = "${id}"` })
            .firstPage()
    } catch (err) {
        //console.log('getPerson');
        //console.log(err)
    }
}

async function getArtefact(id) {
    try {
        return await base('Artefacts')
            .select({ maxRecords: 1, filterByFormula: `{ID} = "${id}"` })
            .firstPage()
    } catch (err) {
        //console.log('getArtefact');
        //console.log(err)
    }
}

async function getDates(id) {
    try {
        return await base('ReviewDateOptions')
            .select({ view: 'All', filterByFormula: `{ReviewID} = "${id}"` })
            .firstPage()
    } catch (err) {
        //console.log('getDates');
        //console.log(err)
    }
}

async function getDate(id) {
    ////console.log(id)
    try {
        return await base('ReviewDateOptions')
            .select({ maxRecords: 1, filterByFormula: `{ID} = "${id}"` })
            .firstPage()
    } catch (err) {
        //console.log('getDate');
        //console.log(err)
    }
}

async function getPanelMember(id) {
    try {
        return await base('ReviewPanel')
            .select({ view: 'People', filterByFormula: `{ID} = "${id}"` })
            .firstPage()
    } catch (err) {
        //console.log('getPanelMember');
        //console.log(err)
    }
}

async function getMyAssessments() {
    return await base('ReviewPanel').select({ view: 'Mine' }).all()
}

async function getActiveAssessments() {
    return await base('Reviews').select({ view: 'Recent' }).all()
}

async function getAllDoneWell(id) {
    try {
        return await base('DoneWell')
            .select({ view: 'All', filterByFormula: `{Assessment} = "${id}"` })
            .all()
    } catch (err) {
        //console.log('getArtegetAllDoneWellfacts');
        //console.log(err)
    }
}

async function getAllImprove(id) {
    try {
        return await base('Improve')
            .select({ view: 'All', filterByFormula: `{Assessment} = "${id}"` })
            .all()
    } catch (err) {
        //console.log('getAllImprove');
        //console.log(err)
    }
}

async function getAllActions(id) {
    try {
        return await base('Actions')
            .select({ view: 'All', filterByFormula: `{Assessment} = "${id}"` })
            .all()
    } catch (err) {
        //console.log('getAllActions');
        //console.log(err)
    }
}

async function getDoneWell(point, id) {
    try {
        return await base('DoneWell')
            .select({ view: 'All', filterByFormula: `AND({Assessment} = "${id}",{Standard} = "${point}")` })
            .all()
    } catch (err) {
        //console.log('getDoneWell');
        //console.log(err)
    }
}

async function getOutcomes(id) {
    try {
        return await base('Outcomes')
            .select({ view: 'All', filterByFormula: `{AssessmentID} = "${id}"` })
            .all()
    } catch (err) {
        //console.log('**************************************************************************** getOutcome');
        //console.log(err)
    }
}

async function getComments(id) {
    try {
        return await base('AssessmentComments')
            .select({ view: 'All', filterByFormula: `{AssessmentID} = "${id}"` })
            .all()
    } catch (err) {
        //console.log('getComments');
        //console.log(err)
    }
}


async function getActionsForPointAndAssessment(point, id) {
    try {
        return await base('Actions')
            .select({ view: 'All', filterByFormula: `AND({Assessment} = "${id}",{Standard} = "${point}")` })
            .all()
    } catch (err) {
        //console.log('getActionsForPointAndAssessment');
        //console.log(err)
    }
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
        .select({ view: 'All', filterByFormula: `{AssessmentID} = "${id}"` })
        .all()
}

async function getActions(point, id) {
    try {
        //console.log('getActions : ' + point + ' - ' + id)
        return await base('Actions')
            .select({ view: 'All', filterByFormula: `{AssessmentID} = "${id}"` })
            .all()
    } catch (err) {
        //console.log('getActions');
        //console.log(err)
    }
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

async function getCommentByUID(id) {
    try {
        return await base('AssessmentComments').find(id)
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

async function DeleteComment(id) {
    try {
        return await base('AssessmentComments').destroy([id])
    } catch (err) {
        //console.log(err)
    }
}


async function GetAssessmentsForAssessor(email, status) {
    return await base('AssessorPanel')
        .select({ view: status, filterByFormula: `{AssessorEmail} = "${email}"` })
        .all()
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

exports.get_assess = function (req, res) {
    const email = req.session.data.user.email;
    //console.log('Email: ' + email)

    axios.all([GetAssessmentsForAssessor(email, 'Active')]).then(
        axios.spread((entries) => {
            //console.log(entries)
            return res.render('assess/index', { entries })
        }),
    )
}

exports.get_assessor_dashboard = async function (req, res) {

    var assessorType = req.params.type;
    if (!req.session.data) {
        req.session.data = {};
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

    try {
        //console.log('Panel - Get Request ' + id)
        axios
            .all([
                getEntryByID(id), getArtefacts(id), getPanel(id), getTeam(id)
            ])
            .then(
                axios.spread(
                    (
                        entry, artefacts, panel, team
                    ) => {


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
    } catch (err) {
        //console.log(err)
    }
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

    await wait(100)

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

    await wait(100)

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

    //console.log('Delete action: ' + uid)

    DeleteAction(uid)

    await wait(100)

    return res.redirect('/assess/entry/sspoint' + point + '/pactions/' + id)
}

exports.get_editaction = async function (req, res) {
    try {
        //console.log('get_editaction')

        var id = req.params.id
        var uid = req.params.uid
        var view = req.params.partial;
        var point = extractNumbersFromString(req.params.point)
        var mainview = "report"
        var subView = "edit-action"
        var selnav = "report"

        axios
            .all([
                getEntryByID(id), getArtefacts(id), getPanel(id), getTeam(id), getActionByUID(uid)
            ])
            .then(
                axios.spread(
                    (
                        entry, artefacts, panel, team, action
                    ) => {


                        var standards = require('../data/standards.json');

                        if (entry.fields.Type === "Peer Review") {
                            standards = require('../data/peerreview.json');
                        }
                        return res.render('assess/entry/index', {
                            entry, artefacts, panel, team, view, mainview, standards, subView, point, action, selnav
                        })
                    },
                ),
            )
    } catch (err) {
        //console.log(err)
    }
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
                    Details: req.body.action
                },
            },
        ]
    )
    return res.redirect('/assess/entry/sspoint' + point + '/pactions/' + id)

}

exports.get_editcomment = async function (req, res) {
    try {
        //console.log('get_editcomment')

        var id = req.params.id
        var uid = req.params.uid
        var view = 'edit-comment';
        var point = extractNumbersFromString(req.params.point)
        var mainview = "report"
        var subView = "edit-comment"
        var selnav = "report"

        axios
            .all([
                getEntryByID(id), getArtefacts(id), getPanel(id), getTeam(id), getCommentByUID(uid)
            ])
            .then(
                axios.spread(
                    (
                        entry, artefacts, panel, team, comment
                    ) => {


                        var standards = require('../data/standards.json');

                        if (entry.fields.Type === "Peer Review") {
                            standards = require('../data/peerreview.json');
                        }
                        return res.render('assess/entry/index', {
                            entry, artefacts, panel, team, view, mainview, standards, subView, comment, selnav
                        })
                    },
                ),
            )
    } catch (err) {
        //console.log(err)
    }
}


exports.post_editcomment_confirm = async function (req, res) {
    var id = req.params.id
    var uid = req.params.uid

    //console.log('post_editecomment_confirm')

    try {

        base('AssessmentComments').update(
            [
                {
                    id: uid,
                    fields: {
                        Details: req.body.comment
                    },
                },
            ]
        )
        return res.redirect('/assess/entry/report-comments/' + id)
    } catch (err) {
        //console.log(err)
    }
}




exports.get_entry_view = async function (req, res) {
    var id = req.params.id;
    var view = req.params.partial;
    var mainview = "overview";
    var subView = "";
    if (view === 'report' || view === 'done-well' || view === 'improve' || view === 'preview' || view === 'submit' || view === "outcome" || view.includes('sspoint')) {
        mainview = "report"
    }
    var isLeadAssessor = false;
    await wait(100)

    if (view === "report-submitted") {
        if (!req.session.data) {
            req.session.data = {}
        }

        req.session.data['report-submitted'] = 'true';

    }

    //console.log(view)

    //console.log('get_entry_view ' + id)
    axios
        .all([
            getEntryByID(id), getArtefacts(id), getPanel(id), getTeam(id), getActionsForAssessment(id), getOutcomes(id), getComments(id)

        ])
        .then(
            axios.spread(
                (
                    entry, artefacts, panel, team, actions, outcome, comments
                ) => {

             
                    var userID = Array.isArray(req.session.data.user.uID) ? req.session.data.user.uID : [req.session.data.user.uID]
                    console.log(userID)

                    panel.forEach(function (item) {
                        console.log(item.fields.UserUID)
                        if (item.fields.UserUID[0] == userID[0]) {
                            if (item.fields.Role == "Lead assessor") {
                                isLeadAssessor = true;
                            }
                        }
                    });


                    var standards = require('../data/standards.json');

                    if (entry.fields.Type === "Peer Review") {
                        standards = require('../data/peerreview.json');
                    }
                    return res.render('assess/entry/index', {
                        entry, artefacts, panel, team, view, mainview, standards, subView, actions, outcome, comments, isLeadAssessor
                    })
                },
            ),
        )
}

exports.get_entry_subview = async function (req, res) {
    var id = req.params.id;
    var view = req.params.partial;
    var subView = req.params.sub;
    var isLeadAssessor = false;
    //Extract the standard from the partial
    await wait(100)

    var point = extractNumbersFromString(view)

    //console.log('sub report view: ' + view + " - " + subView)


    var mainview = "overview";

    if (view === 'report' || view === 'done-well' || view === 'improve' || view === 'preview' || view === 'submit' || view === "outcome" || view.includes('sspoint')) {
        mainview = "report"
    }


    //console.log('Panel - Get Request ' + id)
    axios
        .all([
            getEntryByID(id), getArtefacts(id), getPanel(id), getTeam(id), getActions(point, id), getOutcomes(id), getComments(id)
        ])
        .then(
            axios.spread(
                (
                    entry, artefacts, panel, team, actions, outcome, comments
                ) => {

                    //console.log(panel);
                    var userID = Array.isArray(req.session.data.user.uID) ? req.session.data.user.uID : [req.session.data.user.uID]
                    console.log(userID)

                    panel.forEach(function (item) {
                        console.log(item.fields.UserUID)
                        if (item.fields.UserUID[0] == userID[0]) {
                            if (item.fields.Role == "Lead assessor") {
                                isLeadAssessor = true;
                            }
                        }
                    });

                    var standards = require('../data/standards.json');

                    if (entry.fields.Type === "Peer Review") {
                        standards = require('../data/peerreview.json');
                    }
                    return res.render('assess/entry/index', {
                        entry, artefacts, panel, team, view, mainview, standards, subView, point, actions, outcome, comments, isLeadAssessor
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

    var standards = require('../data/standards.json');

    var user = req.session.data.user;

    var title = filterAndExtractTitles(standards, point)


    axios
        .all([
            getEntryByID(id)
        ])
        .then(
            axios.spread(
                (
                    entry
                ) => {

                    // save to the DB
                    base('Actions').create(
                        [
                            {
                                fields: {
                                    Standard: parseInt(point),
                                    Assessment: Array.isArray(entry.id) ? entry.id : [entry.id],
                                    Details: req.body.action,
                                    AddedBy: Array.isArray(user.uID) ? user.uID : [user.uID],
                                    StandardTitle: title[0]
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

                },
            ),
        )



}

exports.post_outcome = async function (req, res) {

    var point = req.params.point;
    var id = req.params.id;
    const pointRating = req.body.pointRating;
    // save to the DB

    // If an Outcome exists for the point and assessment, update. If not, create.


    // Do any actions exist?




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

exports.post_submit_report = async function (req, res) {

    var id = req.params.id;

    axios
    .all([
        getEntryByID(id), getPanel(id)
    ])
    .then(
        axios.spread(
            (
                entry, panel
            ) => {

                var userID = Array.isArray(req.session.data.user.uID) ? req.session.data.user.uID : [req.session.data.user.uID]

                panel.forEach(function (item) {
                    console.log(item.fields.UserUID)
                    if (item.fields.UserUID[0] == userID[0]) {
                        if (item.fields.Role == "Lead assessor") {
                            isLeadAssessor = true;
                        }
                    }
                });

                if (isLeadAssessor) {
                    base('Assessments').update(
                        [
                            {
                                id: entry.id,
                                fields: {
                                    Status: 'Pending',
                                    ReportStatus: 'Complete',
                                },
                            },
                        ],
                        function (err, records) {
                            if (err) {
                                console.error(err)
                                return
                            }
                            records.forEach(function (record) {
                                return res.redirect('/assess/entry/report-submitted/' + id)
                            })
                        },
                    )
                }
                else{
                    return res.redirect('/assess/entry/report-submit/' + id)
                }
            })
    )
}

exports.post_overall_outcome = async function (req, res) {

    //console.log('post_overall_outcome')

    const uid = req.body.uid;
    var point = req.params.point;
    var id = req.params.id;
    const pointRating = req.body.pointRatingOverall;

    // Do actions exist, and is the outcome green - if so, we need to trigger some validation

    axios
        .all([
            getAllActions(id)
        ])
        .then(
            axios.spread(
                (
                    actions
                ) => {
                    if (actions.length > 0 && pointRating === 'Green') {

                        //console.log('Actions: ' + actions)
                        //console.log('Point rating: ' + pointRating)

                        var errMessage = 'The rating cannot be green. This is because actions have been added.'

                        if (!req.session.data) {
                            req.session.data = {}
                        }

                        req.session.data['ratingErr'] = 'true';
                        req.session.data['ratingErrMessage'] = errMessage;

                        return res.redirect('/assess/entry/report-outcome/' + id);
                    }
                    else {
                        req.session.data['ratingErr'] = 'false';
                        req.session.data['ratingErrMessage'] = '';
                        base('Assessments').update(
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
                                    return res.redirect('/assess/entry/report/' + id);
                                })
                            },
                        )
                    }
                },
            ),
        )






}


exports.post_comment = async function (req, res) {

    var id = req.params.id;
    var user = req.session.data.user;

    axios
        .all([
            getEntryByID(id)
        ])
        .then(
            axios.spread(
                (
                    entry
                ) => {
                    // save to the DB
                    base('AssessmentComments').create(
                        [
                            {
                                fields: {
                                    Assessment: Array.isArray(entry.id) ? entry.id : [entry.id],
                                    Details: req.body.comment,
                                    AddedBy: Array.isArray(user.uID) ? user.uID : [user.uID]
                                },
                            },
                        ],
                        function (err, records) {
                            if (err) {
                                console.error(err)
                                return
                            }
                            records.forEach(function (record) {
                                return res.redirect('/assess/entry/report-comments/' + id)
                            })
                        },
                    )
                },
            ),
        )
}

exports.get_deletecomment = async function (req, res) {
    var id = req.params.id
    var uid = req.params.uid
    var view = 'delete-comments';
    var point = extractNumbersFromString(req.params.point)
    var mainview = "report"
    var subView = "delete-comment"
    var selnav = "report"

    axios
        .all([
            getEntryByID(id), getArtefacts(id), getPanel(id), getTeam(id), getCommentByUID(uid)
        ])
        .then(
            axios.spread(
                (
                    entry, artefacts, panel, team, comment
                ) => {


                    var standards = require('../data/standards.json');

                    if (entry.fields.Type === "Peer Review") {
                        standards = require('../data/peerreview.json');
                    }
                    return res.render('assess/entry/index', {
                        entry, artefacts, panel, team, view, mainview, standards, subView, point, comment, selnav
                    })
                },
            ),
        )


}

exports.post_deletecomment_confirm = async function (req, res) {
    var id = req.params.id
    var uid = req.params.uid
    var point = req.params.point;

    //console.log('Delete comment: ' + uid)

    DeleteComment(uid)

    await wait(100)

    return res.redirect('/assess/entry/report-comments/' + id)
}