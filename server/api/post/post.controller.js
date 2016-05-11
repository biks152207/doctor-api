/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/post              ->  index
 * POST    /api/post              ->  create
 * GET     /api/post/:id          ->  show
 * PUT     /api/post/:id          ->  update
 * DELETE  /api/post/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Post from './post.model';

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

// Gets a list of Posts
export function index(req, res) {
  Post.find({}).populate('userId').sort({created_at:-1}).exec(function(err,data){
    if (err){
      res.status(400);
      return res.json({
        success: 0,
        message: 'Something went wrong'
      })
    }else{
      res.status(200);
      return res.json({
        success: 1,
        data: data
      })
    }
  })
}

// Gets a single Post from the DB
export function show(req, res) {
  return Post.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Post in the DB
export function create(req, res) {
  if (req.body.post && req.body.userId){
    var newPost = new Post(
      req.body
    )
    newPost.save(function(err, post){
      if (err){
        res.status(400);
        return res.json({
          message: 'Something went wrong',
          success: 0
        });
      }else{
        res.status(200);
        return res.json({
          message: 'Successfully created',
          success: 1,
          data: post
        })
      }
    })
  }else{
    res.status(400);
    return res.json({
      message: 'Please enter your post',
      success: 0
    })
  }
}

// Updates an existing Post in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Post.findById(req.params.id).exec(function(err, data){
    if (err){
      res.status(400);
      return res.json({
        message: 'Something went wrong',
        success: 0
      });
    }
    if (data){
      data.post = req.body.post;
      data.save(function(err, result){
        if (err){
          res.status(400);
          return res.json({
            message: 'Cannot save',
            success: 0
          });
        }else{
          return res.json({
            message: 'Successfully updated',
            success: 1,
            data: result
          })
        }
      })
    }else{

    }
  })
}

// Deletes a Post from the DB
export function destroy(req, res) {
  return Post.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
