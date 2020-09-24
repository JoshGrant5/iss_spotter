const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }
//   console.log('It worked! Returned IP:' , ip);
// });

// fetchCoordsByIP('207.216.89.139', (error, data) => {
//   if (error) {
//     console.log('Could not find coordinates!', error);
//     return;
//   } else {
//     console.log('It worked! Returned coordinates: ', data);
//   }
// });

fetchISSFlyOverTimes({ latitude: '49.27670', longitude: '-123.13000' }, (error, data) => {
  if (error) {
    console.log('Could not find FlyOverTime!', error);
    return;
  } else {
    console.log('It worked! Returned FlyOverTime: ', data);
  }
});