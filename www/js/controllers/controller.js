angular.module('asm.controllers', ['asm.services'])

.controller('mainCtrl', function($rootScope, $scope, $routeParams, $q, $filter, $http, $window, $modal, navTab, navBar, ajaxSecours, ajaxData, ajaxMoyens, valueSecours, convertTo) {

    // Mise en surbrillance de l'onglet actif
    $rootScope.navTab = navTab.get();

    // Initialisation - Chargement de la dernière fiche de secours de l'année en cours
    $rootScope.dataSecours = navBar.init();

    // Fonction de navigation
    $rootScope.navFunction = function(action) {
        $rootScope.dataSecours = navBar.nav(action);
    };

    // Liste des moyens disponibles - lst_personnels
    ajaxData.getPersonnels().then(function(data) {
        $rootScope.lstPersonnels = data;
    });

    // Liste des communes
    $rootScope.getCommunes = function(val) {
        if (val.length > 2) {
            var postData = {dataType: 'communes', val: val};
            return $http.post('js/services/data_tabData.php', postData).then(function(response){
                return response.data;
            });
        } else {
            var response = {};
            response.data=[];
            return response.data;
        };
    };

    // Fonction ajout d'une fiche
    $rootScope.addSecours = function() { // Fonction ajout d'une fiche
        ajaxSecours.addSecours('add').then(function() {
            $rootScope.dataSecours = navBar.init();
        });
    };

    // Fonction d'enregistrement des données
    $rootScope.updateFiche = function(field, data) {
        if (data == null) { // Correction des valeurs "null"
            data = '';
        };
        // Sauvegarde dans la base de donnée
        if (isNaN(data)) { // Avec majuscules en début de phrase
            ajaxSecours.updateSecours(valueSecours.id, field, convertTo.phraseUpcase(data)).then(function() {
                // Mise à jour du champ avec le(s) majuscule(s) dans le $rootScope
                $rootScope.dataSecours.data[field] = convertTo.phraseUpcase(data);
            });
        } else { // Autres valeurs
            ajaxSecours.updateSecours(valueSecours.id, field, data).then(function() {
            });
        }
    };
    $rootScope.updateDateAlerte = function(field, data) {
        // Sauvegarde dans la base de donnée
        if (data.length == 19) {
            data = $filter('date')($filter('dateToISO')(data), "yyyyMMddHHmm");
        };
        ajaxSecours.updateSecours(valueSecours.id, field, convertTo.dateAlerteToMYSQL(data)).then(function() {
        });
    };

    // Fonctions Search

    $rootScope.searchId = function(search) {
        if ((search) && !isNaN(search) && (search >= 1)) {
            ajaxSecours.searchId(search).then(function(response) {
                if (response.length > 0) { // PV trouvé
                    var idId = response[0]['id'];
                    console.log('Id ID :', idId);
                    for (var i=0; i < valueSecours.data.length; i++) { // Parcours du tableau des Ids
                        if (valueSecours.data[i].id == idId) { // Id trouvé
                            valueSecours.currentSecours = i + 1;
                            $rootScope.dataSecours = navBar.nav('searchId', idId);
                        };
                    };

                } else { // PV non trouvé
                    $rootScope.confirm("Numéro Id non trouvé !");
                };
            });
        } else { // Données à rechercher non conforme
            $rootScope.confirm("Numéro Id non valide !");
        };
        $scope.inputSearch = null; // Effacement de la zone de saisie Search
    }

    $rootScope.searchPv = function(search) {
        if ((search) && !isNaN(search) && (search >= 1)) {
            ajaxSecours.searchPv(search).then(function(response) {
                if (response.length > 0) { // PV trouvé
                    var idPv = response[0]['id'];
                    console.log('Id PV :', idPv);
                    for (var i=0; i < valueSecours.data.length; i++) { // Parcours du tableau des Ids
                        if (valueSecours.data[i].id == idPv) { // Id trouvé
                            valueSecours.currentSecours = i + 1;
                            $rootScope.dataSecours = navBar.nav('searchId', idPv);
                        };
                    };

                } else { // PV non trouvé
                    $rootScope.confirm("Numéro de PV non trouvé !");
                };
            });
        } else { // Données à rechercher non conforme
            $rootScope.confirm("Numéro de PV non valide !");
        };
        $scope.inputSearch = null; // Effacement de la zone de saisie Search
    }

    // Fonction - Impression fiche d'alerte
    $rootScope.printAsm = function() {
        var idPdf = valueSecours.id;
        var url = "js/services/pdf_fiche_alerte.php?id=" + idPdf;
        $window.open(url);
    };

    // Fonction - Impression PV RA
    $rootScope.printPv = function() {
        var url =
            "js/services/pdf_pv_ra.php?id=" + valueSecours.id +
            "&secours=" + valueSecours.currentSecours +
            "&annee=" + valueSecours.year;
        $window.open(url);
    };

// Fonction - Impression PV RJ
    $rootScope.printPvRJ = function() {
        var url =
            "js/services/pdf_pv_rj.php?id=" + valueSecours.id +
            "&secours=" + valueSecours.currentSecours +
            "&annee=" + valueSecours.year;
        $window.open(url);
    };

    // Fonction - Envoi SMS
    $rootScope.sendSMS = function() {
        // Récupération des secouristes parmi les moyens engagés
        var nb_moyens = $scope.dataSecours.dataMoyens.data.length;
        var secouristes_engages = [];
        var medecins_engages = [];
        var helicos_engages = [];
        var lst_tph_portable = [];
        for (var i = 0 ; i < nb_moyens; i++) {
            if ($scope.dataSecours.dataMoyens.data[i].type == 'Secouriste') {
                secouristes_engages.push($scope.dataSecours.dataMoyens.data[i].nom);
            }
            if ($scope.dataSecours.dataMoyens.data[i].type == 'Hélicoptère') {
                helicos_engages.push($scope.dataSecours.dataMoyens.data[i].nom);
            }
            if ($scope.dataSecours.dataMoyens.data[i].type == 'Médecin') {
                medecins_engages.push(" médicalisé SAMU ");
                medecins_engages.push($scope.dataSecours.dataMoyens.data[i].nom);
            }
        }


        // Récupération des téléphones portables des secouristes concernés
        secouristes_engages.forEach(function(nom) {
            $rootScope.lstPersonnels.forEach(function(value, index) {
                if ($rootScope.lstPersonnels[index].nom == nom) {
                    ($rootScope.lstPersonnels[index].tph != '') ? lst_tph_portable.push($rootScope.lstPersonnels[index].tph) : '';
                }
            });
        });
        // Nettoyage des doublons dans un tableau
        function cleanArray(array) {
            var i, j, len = array.length, out = [], obj = {};
            for (i = 0; i < len; i++) {
                obj[array[i]] = 0;
            }
            for (j in obj) {
                out.push(j);
            }
            return out;
        }
        lst_tph_portable = cleanArray(lst_tph_portable);
        //alert(encodeURIComponent(lst_tph_portable));
//Ces fonctions de conversion doivent sortir d'ici
        // Champ coordonnées - Conversion DD.DDDDDD -> DD°MM.MM
        function formatNumber(number) {
            return (number < 1000 ? '0' : '') + number;
        }
        function formatNumberMM(number) {
            return (number < 10 ? '0' : '') + number;
        }
        function convert_xy (coord_dd) {
          coord_dd = coord_dd / 1000000 ;
          //console.log(coord_dd);
          var d = Math.floor(coord_dd);
          //console.log(d);
          var m = (coord_dd - d) * 60 * 100;
          //console.log(m);
          var m_entier = (coord_dd - d) * 60;
          var m_floor = Math.floor(m_entier);
          //console.log(formatNumberMM(m_floor));
          var m_dec = ((m_entier-m_floor)*100);
          //console.log(formatNumberMM(Math.floor(m_dec)));
          console.log(d+" "+formatNumberMM(m_floor)+"."+formatNumberMM(Math.floor(m_dec)));
          var coord_ddmmss = d + '°' + formatNumberMM(m_floor)+"."+formatNumberMM(Math.floor(m_dec)) + "'" ;
            return coord_ddmmss;
        }
        var lat = $scope.dataSecours.data.loc_gps.substring(0,8)/ 1000000;
        var lon = $scope.dataSecours.data.loc_gps.substring(8,15)/ 1000000;
        var lat_lon =   'N ' + convert_xy(+$scope.dataSecours.data.loc_gps.substring(0,8)) + ' ' +
                        'E ' + convert_xy(+$scope.dataSecours.data.loc_gps.substring(8,15));
console.log(lat_lon);
        // Champ divers
        var divers = (angular.isDefined($scope.dataSecours.data.acc_rsgts))
        ? $scope.dataSecours.data.acc_rsgts
        : '';

        // Champ blessures
        if (angular.isDefined($rootScope.blessures.selected.blessures)) {
            var blessures = $rootScope.blessures.selected.blessures;
        } else {
            $rootScope.confirm('Veuillez remplir le champ "Blessures"');
            return
        }

        // Champ localisation
        var localisation = []
        if (($scope.dataSecours.data.loc_lieu.length > 0) && angular.isDefined($scope.dataSecours.data.loc_lieu)) {
            localisation.push($scope.dataSecours.data.loc_lieu);
        } else {
            $rootScope.confirm('Veuillez remplir les champs "Localisation"');
            return
        }

        if (angular.isDefined($scope.dataSecours.data.loc_complement)) {

                 localisation.push($scope.dataSecours.data.loc_complement);

         }

        // Champ vital
        var vital = [];
        ($scope.dataSecours.data.chk_hemorragie == 1) ? vital.push('Hémorragie') : '';
        ($scope.dataSecours.data.chk_pci == 1) ? vital.push('PCI') : '';
	    ($scope.dataSecours.data.chk_hc == 1) ? vital.push('Haute cinétique') : '';

        switch ($scope.dataSecours.data.acc_bilan) {
                default :
                vital.push('');
                break;

                case "1" :
                vital.push('Inconscience');
                break;

                case "2" :
                vital.push('Détresse ventilatoire');
                break;

                case "3" :
                vital.push('Détresse cardio-ventilatoire');
                break;
        }

        // Champ activités
        if (angular.isDefined($rootScope.activites.selected.activites)) {
            var activites = $rootScope.activites.selected.activites;
        } else {
            $rootScope.confirm('Veuillez remplir le champ "Activités"');
            return
        }

        // Champ contre appel
        if ($scope.dataSecours.data.tph_nat!=null) {
            var contreappel = "Contre-appel " + $scope.dataSecours.data.tph_nat + "\n";
        } else if ($scope.dataSecours.data.tph_intl!=null) {
            var contreappel = "Contre-appel " + $scope.dataSecours.data.tph_intl + "\n";
        } else {
            var contreappel = "";
        }

        // Champ texte du SMS
        // ? ajout helico
        var txtSMS = "SEC " + $scope.dataSecours.data.fiche+ "\n" +
                    helicos_engages + medecins_engages.join('') + "\n" +
        			localisation.join(', ') + "\n"  +
                     $scope.dataSecours.data.loc_commune + " - " +
                     $scope.dataSecours.data.loc_alt + "M \n " +
                     lat_lon + "\n " +
                     activites + ", " +
                     blessures + "\n " +
                     vital.join(', ') + "\n " +
                     divers + "\n " +
                     contreappel +
                     " https://sdfgsdfgsdg.com?unite=PG38&lat="+lat+"&lon="+lon+"&z=15";
        //alert(lst_tph_portable);
        // Envoi des données pour la création des SMS - PHP
       // var postData = {lst_tph_portable: lst_tph_portable.join(','), txtSMS: txtSMS.toUpperCase()};
        //$http.post('js/services/sms.send.php', postData).then(function() {
        alert('SMS envoyé à : ' + secouristes_engages.join(', '));
        //console.log(txtSMS);
        //});
        //adaptation pour séparer les appels API raspisms
        for (var i = lst_tph_portable.length - 1; i >= 0; i--) {
            //alert(lst_tph_portable[i]);
            var script = document.createElement('script');
            var url = "http://xxxx.xxx.xxx.xxx/sms/RaspiSMS/smsAPI/?email=xxxx&password=xxxx&numbers=" + encodeURIComponent(lst_tph_portable[i]) + "&text=" + encodeURIComponent(txtSMS);
            //console.log(url);
            script.src = url;
            document.body.appendChild(script);
        }
//envoi du message d'alerte dans le salon matrix/synapse
  $http.post('https://xxxxx/_matrix/client/r0/rooms/%21NyKrKssdfKlvYQXuN:matrix.pghm-isere.com/send/m.room.message?access_token=MDAysdfgshdfgfdgLWlzZXJlLmNvbQowMDEzaWRlbnRpZmllciBrZXkKMDAxMGNpZCBnZW4gPSAxCjAwNzCjAwMjFjaWQgbm9uY2UgPSA4Y2FKZ0VRdmgmWWFkYWxJCjAwMmZzaWduYXR1cmUgwCcZVZ_7mirb6ItEl5b7bkwXu3vnZwJc-CrVqtOxuVkK', {"msgtype":"m.text", "body":txtSMS}).then(
	  function(response) {
    		console.log("Success!");
  		},
  	  function(error) {
    		console.log("Something went wrong!");
  });

  

}
    /* Fenêtre Modal de confirmation pour toutes les modes de recherches (Id - PV - Victimes - Date) */
    $rootScope.confirm = function (text) { // Modal - Info
        $scope.text = text;
        var modalInstance = $modal.open({
            templateUrl: 'partials/info.html',
            controller: 'modalInfoCtrl',
            size: 'sm',
            backdrop: false,
            resolve: {
                modalText: function () {
                return $scope.text;
                }
            }
        });
    };

    $rootScope.affichage = function (text) { // Modal - Affichage
        $scope.text = text;
        var modalInstance = $modal.open({
            templateUrl: 'partials/affichage.html',
            controller: 'modalInfoCtrl',
            size: 'sm',
            backdrop: false,
            resolve: {
                modalText: function () {
                return $scope.text;
                }
            }
        });
    };
})

