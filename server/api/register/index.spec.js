'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var registerCtrlStub = {
  index: 'registerCtrl.index',
  show: 'registerCtrl.show',
  create: 'registerCtrl.create',
  update: 'registerCtrl.update',
  destroy: 'registerCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var registerIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './register.controller': registerCtrlStub
});

describe('Register API Router:', function() {

  it('should return an express router instance', function() {
    registerIndex.should.equal(routerStub);
  });

  describe('GET /api/register', function() {

    it('should route to register.controller.index', function() {
      routerStub.get
        .withArgs('/', 'registerCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/register/:id', function() {

    it('should route to register.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'registerCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/register', function() {

    it('should route to register.controller.create', function() {
      routerStub.post
        .withArgs('/', 'registerCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/register/:id', function() {

    it('should route to register.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'registerCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/register/:id', function() {

    it('should route to register.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'registerCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/register/:id', function() {

    it('should route to register.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'registerCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
