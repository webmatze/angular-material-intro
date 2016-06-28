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