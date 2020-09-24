
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

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes };