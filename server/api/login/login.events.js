/**
 * Login model events
 */

'use strict';

import {EventEmitter} from 'events';
import Login from './login.model';
var LoginEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
LoginEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Login.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    LoginEvents.emit(event + ':' + doc._id, doc);
    LoginEvents.emit(event, doc);
  }
}

export default LoginEvents;
