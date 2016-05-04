'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var uniqueEmailCtrlStub = {
  index: 'uniqueEmailCtrl.index',
  show: 'uniqueEmailCtrl.show',
  create: 'uniqueEmailCtrl.create',
  update: 'uniqueEmailCtrl.update',
  destroy: 'uniqueEmailCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var uniqueEmailIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './email.controller': uniqueEmailCtrlStub
});

describe('UniqueEmail API Router:', function() {

  it('should return an express router instance', function() {
    uniqueEmailIndex.should.equal(routerStub);
  });

  describe('GET /api/unique/email', function() {

    it('should route to uniqueEmail.controller.index', function() {
      routerStub.get
        .withArgs('/', 'uniqueEmailCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/unique/email/:id', function() {

    it('should route to uniqueEmail.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'uniqueEmailCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/unique/email', function() {

    it('should route to uniqueEmail.controller.create', function() {
      routerStub.post
        .withArgs('/', 'uniqueEmailCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/unique/email/:id', function() {

    it('should route to uniqueEmail.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'uniqueEmailCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/unique/email/:id', function() {

    it('should route to uniqueEmail.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'uniqueEmailCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/unique/email/:id', function() {

    it('should route to uniqueEmail.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'uniqueEmailCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
