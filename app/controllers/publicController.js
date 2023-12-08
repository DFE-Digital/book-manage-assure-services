var NotifyClient = require('notifications-node-client').NotifyClient
const notify = new NotifyClient(process.env.notifyKey)


const upsertUser = require('../data/airtable/auth/upsertUser.js');
const validateToken = require('../data/airtable/auth/validateToken.js');

// Gets

exports.get_home = function (req, res) {
    return res.redirect('/features')
}

exports.get_features = function (req, res) {
    return res.render('public/features')
}

exports.get_roadmap = function (req, res) {
    return res.render('public/roadmap')
}

exports.get_feature_book = function (req, res) {
    return res.render('public/features/book.html')
}

exports.get_feature_view = function (req, res) {
    var view = req.params.id
    console.log(view)
    return res.render('public/features/'+view+'.html')
}

exports.get_contact = function (req, res) {
    return res.render('public/contact')
}

exports.get_sign_in = function (req, res) {
    return res.render('public/sign-in')
}

exports.get_check_email = function (req, res) {
    return res.render('public/check-email')
}

exports.get_sign_out = function (req, res) {
    req.session.data = {}
    return res.redirect('/sign-in')
}





exports.get_check_token = async function (req, res) {

    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        // Get user data from token
        const userData = await validateToken(token);

        if (!userData) {
            return res.status(400).json({ error: 'Invalid token' });
        }

        // User is valid, set session value
        if(!req.session.data)
        {
            req.session.data = {}
        }
        req.session.data['user'] = userData;
        
         //console.log(userData)

        // User is valid, set auth cookie
        // Set cookie to expire in 1 hour
        const expiry = new Date(Date.now() + 60 * 60 * 1000);

        res.cookie('auth', userData.token, {
            expires: expiry,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });

        // Redirect to app
        res.redirect('/manage');

    } catch (error) {
        console.error('Error in checkToken:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



// Posts

exports.post_sign_in = async function (req, res) {

    try {
        const { email } = req.body;

        if (!email) {
            return res.render('public/sign-in', { error: 'Email is required' });
        }

        // Create or update user and get token
        const userData = await upsertUser(email);

        // TODO - Check if user has been created
        //console.log('post sign');

        if (userData) {

            // Send magic link email
            await sendMagicLinkEmail(userData.token, userData.email);
        }
        else {
            return res.render('sign-in', { error: 'We encountered a problem. We can\'t send an email right now.' });
        }

        // Redirect to check-email page
        res.redirect('/check-email');

    } catch (error) {
        console.error('Error in auth:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


function sendMagicLinkEmail(token, email) {
    notify
        .sendEmail(process.env.magiclinkemailtemplateid, email, {
            personalisation: {
                token: token,
                baseURL: process.env.baseURL
            },
        })
        .then((response) => { return true })
        .catch((err) => console.log(err.response.data))
}


