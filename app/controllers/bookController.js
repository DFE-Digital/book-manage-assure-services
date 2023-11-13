// Global
var Airtable = require('airtable')
var axios = require('axios')
var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE,
)

var urlencode = require('urlencode')

const GetRequestsByType = require('../data/airtable/getRequestsByType')
const GetRequestByID = require('../data/airtable/getRequestByID')
const DeleteRequest = require('../data/airtable/deleteRequest')

var NotifyClient = require('notifications-node-client').NotifyClient,
    notify = new NotifyClient(process.env.NOTIFYAPIKEY)

    function getMonday(d) {
        d = new Date(d)
        var day = d.getDay(),
          diff = d.getDate() - day + (day == 0 ? -6 : 1)
        return new Date(d.setDate(diff))
      }
      
      function addWeeksToDate(date, weeks) {
        console.log('Adding ' + weeks + ' weeks to ' + date)
        console.log(date)
        date.setDate(date.getDate() + 7 * weeks)
        return date
      }
      
      function wait(waitTime) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(true)
          }, waitTime)
        })
      }

exports.get_start = function (req, res) {

    req.session.data = {}

    axios.all([GetRequestsByType('Draft')]).then(
        axios.spread((draft_records) => {
            return res.render('book/index', { draft_records })
        }),
    )
}

// Get a draft
exports.get_draft = function (req, res) {
    var draftID = req.params.id;

    if (!req.session.data) {
        req.session.data = {};
    }

    axios.all([GetRequestByID(draftID)]).then(
        axios.spread((request) => {
            req.session.data['draftID'] = request.id;
            req.session.data['phase'] = request.fields.Phase;
            req.session.data['type'] = request.fields.Type;

            return res.redirect('/book/request/tasks');
        }),
    ).catch((error) => {
        console.error("Error in axios request:", error);
    });
}

// get phase
exports.get_tasks = function (req, res) {
    var draftID = req.session.data['draftID']

    if (draftID) {
      axios.all([GetRequestByID(draftID)]).then(
        axios.spread((request) => {
          req.session.data['draftID'] = request.id
          return res.render('book/request/tasks', { request })
        }),
      )
    } else {
      return res.redirect('/book')
    }
  }

// get phase
exports.get_phase = function (req, res) {
    return res.render('book/request/phase')
}

// get type
exports.get_type = function (req, res) {
    return res.render('book/request/type')
}

// get trandsactions
exports.get_transactions = function (req, res) {
    return res.render('book/request/transactions')
}

// get name
exports.get_name = function (req, res) {
    var draftID = req.session.data['draftID']

    axios.all([GetRequestByID(draftID)]).then(
        axios.spread((request) => {
            return res.render('book/request/name', { request })
        }),
    )
}

// get description
exports.get_description = function (req, res) {

    var draftID = req.session.data['draftID']

    axios.all([GetRequestByID(draftID)]).then(
        axios.spread((request) => {
            return res.render('book/request/description', { request })
        }),
    )

}

// get description
exports.get_code = function (req, res) {

    var draftID = req.session.data['draftID']

    axios.all([GetRequestByID(draftID)]).then(
        axios.spread((request) => {
            return res.render('book/request/code', { request })
        }),
    )

}

// get start-date
exports.get_startdate = function (req, res) {
    var draftID = req.session.data['draftID']

    axios.all([GetRequestByID(draftID)]).then(
      axios.spread((request) => {
        console.log(request)
  
        var day, month, year
  
        // Does a start date exist?
        if (request.fields.StartDate) {
          day = request.fields.StartDate.split('-')[2]
          month = request.fields.StartDate.split('-')[1]
          year = request.fields.StartDate.split('-')[0]
        }
  
        return res.render('book/request/start-date', {
          request,
          day,
          month,
          year,
        })
      }),
    )
  }

  // Get end date
exports.get_enddate = function (req, res) {
    var draftID = req.session.data['draftID']
  
    axios.all([GetRequestByID(draftID)]).then(
      axios.spread((request) => {
        console.log(request)
  
        var day, month, year
  
        // Does an end date exist?
        if (request.fields.EndDate) {
          day = request.fields.EndDate.split('-')[2]
          month = request.fields.EndDate.split('-')[1]
          year = request.fields.EndDate.split('-')[0]
        }
  
        var endDateYN = req.session.data['disco-end']
  
        if (request.fields.EndDateYN) {
          endDateYN = request.fields.EndDateYN
        }
  
        return res.render('book/request/end-date', {
          request,
          day,
          month,
          year,
          endDateYN,
        })
      }),
    )
  }
  
  // Get dates
