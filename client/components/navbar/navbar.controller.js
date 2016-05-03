'use strict';

class NavbarController {
  //start-non-standard
  //end-non-standard

  constructor() {
    this.appName = 'Health App'
  }
}

angular.module('myAppApp')
  .controller('NavbarController', NavbarController);
