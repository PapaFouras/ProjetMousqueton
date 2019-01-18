var asm = angular.module('asm', [
    'asm.controllers',
    'asm.services',
    'asm.filters',
    'asm.directives',
    'asm.modal',
    'ngRoute',
    'ngAnimate',
    'ngSanitize',
    'ngTable',
    'ui.select',
    'ui.utils',
    'ui.bootstrap'
]);

asm.config(function ($routeProvider) {
  $routeProvider
    .when('/page/alerte', {templateUrl: 'partials/alerte.html', controller: 'alerteCtrl'})
    .when('/page/alerte/num/:num', {templateUrl: 'partials/alerte.html', controller: 'alerteCtrl'})
    .when('/page/moyens', {templateUrl: 'partials/moyens.html', controller: 'moyensCtrl'})
    .when('/page/deroulement', {templateUrl: 'partials/deroulement.html', controller: 'deroulementCtrl'})
    .when('/page/victimes', {templateUrl: 'partials/victimes.html', controller: 'victimesCtrl'})
    .when('/page/rsgts', {templateUrl: 'partials/rsgts.html', controller: 'rsgtsCtrl'})
    .when('/page/config/annee', {templateUrl: 'partials/annee.html', controller: 'configCtrl'})
    .when('/page/config/unite', {templateUrl: 'partials/unite.html', controller: 'uniteCtrl'})
    .when('/page/config/data', {templateUrl: 'partials/data.html', controller: 'dataCtrl'})
    .when('/page/config/recherche', {templateUrl: 'partials/recherche.html', controller: 'rechercheCtrl'})
    .when('/page/config/statistiques', {templateUrl: 'partials/statistiques.html', controller: 'statCtrl'})
    .otherwise({redirectTo: '/page/alerte'});
});