exports.get_dates = function (req, res) {
    var draftID = req.session.data['draftID']
  
    axios.all([GetRequestByID(draftID)]).then(
      axios.spread((request) => {
        var endDateEstimated = new Date(request.fields.EndDate)
  
        // What are the weeks 5-10 from now?
  
        var weeks5 = getMonday(addWeeksToDate(new Date(), 5).toISOString())
        var weeks6 = getMonday(addWeeksToDate(new Date(), 6).toISOString())
        var weeks7 = getMonday(addWeeksToDate(new Date(), 7).toISOString())
        var weeks8 = getMonday(addWeeksToDate(new Date(), 8).toISOString())
        var weeks9 = getMonday(addWeeksToDate(new Date(), 9).toISOString())
        var weeks10 = getMonday(addWeeksToDate(new Date(), 10).toISOString())
  
        let dates = []
  
        if (request.fields.EndDateYN === 'No') {
          dates.push({
            week: weeks5.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
            }),
          })
          dates.push({
            week: weeks6.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
            }),
          })
          dates.push({
            week: weeks7.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
            }),
          })
          dates.push({
            week: weeks8.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
            }),
          })
          dates.push({
            week: weeks9.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
            }),
          })
          dates.push({
            week: weeks10.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
            }),
          })
        } else {
          if (endDateEstimated >= weeks5) {
            dates.push({
              week: weeks5.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
              }),
            })
          }
          if (endDateEstimated >= weeks6) {
            dates.push({
              week: weeks6.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
              }),
            })
          }
          if (endDateEstimated >= weeks7) {
            dates.push({
              week: weeks7.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
              }),
            })
          }
          if (endDateEstimated >= weeks8) {
            dates.push({
              week: weeks8.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
              }),
            })
          }
          if (endDateEstimated >= weeks9) {
            dates.push({
              week: weeks9.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
              }),
            })
          }
          if (endDateEstimated >= weeks10) {
            dates.push({
              week: weeks10.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
              }),
            })
          }
        }
  
        req.session.data['dates'] = dates
  
        if (dates.length) {
          req.session.data['hasdates'] = 'yes'
        } else {
          req.session.data['hasdates'] = 'no'
        }
  
        console.log(dates)
  
        res.render('book/request/dates', { request, dates })
      }),
    )
  }

// Get summary
exports.get_portfolio = function (req, res) {
    var draftID = req.session.data['draftID']
  
    axios.all([GetRequestByID(draftID)]).then(
      axios.spread((request) => {
        return res.render('book/request/portfolio', { request })
      }),
    )
  }

// Get Deputy director
exports.get_dd = function (req, res) {
    var draftID = req.session.data['draftID']
  
    axios.all([GetRequestByID(draftID)]).then(
      axios.spread((request) => {
        var dd
  
        if (!request.fields.DeputyDirector) {
          dd = req.session.data['dd']
        } else {
          dd = request.fields.DeputyDirector
        }
  
        return res.render('book/request/dd', { request, dd })
      }),
    )
  }


// Get SRO
exports.get_sro = function (req, res) {
    var draftID = req.session.data['draftID']
  
    axios.all([GetRequestByID(draftID)]).then(
      axios.spread((request) => {
        var sroName
  
        if (request.fields.SROSameAsDD === 'Yes') {
          sroName = request.fields.DeputyDirector
        } else {
          sroName = request.fields.SROName
        }
  
        return res.render('book/request/sro', { request, sroName })
      }),
    )
  }
  
  // Get Product manager
  exports.get_product = function (req, res) {
    var draftID = req.session.data['draftID']
  
    axios.all([GetRequestByID(draftID)]).then(
      axios.spread((request) => {
        return res.render('book/request/product', { request })
      }),
    )
  }
  
  // Get Delivery manager
  exports.get_delivery = function (req, res) {
    var draftID = req.session.data['draftID']
  
    axios.all([GetRequestByID(draftID)]).then(
      axios.spread((request) => {
        return res.render('book/request/delivery', { request })
      }),
    )
  }

  exports.get_complete = function (req, res) {
    var draftID = req.session.data['draftID']
  
    axios.all([GetRequestByID(draftID)]).then(
      axios.spread((request) => {
        return res.render('book/request/complete', { request })
      }),
    )
  }

  
  exports.get_confirmdelete = function (req, res) {
    var draftID = req.session.data['draftID']
  
    axios.all([GetRequestByID(draftID)]).then(
      axios.spread((request) => {
        return res.render('book/request/confirm-delete', { request })
      }),
    )
  }

















