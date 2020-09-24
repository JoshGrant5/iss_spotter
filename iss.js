// Takes in a callback to pass back an error or the IP string (error, ip)
let request = require('request');

const fetchMyIP = callback => {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      return callback(error, null);
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null);
    } else {
      return callback(null, JSON.parse(body).ip);
    }
  });
};

// Takes in a string IP address and a callback
const fetchCoordsByIP = (ip, callback) => {
  request(`https://ipvigilante.com/json/${ip}`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null);
    } else {
      let coordinates = { latitude: JSON.parse(body).data.latitude, longitude: JSON.parse(body).data.longitude };
      return callback(null, coordinates);
    }
  });
};

// Takes in an object with keys latitude nad longitude, and a callback to pass an error or the array of resulting data
const fetchISSFlyOverTimes = function(coords, callback) {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching FlyOverTime. Response: ${body}`;
      return callback(Error(msg), null);
    } else {
      return callback(null, JSON.parse(body).response);
    }
  });
};

/*
* Orchestrate multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
* Input:
*   - A callback with an error or results.
* Returns (via Callback):
*   - An error, if any (nullable)
*   - The fly-over times as an array (null if error):
*     [ { risetime: <number>, duration: <number> }, ... ]
*/

const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    } else {
      fetchCoordsByIP(ip, (error, data) => {
        if (error) {
          return callback(error, null);
        } else {
          fetchISSFlyOverTimes(data, (error, data) => {
            if (error) {
              return callback(error, null);
            } else { // Convert Unix timestamp to UTC string of date
              let output = '';
              for (timestamp of data) {
                let date = new Date(timestamp.risetime * 1000);
                let dateString = date.toUTCString();
                output += `Next pass at ${dateString} (Pacific Daylight Time) for ${timestamp.duration} seconds!\n`;
              }
              return callback(null, output);
            }
          });
        }
      });
    }
  });
};

module.exports = { nextISSTimesForMyLocation };