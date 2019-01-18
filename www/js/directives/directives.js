angular.module('asm.directives', [])

.directive('ngOnfocus', function( $timeout ) {
  return function( scope, elem, attrs ) {
    scope.$watch(attrs.ngOnfocus, function( newval ) {
      if ( newval ) {
        $timeout(function() {
          elem[0].focus();
        }, 100, false);
      }
    });
  };
})

.directive('dateDisplay', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$formatters.push(function(value) {
                if (value) {
                    value = value.substring(8,10) + '/' + value.substring(6,8) + '/' + value.substring(0,2) +
                            value.substring(3,5) + ' ' +value.substring(11,13) + ':' + value.substring(14,16);
                    return value;
                }
            });
            
            ngModel.$parsers.push(function(value) {
                value = value.substring(6,10) + '-' + value.substring(3,5) + '-' + value.substring(0,2) + ' ' +
                        value.substring(11,16) + ':00';
                return value;
            });
        }
    };
})

.directive('capitalizeFirst', function($parse) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            var capitalize = function(inputValue) {
                if (inputValue) {
                    if (inputValue === undefined) { inputValue = ''; }
                        var capitalized = inputValue.charAt(0).toUpperCase() + inputValue.substring(1);
                        if(capitalized !== inputValue) {
                            modelCtrl.$setViewValue(capitalized);
                            modelCtrl.$render();
                        }         
                    return capitalized;
                }
            }
            modelCtrl.$parsers.push(capitalize);
            capitalize($parse(attrs.ngModel)(scope));
        }
    };
})

.directive('capitalize', function($parse) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            var capitalize = function(inputValue) {
                if (inputValue) {
                    var capitalized = inputValue.toUpperCase();
                    if(capitalized !== inputValue) {
                        modelCtrl.$setViewValue(capitalized);
                        modelCtrl.$render();
                    }         
                    return capitalized;
                }
            }
            var model = $parse(attrs.ngModel);
            modelCtrl.$parsers.push(capitalize);
            capitalize(model(scope));
        }
    };
})