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
