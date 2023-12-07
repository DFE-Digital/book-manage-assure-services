const express = require('express')
const router = express.Router()
const axios = require('axios')
var Airtable = require('airtable')
var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE,
)

var public_controller = require('./controllers/publicController.js')
var book_controller = require('./controllers/bookController.js')
var assess_controller = require('./controllers/assessController.js')
var manage_controller = require('./controllers/manageController.js')
var actionplan_controller = require('./controllers/actionPlanController.js')
var assessments_controller = require('./controllers/assessmentsController.js')
var admin_controller = require('./controllers/adminController.js')
var api_controller = require('./controllers/apiController.js')

var reports_controller = require('./controllers/reportsController.js')
const getUserByUID = require('./data/airtable/users/getUserByUID');

async function getUser(email) {
    return await base('Users')
        .select({ maxRecords: 1, filterByFormula: `{EmailAddress} = "${email}"` })
        .firstPage()
}


async function authenticate(req, res, next) {
    try {
        if (process.env.NODE_ENV === 'development') {
            await authenticateDevUser(req, res, next);
        } else {
            authenticateProdUser(req, res, next);
        }
    } catch (error) {
        console.error('Error authenticating user:', error);
        return res.status(500).send('Internal server error');
    }
}

async function authenticateDevUser(req, res, next) {
    const userID = process.env.devuser;

    try {
        const [user] = await axios.all([getUser(userID)]);

        if (!req.session.data) {
            req.session.data = {};
        }

        req.session.data.user = {
            email: user[0].fields.EmailAddress,
            firstName: user[0].fields.FirstName,
            lastName: user[0].fields.LastName,
            isLeadAdmin: Boolean(user[0].fields.LeadForDepartment),
            isAdmin: '',
            uID: user[0].id,
        };

        logSessionData(req.session);

        next();
    } catch (error) {
        console.error('Error authenticating development user:', error);
        return res.status(500).send('Internal server error');
    }
}

function authenticateProdUser(req, res, next) {
    // Check if the user is authenticated
    if (req.session.data && req.session.data.user) {
        // User is authenticated
        next();
    } else {
        // User is not authenticated
        res.redirect('/sign-in');
    }
}



function logSessionData(session) {
    //console.log('authenticate  ---------- Start');
    //console.log(session);
    //console.log('authenticate  ---------- End');
}




// Public pages

router.get("/sign-in", public_controller.get_sign_in);
router.post("/public/sign-in", public_controller.post_sign_in);
router.get("/check-email", public_controller.get_check_email);
router.get("/auth/token/:token", public_controller.get_check_token);
router.get("/sign-out", public_controller.get_sign_out);

router.get("/features", public_controller.get_features);
router.get("/roadmap", public_controller.get_roadmap);
router.get("/contact", public_controller.get_contact);




// Book
router.get("/book", authenticate, book_controller.get_start);
router.get("/book/draft/:id", authenticate, book_controller.get_draft);
router.get("/book/request/phase", authenticate, book_controller.get_phase);
// router.get("/book/request/type", authenticate, book_controller.get_type);
router.get("/book/request/transactions", authenticate, book_controller.get_transactions);
router.get("/book/request/name", authenticate, book_controller.get_name);
router.get("/book/request/description", authenticate, book_controller.get_description);
router.get("/book/request/code", authenticate, book_controller.get_code);
router.get("/book/request/start-date", authenticate, book_controller.get_startdate);
router.get("/book/request/end-date", authenticate, book_controller.get_enddate);
router.get("/book/request/dates", authenticate, book_controller.get_dates);
router.get("/book/request/portfolio", authenticate, book_controller.get_portfolio);
router.get("/book/request/dd/", authenticate, book_controller.get_dd);
router.get("/book/request/sro/", authenticate, book_controller.get_sro);
router.get("/book/request/product/", authenticate, book_controller.get_product);
router.get("/book/request/delivery/", authenticate, book_controller.get_delivery);
router.get("/book/request/complete/", authenticate, book_controller.get_complete);
router.get("/book/request/confirm-delete/:id", authenticate, book_controller.get_confirmdelete);

router.get("/book/request/tasks", authenticate, book_controller.get_tasks);


router.post("/book/post/phase", authenticate, book_controller.post_phase);
// router.post("/book/post/type", authenticate, book_controller.post_type);
router.post("/book/post/transactions", authenticate, book_controller.post_transactions);
router.post("/book/post/name", authenticate, book_controller.post_name);
router.post("/book/post/description", authenticate, book_controller.post_description);
router.post("/book/post/code", authenticate, book_controller.post_code);
router.post("/book/post/start-date", authenticate, book_controller.post_startdate);
router.post("/book/post/end-date", authenticate, book_controller.post_enddate);
router.post("/book/post/dates", authenticate, book_controller.post_dates);
router.post("/book/post/portfolio", authenticate, book_controller.post_portfolio);
router.post("/book/post/dd/", authenticate, book_controller.post_dd);
router.post("/book/post/sro/", authenticate, book_controller.post_sro);
router.post("/book/post/product/", authenticate, book_controller.post_product);
router.post("/book/post/delivery/", authenticate, book_controller.post_delivery);

router.post("/book/post/tasks/", authenticate, book_controller.post_tasks);
router.post("/book/post/confirm-delete/:id", authenticate, book_controller.post_confirmdelete);
router.post("/book/post/delete/:id", authenticate, book_controller.post_delete);


