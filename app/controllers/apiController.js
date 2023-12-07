const Airtable = require('airtable')
const axios = require('axios')
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE,
)

const addUser = require('../data/airtable/users/addUser');
const GetAdministratorByUID = require('../data/airtable/assessors/getAdministratorByUID');
const getUserByUID = require('../data/airtable/users/getUserByUID');


const validateEmail = (email) => {
    // Regular expression for a simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

async function getUser(email) {
    return await base('Users')
        .select({ maxRecords: 1, filterByFormula: `{EmailAddress} = "${email}"` })
        .firstPage()
}  


async function getUserByID(id) {
    return await base('Users')
        .select({ maxRecords: 1, filterByFormula: `{ID} = "${id}"` })
        .firstPage()
}



async function getAssessorByID(id) {x
    return await base('Assessors')
        .select({ maxRecords: 1, filterByFormula: `{ID} = "${id}"` })
        .firstPage()
}


async function getAssessorByEmail(email) {
    return await base('Assessors')
        .select({ maxRecords: 1, filterByFormula: `{EmailAddress} = "${email}"` })
        .firstPage()
}

async function getAdministratorsByEmail(email) {
    return await base('Administrators')
        .select({ maxRecords: 1, filterByFormula: `{EmailAddress} = "${email}"` })
        .firstPage()
}




async function addAssessor(user, role, crossgov, lead) {

    const isLeadAssessor = Array.isArray(role)
        ? role.includes('Lead assessor')
        : role === 'Lead assessor';

    const roles = Array.isArray(role) ? role : [role];
    const filteredRoles = roles.filter(r => r !== 'Lead assessor');

    return await base('Assessors').create(
        [
            {
                fields: {
                    Name: Array.isArray(user.id) ? user.id : [user.id],
                    Status: 'Active',
                    Role: filteredRoles,
                    CrossGovAssessor: crossgov === 'Yes',
                    LeadAssessor: isLeadAssessor
                },
            }
        ])
}


async function addAdministrator(user) {



    return await base('Administrators').create(
        [
            {
                fields: {
                    Name: Array.isArray(user.id) ? user.id : [user.id],
                    Status: 'Active'
                },
            }
        ])
}




exports.post_add_assessor = async function (req, res) {

    // check if post has all required fields
    // var firstName = req.body.firstName
    // var lastName = req.body.lastName
    // var email = req.body.email
    // var role = req.body.role
    // var crossgov = req.body.crossgov

    const { firstName, lastName, email, role, crossgov } = req.body;

    var err = false;
    var errors = {}

    // for any that are missing, return an error and the missing form fields

    if (!firstName) {
        err = true;
        errors.firstName = "First name is required";
    }

    if (!lastName) {
        err = true;
        errors.lastName = "Last name is required";
    }

    if (!email) {

        err = true;
        errors.email = "Email is required";
    } else if (!validateEmail(email)) {
        err = true;
        errors.email = "Email address isn't in the correct format";
    }

    if (!role) {
        err = true;
        errors.role = "Role is required";
    }

    if (!crossgov) {
        err = true;
        errors.crossgov = "Cross government assessor response is required";
    }

    if (err) {
        return res.render('admin/assessors/add', { err, errors })
    }

    // If all ok, check if they already have an account - use email only. 

    // Get account for email address

    try {
        const [users, assessors] = await axios.all([getUser(email), getAssessorByEmail(email)]);

        if (users.length > 0) {
            if (assessors.length === 0) {
                const user = users[0];
                await addAssessor(user, role, crossgov);
            }
        } else {
            // Create the user
            const newUser = await addUser(firstName, lastName, email, "New", "Created from add assessor process", "Department for Education");

            // Add the new user to the assessors table
            await addAssessor(newUser[0], role, crossgov);
        }

        // Clear session values out
        req.session.data['firstName'] = "";
        req.session.data['lastName'] = "";
        req.session.data['email'] = "";
        req.session.data['role'] = "";
        req.session.data['crossgov'] = "";

        return res.redirect('/admin/assessors');
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Internal Server Error");
    }


    // If they do, just add the existing user to the assessor list

    // If they don't have an account, create the user account and then add to the list of assessors.
    return res.redirect('/admin/assessors')
}


// post_change_assessor_name
exports.post_change_assessor_name = async function (req, res) {
    const { firstName, lastName } = req.body;
    const id = req.params.id;
    const subView = 'change-name'

    //console.log('post_change_assessor_name');

    var err = false;
    var errors = {};

    // for any that are missing, return an error and the missing form fields

    if (!firstName) {
        err = true;
        errors.firstName = "First name is required";
    }

    if (!lastName) {
        err = true;
        errors.lastName = "Last name is required";
    }

    if (err) {
        const [assessorx] = await axios.all([getAssessorByID(id)]);
        const assessor = assessorx[0]

        return res.render('admin/assessors/manage', { err, errors, subView, assessor })
    }

    try {
        const [users] = await axios.all([getUserByID(id)]);

        //console.log(users);

        if (users.length === 1) {
            var user = users[0];

            //console.log('user');
            //console.log(user);

            // update the user
            await base('Users').update([
                {
                    id: user.id,
                    fields: {
                        FirstName: firstName,
                        LastName: lastName
                    },
                },
            ]);

            return res.redirect('/admin/assessors/manage/' + user.fields.ID);
        }
    } catch (error) {
        console.error("Error:", error);
        // Handle the error, you might want to render an error page or redirect to a specific URL
        return res.render('error-page', { error });
    }

    return res.redirect('/admin/assessors/manage/' + user.fields.ID);
};

// post_change_assessor_email
exports.post_change_assessor_email = async function (req, res) {
    const { email } = req.body;
    const id = req.params.id;
    const subView = 'change-email'

    //console.log('post_change_assessor_email');

    var err = false;
    var errors = {};

    // for any that are missing, return an error and the missing form fields

    if (!email) {

        err = true;
        errors.email = "Email is required";
    } else if (!validateEmail(email)) {
        err = true;
        errors.email = "Email address isn't in the correct format";
    }


    if (err) {
        const [assessorx] = await axios.all([getAssessorByID(id)]);
        const assessor = assessorx[0]

        return res.render('admin/assessors/manage', { err, errors, subView, assessor })
    }

    try {
        const [users] = await axios.all([getUserByID(id)]);

        //console.log(users);

        if (users.length === 1) {
            var user = users[0];

            //console.log('user');
            //console.log(user);

            // update the user
            await base('Users').update([
                {
                    id: user.id,
                    fields: {
                        EmailAddress: email
                    },
                },
            ]);

            return res.redirect('/admin/assessors/manage/' + user.fields.ID);
        }
    } catch (error) {
        console.error("Error:", error);
        // Handle the error, you might want to render an error page or redirect to a specific URL
        return res.render('error-page', { error });
    }

    return res.redirect('/admin/assessors/manage/' + user.fields.ID);
};


exports.post_add_administrator = async function (req, res) {

    // check if post has all required fields
    // var firstName = req.body.firstName
    // var lastName = req.body.lastName
    // var email = req.body.email

    const { firstName, lastName, adminemail } = req.body;

    var err = false;
    var errors = {}

    // for any that are missing, return an error and the missing form fields

    if (!firstName) {
        err = true;
        errors.firstName = "First name is required";
    }

    if (!lastName) {
        err = true;
        errors.lastName = "Last name is required";
    }

    if (!adminemail) {

        err = true;
        errors.adminemail = "Email is required";
    } else if (!validateEmail(adminemail)) {
        err = true;
        errors.adminemail = "Email address isn't in the correct format";
    }

    if (err) {
        return res.render('admin/administrators/add', { err, errors })
    }

    // If all ok, check if they already have an account - use email only. 

    // Get account for email address

    try {
        const [users, administrators] = await axios.all([getUser(adminemail), getAdministratorsByEmail(adminemail)]);

        if (users.length > 0) {
            if (administrators.length === 0) {
                const user = users[0];
                await addAdministrator(user);
            }
        } else {
            // Create the user
            const newUser = await addUser(firstName, lastName, email, "New", "Created from add adminiistrator process", "Department for Education");



            // Add the new user to the assessors table
            await addAdministrator(newUser[0]);
        }

        // Clear session values out
        req.session.data['firstName'] = "";
        req.session.data['lastName'] = "";
        req.session.data['email'] = "";


        return res.redirect('/admin/administrators');
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Internal Server Error");
    }
}


// post_manage_administrator

exports.post_manage_administrator = async function (req, res) {

    // Get the UID from the post

    const { firstName, lastName, email, uid } = req.body;

    var err = false;
    var errors = {}

    // for any that are missing, return an error and the missing form fields

    if (!firstName) {
        err = true;
        errors.firstName = "First name is required";
    }

    if (!lastName) {
        err = true;
        errors.lastName = "Last name is required";
    }

    if (!email) {

        err = true;
        errors.email = "Email is required";
    } else if (!validateEmail(email)) {
        err = true;
        errors.email = "Email address isn't in the correct format";
    }

    const [administrator] = await axios.all([GetAdministratorByUID(uid)]);

    if (err) {
       
        return res.render('admin/administrator/manage', { err, errors, administrator })
    }

    //console.log('admin')
    //console.log(administrator.fields.Name)

    try {
        const [user] = await axios.all([getUserByUID(administrator.fields.Name[0])]);

        //console.log(user);

      
            //console.log('user');
            //console.log(user);

            // update the user
            await base('Users').update([
                {
                    id: user.id,
                    fields: {
                        FirstName: firstName,
                        LastName: lastName,
                        EmailAddress: email
                    },
                },
            ]);

            return res.redirect('/admin/administrators');
        
    } catch (error) {
        console.error("Error:", error);
        // Handle the error, you might want to render an error page or redirect to a specific URL
        return res.render('error-page', { error });
    }

    return res.redirect('/admin/administrators');


}

exports.post_remove_administrator = async function (req, res) {

    // Get the UID from the post

    const {  uid } = req.body;

    const [administrator] = await axios.all([GetAdministratorByUID(uid)]);

   
    try {
       
            // update the user
            await base('Administrators').update([
                {
                    id: administrator.id,
                    fields: {
                        Status: 'Disabled'
                    },
                },
            ]);

            return res.redirect('/admin/administrators');
        
    } catch (error) {
        console.error("Error:", error);
        // Handle the error, you might want to render an error page or redirect to a specific URL
        return res.render('error-page', { error });
    }



}
