(function (angular) {

  function mdIntroStep ($q) {
    return function (config, beforeCallback, afterCallback) {
      return function () {
        if (beforeCallback) {
          config.onBeforeStep = beforeCallback
        }
        if (afterCallback) {
          config.onAfterStep = afterCallback
        }
        return $q.when(config)
      }
    }
  }
  mdIntroStep.$inject = ["$q"]

  angular.module('angular-material-intro.services').service('mdIntroStep', mdIntroStep)

})(angular);
