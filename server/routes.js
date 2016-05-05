/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';
var controller = require('../server/api/register/register.controller');

export default function(app) {
  // Insert routes below
  app.use('/api/unique/email', require('./api/unique/email'));
  app.use('/api/register', require('./api/register'));
  app.use('/api/login', require('./api/login'));
  app.use('/api/things', require('./api/thing'));
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.writeHead(200, {'content-type':'text/html'});
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
  app.post('/reset', controller.reset);
  app.post('/token', controller.token);

}