.controller('modalInfoCtrl', function ($scope, $modalInstance, modalText) { // Dépendance Modal Instance
    $scope.modalText = modalText;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
})

.controller('groupCtrl', function($scope) { // Groupes de NgTable - Moyens
    $scope.group.$hideRows = true;
    $scope.$groups[0].$hideRows = false; // Affichage du premier Groupe de la liste
    $scope.switchGroup = function(group, groups){
        if(group.$hideRows){
            angular.forEach(groups, function(g){
                if(g !== group){
                    g.$hideRows = true;
                }
            });
        }

        group.$hideRows = !group.$hideRows;
    };
})

.controller('configCtrl', function($rootScope, $scope, $timeout, $location, navBar, navTab, yearConfig) {
    // Mise en surbrillance de l'onglet actif
    $rootScope.navTab = navTab.get();

    // Récupération de l'année courante
    $scope.dataConfig = yearConfig.init();

    // Fonction de MAJ de la nouvelle année choisie & Retour à la page d'accueil
    $scope.updateYear = function () {
        $scope.dataConfig = yearConfig.update ($scope.dataConfig.selectedYear);
        $timeout(function() {
            $rootScope.dataSecours = navBar.init();
            $location.path('/page/alerte');
        }, 5000);
    };
})

.controller('uniteCtrl', function($rootScope, $scope, $timeout, $location, ajaxConfigUnite, navTab) {
    // Mise en surbrillance de l'onglet actif
    $rootScope.navTab = navTab.get();

    // Récupération des données actuelles de l'unité
    ajaxConfigUnite.get().then(function(data) {
        $scope.config = data[0];
    });

    // Fonction de MAJ des données de l'unité
    $scope.updateUnite = function() {
        ajaxConfigUnite.update($scope.config).then(function() {
            $scope.isVisibleUpdateUnite = true;
            $timeout(function() {
                $location.path('/page/alerte');
            }, 2000);
        });
    };
})

