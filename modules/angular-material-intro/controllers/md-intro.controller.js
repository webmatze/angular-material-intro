(function (angular) {

  function mdIntroController($scope, mdIntroPanel) {
    var $ctrl = this
    var currentStep = 0
    $ctrl.step = function () {
      var step = this.nextStep()
      if (step) {
        step.then(function (data) {
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
      return mdIntroPanel.create(step)
    }
  }
  mdIntroController.$inject = ["$scope", "mdIntroPanel"]

  angular.module('angular-material-intro.controllers').controller('mdIntroController', mdIntroController);

})(angular);
