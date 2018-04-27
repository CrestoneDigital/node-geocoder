var querystring = require('querystring'),
  util = require('util'),
  AbstractGeocoder = require('./abstractgeocoder');

/**
 * Constructor
 */
var PitneyBowesGeocoder = function PitneyBowesGeocoder(httpAdapter, apiKey) {

  PitneyBowesGeocoder.super_.call(this, httpAdapter);

  if (!apiKey || apiKey == 'undefined') {

    throw new Error(this.constructor.name + ' needs an apiKey');
  }

  this.apiKey = apiKey;
  this._authendpoint = 'https://api.pitneybowes.com/oauth/token';
  this._endpoint = 'https://api.pitneybowes.com/location-intelligence/geocode-service/v1';
};

util.inherits(PitneyBowesGeocoder, AbstractGeocoder);

/**
 * Geocode
 * @param <string>   value    Value to geocode (Address)
 * @param <function> callback Callback method
 */
PitneyBowesGeocoder.prototype._geocode = function (value, callback) {
  var _this = this;
  this.httpAdapter.post(this._authendpoint, {
    'grant_type': 'client_credentials'
  }, {
    'Authorization': 'Basic ' + this.apiKey,
    'Content-Type': 'application/x-www-form-urlencoded'
  }, function (err, result) {
    if (err) {
      return callback(err);
    }
    if (result.error) {
      return callback(new Error('Status is ' + result.error), {raw: result});
    }
    callback(false, result);

    // if(result.access_token) {
    //   this.httpAdapter.post(this._endpoint + '/transient/basic/geocode', {
    //     'mainAddress': value
    //   }, {
    //     'Authorization': 'Bearer ' + result.access_token,
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   }, function (err, result) {

    //   });
    // }


    // var results = [];

    // var locations = result.features;

    // for (var i = 0; i < locations.length; i++) {
    //   results.push(_this._formatResult(locations[i]));
    // }

    // results.raw = result;
    // callback(false, results);
  });

};

PitneyBowesGeocoder.prototype._formatResult = function (result) {
  var accuracy = (result.properties.confidence < 1) ? result.properties.confidence - 0.1 : 1;

  return {
    'latitude': result.geometry.coordinates[1],
    'longitude': result.geometry.coordinates[0],
    'country': result.properties.country,
    'city': result.properties.locality,
    'state': result.properties.region,
    'zipcode': null,
    'streetName': result.properties.street,
    'streetNumber': result.properties.housenumber,
    'countryCode': result.properties.country_a,
    'extra': {
      confidence: accuracy || 0
    }
  };
};

/**
 * Reverse geocoding
 * @param {lat:<number>,lon:<number>}  lat: Latitude, lon: Longitude
 * @param <function> callback Callback method
 */
PitneyBowesGeocoder.prototype._reverse = function (query, callback) {
  var lat = query.lat;
  var lng = query.lon;

  var _this = this;

  this.httpAdapter.get(this._endpoint + '/transient/basic/reverseGeocode', {
    'point.lat': lat,
    'point.lon': lng,
    'api_key': querystring.unescape(this.apiKey)
  }, function (err, result) {
    if (err) {
      return callback(err);
    }

    var results = [];
    var locations = result.results;

    for (var i = 0; i < locations.length; i++) {
      results.push(_this._formatResult(locations[i]));
    }

    results.raw = result;
    callback(false, results);
  });
};

module.exports = PitneyBowesGeocoder;
