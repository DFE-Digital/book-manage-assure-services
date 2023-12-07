// Global

const Airtable = require('airtable')
const axios = require('axios')
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE,
)

const myDepartment = "Department for Education";

const getAdministratorByUID = require('../data/airtable/assessors/getAdministratorByUID')

async function getAdministrators(viewName) {
    return await base('Administrators').select({ view: viewName }).all()
}

async function getAssessors(viewName) {
    return await base('Assessors').select({ view: viewName }).all()
}

async function getAssessorByID(id) {
    return await base('Assessors')
        .select({ maxRecords: 1, filterByFormula: `{ID} = "${id}"` })
        .firstPage()
}

async function getAdministratorByID(id) {
    return await base('Administrators')
        .select({ maxRecords: 1, filterByFormula: `{ID} = "${id}"` })
        .firstPage()
}


async function getAssessorTrainingForUser(id) {
    return await base('AssessorTraining')
        .select({ view: 'All', filterByFormula: `{UserID} = "${id}"` })
        .all()
}

exports.get_admin = async function (req, res) {
    return res.render('admin/index')
}


exports.get_admins = async function (req, res) {

    try {
        const [administrators] = await axios.all([getAdministrators('Active')]);

        return res.render('admin/administrators/index', { administrators });
    } catch (error) {
        console.error("Error:", error);
    }

    return res.render('/admin/administrators', { administrators })
}



exports.get_assessors = async function (req, res) {

    try {
        const [assessors] = await axios.all([getAssessors('All')]);

        return res.render('admin/assessors/index', { assessors });
    } catch (error) {
        console.error("Error:", error);
    }

    return res.redirect('/admin/assessors')
}


exports.get_assessor = async function (req, res) {

    const id = req.params.id

    try {
        const [assessorx] = await axios.all([getAssessorByID(id)]);

        var assessor = assessorx[0]

        if (assessor) {
            ////console.log(assessor)
            if (assessor.fields.Department && (assessor.fields.Department[0] === myDepartment)) {

                return res.render('admin/assessors/assessor.html', { assessor });
            }

        }

    } catch (error) {
        console.error("Error:", error);
    }

    return res.redirect('/admin/assessors')
}



exports.get_assessor_training = async function (req, res) {

    const id = req.params.id

    try {
        const [assessorx, assessorTraining] = await axios.all([getAssessorByID(id), getAssessorTrainingForUser(id)]);

        var assessor = assessorx[0]

        //console.log(assessorTraining)

        if (assessor) {
            ////console.log(assessor)
            if (assessor.fields.Department && (assessor.fields.Department[0] === myDepartment)) {

                return res.render('admin/assessors/training', { assessor, assessorTraining });
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }

    return res.redirect('/admin/assessors')
}

exports.get_assessor_manage = async function (req, res) {

    const id = req.params.id
    const subView = req.params.view

    //console.log('get_assessor_manage')

    try {
        const [assessorx] = await axios.all([getAssessorByID(id)]);

        var assessor = assessorx[0]

        if (assessor) {
            ////console.log(assessor)
            if (assessor.fields.Department && (assessor.fields.Department[0] === myDepartment)) {

                return res.render('admin/assessors/manage.html', { assessor, subView });
            }

        }

    } catch (error) {
        console.error("Error:", error);
    }

    return res.redirect('/admin/assessors')
}


exports.get_assessor_add = function (req, res) {
    return res.render('admin/assessors/add');
}


exports.get_administrators_add = function (req, res) {

    return res.render('admin/administrators/add');
}

exports.get_administrators_manage = async function (req, res) {

    const id = req.params.id
    const subView = req.params.view

    //console.log('get_administrators_manage')

    try {
        const [administrator] = await axios.all([getAdministratorByUID(id)]);
        if (administrator.fields.DepartmentName && (administrator.fields.DepartmentName == myDepartment)) {
            return res.render('admin/administrators/manage', { administrator, subView });
        }
    } catch (error) {
        console.error("Error:", error);
    }

    return res.redirect('/admin/administrators')
}   


exports.get_administrators_remove = async function (req, res) {

    const id = req.params.id
    const subView = req.params.view

    //console.log('get_administrators_remove')

    try {
        const [administrator] = await axios.all([getAdministratorByUID(id)]);
        if (administrator.fields.DepartmentName && (administrator.fields.DepartmentName == myDepartment)) {
            return res.render('admin/administrators/remove', { administrator, subView });
        }
    } catch (error) {
        console.error("Error:", error);
    }

    return res.redirect('/admin/administrators')
}   