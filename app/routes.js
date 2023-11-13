const express = require('express')
const router = express.Router()


var book_controller = require('./controllers/bookController.js')
var assess_controller = require('./controllers/assessController.js')
var manage_controller = require('./controllers/manageController.js')


// Book
router.get("/book", book_controller.get_start);
router.get("/book/draft/:id", book_controller.get_draft);
router.get("/book/request/phase", book_controller.get_phase);
router.get("/book/request/type", book_controller.get_type);
router.get("/book/request/transactions", book_controller.get_transactions);
router.get("/book/request/name", book_controller.get_name);
router.get("/book/request/description", book_controller.get_description);
router.get("/book/request/code", book_controller.get_code);
router.get("/book/request/start-date", book_controller.get_startdate);
router.get("/book/request/end-date", book_controller.get_enddate);
router.get("/book/request/dates", book_controller.get_dates);
router.get("/book/request/portfolio", book_controller.get_portfolio);
router.get("/book/request/dd/", book_controller.get_dd);
router.get("/book/request/sro/", book_controller.get_sro);
router.get("/book/request/product/", book_controller.get_product);
router.get("/book/request/delivery/", book_controller.get_delivery);
router.get("/book/request/complete/", book_controller.get_complete);
router.get("/book/request/confirm-delete/:id", book_controller.get_confirmdelete);

router.get("/book/request/tasks", book_controller.get_tasks);


router.post("/book/post/phase", book_controller.post_phase);
router.post("/book/post/type", book_controller.post_type);
router.post("/book/post/transactions", book_controller.post_transactions);
router.post("/book/post/name", book_controller.post_name);
router.post("/book/post/description", book_controller.post_description);
router.post("/book/post/code", book_controller.post_code);
router.post("/book/post/start-date", book_controller.post_startdate);
router.post("/book/post/end-date", book_controller.post_enddate);
router.post("/book/post/dates", book_controller.post_dates);
router.post("/book/post/portfolio", book_controller.post_portfolio);
router.post("/book/post/dd/", book_controller.post_dd);
router.post("/book/post/sro/", book_controller.post_sro);
router.post("/book/post/product/", book_controller.post_product);
router.post("/book/post/delivery/", book_controller.post_delivery);

router.post("/book/post/tasks/", book_controller.post_tasks);
router.post("/book/post/confirm-delete/:id", book_controller.post_confirmdelete);
router.post("/book/post/delete/:id", book_controller.post_delete);


// Manage
router.get("/manage", manage_controller.get_dashboard);




//
// Assess


router.get("/assess/:type", assess_controller.get_assessor_dashboard);

// Done well 
router.post("/assess/entry/delete-well/:point/:id/:uid", assess_controller.post_deletewell_confirm)
router.get("/assess/entry/:partial/delete-well/:id/:uid", assess_controller.get_deletewell);
router.post("/assess/entry/edit-well/:point/:id/:uid", assess_controller.post_editwell_confirm)
router.get("/assess/entry/:partial/edit-well/:id/:uid", assess_controller.get_editwell);
router.post('/assess/post/done-well/:point/:id', assess_controller.post_done_well)

// Improve
router.post("/assess/entry/delete-improve/:point/:id/:uid", assess_controller.post_deleteimprove_confirm)
router.get("/assess/entry/:partial/delete-improve/:id/:uid", assess_controller.get_deleteimprove);
router.post("/assess/entry/edit-improve/:point/:id/:uid", assess_controller.post_editimprove_confirm)
router.get("/assess/entry/:partial/edit-improve/:id/:uid", assess_controller.get_editimprove);
router.post('/assess/post/improve/:point/:id', assess_controller.post_improve)

// action
router.post("/assess/entry/delete-action/:point/:id/:uid", assess_controller.post_deleteaction_confirm)
router.get("/assess/entry/:partial/delete-action/:id/:uid", assess_controller.get_deleteaction);
router.post("/assess/entry/edit-action/:point/:id/:uid", assess_controller.post_editaction_confirm)
router.get("/assess/entry/:partial/edit-action/:id/:uid", assess_controller.get_editaction);
router.post('/assess/post/action/:point/:id', assess_controller.post_action)

router.post('/assess/post/outcome/:id', assess_controller.post_overall_outcome)
router.post('/assess/post/outcome/:point/:id', assess_controller.post_outcome)


router.get("/assess/entry/:id", assess_controller.get_entry);
router.get("/assess/entry/:partial/:id", assess_controller.get_entry_view);
router.get("/assess/entry/:partial/:sub/:id", assess_controller.get_entry_subview);

module.exports = router