/**
 * Filename: helpers.js
 * Description: Tools and functions that are used across the app
 * Author: Andy Jones
 * Date: 2023-12-03
 */


function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }
  
  function addWeeksToDate(date, weeks) {
    //console.log('Adding ' + weeks + ' weeks to ' + date);
    //console.log(date);
    date.setDate(date.getDate() + 7 * weeks);
    return date;
  }
  
  function wait(waitTime) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, waitTime);
    });
  }

  function nameFromEmail(email) {
    // Split the email address on the '@' symbol
    const parts = email.split('@');
  
    // Check if there are two parts (username and domain) in the split result
    if (parts.length === 2) {
      // Extract the username part
      const username = parts[0];
  
      // Remove numbers from the username and capitalize the first letters
      const name = username
        .split('.')
        .map((part) => part.replace(/\d+/g, '').charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
  
      return name;
    } else {
      // Invalid email format
      return null;
    }
  }

    
  module.exports = {
    getMonday,
    addWeeksToDate,
    wait,
    nameFromEmail
  };