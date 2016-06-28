(function (angular) {

  function mdIntroController($scope, mdIntroPanel) {
    var $ctrl = this
    var currentStep = 0
    $ctrl.step = function () {
      var nextStep = this.nextStep()
      if (nextStep) {
        nextStep().then(function (data) {
          return $ctrl.showStep(data)
        }).finally(function () {
          currentStep++
          $ctrl.step()
        })
      }
    }
    $ctrl.nextStep = function () {
      return $scope.mdIntroOptions.steps[currentStep]
    }
    $ctrl.showStep = function (step) {
      return mdIntroPanel(step)
    }
  }
  mdIntroController.$inject = ["$scope", "mdIntroPanel"]

  angular.module('angular-material-intro.controllers').controller('mdIntroController', mdIntroController);

})(angular);