.controller('dataCtrl', function($rootScope, $scope, $timeout, $location, $filter, navTab, ajaxData, ajaxConfigEvacuation, ajaxConfigMassifs, ajaxConfigMoyens, ngTableParams) {
    // Mise en surbrillance de l'onglet actif
    $rootScope.navTab = navTab.get();

    // Récupération des données actuelles
    $scope.$watch('dataType', function() {
        switch ($rootScope.dataType) {
            case 'Evacuations':
            // Fonction GET - Evacuation
            ajaxData.getEvacuation().then(function(data) {
                $scope.evacuations = data;
            });
            break;

            case 'Massifs':
            ajaxData.getMassifs().then(function(data) {
                $scope.massifs = data;
            });
            break;

            case 'Moyens':
            ajaxData.getPersonnels().then(function(data) {
                $scope.moyens = data;
                $scope.tableParamsMoyens = new ngTableParams({
                    page: 1,    // Affiche la première page
                    count: 100,  // Nombre d'enregistrements à afficher
                    sorting: {ordre: 'asc', organisme: 'asc', lieu: 'asc', nom: 'asc'} // Tri initial
                }, {
                    total: $scope.moyens.length,
                    groupBy: 'type',
                    getData: function($defer, params) {
                        var orderedData =
                            params.sorting() ? $filter('orderBy')($scope.moyens, params.orderBy()) : $scope.moyens;
                        $defer.resolve(orderedData.slice((params.page()-1) * params.count(),
                                                         params.page() * params.count()));
                    }
                });
            });
// Déplacer en config
            $scope.type = ['Secouriste','Hélicoptère','Equipage','Médecin','Equipe cynophile','Autre']
            $scope.grades = ['GAV','GND','MDC','ADJ','ADC','MAJ','LTN','CNE','CEN','LCL','COL'];

            break;
        };

        // Ouverture du tableau - Edition des données
        $scope.editId = -1;
        $scope.setEditId =  function(id) {
            console.log(id);
            $scope.editId = id;
        }
    });

    // Fonction ADD - Evacuation
    $scope.addEvacuation = function(lieu_evacuation) {
        ajaxConfigEvacuation.add(lieu_evacuation).then(function() {
            ajaxData.getEvacuation().then(function(data) {
                $scope.evacuations = data;
                var max = 0;
                for(var i=0;i<data.length;i++) {
                   if(parseInt(data[i].id,10) > max) {
                      max = data[i].id;
                   }
                }
                $scope.setEditId(max);
            });
        });
    };

    // Fonction ADD - Massifs
    $scope.addMassif = function(massifs) {
        ajaxConfigMassifs.add(massifs).then(function() {
            ajaxData.getMassifs().then(function(data) {
                $scope.massifs = data;
                var max = 0;
                for(var i=0;i<data.length;i++) {
                   if(parseInt(data[i].id,10) > max) {
                      max = data[i].id;
                   }
                }
                $scope.setEditId(max);
            });
        });
    };

    // Fonction ADD - Moyens
    $scope.addMoyen = function(ordre) {
        ajaxConfigMoyens.add(ordre).then(function() {
            ajaxData.getPersonnels().then(function(data) {
                $scope.moyens = data;
                $scope.tableParamsMoyens.total($scope.moyens.length);
                $scope.tableParamsMoyens.reload();
                var max = 0;
                for(var i=0;i<data.length;i++) {
                   if(parseInt(data[i].id,10) > max) {
                      max = data[i].id;
                   }
                }
                $scope.setEditId(max);
            });
        });
    };

    // Fonction UPDATE - Evacuation
    $scope.updateEvacuation = function(id, lieu_evacuation) {
        ajaxConfigEvacuation.update(id, lieu_evacuation).then(function() {
            ajaxData.getEvacuation().then(function(data) {
                $scope.evacuations = data;
                $scope.setEditId(-1);
            });
        });
    };

    // Fonction UPDATE - Massifs
    $scope.updateMassif = function(id, massifs) {
        ajaxConfigMassifs.update(id, massifs).then(function() {
            ajaxData.getMassifs().then(function(data) {
                $scope.massifs = data;
                $scope.setEditId(-1);
            });
        });
    };

    // Fonction UPDATE - Moyens
    $scope.updateMoyen = function(moyen) {
        ajaxConfigMoyens.update(moyen).then(function() {
            ajaxData.getPersonnels().then(function(data) {
                $scope.moyens = data;
                $scope.tableParamsMoyens.total($scope.moyens.length);
                $scope.tableParamsMoyens.reload();
                $scope.setEditId(-1);
            });
        });
    };

    // Fonction DELETE - Evacuation
    $scope.deleteEvacuation = function(id) {
        ajaxConfigEvacuation.delete(id).then(function() {
            ajaxData.getEvacuation().then(function(data) {
                $scope.evacuations = data;
            });
        });
    };

    // Fonction DELETE - Massifs
    $scope.deleteMassif = function(id) {
        ajaxConfigMassifs.delete(id).then(function() {
            ajaxData.getMassifs().then(function(data) {
                $scope.massifs = data;
            });
        });
    };

    // Fonction DELETE - Moyens
    $scope.deleteMoyen = function(id) {
        ajaxConfigMoyens.delete(id).then(function() {
            ajaxData.getPersonnels().then(function(data) {
                $scope.moyens = data;
                $scope.tableParamsMoyens.total($scope.moyens.length);
                $scope.tableParamsMoyens.reload();
            });
        });
    };

})

