import jwt from 'jsonwebtoken';
import config from '../config/environment';
import Q from 'q';
export function jwtSignature(ModelObject){
  return Q.Promise(function(resolve, reject){
    var token = jwt.sign(ModelObject, config.tokenSecret,{
      expiresIn: '5h'
    })
    resolve(token);
  })
  
}