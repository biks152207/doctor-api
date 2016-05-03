
export function requiredParams(req, res, next){
  console.log('test we are')
  return function(type){
    console.log(type);
  }
}