.controller('statCtrl', function($rootScope, $scope, $window, valueSecours, navTab, $filter, valueZone) {
    /**************************************
    *Statistiques - Secours par personnels*
    ***************************************/
    // Mise en surbrillance de l'onglet actif
    $rootScope.navTab = navTab.get();

    // Initialisation
    $scope.anneeLstSecours = parseInt(valueSecours.year);

    // liste zones
    $rootScope.lstZone = valueZone;

    // Fonction - Liste des secours par personne
    $scope.statLstSecours = function() {
        var annee = $scope.anneeLstSecours;
        var personnel = $scope.personnelLstSecours;
        var url = "js/services/pdf_secours_par_personnel.php?annee=" + annee + "&personnel=" + personnel;
        $window.open(url);
    };

    /************************
    *Statistiques - Synthèse*
    ************************/
    // Remplissage automatique des dates - Semaine précédente
    var dateNow = new Date();
    var numDay = dateNow.getDay();
    var day = dateNow.getDate();
    var month = dateNow.getMonth();
    var year = dateNow.getFullYear();
    var dateDebut = new Date(year, month, (day - numDay) + 1 - 7);
    var dateFin = new Date(year,month, day - numDay + 1);

    $scope.dateDebutSynthese = $filter('date')(dateDebut, 'ddMMyyyy');
    $scope.dateFinSynthese = $filter('date')(dateFin, 'ddMMyyyy');

    // Fonction - Validité date
    verificationDate = function(data) {
        if (data) {
            var d = parseInt(data.substring(0,2), 10);
            var m = parseInt(data.substring(2,4), 10);
            var y = parseInt(data.substring(4,8), 10);

            var testDate = new Date(data.substring(4,8), data.substring(2,4) - 1, data.substring(0,2));
            if (angular.isDate(testDate)) {
                if (testDate.getFullYear() == y && testDate.getMonth() + 1 == m && testDate.getDate() == d) {
                    return $filter('date')(testDate, 'yyyy-MM-dd HH:mm:ss');
                } else {
                    $rootScope.confirm("Date invalide !");
                    return false;
                };
            } else {
                $rootScope.confirm("Date invalide !");
                return false;
            };
        } else {
            $rootScope.confirm("Date invalide !");
            return false;
        };
    };

    // Fonction - Synthese
    $scope.statSynthesePdf = function(debut, fin, loc) {
        debut = verificationDate(debut);
        fin = verificationDate(fin);

        if ((debut != false) && (fin != false)) {
            var url = "js/services/pdf_synthese_secours.php?debut=" + debut + "&fin=" + fin + "&loc=" + loc;
            $window.open(url);
        };
    };
})

