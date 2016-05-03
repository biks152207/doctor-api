'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/myapp-dev'
  },
  tokenSecret: 'I am a lover boy',
  gmailUser:'docmailforyou@gmail.com',
  gmailPassword: 'beatles12',

  // Seed database on startup
  seedDB: true

};
