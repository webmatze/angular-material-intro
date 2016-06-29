(function (angular) {

  function mdIntroDirective ($timeout) {
    return {
      controller: "mdIntroController",
      controllerAs: '$mdIntroCtrl',
      bindToController: {
        mdIntroOptions: '<',
        mdIntroMethod: '='
      }
    }
  }
  mdIntroDirective.$inject = ["$timeout"]

  angular.module('angular-material-intro.directives').directive('mdIntro', mdIntroDirective);

})(angular);
