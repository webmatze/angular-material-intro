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

(function (angular) {

  function mdIntroPanel ($mdPanel, $q) {
    return {
      create: function (step) {
        return $q(function (resolve, reject) {
          var position = $mdPanel.newPanelPosition()
          if (step.element) {
            position = position.relativeTo(step.element)
            .addPanelPosition($mdPanel.xPosition.ALIGN_END, $mdPanel.yPosition.BELOW)
            .addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.BELOW)
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
  }
  mdIntroPanel.$inject = ["$mdPanel", "$q"]
  
  angular.module('angular-material-intro.services').service('mdIntroPanel', mdIntroPanel)

})(angular);