'use strict';
import Q from 'q';
import Login from '../login/login.model';
export function post(ModelObject){
  var Db = new Login(ModelObject);
  return Q.nfcall(Db.save.bind(Db)); 
}

export function query(ModelObject){

  var Db = Login.findOne(ModelObject);
  return Q.nfcall(Db.exec.bind(Db));
}

