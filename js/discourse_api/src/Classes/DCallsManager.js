const DCall = require('./DCall');

function DCallsManager(caller) {
  this.caller = caller;
  this.calls = [];
  this.callsEndpointMap = [];
  this.callsQueue = [];
}

DCallsManager.prototype.call = function (name, endpoint, token, body, headers, cache) {
  this.calls[name] = new DCall(this.caller.restUrl, name, endpoint, token, body, headers, cache);
  this.callsEndpointMap[endpoint] = name;
  return this.calls[name];
};

DCallsManager.prototype.queue = function (group, name) {
  if (typeof this.callsQueue[group] === "undefined")
    this.callsQueue[group] = [];

  this.callsQueue[group].push(this.calls[name].get());
};

DCallsManager.prototype.executeQueue = function (group) {
  var queue = this.getQueue(group);
  return DCall.executeQueue(queue);
};

DCallsManager.prototype.getQueue = function (group) {
  return this.callsQueue[group];
};

DCallsManager.prototype.get = function (name) {
  return this.calls[name];
};

DCallsManager.prototype.getByEndpoint = function (endpoint) {
  return this.get(this.callsEndpointMap[endpoint]);
};

/**
 * Exports
 * @type {DCallsManager}
 */
module.exports = DCallsManager;