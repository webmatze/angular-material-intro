'use strict';

describe('', function() {

  var module;
  var dependencies;
  dependencies = [];

  var hasModule = function(module) {
  return dependencies.indexOf(module) >= 0;
  };

  beforeEach(function() {

  // Get module
  module = angular.module('angular-material-intro');
  dependencies = module.requires;
  });

  it('should load config module', function() {
    expect(hasModule('angular-material-intro.config')).to.be.ok;
  });

  

  
  it('should load directives module', function() {
    expect(hasModule('angular-material-intro.directives')).to.be.ok;
  });
  

  
  it('should load services module', function() {
    expect(hasModule('angular-material-intro.services')).to.be.ok;
  });
  

  
    it('should load controllers module', function() {
      expect(hasModule('angular-material-intro.controllers')).to.be.ok;
    });
  

});
