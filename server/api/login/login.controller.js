/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/login              ->  index
 * POST    /api/login              ->  create
 * GET     /api/login/:id          ->  show
 * PUT     /api/login/:id          ->  update
 * DELETE  /api/login/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Login from './login.model';
var LoginService = require('../register/register.services');
var token = require('../../services/jwt.services');


function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Logins
export function index(req, res) {
  return Login.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Login from the DB
export function show(req, res) {
  return Login.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Login in the DB
export function create(req, res) {
  if (req.body.email && req.body.password){
  LoginService.query({email: req.body.email})
    .then(result =>{
      if (!result){
        res.status(400);
        return res.json({
          success: 0,
          message: 'User doesn\'t exist'
        })
      }
      var hashPassword = result.password;
      result.comparePassword(req.body.password, function(err, isMatch){
        if(err){
          res.json({success: 0, message: 'Something went wrong' });
        }
        if (isMatch){
          // var token = jwt.sign(result, config.secret, {
          //     expiresIn: '5h'
          // });
          token.jwtSignature(result)
            .then(data =>{
              return res.json({
                success: 1,
                message: 'Successfully logged In',
                data: result,
                token: data
              });
            })
        }else{
          return res.json({
            success: 0,
            message: 'Invalid password or username'
          })
        }
      })
      var hash
      console.log(result);
      console.log('getting result');
    })
  }else{
    res.status(400);
    return res.json({
            success: 0,
            message: 'Enter your email and password'
          })
  }
}

// Updates an existing Login in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Login.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Login from the DB
export function destroy(req, res) {
  return Login.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
