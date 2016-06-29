(function (angular) {

  function mdIntroController($scope, $q, mdIntroPanel) {
    var $ctrl = this
    var currentStep = 0
    $ctrl.step = function () {
      var nextStep = this.nextStep()
      if (nextStep) {
        nextStep().then(function (data) {
          return data.onBeforeStep ? $q.when(data.onBeforeStep(data)) : data
        }).then(function (data) {
          return $ctrl.showStep(data).then(function (mdPanelRef) {
            return data
          })
        }).then(function (data) {
          return data.onAfterStep ? $q.when(data.onAfterStep(data)) : data
        }).then(function (data) {
          currentStep++
          $ctrl.step()
        }).catch(function (error) {
          console.log(error)
          currentStep = 0
        })
      }
    }
    $ctrl.nextStep = function () {
      return $ctrl.mdIntroOptions.steps[currentStep]
    }
    $ctrl.showStep = function (step) {
      return mdIntroPanel(step)
    }
    $scope.$watch('$ctrl.mdIntroOptions', function (newVal) {
      if (newVal && newVal.autorun) {
        $ctrl.step()
      }
    })
    $ctrl.mdIntroMethod = function () {
      currentStep = 0
      $ctrl.step()
    }

  }
  mdIntroController.$inject = ["$scope", "$q", "mdIntroPanel"]

  angular.module('angular-material-intro.controllers').controller('mdIntroController', mdIntroController);

})(angular);
