angular.module('asm.modal', [])

.controller('loginCtrl', function ($rootScope, $scope, $modal, $location) {

    $scope.modalLogin = function (pageConfig, dataType) { // Modal - Login
        $scope.pageConfig = pageConfig;
        var modalInstance = $modal.open({
            templateUrl: 'partials/login.html',
            controller: 'modalLoginCtrl',
            size: 'sm',
            backdrop: false, 
            resolve: {
                pageConfig: function () { // Type de données à modifier : unite / data
                return $scope.pageConfig;
                }
            }
        });
        
        modalInstance.result.then(function (pageConfig) {
            $location.path('/page/config/' + pageConfig);
            $rootScope.dataType = dataType;
        });
    };
})

.controller('modalLoginCtrl', function ($scope, $modalInstance, $timeout, pageConfig) { // Dépendance Modal Instance
    
    $scope.ok = function (mdp) {
        if (mdp && (mdp == 'asm-admin')) { // Définition du mot de passe "Administration" -> asm-admin
            $modalInstance.close(pageConfig);
        } else {
            $scope.password = ""; 
            $scope.mdp = true;
            document.getElementById("password").focus();
            $timeout(function() {
                $scope.mdp = false;
            }, 2000);
        }
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
})

.controller('listeLieuxCtrl', function ($rootScope, $scope, $modal, ajaxLieux) {
    
    $scope.getLieux = function (val) { // Modal - Recherche des lieux
        if (val == null) { // Test si le champ recherche est vide
            return;
        }
        
        // Récupération de la recherche
        ajaxLieux.get(val).then(function(data) {
            $scope.items = data;
            
            if (data != 0) { // Recherche du lieu positive
                var modalInstance = $modal.open({
                    templateUrl: 'partials/lieux_liste.html',
                    controller: 'modalListeLieuxCtrl',
                    size: 'lg',
                    backdrop: false, 
                    resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $rootScope.dataSecours.data.loc_lieu  = selectedItem.lieu;
                    $rootScope.dataSecours.data.loc_alt  = selectedItem.altitude;
                    $rootScope.dataSecours.data.loc_massif  = selectedItem.massif;
                    $rootScope.dataSecours.data.loc_commune  = selectedItem.commune;
                    $rootScope.dataSecours.data.loc_gps  = selectedItem.gps;
		    $rootScope.dataSecours.data.geom  = selectedItem.geom;
            $rootScope.dataSecours.data.loc_utm  = selectedItem.utm;

                    $rootScope.updateFiche('loc_lieu', selectedItem.lieu);
                    $rootScope.updateFiche('loc_alt', selectedItem.altitude);
                    $rootScope.updateFiche('loc_gps', selectedItem.gps);
                    $rootScope.updateFiche('loc_commune', selectedItem.commune);
                    $rootScope.updateFiche('loc_massif', selectedItem.massif);
                    $rootScope.updateFiche('geom', selectedItem.gps);
                    $rootScope.updateFiche('loc_utm', selectedItem.utm);

                });
            } else { // Pas de lieux trouvés - Recherche du lieu négative
                var modalInstance = $modal.open({
                    templateUrl: 'partials/lieux_ajout.html',
                    controller: 'modalListeLieuxCtrl',
                    size: 'lg',
                    backdrop: false, 
                    resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    selectedItem.commune = selectedItem.commune.commune + ' (' + selectedItem.commune.dept + ')';
                    $rootScope.dataSecours.data.loc_lieu  = selectedItem.lieu;
                    $rootScope.dataSecours.data.loc_alt  = selectedItem.altitude;
                    $rootScope.dataSecours.data.loc_massif  = selectedItem.massif;
                    $rootScope.dataSecours.data.loc_commune  = selectedItem.commune;
                    $rootScope.dataSecours.data.loc_gps  = selectedItem.gps;
		            $rootScope.dataSecours.data.geom  = selectedItem.geom;
                    $rootScope.dataSecours.data.loc_utm  = selectedItem.utm;
                    
                    $rootScope.updateFiche('loc_lieu', selectedItem.lieu);
                    $rootScope.updateFiche('loc_alt', selectedItem.altitude);
                    $rootScope.updateFiche('loc_gps', selectedItem.gps);
                    $rootScope.updateFiche('loc_commune', selectedItem.commune);
                    $rootScope.updateFiche('loc_massif', selectedItem.massif);
                    $rootScope.updateFiche('loc_utm', selectedItem.utm);
		    $rootScope.updateFiche('geom', selectedItem.gps);

		    ajaxLieux.add(selectedItem.lieu, selectedItem.massif, selectedItem.commune,
                                  selectedItem.altitude, selectedItem.gps, selectedItem.utm, selectedItem.geom).then(function() { // Enregistrement dans la base
                    });
                });
            };
        });
    };
})

.controller('dataLieuCtrl', function ($rootScope, $scope, $modal, ajaxLieux) {
    
    $scope.importLieu = function () { // Modal - Recherche des lieux
        
        // Récupération de la recherche
        ajaxLieux.getDataLieu().then(function(data) {
            $scope.items = data;
            
            if (data != 0) { // Recherche du lieu positive
                var modalInstance = $modal.open({
                    templateUrl: 'partials/lieux_ajout.html',
                    controller: 'modalListeLieuxCtrl',
                    size: 'lg',
                    backdrop: false, 
                    resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    if (angular.isObject(selectedItem.commune) == true) {
                        console.log ('Object');
                        selectedItem.commune = selectedItem.commune.commune + ' (' + selectedItem.commune.dept + ')';
                    };
                    
                    $rootScope.dataSecours.data.loc_lieu  = selectedItem.lieu;
                    $rootScope.dataSecours.data.loc_alt  = selectedItem.altitude;
                    $rootScope.dataSecours.data.loc_massif  = selectedItem.massif;
                    $rootScope.dataSecours.data.loc_commune  = selectedItem.commune;
                    $rootScope.dataSecours.data.loc_gps  = selectedItem.gps;
		            $rootScope.dataSecours.data.geom  = selectedItem.geom;
                    $rootScope.dataSecours.data.loc_utm  = selectedItem.utm;

                    $rootScope.updateFiche('loc_lieu', selectedItem.lieu);
                    $rootScope.updateFiche('loc_alt', selectedItem.altitude);
                    $rootScope.updateFiche('loc_gps', selectedItem.gps);
                    $rootScope.updateFiche('loc_commune', selectedItem.commune);
                    $rootScope.updateFiche('loc_massif', selectedItem.massif);
                    $rootScope.updateFiche('loc_utm', selectedItem.utm);
		    $rootScope.updateFiche('geom', selectedItem.gps);

                    ajaxLieux.add(selectedItem.lieu, selectedItem.massif, selectedItem.commune,
                        selectedItem.altitude, selectedItem.gps, selectedItem.utm, selectedItem.geom).then(function() { // Enregistrement dans la base
                    });
                });
            };
        });
    };
})

.controller('modalListeLieuxCtrl', function ($rootScope, $scope, $modalInstance, items) { // Dépendance Modal Instance
    $scope.items = items;
    $scope.selected = {item: $scope.items[0]};
    
    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
})

.controller('deleteVictimeCtrl', function ($rootScope, $scope, $modal, ajaxVictimes, valueSecours) {

    $scope.deleteVictime = function (size, text, id_victimes) { // Modal - Suppression d'une victime
        if (text == null) {text = 'la victime sans nom';}
        $scope.text = 'Voulez-vous procéder à la suppression de ' + text + ' ?';
        var modalInstance = $modal.open({
            templateUrl: 'partials/confirm.html',
            controller: 'modalDeleteVictimeCtrl',
            size: size,
            backdrop: false, 
            resolve: {
                modalText: function () {
                return $scope.text;
                }
            }
        });
        
        modalInstance.result.then(function () {
            ajaxVictimes.delete('delete', id_victimes).then(function() {
                ajaxVictimes.get(valueSecours.id).then(function(data) {
                    $rootScope.dataSecours.dataVictimes = {data: data};
                });
            });
        });
    };
})

.controller('modalDeleteVictimeCtrl', function ($scope, $modalInstance, modalText) { // Dépendance Modal Instance
    $scope.modalText = modalText;
    
    $scope.ok = function () {
        $modalInstance.close();
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
})

.controller('confirmCtrl', function ($rootScope, $scope, $modal, ajaxVictimes, valueSecours) {

    $scope.confirm = function (size, text) { // Modal - Traitement CNIL
        $scope.text = 'Voulez-vous procéder ' + text + ' ?';
        var modalInstance = $modal.open({
            templateUrl: 'partials/confirm.html',
            controller: 'modalConfirmCtrl',
            size: size,
            backdrop: false, 
            resolve: {
                modalText: function () {
                return $scope.text;
                }
            }
        });
        
        modalInstance.result.then(function () {
            ajaxVictimes.cnil('cnil', valueSecours.id).then(function() {
                ajaxVictimes.get(valueSecours.id).then(function(data) { // Rechargement de la dernière fiche
                    $rootScope.dataSecours.dataVictimes = {data: data};
                });
            });
        });
    };
})

.controller('modalConfirmCtrl', function ($scope, $modalInstance, modalText) { // Dépendance Modal Instance
    $scope.modalText = modalText;
    
    $scope.ok = function () {
        $modalInstance.close();
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
})

.controller('deleteCtrl', function ($rootScope, $scope, $modal, ajaxSecours, navBar, valueSecours) {

    $scope.open = function (size, text) { // Modal - Suppression d'une fiche secours
        $scope.text = 'Voulez-vous supprimer : ' + text + ' ?';
        var modalInstance = $modal.open({
            templateUrl: 'partials/modal.html',
            controller: 'modalInstanceCtrl',
            size: size,
            backdrop: false, 
            resolve: {
                modalText: function () {
                return $scope.text;
                }
            }
        });
        
        modalInstance.result.then(function () {
            ajaxSecours.deleteSecours('remove', valueSecours.id).then(function() {
                $rootScope.dataSecours = navBar.init(); // Rechargement de la dernière fiche
            });
        });
    };
})

.controller('modalInstanceCtrl', function ($scope, $modalInstance, modalText) { // Dépendance Modal Instance
    $scope.modalText = modalText;
    
    $scope.ok = function () {
        $modalInstance.close();
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
})

.controller('aboutCtrl', function ($scope, $modal) {

    $scope.modalAbout = function () { // Modal - A propos
        var modalInstance = $modal.open({
            templateUrl: 'partials/about.html',
            controller: 'modalAboutCtrl',
            size: 'lg',
            backdrop: false, 
            resolve: {
                modalText: function () {}
            }
        });
        
        modalInstance.result.then(function () {
        });
    };
})

.controller('modalAboutCtrl', function ($scope, $modalInstance, modalText) { // Dépendance Modal Instance
    $scope.modalText = modalText;
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
})

.controller('bdspCtrl', function ($rootScope, $scope, $modal, $filter, convertTo) {

    $scope.bdspModal = function () { // CRO BDSP
        //déterminer type intervention
        inter = $rootScope.dataSecours.data.inter;
        //déterminer département
        dept = ($rootScope.dataSecours.data.loc_commune).substr(-5, 2);
        //déterminer message
        switch (inter) {
            case 'ORSEC':
                model="orsec" + dept + ".html";
                break;
            case 'EVASAN':
                model="evasan.html";
                break;
            case 'GENDARMERIE':
                model="gendarmerie.html";
                break;
            case 'DIVERS':
                model="divers.html";
                break;
            default:
                model="orsec38.html";
        }
        var dateBdsp = $rootScope.dataSecours.data;
        if (dateBdsp.alerte_gdh.length == 19) {
            $scope.gdhBdsp = $filter('date')($filter('dateToISO')(dateBdsp.alerte_gdh), "dd/MM/yyyy - HH:mm");
        } else {
            //var dateBdspToMysql = convertTo.dateAlerteToMYSQL(dateBdsp.alerte_gdh);
            //console.log(dateBdspToMysql);
            //$scope.gdhBdsp = $filter('date')($filter('dateToISO')(dateBdspToMysql), "dd/MM/yyyy - HH:mm");
	    $scope.gdhBdsp = $filter('date')($filter('dateToISO')(dateBdsp.alerte_gdh), "dd/MM/yyyy - HH:mm");
        };
        // Déroulement
        var deroulement = $rootScope.dataSecours.dataDeroulement.data;
        for (var i = 0; i < deroulement.length; i++) { // Récupération du début et fin du secours
            if (deroulement[i].deroulement_texte.indexOf('Départ des secouristes') != -1) {
                $scope.debut = 
                    $filter('date')($filter('dateToISO')(deroulement[i].deroulement_gdh), "HH:mm") + ' - ' +
                    deroulement[i].deroulement_texte;
            };
            if (deroulement[i].deroulement_texte.indexOf('Fin du secours') != -1) {
                $scope.fin = 
                    $filter('date')($filter('dateToISO')(deroulement[i].deroulement_gdh), "HH:mm") + ' - ' +
                    deroulement[i].deroulement_texte;
            };
        }
        // Victimes
        var victimes = $rootScope.dataSecours.dataVictimes.data;
        
        if (victimes.length > 0) {
            var victime = []; var nb_rech = nb_ass = nb_bl = nb_dcd = nb_mal = 0 ;
            var victime_id = [];
            var victime_msg = [];
            //Assisté', 'Malade', 'Blessé', 'Décédé', 'Recherché
            for (var i = 0; i < victimes.length; i++) { // Récupération des victimes
                var blessures = angular.fromJson(victimes[i].blessures);
                if (blessures.length > 0) {
                    var blessuresVictime = [];
                    for (var b = 0; b < blessures.length; b++) {
                        blessuresVictime.push(blessures[b].blessures);
                    };
                } else {
                    blessuresVictime = ['Aucune blessure'];
                }
                victime.push(
                    '\nVictime N°' + (i + 1) + '\n' +
                    'Sexe : ' + victimes[i].sexe +
                    ' - Age : ' + $filter('date')($filter('dateToAge')(victimes[i].naissance_date)) + '\n' +
                    //' - Résidence : ' + victimes[i].adresse_commune + '\n' + 
                    'Evacuation : ' + victimes[i].evacuation + '\n' +
                    'Etat : '+ victimes[i].etat+' - ' + blessuresVictime
                );

                victime_msg.push(
                    '%0D%0AVictime N°' + (i + 1) + '%0D%0A' +
                    'Sexe : ' + victimes[i].sexe +
                    ' - Age : ' + $filter('date')($filter('dateToAge')(victimes[i].naissance_date)) + '%0D%0A' +
                    //' - Résidence : ' + victimes[i].adresse_commune + '\n' + 
                    'Evacuation : ' + victimes[i].evacuation + '%0D%0A' +
                    'Etat : '+ victimes[i].etat+' - ' + blessuresVictime
                );

                if (victimes[i].etat=="Assisté") {nb_ass++;}
                if (victimes[i].etat=="Malade") {nb_mal++;}
                if (victimes[i].etat=="Blessé") {nb_bl++;}
                if (victimes[i].etat=="Décédé") {nb_dcd++;}
                if (victimes[i].etat=="Recherché") {nb_rech++;}

                date_naiss = new Date(victimes[i].naissance_date);
                victime_id.push((i + 1) + '. ' + victimes[i].nom + ' ' + victimes[i].prenom +
                    ' - Sexe : ' + victimes[i].sexe +
                    ' - Naissance le : ' + date_naiss.toLocaleDateString("fr-FR") + ' à ' + victimes[i].naissance_lieu );
            }
            if (nb_ass>0){
                victime.unshift('Nombre de victime(s) assistée(s): ' + nb_ass );
                victime_msg.unshift('Nombre de victime(s) assistée(s): ' + nb_ass );
            }
            if (nb_mal>0){
                victime.unshift('Nombre de victime(s) malade(s): ' + nb_mal );
                victime_msg.unshift('Nombre de victime(s) malade(s): ' + nb_mal );
            }
            if (nb_bl>0){
                victime.unshift('Nombre de victime(s) blessée(s): ' + nb_bl );
                victime_msg.unshift('Nombre de victime(s) blessée(s): ' + nb_bl );
            }
            if (nb_dcd>0){
                victime.unshift('Nombre de victime(s) décédée(s): ' + nb_dcd );
                victime_msg.unshift('Nombre de victime(s) décédée(s): ' + nb_dcd );
            }
            if (nb_rech>0){
                victime.unshift('Nombre de victime(s) recherchée(s): ' + nb_rech );
                victime_msg.unshift('Nombre de victime(s) recherchée(s): ' + nb_rech );
            }
            // victime.unshift(
            //         'Nombre de victime(s): ' + victimes.length
            // );
            $scope.victime = victime.join('\n');
            $scope.victime_id = victime_id.join('\n');
            $scope.victime_msg = victime_msg.join('%0D%0A');

        } else {
            $scope.victime = 'Aucune victime';
            $scope.victime_msg = 'Aucune victime';

        }
 
        //Type d'opération
        var type = $rootScope.dataSecours.data.caravane;
        if (type==7) {
            type= "INTERVENTION CONFIEE A LA GENDARMERIE - ";
        } else if (type==6) {
            type= "INTERVENTION CONFIEE AUX PISTEURS - ";
        } else if (type==5) {
            type= "INTERVENTION CONFIEE AU SDIS - ";
        } else if (type==4) {
            type= "AUCUN MOYEN ENGAGE - ";
        } else if (type==3) {
            type= "OPERATION TERRESTRE - ";
        } else if (type==2) {
            type = "OPERATION MIXTE - ";
        } else {
            type = "OPERATION HELIPORTEE - ";
        }
        $scope.type = type;

        // Moyens engagés
        var moyens = $rootScope.dataSecours.dataMoyens.data;
        if (moyens.length > 0) {
            var helico = [], med= [], aut = [], nbPghm = 0, nbSmur = 0, nbCyno = 0, nbAutre = 0;
            for (var i = 0; i < moyens.length; i++) {
                if (moyens[i].type == 'Hélicoptère') { // Moyens aériens
                    helico.push(moyens[i].nom + ' ' + moyens[i].organisme + ' - ' + moyens[i].lieu);
                }
                if (moyens[i].type == 'Secouriste') { // Moyens aériens
                    nbPghm ++;
                }
                if (moyens[i].type == 'Médecin') { // Moyens aériens
                    nbSmur ++;
                    med.push(moyens[i].organisme + ' ' + moyens[i].lieu + ' ' + moyens[i].nom);
                }
                if (moyens[i].type == 'Equipe cynophile') { // Moyens aériens
                    nbCyno ++;
                }
                if (moyens[i].type == 'Autre') { // Moyens aériens
                    nbAutre ++;
                    aut.push(moyens[i].organisme + ' ' + moyens[i].lieu + ' ' + moyens[i].nom);
                }
            }
            $scope.helico = helico.join(', ') !='' ? helico.join(', ') : 'Aucun moyen aérien';
            if (nbSmur>0) {med.unshift("OPERATION MEDICALISEE"); }
            $scope.med = med.join(', ') !='' ? med.join(', ') : 'Opération non médicalisée';
            if (nbAutre>0) {aut.unshift(" - AUTRE(S) SECOURISTE(S)"); }
            $scope.aut = aut.join(', ') !='' ? aut.join(', ') : '';
        } else {
            $scope.helico = 'Aucun moyen aérien';
            $scope.med = 'Opération non médicalisée';
            nbAutre = nbCyno = nbPghm = nbSmur = 0;
        }
        
        $scope.nbMoyens = {};
        if (nbPghm>0) {$scope.nbMoyens.pghm = nbPghm + ' PGHM';} else {$scope.nbMoyens.pghm = "";}
        if (nbSmur>0) {$scope.nbMoyens.smur = ' - '+ nbSmur + ' MEDECIN(S)';} else {$scope.nbMoyens.smur = "";}
        if (nbCyno>0) {$scope.nbMoyens.cyno = ' - '+ nbCyno + ' EQUIPE(S) CYNOPHILE(S)';} else {$scope.nbMoyens.cyno = "";}
        if (nbAutre>0) {$scope.nbMoyens.autre = ' - '+ nbAutre + ' AUTRES SECOURISTES ';} else {$scope.nbMoyens.autre = "";}
        
        var modalInstance = $modal.open({
            templateUrl: 'partials/'+ model,
            controller: 'modalBdspCtrl',
            size: 'lg',
            backdrop: false, 
            resolve: {
                gdhBdsp: function() {
                    return $scope.gdhBdsp;
                },
                txtDebut: function () {
                return $scope.debut;
                },
                txtFin: function () {
                return $scope.fin;
                },
                txtVictimes: function () {
                return $scope.victime;
                },
                txtVictimes_id: function () {
                return $scope.victime_id;
                },
                txtVictimes_msg: function () {
                return $scope.victime_msg;
                },
                txtType: function () {
                return $scope.type;
                },
                txtMed: function () {
                return $scope.med;
                },
                txtAut: function () {
                return $scope.aut;
                },
                txtHelico: function () {
                return $scope.helico;
                },
                nbMoyens: function () {
                return $scope.nbMoyens;
                }
            }
        });
        
        modalInstance.result.then(function () {
        });
    };
})

.controller('modalBdspCtrl', function ($scope, $modalInstance, gdhBdsp, txtDebut, txtFin, txtVictimes, txtVictimes_id, txtVictimes_msg, txtType, txtMed, txtHelico, txtAut, nbMoyens) { // Dépendance Modal Instance
    $scope.gdhBdsp = gdhBdsp;
    $scope.txtDebut = txtDebut;
    $scope.txtFin = txtFin;
    $scope.txtVictimes = txtVictimes;
    $scope.txtVictimes_id = txtVictimes_id;
    $scope.txtVictimes_msg = txtVictimes_msg;
    $scope.txtType = txtType;
    $scope.txtMed = txtMed;
    $scope.txtAut = txtAut;
    $scope.txtHelico = txtHelico;
    $scope.nbMoyens = nbMoyens;
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
})
