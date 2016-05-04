/**
 * UniqueEmail model events
 */

'use strict';

import {EventEmitter} from 'events';
import UniqueEmail from './email.model';
var UniqueEmailEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
UniqueEmailEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  UniqueEmail.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    UniqueEmailEvents.emit(event + ':' + doc._id, doc);
    UniqueEmailEvents.emit(event, doc);
  }
}

export default UniqueEmailEvents;
