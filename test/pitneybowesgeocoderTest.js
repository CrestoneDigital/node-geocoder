var NodeGeocoder = require('../index.js');

var options = {
    provider: 'pitneybowes',
   
    // Optional depending on the providers
    httpAdapter: 'requestn', // Default
    apiKey: 'b1pLdE0zSWlUNGhHZFJic0dPYkdRb01WcUdOVnE0NFg6S21EdlJMSXRyeGw4TWp4cQ==',
    formatter: null         // 'gpx', 'string', ...
  };
   
  var geocoder = NodeGeocoder(options);
  geocoder.geocode('29 champs elysée paris')
  .then(function(res) {
    console.log(res);
  })
  .catch(function(err) {
    console.log(err);
  });