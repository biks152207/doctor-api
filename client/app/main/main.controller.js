'use strict';

(function() {

class MainController {

  constructor($http) {
    this.$http = $http;
    this.formData = {};
  }

  login($validity, type){
    if ($validity){
      // console.log('true');
      this.$http.post('/api/' + type, this.formData).success(function(data){
        console.log(data);
      })
    }
  }

  // $onInit() {
  //   this.$http.get('/api/things').then(response => {
  //     this.awesomeThings = response.data;
  //   });
  // }

  // addThing() {
  //   if (this.newThing) {
  //     this.$http.post('/api/things', { name: this.newThing });
  //     this.newThing = '';
  //   }
  // }

  // deleteThing(thing) {
  //   this.$http.delete('/api/things/' + thing._id);
  // }
}

angular.module('myAppApp')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController,
    controllerAs: 'main'
  });

})();
