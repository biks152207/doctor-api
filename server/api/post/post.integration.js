'use strict';

var app = require('../..');
import request from 'supertest';

var newPost;

describe('Post API:', function() {

  describe('GET /api/post', function() {
    var posts;

    beforeEach(function(done) {
      request(app)
        .get('/api/post')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          posts = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      posts.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/post', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/post')
        .send({
          name: 'New Post',
          info: 'This is the brand new post!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newPost = res.body;
          done();
        });
    });

    it('should respond with the newly created post', function() {
      newPost.name.should.equal('New Post');
      newPost.info.should.equal('This is the brand new post!!!');
    });

  });

  describe('GET /api/post/:id', function() {
    var post;

    beforeEach(function(done) {
      request(app)
        .get('/api/post/' + newPost._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          post = res.body;
          done();
        });
    });

    afterEach(function() {
      post = {};
    });

    it('should respond with the requested post', function() {
      post.name.should.equal('New Post');
      post.info.should.equal('This is the brand new post!!!');
    });

  });

  describe('PUT /api/post/:id', function() {
    var updatedPost;

    beforeEach(function(done) {
      request(app)
        .put('/api/post/' + newPost._id)
        .send({
          name: 'Updated Post',
          info: 'This is the updated post!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedPost = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPost = {};
    });

    it('should respond with the updated post', function() {
      updatedPost.name.should.equal('Updated Post');
      updatedPost.info.should.equal('This is the updated post!!!');
    });

  });

  describe('DELETE /api/post/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/post/' + newPost._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when post does not exist', function(done) {
      request(app)
        .delete('/api/post/' + newPost._id)
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