.controller('rechercheCtrl', function($rootScope, $scope, $filter, ajaxSecours, ajaxVictimes, navTab) {
    // Mise en surbrillance de l'onglet actif
    $rootScope.navTab = navTab.get();

    // Fonction recherche par victime
    $scope.searchVictime = function(victime) {
        if ((victime) && isNaN(victime)) {
            ajaxSecours.searchVict(victime).then(function(response) {
                if (response.length > 0) { // Victime trouvée
                    $scope.isVisibleDate = false;
                    $scope.isVisibleDateDetails = false;
                    $scope.isVisibleDetailsResults = false;
                    $scope.isVisibleResults = true;
                    $scope.resultsVictime = response;
                } else { // PV non trouvé
                    $rootScope.confirm("Victime non trouvée !");
                    $scope.isVisibleDateDetails = false;
                    $scope.isVisibleDate = false;
                    $scope.isVisibleResults = false;
                    $scope.isVisibleDetailsResults = false;
                };
            });
        } else { // Données à rechercher non conforme
            $rootScope.confirm("Nom de victime invalide !");
            $scope.isVisibleResults = false;
            $scope.isVisibleDetailsResults = false;
        };
        $scope.inputVictime = null; // Effacement de la zone de saisie Search
    };

    // Fonction recherche par victime
    $scope.searchDate = function(date) {
        if (date) {
            date = new Date(date.substring(4,8), date.substring(2,4) - 1, date.substring(0,2));
            if (angular.isDate(date)) {
                date = $filter('date')(date, 'yyyy-MM-dd');
                ajaxSecours.searchDate(date).then(function(response) {
                    if (response.length > 0) { // Date trouvée
                        $scope.isVisibleDetailsResults = false;
                        $scope.isVisibleResults = false;
                        $scope.isVisibleDate = true;
                        $scope.isVisibleDateDetails = false;
                        $scope.resultsDate = response;
                    } else { // PV non trouvé
                        $rootScope.confirm("Date non trouvée !");
                        $scope.isVisibleDate = false;
                        $scope.isVisibleDateDetails = false;
                        $scope.isVisibleDetailsResults = false;
                        $scope.isVisibleResults = false;
                    };
                });
            };
        } else {
            $rootScope.confirm("Date invalide !");
            $scope.isVisibleDate = false;
            $scope.isVisibleDateDetails = false;
        };


        $scope.inputDate = null; // Effacement de la zone de saisie Search
    };

    // Fonction détail - Victimes
    $scope.detailsResults = function(id) {
        ajaxSecours.getSecours('get', id).then(function(response) {
            $scope.details = response;
            $scope.isVisibleDetailsResults = true;
        });
    };

    // Fonction détail - Date
    $scope.detailsDate = function(id) {
        ajaxVictimes.get(id).then(function(response) {
            $scope.dateDetails = response;
            $scope.isVisibleDateDetails = true;
        });
    };

})

