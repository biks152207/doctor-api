import Q from 'q';
export function query(Model,queryParams){
  console.log(Model);
  console.log(queryParams);
   var q = Model.findOne(queryParams);
   return Q.nfcall(q.exec.bind(q));
}