'use strict';

var HttpError = require('../error/httperror.js');
var request = require('request-promise');

/**
* RequestNAdapter
* @param <object>   http      an optional http instance to use
* @param <object>   options   additional options to set on the request
*/
var RequestNAdapter = function(request, options) {
  this.options = options;
};

RequestNAdapter.prototype.supportsHttps = function() {
  return true;
};

/**
* get
* @param <string>   uri      Webservice url
* @param <array>    params   array of query string parameters
* @param <function> callback Callback method
*/
RequestNAdapter.prototype.get = function(url, params, headers, callback) {
  var options = {
    headers: headers,
    json: true,
    method: 'GET',
    qs: params,
    uri: url,
    resolveWithFullResponse: true
  };

  if (this.options) {
    for (var k in this.options) {
      var v = this.options[k];
      if (!v) {
        continue;
      }
      options[k] = v;
    }
  }

  return request(options).then(function handleResponse(response) {
    return response.body;
  })
  .catch(function(error) {
    var _error = error.cause ? error.cause : error;
    throw new HttpError(_error.message, {
      code: _error.code
    });
  })
  .asCallback(callback);
};

/**
* request
* @param <string>   uri      Webservice url
* @param <array>    params   object of query string parameters
* @param <array>    headers   object of query string parameters
* @param <function> callback Callback method
*/
RequestNAdapter.prototype.post = function(url, params, headers, callback) {
  var options = {
    form: params,
    headers: headers,
    // json: true,
    method: 'POST',
    uri: url,
    resolveWithFullResponse: true
  };

  if (this.options) {
    for (var k in this.options) {
      var v = this.options[k];
      if (!v) {
        continue;
      }
      options[k] = v;
    }
  }

  return request(options)
  .then(function handleResponse(response) {
    return response.body;
  })
  .catch(function(error) {
    var _error = error.cause ? error.cause : error;
    throw new HttpError(_error.message, {
      code: _error.code
    });
  })
  .asCallback(callback);
};

module.exports = RequestNAdapter;