// Post phase
exports.post_phase = function (req, res) {

    req.session.data['type'] === undefined;
    return res.redirect('/book/request/type')
}

// Post type
exports.post_type = function (req, res) {

    if (req.session.data['type'] === "Service assessment") {
        return res.redirect('/book/request/transactions')
    }
    else {
        return res.redirect('/book/request/name')
    }
}

// Post phase
exports.post_transactions = function (req, res) {
    return res.redirect('/book/request/name')
}

// Post phase
exports.post_name = function (req, res) {

    var draftID = req.session.data['draftID']
    var name = req.body.title

    // If no title, return an error
    if (!name) {
        var err = true
        return res.render('book/request/name', { err })
    }

    // If we have a draftID then this is already in the DB so lets update the entry
    // Otherwise, create a new draft
    if (draftID) {
        // Update the draft
        base('Reviews').update(
            [
                {
                    id: draftID,
                    fields: {
                        Name: name,
                    },
                },
            ],
            function (err, records) {
                if (err) {
                    console.error(err)
                    return
                }
                records.forEach(function (record) {
                    return res.redirect('/book/request/description/')
                })
            },
        )
    } else {
        // Create a draft
        base('Reviews').create(
            [
                {
                    fields: {
                        Name: name,
                        Status: 'Draft',
                        RequestedBy: process.env.usr,
                        ReportStatus: 'Enabled',
                        Type: 'Peer Review',
                        Phase: 'Discovery',
                    },
                },
            ],
            function (err, records) {
                if (err) {
                    console.error(err)
                    return
                }
                records.forEach(function (record) {
                    // Save the ID to the session so we know it's a draft
                    req.session.data['draftID'] = record.id

                    return res.redirect('/book/request/description/')
                })
            },
        )
    }
}

// Post description
exports.post_description = function (req, res) {
    var draftID = req.session.data['draftID']
    var description = req.body.purpose

    // If no title, return an error
    if (!description) {
        var err = true
        return res.render('book/request/description', { err })
    }

    // If we have a draftID then this is already in the DB so lets update the entry
    // Otherwise, create a new draft
    if (draftID) {
        // Update the draft
        base('Reviews').update(
            [
                {
                    id: draftID,
                    fields: {
                        Description: description,
                    },
                },
            ],
            function (err, records) {
                if (err) {
                    console.error(err)
                    return
                }
                records.forEach(function (record) {
                    return res.redirect('/book/request/code/')
                })
            },
        )
    } else {
        return res.redirect('/book')
    }
}

// Post code
exports.post_code = function (req, res) {
    var draftID = req.session.data['draftID']
  var codeyn = req.body.projcode
  var code = req.body.projcodenumber


  if (!codeyn) {
    var err = true
    return res.render('book/request/codex', { err })
  } else if (codeyn === 'Yes' && !code) {
    var errcode = true
    return res.render('book/request/code', { errcode })
  }
else{



  // If we have a draftID then this is already in the DB so lets update the entry
  // Otherwise, create a new draft
  if (draftID) {
    // Update the draft
    base('Reviews').update(
      [
        {
          id: draftID,
          fields: {
            ProjectCodeYN: codeyn,
            ProjectCode: code,
          },
        },
      ],
      function (err, records) {
        if (err) {
          console.error(err)
          return
        }
        records.forEach(function (record) {
          return res.redirect('/book/request/start-date/')
        })
      },
    )
  } else {
    return res.redirect('/book')
  }
}
}

