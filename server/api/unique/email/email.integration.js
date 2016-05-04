'use strict';

var app = require('../../..');
import request from 'supertest';

var newUniqueEmail;

describe('UniqueEmail API:', function() {

  describe('GET /api/unique/email', function() {
    var uniqueEmails;

    beforeEach(function(done) {
      request(app)
        .get('/api/unique/email')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          uniqueEmails = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      uniqueEmails.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/unique/email', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/unique/email')
        .send({
          name: 'New UniqueEmail',
          info: 'This is the brand new uniqueEmail!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newUniqueEmail = res.body;
          done();
        });
    });

    it('should respond with the newly created uniqueEmail', function() {
      newUniqueEmail.name.should.equal('New UniqueEmail');
      newUniqueEmail.info.should.equal('This is the brand new uniqueEmail!!!');
    });

  });

  describe('GET /api/unique/email/:id', function() {
    var uniqueEmail;

    beforeEach(function(done) {
      request(app)
        .get('/api/unique/email/' + newUniqueEmail._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          uniqueEmail = res.body;
          done();
        });
    });

    afterEach(function() {
      uniqueEmail = {};
    });

    it('should respond with the requested uniqueEmail', function() {
      uniqueEmail.name.should.equal('New UniqueEmail');
      uniqueEmail.info.should.equal('This is the brand new uniqueEmail!!!');
    });

  });

  describe('PUT /api/unique/email/:id', function() {
    var updatedUniqueEmail;

    beforeEach(function(done) {
      request(app)
        .put('/api/unique/email/' + newUniqueEmail._id)
        .send({
          name: 'Updated UniqueEmail',
          info: 'This is the updated uniqueEmail!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedUniqueEmail = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedUniqueEmail = {};
    });

    it('should respond with the updated uniqueEmail', function() {
      updatedUniqueEmail.name.should.equal('Updated UniqueEmail');
      updatedUniqueEmail.info.should.equal('This is the updated uniqueEmail!!!');
    });

  });

  describe('DELETE /api/unique/email/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/unique/email/' + newUniqueEmail._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when uniqueEmail does not exist', function(done) {
      request(app)
        .delete('/api/unique/email/' + newUniqueEmail._id)
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
