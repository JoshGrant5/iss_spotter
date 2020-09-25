const request = require('request-promise-native');

const fetchMyIP = () => {
  return request('https://api.ipify.org?format=json'); //* Returns a promise!
};

const fetchCoordsByIP = body => {
  let ip = JSON.parse(body).ip;
  return request(`https://ipvigilante.com/json/${ip}`); //* Returns a promise!
};

const fetchISSFlyOverTimes = body => {
  const { latitude, longitude } = JSON.parse(body).data;
  return request(`http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`); //* Returns a promise!
};

const nextISSTimesForMyLocation = () => {
  return fetchMyIP() //! We know this function also returns a promise, so we can chain onto it!
    .then(fetchCoordsByIP) 
    .then(fetchISSFlyOverTimes)
    .then(data => {
      const { response } = JSON.parse(data);
      let output = '';
        for (timestamp of response) {
          let date = new Date(timestamp.risetime * 1000);
          let dateString = date.toUTCString();
          output += `Next pass at ${dateString} (Pacific Daylight Time) for ${timestamp.duration} seconds!\n`;
        }      
      return output; //! End of the chain - if it breaks anywhere along the way, it will trigger our catch in the function call
    });
};

module.exports = { nextISSTimesForMyLocation };