(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('angular-material-intro.config', [])
      .value('angular-material-intro.config', {
          debug: true
      });

  // Modules
  angular.module('angular-material-intro.directives', []);
  angular.module('angular-material-intro.services', []);
  angular.module('angular-material-intro.controllers', []);

  angular.module('angular-material-intro',
      [
        'angular-material-intro.config',
        'angular-material-intro.directives',
        'angular-material-intro.services',
        'angular-material-intro.controllers'
      ]);

})(angular);

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

(function (angular) {

  function mdIntroDirective ($timeout) {
    return {
      controller: "mdIntroController",
      controllerAs: '$ctrl',
      bindToController: {
        mdIntroOptions: '<',
        mdIntroMethod: '='
      }
    }
  }
  mdIntroDirective.$inject = ["$timeout"]

  angular.module('angular-material-intro.directives').directive('mdIntro', mdIntroDirective);

})(angular);

(function (angular) {

  function mdIntroPanel ($mdPanel, $q) {
    return function (step) {
      return $q(function (resolve, reject) {
        var position = $mdPanel.newPanelPosition()
        if (step.element) {
          position = position.relativeTo(step.element)
          .addPanelPosition($mdPanel.xPosition.OFFSET_START, $mdPanel.yPosition.BELOW)
          .addPanelPosition($mdPanel.xPosition.OFFSET_END, $mdPanel.yPosition.BELOW)
          .addPanelPosition($mdPanel.xPosition.OFFSET_START, $mdPanel.yPosition.ABOVE)
          .addPanelPosition($mdPanel.xPosition.OFFSET_END, $mdPanel.yPosition.ABOVE)
          //.withOffsetY('10px');
        } else {
          position = position.absolute().center()
        }
        var config = {
          attachTo: angular.element(document.body),
          template: '<div class="md-intro-panel">'
            + '<div>' + step.intro + '</div>'
            + '<md-button ng-click="$ctrl.next($event)" ng-hide="$ctrl.step.hideNextButton">{{$ctrl.nextLabel()}}</md-button>'
            + '<md-button ng-click="$ctrl.cancel($event)" ng-hide="$ctrl.step.hideCancelButton">{{$ctrl.cancelLabel()}}</md-button>'
            + '</div>',
          locals: {
            step: step
          },
          clickOutsideToClose: false,
          escapeToClose: false,
          focusOnOpen: true,
          hasBackdrop: false,
          position: position,
          controller: function (mdPanelRef) {
            this.next = function () {
              mdPanelRef.close()
            }
            this.cancel = function () {
              reject({ reason: 'cancel', step: step})
              mdPanelRef.close()
            }
            this.nextLabel = function () {
              return this.step.nextLabel || 'Next Step'
            }
            this.cancelLabel = function () {
              return this.step.cancelLabel || 'Cancel'
            }
          },
          controllerAs: '$ctrl',
          onRemoving: resolve
        }
        $mdPanel.create(config).open()
      })
    }
  }
  mdIntroPanel.$inject = ["$mdPanel", "$q"]

  angular.module('angular-material-intro.services').service('mdIntroPanel', mdIntroPanel)

})(angular);

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
