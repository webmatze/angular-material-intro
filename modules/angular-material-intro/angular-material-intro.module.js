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