.controller('alerteCtrl', function($rootScope, $routeParams, $scope, $window, navTab, navBar, ajaxLieux, ajaxData, ajaxSecours, valueSecours, valueMeteo, valueVent, valueInter) {

    if ($routeParams.num) {
        $rootScope.dataSecours = navBar.nav('searchId', $routeParams.num);
        $scope.dataSecours.currentSecours = $routeParams.num ;
        console.log ("numero " + $routeParams.num);
    }

    // Mise en surbrillance de l'onglet actif
    $rootScope.navTab = navTab.get();

    // Liste des activites
    $rootScope.activites = {};
    $rootScope.availableActivites = [];
    ajaxData.getActivites().then(function(data) {
        $rootScope.availableActivites = data;
    });

    // Liste des blessures
    $rootScope.blessures = {};
    $rootScope.availableBlessures = [];
    ajaxData.getBlessures().then(function(data) {
        $rootScope.availableBlessures = data;
    });

    // Liste des massifs
    ajaxData.getMassifs().then(function(data) {
        $rootScope.lstMassifs = data;
    });

    // Liste météo & vent & type inter
    $rootScope.lstMeteo = valueMeteo;
    $rootScope.lstVent = valueVent;
    $rootScope.lstInter = valueInter;

    // Mise à jour du champ Activités
    $rootScope.$watch('dataSecours.data.acc_activites', function(newValue, oldValue) {
        if (angular.isDefined(newValue)) {
            $rootScope.activites.selected = angular.fromJson($rootScope.dataSecours.data.acc_activites);
        };
    });

    // Mise à jour du champ Blessures
    $rootScope.$watch('dataSecours.data.acc_blessures', function(newValue, oldValue) {
        if (angular.isDefined(newValue)) {
            $rootScope.blessures.selected = angular.fromJson($rootScope.dataSecours.data.acc_blessures);
        };
    });

    // Mise à jour des champs UI-Select lors d'une modification
    $scope.updateUiSelect_activites = function(data) {
        $scope.dataSecours.data.acc_activites = angular.toJson(data);
    };
    $scope.updateUiSelect_blessures = function(data) {
        $scope.dataSecours.data.acc_blessures = angular.toJson(data);
    };

    // Mise à jour du champ 'Recherche' pour la localisation de l'accident
    $rootScope.$watch('dataSecours.data.loc_lieu', function(newValue, oldValue) {
        if (angular.isDefined(newValue)) {
            $scope.searchLieuAccident = null;
        };
    });

    // Fonction sauvegarde des activités
    $rootScope.updateListe = function(field, data) { // Champ activités
        // Sauvegarde dans la base de donnée
        data = angular.toJson(data); // Transformation au format JSON
        ajaxSecours.updateSecours(valueSecours.id, field, data).then(function() {});
    };

    // Fonction de mise à jour des Checkbox
    $scope.updateChkConf = function(field) {
        $scope.dataSecours.data.chk_conf3 = $scope.dataSecours.data.chk_conf3 == 1 ? 0 : 1
        $rootScope.updateFiche(field, $scope.dataSecours.data.chk_conf3);
    };
    $scope.updateChkTph = function(field) {
        $scope.dataSecours.data.chk_tph = $scope.dataSecours.data.chk_tph == 1 ? 0 : 1
        $rootScope.updateFiche(field, $scope.dataSecours.data.chk_tph);
    };
    $scope.updateChkHemorragie = function(field) {
        $scope.dataSecours.data.chk_hemorragie = $scope.dataSecours.data.chk_hemorragie == 1 ? 0 : 1
        $rootScope.updateFiche(field, $scope.dataSecours.data.chk_hemorragie);
    };
$scope.updateChkPci = function(field) {
        $scope.dataSecours.data.chk_pci = $scope.dataSecours.data.chk_pci == 1 ? 0 : 1
        $rootScope.updateFiche(field, $scope.dataSecours.data.chk_pci);
    };
$scope.updateChkHc = function(field) {
        $scope.dataSecours.data.chk_hc = $scope.dataSecours.data.chk_hc == 1 ? 0 : 1
        $rootScope.updateFiche(field, $scope.dataSecours.data.chk_hc);
    };
    $scope.updateChkRecherches = function(field) {
        $scope.dataSecours.data.chk_rech = $scope.dataSecours.data.chk_rech == 1 ? 0 : 1
        $rootScope.updateFiche(field, $scope.dataSecours.data.chk_rech);
    };
    $scope.updateChkBsm = function(field) {
        $scope.dataSecours.data.chk_bsm = $scope.dataSecours.data.chk_bsm == 1 ? 0 : 1
        $rootScope.updateFiche(field, $scope.dataSecours.data.chk_bsm);
    };
    $scope.updateChkPulsar = function(field) {
        $scope.dataSecours.data.chk_pulsar = $scope.dataSecours.data.chk_pulsar == 1 ? 0 : 1
        $rootScope.updateFiche(field, $scope.dataSecours.data.chk_pulsar);
    };
    $scope.updateChkCro = function(field) {
        $scope.dataSecours.data.chk_cro = $scope.dataSecours.data.chk_cro == 1 ? 0 : 1
        $rootScope.updateFiche(field, $scope.dataSecours.data.chk_cro);
    };

    // Fonction - Affichage carte IGN
    $scope.showMap = function() {
        $window.open("http://pghm-isere.com/log");
    };
//re même fonction !!
    // Fonction - Affichage coordonnées GPS hélicoptère
    $scope.gpsHelico = function() {
        // Champ coordonnées - Conversion DD.DDDDDD -> DD°MM.MM'
        function formatNumber(number) {
            return (number < 1000 ? '0' : '') + number;
        }
        function formatNumberMM(number) {
            return (number < 10 ? '0' : '') + number;
        }
        function convert_xy (coord_dd) {
          coord_dd = coord_dd / 1000000 ;
          //console.log(coord_dd);
          var d = Math.floor(coord_dd);
          //console.log(d);
          var m = (coord_dd - d) * 60 * 100;
          //console.log(m);
          var m_entier = (coord_dd - d) * 60;
          var m_floor = Math.floor(m_entier);
          //console.log(formatNumberMM(m_floor));
          var m_dec = ((m_entier-m_floor)*100);
          //console.log(formatNumberMM(Math.floor(m_dec)));
          console.log(d+" "+formatNumberMM(m_floor)+"."+formatNumberMM(Math.floor(m_dec)));
          var coord_ddmmss = d + '°' + formatNumberMM(m_floor)+"."+formatNumberMM(Math.floor(m_dec)) + "'" ;
            return coord_ddmmss;
        }

        var lat_lon =   'N' + convert_xy(+$scope.dataSecours.data.loc_gps.substring(0,8)) + ' ' +
                        'E' + convert_xy(+$scope.dataSecours.data.loc_gps.substring(8,15));
        // Affichage de la fenêtre modal
        $rootScope.affichage(lat_lon);
    };

    // Fonction - Affichage coordonnées GPS hélicoptère
    $scope.gpsUtm = function() {
        //lecture valeur dans tab_secours
        var coord_utm =   $scope.dataSecours.data.loc_utm;
        // Affichage de la fenêtre modal
        $rootScope.affichage(coord_utm);
    };
})