// Post the start date
exports.post_startdate = function (req, res) {
    var draftID = req.session.data['draftID']
  
    // If no start date
    if (
      !req.session.data['disco-start-day'] ||
      !req.session.data['disco-start-month'] ||
      !req.session.data['disco-start-year']
    ) {
      var err = true
      return res.render('book/request/start-date', { err })
    }
  
    var startDate = null
  
    // US Format for Airtable
    startDate =
      req.session.data['disco-start-month'] +
      '/' +
      req.session.data['disco-start-day'] +
      '/' +
      req.session.data['disco-start-year']
  
    // If we have a draftID then this is already in the DB so lets update the entry
    // Otherwise, create a new draft
    if (draftID) {
      // Update the draft
      base('Reviews').update(
        [
          {
            id: draftID,
            fields: {
              StartDate: startDate,
            },
          },
        ],
        function (err, records) {
          if (err) {
            console.error(err)
            return
          }
          records.forEach(function (record) {
            return res.redirect('/book/request/end-date')
          })
        },
      )
    } else {
      return res.redirect('/book')
    }
  }


// Post the end date
exports.post_enddate = function (req, res) {
    var draftID = req.session.data['draftID']
  
    var endDateYN = req.session.data['disco-end']
  
    if (!endDateYN) {
      var err = true
      return res.render('book/request/end-date', { err, endDateYN })
    } else if (
      endDateYN === 'Yes' &&
      (!req.session.data['disco-end-day'] ||
        !req.session.data['disco-end-month'] ||
        !req.session.data['disco-end-year'])
    ) {
      var errcode = true
      return res.render('book/request/end-date', { errcode, endDateYN })
    }
  
    var endDate = null
  
    if (endDateYN === 'Yes') {
      // US Format for Airtable
      endDate =
        req.session.data['disco-end-month'] +
        '/' +
        req.session.data['disco-end-day'] +
        '/' +
        req.session.data['disco-end-year']
    }
  
    // If we have a draftID then this is already in the DB so lets update the entry
    // Otherwise, create a new draft
    if (draftID) {
      // Update the draft
      base('Reviews').update(
        [
          {
            id: draftID,
            fields: {
              EndDate: endDate,
              EndDateYN: endDateYN,
            },
          },
        ],
        function (err, records) {
          if (err) {
            console.error(err)
            return
          }
          records.forEach(function (record) {
            return res.redirect('/book/request/dates')
          })
        },
      )
    } else {
      return res.redirect('/book/')
    }
  }


// Post dates
exports.post_dates = function (req, res) {
    var draftID = req.session.data['draftID']
  
    var dates = req.session.data['dates']
    var err = false
  
    if (
      req.session.data['hasdates'] === 'yes' &&
      !req.session.data['reviewWeek']
    ) {
      err = true
      return res.render('book/request/dates', { dates, err })
    } else {
      var requestedWeeks = ''
  
      requestedWeeks = req.session.data['reviewWeek']
        ? req.session.data['reviewWeek'].toString()
        : 'None available as end date is within next 5 weeks'
  
      var draftID = req.session.data['draftID']
  
      base('Reviews').update(
        [
          {
            id: draftID,
            fields: {
              RequestedWeeks: requestedWeeks,
            },
          },
        ],
        function (err, records) {
          if (err) {
            console.error(err)
            return
          }
          records.forEach(function (record) {
            console.log(record.fields.ID)
  
            return res.redirect('/book/request/portfolio')
          })
        },
      )
    }
  }
  
  // Post the summary
exports.post_portfolio = function (req, res) {
    var portfolio = req.body.portfolio
  
    if (!portfolio) {
      var err = true
      return res.render('book/request/portfolio', { err })
    }
  
    var draftID = req.session.data['draftID']
  
    base('Reviews').update(
      [
        {
          id: draftID,
          fields: {
            Portfolio: portfolio,
          },
        },
      ],
      { typecast: true },
      function (err, records) {
        if (err) {
          console.error(err)
          return
        }
        records.forEach(function (record) {
          return res.redirect('/book/request/dd')
        })
      },
    )
  }

  // Post the deputy director
exports.post_dd = function (req, res) {
    var dd = req.body.dd
    var DeputyDirectorName = dd
  
    console.log(req.session)
  
    if (!dd) {
      var err = true
      return res.render('book/request/dd', { err, DeputyDirectorName })
    }
  
    var draftID = req.session.data['draftID']
  
    base('Reviews').update(
      [
        {
          id: draftID,
          fields: {
            DeputyDirector: dd,
          },
        },
      ],
      function (err, records) {
        if (err) {
          console.error(err)
          return
        }
        records.forEach(function (record) {
          return res.redirect('/book/request/sro')
        })
      },
    )
  }


