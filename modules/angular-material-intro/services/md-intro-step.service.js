(function (angular) {

  function mdIntroStep ($q) {
    return function (config, callback) {
      return function () {
        var promise = $q.when(config)
        if (callback) {
          promise = promise.then(callback)
        }
        return promise
      }
    }
  }
  mdIntroStep.$inject = ["$q"]

  angular.module('angular-material-intro.services').service('mdIntroStep', mdIntroStep)

})(angular);
