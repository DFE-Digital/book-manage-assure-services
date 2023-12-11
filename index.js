const express = require('express')
const nunjucks = require('nunjucks')
const axios = require('axios')
var dateFilter = require('nunjucks-date-filter')
var markdown = require('nunjucks-markdown')
var marked = require('marked')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const config = require('./app/config')
const forceHttps = require('express-force-https');
const compression = require('compression');
const session = require('express-session');

const favicon = require('serve-favicon');


require('dotenv').config();

const app = express()
app.use(compression());



app.use(session({
    secret: process.env.sessionKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
}));



const routes = require('./app/routes.js')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(favicon(path.join(__dirname, 'public/assets/images', 'favicon.ico')));

app.set('view engine', 'html')

app.locals.serviceName = config.serviceName
app.locals.useNames = (process.env.useNames === 'true' ? true : false);

var enableDrafts = process.env.ENABLE_DRAFTS;

// Set up Nunjucks as the template engine
var nunjuckEnv = nunjucks.configure(
  [
    'app/views',
    'node_modules/govuk-frontend',
    'node_modules/dfe-frontend-alpha/packages/components',
  ],
  {
    autoescape: true,
    express: app,
  },
)


// Your custom middleware to automatically save form data to session
function saveFormDataToSession(req, res, next) {
  if (req.method === 'POST') {
    req.session.data = {
      ...req.session.data, // Existing session data
      ...req.body // New form data
    };
  }
  next();
}

// Middleware to make formData globally available to all views
function makeFormDataGlobal(req, res, next) {
  // Perform a shallow merge of existing res.locals.data and session data
  res.locals.data = {
    ...res.locals.data, // Existing data
    ...req.session.data // Data from the session
  };
  next();
}


// Register the middlewares globally
app.use(saveFormDataToSession);
app.use(makeFormDataGlobal);

nunjuckEnv.addFilter('split', function(str, seperator) {
  return str.split(seperator);
});

nunjuckEnv.addFilter('array', function (input, key) {
  try {
    const parsedInput = JSON.parse(input);
    return parsedInput[key];
  } catch (error) {
    return input; // Return the original input if parsing fails
  }
});

nunjuckEnv.addFilter('BoolToYesNo', function(str) {
  return str ? 'Yes' : 'No'
})

nunjuckEnv.addFilter('BoolToYesBlank', function(str) {
  return str ? 'Yes' : '-'
})

nunjuckEnv.addFilter('date', dateFilter)

nunjuckEnv.addFilter('BoolToYesNo', function(str) {
  return str ? 'Yes' : 'No'
})

nunjuckEnv.addFilter('BoolToYesBlank', function(str) {
  return str ? 'Yes' : '-'
})

markdown.register(nunjuckEnv, marked.parse)

nunjuckEnv.addFilter('formatNumber', function (number) {
  return number.toLocaleString();
});

nunjuckEnv.addFilter('countByStandard', function (array, point) {
  return array.filter(item => item.fields.Standard == point).length;
});

app.use(forceHttps);

// Set up static file serving for the app's assets
app.use('/assets', express.static('public/assets'))

app.use((req, res, next) => {
  if (req.url.endsWith('/') && req.url.length > 1) {
    const canonicalUrl = req.url.slice(0, -1);
    res.set('Link', `<${canonicalUrl}>; rel="canonical"`);
  }
  next();
});

// Render sitemap.xml in XML format
app.get('/sitemap.xml', (_, res) => {
  res.set({ 'Content-Type': 'application/xml' });
  res.render('sitemap.xml');
});

app.get('/robots.txt', (_, res) => {
  res.set({ 'Content-Type': 'text/plain' });
  res.render('robots.txt');
});


app.get('/downloads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "/app/assets/downloads/" + filename);
  // Set appropriate headers
  //  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  // Send the file
  res.sendFile(filePath);
});

app.get('/accessibility-statement', (_, res) => {
  res.render('accessibility-statement');
});

app.get('/cookie-policy', (_, res) => {
  res.render('accessibility-statement');
});

// Render sitemap.xml in XML format
app.get('/sitemap.xml', (_, res) => {
  res.set({ 'Content-Type': 'application/xml' });
  res.render('sitemap.xml');
});

app.use('/', routes)

app.get('/', function (req, res) {

  return res.render('index', {})

})





app.get(/\.html?$/i, function (req, res) {
  var path = req.path
  var parts = path.split('.')
  parts.pop()
  path = parts.join('.')
  res.redirect(path)
})

app.get(/^([^.]+)$/, function (req, res, next) {
  matchRoutes(req, res, next)
})

// Handle 404 errors
app.use(function (req, res, next) {
  console.log('error 404 for URL:', req.url);
  res.status(404).redirect('/404.html');
});

// Handle 500 errors
app.use(function (err, req, res, next) {
 //console.log('error 500')
 //console.log(err)
  res.status(500).render('error.html')
})

// Try to match a request to a template, for example a request for /test
// would look for /app/views/test.html
// and /app/views/test/index.html

function renderPath(path, res, next) {
  // Try to render the path
  res.render(path, function (error, html) {
    if (!error) {
      // Success - send the response
      res.set({ 'Content-type': 'text/html; charset=utf-8' })
      res.end(html)
      return
    }
    if (!error.message.startsWith('template not found')) {
      // We got an error other than template not found - call next with the error
      next(error)
      return
    }
    if (!path.endsWith('/index')) {
      // Maybe it's a folder - try to render [path]/index.html
      renderPath(path + '/index', res, next)
      return
    }
    // We got template not found both times - call next to trigger the 404 page
    next()
  })
}

matchRoutes = function (req, res, next) {
  var path = req.path

  // Remove the first slash, render won't work with it
  path = path.substr(1)

  // If it's blank, render the root index
  if (path === '') {
    path = 'index'
  }

  renderPath(path, res, next)
}

// Start the server

// Run application on configured port
// if (config.env === 'development') {
//   app.listen(config.port - 50, () => {
//   });
// } else {
//   app.listen(config.port);
// }

app.listen(config.port)
