'use strict';

describe('Controller: ThreadCtrl', function () {

  // load the controller's module
  beforeEach(module('rtfmApp'));

  var ThreadCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ThreadCtrl = $controller('ThreadCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