// Manage
router.get("/manage", authenticate, manage_controller.get_dashboard);
router.get("/manage/entry/:id", authenticate, manage_controller.get_entry);



//
// Assess
router.get("/assess", authenticate, assess_controller.get_assess);

router.get("/assess/:type", authenticate, assess_controller.get_assessor_dashboard);

// Done well 
router.post("/assess/entry/delete-well/:point/:id/:uid", authenticate, assess_controller.post_deletewell_confirm)
router.get("/assess/entry/:partial/delete-well/:id/:uid", authenticate, assess_controller.get_deletewell);
router.post("/assess/entry/edit-well/:point/:id/:uid", authenticate, assess_controller.post_editwell_confirm)
router.get("/assess/entry/:partial/edit-well/:id/:uid", authenticate, assess_controller.get_editwell);
router.post('/assess/post/done-well/:point/:id', authenticate, assess_controller.post_done_well)

// Improve
router.post("/assess/entry/delete-improve/:point/:id/:uid", authenticate, assess_controller.post_deleteimprove_confirm)
router.get("/assess/entry/:partial/delete-improve/:id/:uid", authenticate, assess_controller.get_deleteimprove);
router.post("/assess/entry/edit-improve/:point/:id/:uid", authenticate, assess_controller.post_editimprove_confirm)
router.get("/assess/entry/:partial/edit-improve/:id/:uid", authenticate, assess_controller.get_editimprove);
router.post('/assess/post/improve/:point/:id', authenticate, assess_controller.post_improve)

// action
///assess/entry/edit-action/3/1/reccKBhspwRluRcnS
router.post("/assess/entry/delete-action/:point/:id/:uid", authenticate, assess_controller.post_deleteaction_confirm)
router.get("/assess/entry/:partial/delete-action/:id/:uid", authenticate, assess_controller.get_deleteaction);
router.post("/assess/entry/edit-action/:point/:id/:uid", authenticate, assess_controller.post_editaction_confirm)
router.get("/assess/entry/:partial/edit-action/:id/:uid", authenticate, assess_controller.get_editaction);
router.post('/assess/post/action/:point/:id', authenticate, assess_controller.post_action)

// Comments
router.post('/assess/post/comment/:id', authenticate, assess_controller.post_comment)
router.get("/assess/entry/delete-comment/:id/:uid", authenticate, assess_controller.get_deletecomment);
router.post("/assess/entry/delete-comment/:id/:uid", authenticate, assess_controller.post_deletecomment_confirm)
router.get("/assess/entry/edit-comment/:id/:uid", authenticate, assess_controller.get_editcomment);
router.post("/assess/entry/edit-comment/:id/:uid", authenticate, assess_controller.post_editcomment_confirm)


router.post('/assess/post/outcome/:id', authenticate, assess_controller.post_overall_outcome)
router.post('/assess/post/outcome/:point/:id', authenticate, assess_controller.post_outcome)

router.post('/assess/entry/submit-report/:id', authenticate, assess_controller.post_submit_report)

router.get("/assess/entry/:id", authenticate, assess_controller.get_entry);
router.get("/assess/entry/:partial/:id", authenticate, assess_controller.get_entry_view);
router.get("/assess/entry/:partial/:sub/:id", authenticate, assess_controller.get_entry_subview);


// Action Plans

router.get("/action-plans", authenticate, actionplan_controller.get_dashboard);
router.get("/action-plans/plan/:id", authenticate, actionplan_controller.get_plan);
router.get("/action-plans/plan/action/:id/:uid", authenticate, actionplan_controller.get_plan_action);




// Assessments
router.get("/assessments", authenticate, assessments_controller.get_assessments);






// Admin
router.get("/admin", authenticate, admin_controller.get_admin);
router.get("/admin/administrators", authenticate, admin_controller.get_admins);
router.get("/admin/assessors", authenticate, admin_controller.get_assessors);
router.get("/admin/assessor/add", authenticate, admin_controller.get_assessor_add);
router.get("/admin/assessors/assessor/:id", authenticate, admin_controller.get_assessor);
router.get("/admin/assessors/training/:id", authenticate, admin_controller.get_assessor_training);
router.get("/admin/assessors/manage/:id", authenticate, admin_controller.get_assessor_manage);
router.get("/admin/assessors/manage/:view/:id", authenticate, admin_controller.get_assessor_manage);


router.get("/admin/administrators/add", authenticate, admin_controller.get_administrators_add);
router.get("/admin/administrators/manage/:id", authenticate, admin_controller.get_administrators_manage);
router.get("/admin/administrators/remove/:id", authenticate, admin_controller.get_administrators_remove);


router.post("/admin/assessors/add", authenticate, api_controller.post_add_assessor);
router.post("/admin/assessors/manage/change-name/:id", authenticate, api_controller.post_change_assessor_name)
router.post("/admin/assessors/manage/change-email/:id", authenticate, api_controller.post_change_assessor_email)



router.post("/admin/administrators/add", authenticate, api_controller.post_add_administrator);
router.post("/admin/administrators/manage", authenticate, api_controller.post_manage_administrator);
router.post("/admin/administrators/remove", authenticate, api_controller.post_remove_administrator);



//Reports
router.get("/reports", authenticate, reports_controller.get_reports);

module.exports = router