// Post the SRO
exports.post_sro = function (req, res) {
    var sroYesNo = req.session.data['sro']

    var draftID = req.session.data['draftID']
  

  
    if (!sroYesNo) {
      var err = true
      return res.render('book/request/sro', { err })
    } else if (sroYesNo === 'No' && !req.session.data['sro-name']) {
      var errcode = true

      axios.all([GetRequestByID(draftID)]).then(
        axios.spread((request) => {
          var sroName = request.fields.SROName
          
          return res.render('book/request/sro', { request, sroName, errcode })
        }),
      )

    
    } else {
      var draftID = req.session.data['draftID']
  
      var sroName = req.session.data['sro-name']
  
      if (sroYesNo === 'Yes') {
        sroName = null
      }
  
      base('Reviews').update(
        [
          {
            id: draftID,
            fields: {
              SROName: sroName,
              SROSameAsDD: sroYesNo,
            },
          },
        ],
        { typecast: true },
        function (err, records) {
          if (err) {
            console.error(err)
            return
          }
          records.forEach(function (record) {
            return res.redirect('/book/request/product')
          })
        },
      )
    }
  }
  
  // Post the product manager
  exports.post_product = function (req, res) {
    var pm = req.body.pm
    var pmName = req.session.data['pm-name']
  
    if (!pm) {
      var err = true
      return res.render('book/request/product', { err })
    } else if (pm === 'Yes' && !pmName) {
      var errcode = true
      return res.render('book/request/product', { errcode })
    } else {
      var draftID = req.session.data['draftID']
  
      base('Reviews').update(
        [
          {
            id: draftID,
            fields: {
              ProductManagerName: pmName,
              ProductManagerYN: pm,
            },
          },
        ],
        { typecast: true },
        function (err, records) {
          if (err) {
            console.error(err)
            return
          }
          records.forEach(function (record) {
            return res.redirect('/book/request/delivery')
          })
        },
      )
    }
  }
  
  // Post the delivery manager
  exports.post_delivery = function (req, res) {
    var dm = req.body.dm
    var dmName = req.session.data['dm-name']
  
    if (!dm) {
      var err = true
      return res.render('book/request/delivery', { err })
    } else if (dm === 'Yes' && !dmName) {
      var errcode = true
      return res.render('book/request/delivery', { errcode })
    } else {
      var draftID = req.session.data['draftID']
  
      base('Reviews').update(
        [
          {
            id: draftID,
            fields: {
              DeliveryManagerName: dmName,
              DeliveryManagerYN: dm,
            },
          },
        ],
        { typecast: true },
        function (err, records) {
          if (err) {
            console.error(err)
            return
          }
          records.forEach(function (record) {
            return res.redirect('/book/request/tasks')
          })
        },
      )
    }
  }
  
  exports.post_tasks = function (req, res) {
    var draftID = req.session.data['draftID']

    base('Reviews').update(
      [
        {
          id: draftID,
          fields: {
            Status: 'New',
            RequestedBy: 'Callum Mckay'
          },
        },
      ],
      { typecast: true },
      function (err, records) {
        if (err) {
          console.error(err)
          return
        }
        records.forEach(function (record) {
          console.log(record)
  
          notify
            .sendEmail(process.env.SATTemplateId, process.env.recipient, {
              personalisation: {
                nameOfDiscovery: record.fields.Name,
                summary: record.fields.Description,
                id: record.fields.ID,
                serviceURL: process.env.serviceURL,
              },
            })
            .then((response) =>
              console.log('Notification: ' + response.statusText),
            )
            .catch((err) => console.error(err))
        })
      },
    )
    return res.redirect('/book/request/complete')
  }
  
  exports.post_confirmdelete = async function (req, res) {
    return res.redirect('/book/request/confirm-delete/'+req.params.id)
  }

exports.post_delete = async function (req, res) {
  var draftID = req.params.id

  DeleteRequest(draftID)

  await wait(1500)

  return res.redirect('/book/request/deleted')
}


