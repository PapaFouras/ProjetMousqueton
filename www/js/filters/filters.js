angular.module('asm.filters', [])

.filter('dateToISO', function() {
    return function(input) {
        if (input) {
            input = input.substring(0,10) + 'T' + input.substring(11,19) + '.000';
            return input;
        };
    };
})

.filter('dataToActivites', function() {
    return function(input) {
        if (input) {
            input = angular.fromJson(input);
            input = input.activites + ' (' + input.categorie + ')';
            return input;
        };
    };
})

.filter('dataToActivitesCourt', function() {
    return function(input) {
        if (input) {
            input = angular.fromJson(input);
            input = input.activites;
            return input;
        };
    };
})

.filter('dataToBlessures', function() {
    return function(input) {
        if (input) {
            input = angular.fromJson(input);
            input = input.blessures + ' (' + input.categorie + ')';
            return input;
        };
    };
})

.filter('gpsToWGS84', function() {
    return function(input) {
        if (input) {
            input = 'N ' + input.substring(0,2) + '.' + input.substring(2,8) + '° - E ' + input.substring(8,9)  + '.' +
                    input.substring(9,15) + '°';
            return input;
        };
    };
})

.filter('dateToAge', function() {
    return function(input) {
        if (input) {
            input = input.substring(0,10) + 'T' + input.substring(11,19) + '.000';
            input = new Date(input);
            return new Number(Math.floor((new Date() - input) / 31536000000)) + ' ans';
        };
    };
})

.filter('displayBlessures', function() {
    return function(input) {
        if (input) {
            var objBlessures = angular.fromJson(input);
            var txtBlessures = [];
                for (var i=0; i < objBlessures.length; i++) {
                    txtBlessures.push(objBlessures[i].blessures);
                };
            txtBlessures = txtBlessures.join(', ');
            return txtBlessures;
        };
    };
})