/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/unique/email              ->  index
 * POST    /api/unique/email              ->  create
 * GET     /api/unique/email/:id          ->  show
 * PUT     /api/unique/email/:id          ->  update
 * DELETE  /api/unique/email/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import UniqueEmail from './email.model';
var Query = require('../../../services/query');
import Login from '../../login/login.model';

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

// Gets a list of UniqueEmails
export function index(req, res) {
  return UniqueEmail.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single UniqueEmail from the DB
export function show(req, res) {
  return UniqueEmail.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new UniqueEmail in the DB
export function create(req, res) {
  if (req.body.email){
    Query.query(Login,{email:req.body.email})
      .then(result =>{
        // console.log(result);
        // console.log('getting result');
        // if (err){
        //   return res.json({
        //     status: 0,
        //     message: 'Something wrong'
        //   })
        // }
        if (result){
          return res.json({
            status: 1
          })
        }else{
            return res.json({
              status: 0
            })
        }
      }, err =>{
        console.log(err);
      })
  }else{
    res.status(400)
    return res.json({
      message: 'Email not provided'
    })
  }
  // return UniqueEmail.create(req.body)
  //   .then(respondWithResult(res, 201))
  //   .catch(handleError(res));
}

// Updates an existing UniqueEmail in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return UniqueEmail.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a UniqueEmail from the DB
export function destroy(req, res) {
  return UniqueEmail.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
