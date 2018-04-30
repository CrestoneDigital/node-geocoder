var NodeGeocoder = require('../index.js');

var options = {
  provider: 'pitneybowes',

  // Optional depending on the providers
  httpAdapter: 'requestn', // Default
  apiKey: 'b1pLdE0zSWlUNGhHZFJic0dPYkdRb01WcUdOVnE0NFg6S21EdlJMSXRyeGw4TWp4cQ==',
  formatter: null // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);
// geocoder.geocode('29 champs elysée paris')
geocoder.geocode('4750 Walnut St., Boulder CO, 80301')
  .then(function (res) {
    console.log(res);
    console.log('---------');
    geocoder.reverse({
      lat: res[0].latitude,
      lon: res[0].longitude
    })
    .then(function (res) {
      console.log(res);
    })
    .catch(function (err) {
      console.log(err);
    });
  })
  .catch(function (err) {
    console.log(err);
  });