/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/Login              ->  index
 * POST    /api/Login              ->  create
 * GET     /api/Login/:id          ->  show
 * PUT     /api/Login/:id          ->  update
 * DELETE  /api/Login/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Login from '../login/login.model';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import config from '../../config/environment';
import async from 'async';

import Transport from 'nodemailer-smtp-transport';
var smtpTransport = nodemailer.createTransport(Transport({
  service: 'gmail',
  auth: {
      user: config.gmailUser, // my mail
      pass: config.gmailPassword
  }
}));
var RegisterService = require('./register.services');
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
  RegisterService.query({email: req.body.email})
    .then(queryObject => {
      if (!queryObject){
        RegisterService.post(req.body)
          .then(result =>{
            token.jwtSignature(result[0])
              .then(token => {
                return res.json({
                  success: 1,
                  message: 'Register success',
                  token: token,
                  data:result[0]
                })
              })
          })
      }else{
        res.status(400);
        return res.json({
          success: 0,
          message: 'User already registered'
        })
      }
    }, error => {
      console.log(error);
    })

  // return Login.create(req.body)
  //   .then(respondWithResult(res, 201))
  //   .catch(handleError(res));
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

export function reset(req, res){
    if (req.body.email){
    async.waterfall(
      [
        function(callback){
          crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            callback(null, token);
          });
        }, function(token, callback){
          Login.findOne({email: req.body.email}, function(err, user){
            if (!user){
              return res.json({
                success: 0,
                message: 'User with the email ' + req.body.email + ' doesn\'t exist'
              })
            }else{
              user.resetPasswordToken = token;
              user.resetPasswordExpires = Date.now() + 3600000; // 1 hr
              user.save(function(err){
                callback(null, token, user);
              })
            }
          })
        }, function(token, user ,done){
           var mailOptions = {
              to: user.email,
              from: config.gmailUser,
              subject: 'Password Reset',
              text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/#/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
              console.log(err);
              if (err){
                done(new Error("Unable to send mail"));
              }else{
                return res.json({
                  success:1,
                  message: 'Successfully sent email for password.Please check your email'
                })
                done(null, 'done');
              }

            });
        }
      ], function(err){
          console.log(err);
        }
    )

  }else{
    return res.json({
      success: 0,
      message: 'Please enter your email address.'
    })
  }
}

export function token(req, res){
  if (req.params.token){
    async.waterfall([
        function(done) {
          Login
            .findOne({ resetPasswordToken: req.params.token , resetPasswordExpires: { $gt: Date.now() }} )
            .exec(function(err, user) {
              if (err) {
                return next(err);
              }
              if (!user) {
                return res.json({
                  success: 0,
                  message: 'Password reset token is invalid or has expired'
                })

              }
              user.password = req.body.password;
              user.resetPasswordToken = undefined;
              user.passwordResetExpires = undefined;
              user.save(function(err) {
                if (err) {
                  return res.json({
                    success : 0,
                    message: 'Something went wrong'
                  })
                }
                done(null, user)
              });
            });
        },
        function(user, done) {
          var mailOptions = {
            to: user.email,
            from: config.gmailUser,
            subject: 'Your  password has been changed',
            text: 'Hello,\n\n' +
              'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
          };
          smtpTransport.sendMail(mailOptions, function(err) {
            return res.json({
              success:1,
              message: 'Success! Your password has been changed.'
            })
            // done(err);
          });
      }
    ], function(err) {
      if (err) {
        return next(err);
      }

    });
  }else{
    return res.json({
      success: 0,
      message: 'Please provide token'
    })
  }
}

// Deletes a Login from the DB
export function destroy(req, res) {
  return Login.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
