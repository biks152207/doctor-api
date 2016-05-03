'use strict';

var app = require('../..');
import request from 'supertest';

var newRegister;

describe('Register API:', function() {

  describe('GET /api/register', function() {
    var registers;

    beforeEach(function(done) {
      request(app)
        .get('/api/register')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          registers = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      registers.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/register', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/register')
        .send({
          name: 'New Register',
          info: 'This is the brand new register!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newRegister = res.body;
          done();
        });
    });

    it('should respond with the newly created register', function() {
      newRegister.name.should.equal('New Register');
      newRegister.info.should.equal('This is the brand new register!!!');
    });

  });

  describe('GET /api/register/:id', function() {
    var register;

    beforeEach(function(done) {
      request(app)
        .get('/api/register/' + newRegister._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          register = res.body;
          done();
        });
    });

    afterEach(function() {
      register = {};
    });

    it('should respond with the requested register', function() {
      register.name.should.equal('New Register');
      register.info.should.equal('This is the brand new register!!!');
    });

  });

  describe('PUT /api/register/:id', function() {
    var updatedRegister;

    beforeEach(function(done) {
      request(app)
        .put('/api/register/' + newRegister._id)
        .send({
          name: 'Updated Register',
          info: 'This is the updated register!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedRegister = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedRegister = {};
    });

    it('should respond with the updated register', function() {
      updatedRegister.name.should.equal('Updated Register');
      updatedRegister.info.should.equal('This is the updated register!!!');
    });

  });

  describe('DELETE /api/register/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/register/' + newRegister._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when register does not exist', function(done) {
      request(app)
        .delete('/api/register/' + newRegister._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
