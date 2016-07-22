var util = require('util');
var Duplex = require('stream').Duplex;

function WebSocketJSONStream(ws) {
  // Make work with or without 'new'
  if (!(this instanceof WebSocketJSONStream)) return new WebSocketJSONStream(ws);
  Duplex.call(this, {objectMode: true});
  this.ws = ws;
  var self = this;

  ws.on('message', function(msg) { self.push(JSON.parse(msg)); });
  ws.on('close', function() {
    self.push(null); // end readable stream
    self.end(); // end writable stream

    self.emit('close');
    self.emit('end');
  });

  this.on('error', function() { ws.close(); });
  this.on('end', function() { ws.close(); });
};
util.inherits(WebSocketJSONStream, Duplex);

WebSocketJSONStream.prototype._read = function() {};
WebSocketJSONStream.prototype._write = function(msg, encoding, next) {
  this.ws.send(JSON.stringify(msg));
  next();
};

module.exports = WebSocketJSONStream;