.controller('moyensCtrl', function($rootScope, $scope, navTab, $filter, NgTableParams, valueSecours, ajaxMoyens) {
    // Mise en surbrillance de l'onglet actif
    $rootScope.navTab = navTab.get();

    // Liste des moyens disponibles - lst_personnels
    $scope.tableMoyensDisponibles = new NgTableParams({
        page: 1, // show first page
        count: 100, // count per page
        sorting: {ordre: 'asc', organisme: 'asc', lieu: 'asc', nom: 'asc'}
    }, {
        counts: [], // disabled navigation
        groupBy: 'type',
        total: 0, //function() {return getData().length;},
        getData: function($defer, params) {
            var filteredData = $rootScope.lstPersonnels;
            var orderedData = params.sorting() ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                filteredData;
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

    // Liste des moyens engagés
    $scope.tableMoyensEngages = new NgTableParams({
        page: 1, // show first page
        count: 20, // count per page
        sorting: {type: 'desc', nom: 'asc'}
    }, {
        counts: [], // disabled navigation
        groupBy: 'type',
        total: $rootScope.dataSecours.dataMoyens.data.length,
        getData: function($defer, params) {
            var filteredData = $rootScope.dataSecours.dataMoyens.data;
            var orderedData = params.sorting() ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                filteredData;
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

    // Fonction ajout d'un moyen
    $scope.addMoyens = function(user) {
        ajaxMoyens.add(valueSecours.id, user.type, user.organisme, user.lieu,
                       user.nom, user.prenom, user.grade, user.tph).then(function() {
            //user.secours_id = valueSecours.id;
            $rootScope.dataSecours.dataMoyens.data.push(user);
            $scope.tableMoyensEngages.total($scope.dataSecours.dataMoyens.data.length);
            $scope.tableMoyensEngages.reload();
        });
    };

    // Fonction supprimer un moyen
    $scope.deleteMoyens = function(user_nom, user_lieu) {
        ajaxMoyens.delete(valueSecours.id, user_nom, user_lieu).then(function() {
            console.log('delete', user_nom, user_lieu);
            ajaxMoyens.get(valueSecours.id).then(function(data) {
                $rootScope.dataSecours.dataMoyens = {data: data};
                $scope.tableMoyensEngages.total($scope.dataSecours.dataMoyens.data.length);
                $scope.tableMoyensEngages.reload();
                console.log('rechargement');
            });
        });
    };

    $scope.$watch('dataSecours.dataMoyens.data', function(newValue, oldValue) {
        if (angular.isDefined(newValue)) {
            $scope.tableMoyensEngages.total($scope.dataSecours.dataMoyens.data.length);
            $scope.tableMoyensEngages.reload();
        };
    });
})

.controller('victimesCtrl', function($rootScope, $scope, $http, navTab, ajaxVictimes, ajaxData, dataVictimes, valueSecours, valueEtat, convertTo) {
    // Mise en surbrillance de l'onglet actif
    $rootScope.navTab = navTab.get();

    // Fonction d'enregistrement des Victimes
    $rootScope.updateVictime = function(field, data) { // Tous les champs "normaux"
        // Sauvegarde dans la base de donnée
        ajaxVictimes.update(valueSecours.idVictime, field, data).then(function() {
        });
    };
    $rootScope.updateDate = function(field, data) { // Champ date de naissance
        // Sauvegarde dans la base de donnée
        ajaxVictimes.update(valueSecours.idVictime, field, convertTo.mySQLVictime(data)).then(function() {
        });
    };
    $rootScope.updateBlessures = function(field, data) { // Champ blessures
        // Sauvegarde dans la base de donnée
        data = angular.toJson(data); // Transformation au format JSON
        ajaxVictimes.update(valueSecours.idVictime, field, data).then(function() {
        });
    };

    // Liste des pays - Nationalité
    $scope.getPays = function(val) {
        var postData = {dataType: 'nationalites', val: val};
        return $http.post('js/services/data_tabData.php', postData).then(function(response){
            return response.data;
        });
    };

    // Liste lieux d'évacuation
    ajaxData.getEvacuation().then(function(data) {
        $rootScope.lstEvacuation = data;
    });

    // Liste état des victimes
    $rootScope.lstEtat = valueEtat;

    // Liste blessures des victimes
    $scope.selectedBlessures = {};
    $scope.selectedBlessures.blessures = [];
    ajaxData.getBlessures().then(function(data) {
        $scope.availableBlessures = data;
    });

    // Affichage du formulaire de modification
    $scope.isVisible = {display:'none'};
    $scope.isVisibleForm = function(victime) {
        // Remplissage du formulaire
        $scope.selectedNom          = victime.nom;
        $scope.selectedPrenom       = victime.prenom;
        $scope.selectedProfession   = victime.profession;
        $scope.selectedNationalite  = victime.nationalite;
        $scope.selectedAdresse      = victime.adresse;
        $scope.selectedFiliation    = victime.filiation;
        $scope.selectedEtat         = victime.etat;
        $scope.selectedVille        = victime.adresse_commune;
        $scope.selectedCommune      = victime.naissance_lieu;
        $scope.selectedTph          = victime.tph;
        $scope.selectedNaissance    = convertTo.dateVictime(victime.naissance_date);
        $scope.selectedEvacuation   = victime.evacuation;
        $scope.selectedSexe         = victime.sexe;
        $scope.selectedBlessures.blessures = angular.fromJson(victime.blessures);
        valueSecours.idVictime = victime.id;

        // Affichage du formulaire et désactivation des boutons d'édition
        $scope.isVisible = {};
        $scope.isDisabled = true;
    };

    // Fermeture du formulaire de modification
    $scope.notVisibleForm = function() {
        $scope.isVisible = {display:'none'};
        $scope.isDisabled = false;
        ajaxVictimes.get(valueSecours.id).then(function(data) { // Rechargement des victimes
            $rootScope.dataSecours.dataVictimes = {data: data};
            $scope.selectedBlessures.blessures=[];
        });
    };

    // Affichage des détails
    $scope.isVisibleDetails = {};
    $scope.visibleDetails = function(index) {
        $scope.isVisibleDetails[index] = !$scope.isVisibleDetails[index];
    };

    // Fonction ajout d'une victime
    $scope.addVictime = function() {
        $rootScope.dataSecours.dataVictimes = dataVictimes.add(valueSecours.id);
    };
})

.controller('deroulementCtrl', function($rootScope, $scope, navTab, ajaxDeroulement, dataEvenement, valueSecours, convertTo) {
    // Mise en surbrillance de l'onglet actif
    $rootScope.navTab = navTab.get();

    // Fonction ajout d'un événement
    $scope.addEvents = function(event) {
        $rootScope.dataSecours.dataDeroulement = dataEvenement.add(event, valueSecours.id);
    };

    // Fonction suppression d'un événement
    $scope.deleteEvents = function(id_evenement) {
        // Suppression
        ajaxDeroulement.delete('delete', id_evenement).then(function() {
            // Rechargement
            ajaxDeroulement.get(valueSecours.id).then(function(data) {
                $rootScope.dataSecours.dataDeroulement = {data: data};
            });
        });
    };

    // Fonctions d'édition des événements
    $scope.editedItem = null;
    $scope.editingText = false;
    $scope.startEditing = function(evenement, type) {
        if (type == 'text') {
            $scope.editedItemText = $scope.editingText = evenement.deroulement_id;
        } else {
            $scope.editedItemGdh = $scope.editingGdh = evenement.deroulement_id;
            // Récupération de l'heure uniquement !!pourquoi ?
            $scope.gTime = evenement.deroulement_gdh.substring(11,13) + evenement.deroulement_gdh.substring(14,16);

        }
    }

    $scope.doneEditing = function(evenement, type, gTime, user) {
        if (type == 'text') { // Traitement du texte
            $scope.editingText = false;
            $scope.editedItemText = null;
            ajaxDeroulement.update('update', evenement.deroulement_id,
                                   evenement.deroulement_gdh, convertTo.phraseUpcase(evenement.deroulement_texte))
            .then(function() {
                ajaxDeroulement.get(valueSecours.id).then(function(data) {
                    $rootScope.dataSecours.dataDeroulement = {data: data};
                });
                console.log('Update déroulement...');
            });
        } else {
            if (user.$valid) { // Traitement de la date
                $scope.isVisibleAlert = false;
                var gDate = evenement.deroulement_gdh.substring(0, 11);
                gTime = gTime.substring(0,2) + ':' + gTime.substring(2,4);
                evenement.deroulement_gdh = gDate + gTime + ':00';
                $scope.editingGdh = false;
                $scope.editedItemGdh = null;
                ajaxDeroulement.update('update', evenement.deroulement_id,
                                       evenement.deroulement_gdh, convertTo.phraseUpcase(evenement.deroulement_texte))
                .then(function() {
                    ajaxDeroulement.get(valueSecours.id).then(function(data) {
                        $rootScope.dataSecours.dataDeroulement = {data: data};
                    });
                    console.log('Update déroulement...');
                });
            } else {
                $scope.isVisibleAlert = true;
            }

        }
    }
})

.controller('rsgtsCtrl', function($rootScope, $scope, navTab, ajaxSecours, valueSecours ) {
    // Mise en surbrillance de l'onglet actif
    $rootScope.navTab = navTab.get();

    // Fonction de mise à jour des Checkbox
    $scope.updateCheck = function(field) {
        $scope.dataSecours.data.rsgts_check = $scope.dataSecours.data.rsgts_check == 1 ? 0 : 1
        $rootScope.updateFiche(field, $scope.dataSecours.data.rsgts_check);
    };
    $scope.updateCheckRelevage = function(field) {
        $scope.dataSecours.data.chk_mprelevage = $scope.dataSecours.data.chk_mprelevage == 1 ? 0 : 1
        $rootScope.updateFiche(field, $scope.dataSecours.data.chk_mprelevage);
    };
    $scope.updateCheckCollier = function(field) {
        $scope.dataSecours.data.chk_mpcollier = $scope.dataSecours.data.chk_mpcollier == 1 ? 0 : 1
        $rootScope.updateFiche(field, $scope.dataSecours.data.chk_mpcollier);
    };
    $scope.updateCheckAttelle = function(field) {
        $scope.dataSecours.data.chk_mpattelle = $scope.dataSecours.data.chk_mpattelle == 1 ? 0 : 1
        $rootScope.updateFiche(field, $scope.dataSecours.data.chk_mpattelle);
    };
    $scope.updateCheckKed = function(field) {
        $scope.dataSecours.data.chk_mpked = $scope.dataSecours.data.chk_mpked == 1 ? 0 : 1
        $rootScope.updateFiche(field, $scope.dataSecours.data.chk_mpked);
    };
    $scope.updateCheckPerche = function(field) {
        $scope.dataSecours.data.chk_mpperche = $scope.dataSecours.data.chk_mpperche == 1 ? 0 : 1
        $rootScope.updateFiche(field, $scope.dataSecours.data.chk_mpperche);
    };
    $scope.updateCheckTreuillage = function(field) {
        $scope.dataSecours.data.chk_mptreuillage = $scope.dataSecours.data.chk_mptreuillage == 1 ? 0 : 1
        $rootScope.updateFiche(field, $scope.dataSecours.data.chk_mptreuillage);
    };
    $scope.updateCheckMid = function(field) {
        $scope.dataSecours.data.chk_mpmid = $scope.dataSecours.data.chk_mpmid == 1 ? 0 : 1
        $rootScope.updateFiche(field, $scope.dataSecours.data.chk_mpmid);
    };
    $scope.updateCheckMam = function(field) {
        $scope.dataSecours.data.chk_mpmam = $scope.dataSecours.data.chk_mpmam == 1 ? 0 : 1
        $rootScope.updateFiche(field, $scope.dataSecours.data.chk_mpmam);
    };
    $scope.updateCheckO2 = function(field) {
        $scope.dataSecours.data.chk_mpo2 = $scope.dataSecours.data.chk_mpo2 == 1 ? 0 : 1
        $rootScope.updateFiche(field, $scope.dataSecours.data.chk_mpo2);
    };
})
