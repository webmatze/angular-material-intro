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
  mdIntroController.$inject = ["$scope", "$q", "mdIntroPanel"]

  angular.module('angular-material-intro.controllers').controller('mdIntroController', mdIntroController);

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
          template: '<div class="md-intro-panel"><div>' + step.intro + '</div><md-button ng-click="$ctrl.next($event)">Weiter</md-button></div>',
          clickOutsideToClose: false,
          escapeToClose: false,
          focusOnOpen: true,
          hasBackdrop: false,
          position: position,
          controller: function (mdPanelRef) {
            this.next = function () {
              mdPanelRef.close()
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

(function (angular) {

  function mdIntroDirective ($timeout) {
    return {
      controller: "mdIntroController",
      controllerAs: '$ctrl',
      scope: {
        mdIntroOptions: '<'
      },
      link: function (scope, element, attrs, controller) {
        $timeout(controller.step.bind(controller), 1000)
      }
    }
  }
  mdIntroDirective.$inject = ["$timeout"]

  angular.module('angular-material-intro.directives').directive('mdIntro', mdIntroDirective);

})(angular);
