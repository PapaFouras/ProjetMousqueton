'use strict';

/* Module Services */

angular.module('asm.services', [])

.value('valueSecours', {})
//prévoir ne pas écrire en dur
.value('valueEtat', ['Assisté', 'Malade', 'Blessé', 'Décédé', 'Recherché'])
.value('valueMeteo', ['Soleil', 'Couvert', 'Nuages', 'Pluie', 'Brouillard', 'Neige', 'Nuit'])
.value('valueVent', ['Pas de vent', 'Vent faible', 'Vent fort', 'Tempête'])
.value('valueInter', ['ORSEC', 'EVASAN', 'GENDARMERIE', 'DIVERS'])
.value('valueZone', ['tout', 'dept38', 'HuezGD'])

.factory('convertTo', function($filter) {  // Fonction de conversion des dates au format mySQL
    return {
        mySQL: function(data) {
            data = $filter('date')(new Date(),"yyyy-MM-dd HH:mm:ss");
            return data
        },
        mySQLVictime: function(data) {
            data = data.split("/");
            data = new Date(data[2], data[1]-1, data[0]);
            data = $filter('date')(data,"yyyy-MM-dd HH:mm:ss");
            return data
        },
        phraseUpcase: function(data) {
            var data = data.split(/\.\s|\./);
            for (var i=0; i < data.length; i++) {
                data[i] = data[i].replace(/^[A-Za-z0-9àáâãäåçèéêëìíîïðòóôõöùúûüýÿ]/, function($0) {
                    return $0.toUpperCase();
                });
            };
            var data = data.join('. ');
            return data;
        },
        dateVictime: function(data) {
            if (data) {
                data = data.substring(0,10) + 'T' + data.substring(11,19) + '.000';
                data = $filter('date')(data, "ddMMyyyy");
                return data
            }
        },
        dateAlerteToMYSQL: function(data) {
            if (data) {
                data = data.substring(0,4) + '-' + data.substring(4,6) + '-' + data.substring(6,8) + ' ' +
                        data.substring(8,10) + ':' + data.substring(10,12) + ':00';
                return data;
            };
        },
        dateMaskToMYSQL: function(data) {
            if (data) {
                data = data.substring(4,8) + '-' + data.substring(2,4) + '-' + data.substring(0,2) + ' 00:00:00';
                return data;
            };
        }
    }
})

// Page -> Lieux
.factory('ajaxLieux', function($http) {
    return {
        get: function(val) { // Récupération des données de tab_moyens
            var postData = {crud: 'get', val: val};
            return $http.post('js/services/data_tabLieux.php', postData).then(function(response){
                return response.data;
            });
        },
        add: function(lieu, massif, commune, altitude, gps) {
            var postData = {crud: 'add', lieu: lieu, massif: massif, commune: commune,
                           altitude: altitude, gps: gps};
            return $http.post('js/services/data_tabLieux.php', postData).then(function() {
            })
        },
        getDataLieu: function() { // Récupération des données de tab_moyens
            var postData = {crud: 'lieu'};
            return $http.post('js/services/data_tabLieux.php', postData).then(function(response){
                return response.data;
            });
        },
    }
})

// Page -> Personnels
.factory('ajaxMoyens', function($http) {
    return {
        get: function(id_secours) { // Récupération des données de tab_moyens
            var postData = {crud: 'get', id_secours: id_secours};
            return $http.post('js/services/data_tabMoyens.php', postData).then(function(response) {
                return response.data;
            })
        },
        add: function(id_secours, type, organisme, lieu, nom, prenom, grade, tph) { // Ajout d'un moyen
            var postData = {crud: 'add', id_secours: id_secours, type: type, organisme: organisme,
                           lieu: lieu, nom: nom, prenom: prenom, grade: grade, tph: tph};
            return $http.post('js/services/data_tabMoyens.php', postData).then(function() {
            })
        },
        delete: function(id_secours, moyen_nom, moyen_lieu) { // Suppression d'un événement
            var postData = {crud: 'delete', id_secours: id_secours, moyen_nom: moyen_nom, moyen_lieu: moyen_lieu};
            return $http.post('js/services/data_tabMoyens.php', postData).then(function() {
            })
        }
    }
})

// Page -> Victimes
.factory('ajaxData', function($http) {
    return{
        getEvacuation: function() { // Récupération des données de lst_evacuation
            var postData = {dataType: 'evacuation'};
            return $http.post('js/services/data_tabData.php', postData).then(function(response) {
                return response.data;
            })
        },
        getBlessures: function() { // Récupération des données de lst_bessures
            var postData = {dataType: 'blessures'};
            return $http.post('js/services/data_tabData.php', postData).then(function(response) {
                return response.data;
            })
        },
        getPersonnels: function() { // Récupération des données de lst_personnels
            var postData = {dataType: 'personnels'};
            return $http.post('js/services/data_tabData.php', postData).then(function(response) {
                return response.data;
            })
        },
        getActivites: function() { // Récupération des données de lst_activites
            var postData = {dataType: 'activites'};
            return $http.post('js/services/data_tabData.php', postData).then(function(response) {
                return response.data;
            })
        },
        getMassifs: function() { // Récupération des données de lst_activites
            var postData = {dataType: 'massifs'};
            return $http.post('js/services/data_tabData.php', postData).then(function(response) {
                return response.data;
            })
        }
    }
})

.factory('ajaxVictimes', function($http) {
    return{
        get: function(id_secours) { // Récupération des données de tab_deroulement
            var postData = {crud: 'get', id_secours: id_secours};
            return $http.post('js/services/data_tabVictimes.php', postData).then(function(response) {
                return response.data;
            })
        },
        add: function(crud, id_secours, gdh, texte) { // Ajout d'un événement
            var postData = {crud: crud, id_secours: id_secours, gdh: gdh, texte: texte};
            return $http.post('js/services/data_tabVictimes.php', postData).then(function(response) {
            })
        },
        delete: function(crud, id_victime) { // Suppression d'un événement
            var postData = {crud: crud, id_victime: id_victime};
            return $http.post('js/services/data_tabVictimes.php', postData).then(function(response) {
            })
        },
        cnil: function(crud, id_secours) { // Suppression des noms et prénoms des victimes (CNIL)
            var postData = {crud: crud, id_secours: id_secours};
            return $http.post('js/services/data_tabVictimes.php', postData).then(function(response) {
            })
        },
        update: function(id_victime, field, data) { // Mise à jour d'un événement
            var postData = {crud: 'update', id_victime: id_victime, field: field, data: data};
            return $http.post('js/services/data_tabVictimes.php', postData).then(function() {
            })
        }
    }
})

.factory('dataVictimes', function(ajaxVictimes) {
    return {
        get: function(secours_id) {
            var newVictimes = {};
            newVictimes = {secours_id: secours_id};
            ajaxVictimes.get(secours_id).then(function(data) {
                newVictimes.dataVictimes = {data: data};
            });
            return newVictimes;

        },
        add: function(secours_id) {
            var newVictimes = {};
            newVictimes = {secours_id: secours_id};
            ajaxVictimes.add('add', secours_id).then(function() {
                ajaxVictimes.get(secours_id).then(function(data) {
                    newVictimes.data = data;
                });
            });
            return newVictimes;
        }
    }     
})

// Page -> Déroulement
.factory('ajaxDeroulement', function($http) {
    return{
        get: function(id_secours) { // Récupération des données de tab_deroulement
            var postData = {crud: 'get', id_secours: id_secours};
            return $http.post('js/services/data_tabDeroulement.php', postData).then(function(response) {
                return response.data;
            })
        },
        add: function(crud, id_secours, gdh, texte) { // Ajout d'un événement
            var postData = {crud: crud, id_secours: id_secours, gdh: gdh, texte: texte};
            return $http.post('js/services/data_tabDeroulement.php', postData).then(function(response) {
            })
        },
        delete: function(crud, id_evenement) { // Suppression d'un événement
            var postData = {crud: crud, id_evenement: id_evenement};
            return $http.post('js/services/data_tabDeroulement.php', postData).then(function(response) {
            })
        },
        update: function(crud, id_evenement, gdh, texte) { // Mise à jour d'un événement
            var postData = {crud: crud, id_evenement: id_evenement, gdh:gdh, texte: texte};
            return $http.post('js/services/data_tabDeroulement.php', postData).then(function(response) {
            })
        }
    }
})

.factory('dataEvenement', function(ajaxDeroulement, convertTo) {
    return {
        get: function(secours_id) {
            var newEvent = {};
            newEvent = {secours_id: secours_id};
            ajaxDeroulement.get(secours_id).then(function(data) {
                newEvent.dataDeroulement = {data: data};
            });
            return newEvent;

        },
        add: function(event, secours_id) {
            var newEvent = {};
            newEvent = {
                secours_id: secours_id,
                deroulement_gdh: convertTo.mySQL(new Date())
            };
        
            switch (event) {
                case 'debut':
                newEvent.deroulement_texte = 'Départ des secouristes';
                ajaxDeroulement.add('add', newEvent.secours_id, newEvent.deroulement_gdh, newEvent.deroulement_texte)
                .then(function() {
                    ajaxDeroulement.get(secours_id).then(function(data) {
                        newEvent.data = data;
                    });
                });
                break;
                case 'arrive':
                newEvent.deroulement_texte = 'Arrivée des secouristes sur les lieux du secours';
                ajaxDeroulement.add('add', newEvent.secours_id, newEvent.deroulement_gdh, newEvent.deroulement_texte)
                .then(function() {
                    ajaxDeroulement.get(secours_id).then(function(data) {
                        newEvent.data = data;
                    });
                });
                break;
                case 'depart':
                newEvent.deroulement_texte = 'Départ des secouristes des lieux du secours';
                ajaxDeroulement.add('add', newEvent.secours_id, newEvent.deroulement_gdh, newEvent.deroulement_texte)
                .then(function() {
                    ajaxDeroulement.get(secours_id).then(function(data) {
                        newEvent.data = data;
                    });
                });
                break;
                case 'fin':
                newEvent.deroulement_texte = 'Fin du secours';
                ajaxDeroulement.add('add', newEvent.secours_id, newEvent.deroulement_gdh, newEvent.deroulement_texte)
                .then(function() {
                    ajaxDeroulement.get(secours_id).then(function(data) {
                        newEvent.data = data;
                    });
                });
                break;
                case 'ch':
                newEvent.deroulement_texte = 'Arrivée de(s) victime(s) au centre hospitalier';
                ajaxDeroulement.add('add', newEvent.secours_id, newEvent.deroulement_gdh, newEvent.deroulement_texte)
                .then(function() {
                    ajaxDeroulement.get(secours_id).then(function(data) {
                        newEvent.data = data;
                    });
                });
                break;
                case 'codis':
                newEvent.deroulement_texte = 'CODIS avisé';
                ajaxDeroulement.add('add', newEvent.secours_id, newEvent.deroulement_gdh, newEvent.deroulement_texte)
                .then(function() {
                    ajaxDeroulement.get(secours_id).then(function(data) {
                        newEvent.data = data;
                    });
                });
                break;
                case 'samu':
                newEvent.deroulement_texte = 'SMUR/SAMU avisé(s)';
                ajaxDeroulement.add('add', newEvent.secours_id, newEvent.deroulement_gdh, newEvent.deroulement_texte)
                .then(function() {
                    ajaxDeroulement.get(secours_id).then(function(data) {
                        newEvent.data = data;
                    });
                });
                break;
                case 'corg':
                newEvent.deroulement_texte = 'CORG avisé';
                ajaxDeroulement.add('add', newEvent.secours_id, newEvent.deroulement_gdh, newEvent.deroulement_texte)
                .then(function() {
                    ajaxDeroulement.get(secours_id).then(function(data) {
                        newEvent.data = data;
                    });
                });
                break;
                case 'pghm':
                newEvent.deroulement_texte = 'Commandant du PGHM avisé';
                ajaxDeroulement.add('add', newEvent.secours_id, newEvent.deroulement_gdh, newEvent.deroulement_texte)
                .then(function() {
                    ajaxDeroulement.get(secours_id).then(function(data) {
                        newEvent.data = data;
                    });
                });
                break;
                case 'parquet':
                newEvent.deroulement_texte = 'Parquet avisé';
                ajaxDeroulement.add('add', newEvent.secours_id, newEvent.deroulement_gdh, newEvent.deroulement_texte)
                .then(function() {
                    ajaxDeroulement.get(secours_id).then(function(data) {
                        newEvent.data = data;
                    });
                });
                break;
                case 'prefecture':
                newEvent.deroulement_texte = 'Préfecture avisée';
                ajaxDeroulement.add('add', newEvent.secours_id, newEvent.deroulement_gdh, newEvent.deroulement_texte)
                .then(function() {
                    ajaxDeroulement.get(secours_id).then(function(data) {
                        newEvent.data = data;
                    });
                });
                break;
                case 'mairie':
                newEvent.deroulement_texte = 'Mairie avisée';
                ajaxDeroulement.add('add', newEvent.secours_id, newEvent.deroulement_gdh, newEvent.deroulement_texte)
                .then(function() {
                    ajaxDeroulement.get(secours_id).then(function(data) {
                        newEvent.data = data;
                    });
                });
                break;
                case 'add':
                newEvent.deroulement_texte = '';
                ajaxDeroulement.add('add', newEvent.secours_id, newEvent.deroulement_gdh, newEvent.deroulement_texte)
                .then(function() {
                    ajaxDeroulement.get(secours_id).then(function(data) {
                        newEvent.data = data;
                    });
                });
                break;
            }
            return newEvent;
        }
    }     
})
// Page -> Onglets
.factory('navTab', function($rootScope, $location) { // Mise en surbrillance de l'onglet actif
    return {
        get: function() {
            var tabInfo = {}
            tabInfo.$location = $location;
            tabInfo.path = $location.path();
            return tabInfo;
        }
    };
})

// Page -> Configuration des bases de données - Unité
.factory('ajaxConfigUnite', function($http) {
    return {
        get: function() {
            return $http.get('js/services/config_unite.php').then(function(response) {
                return response.data;
            });
        },
        update: function(config) {
            var postData = {
                code_unite: config.code_unite,
                unite: config.unite,
                commune: config.commune,
                departement: config.departement
            };
            return $http.post('js/services/config_unite.php', postData).then(function() {
            });
        }
    }
})

// Page -> Configuration des bases de données - Evacuations
.factory('ajaxConfigEvacuation', function($http) {
    return {
        add: function(lieu_evacuation) {
            var postData = {lieu_evacuation: lieu_evacuation};
            return $http.put('js/services/config_evacuation.php', postData).then(function() {
            });
        },
        update: function(id, lieu_evacuation) {
            var postData = {id: id, lieu_evacuation: lieu_evacuation};
            return $http.post('js/services/config_evacuation.php', postData).then(function() {
            });
        },
        delete: function(id) {
            var postData = {id: id};
            return $http.patch('js/services/config_evacuation.php', postData).then(function() {
            });
        }
    }
})

// Page -> Configuration des bases de données - Massifs
.factory('ajaxConfigMassifs', function($http) {
    return {
        add: function(massifs) {
            var postData = {massifs: massifs};
            return $http.put('js/services/config_massifs.php', postData).then(function() {
            });
        },
        update: function(id, massifs) {
            var postData = {id: id, massifs: massifs};
            return $http.post('js/services/config_massifs.php', postData).then(function() {
            });
        },
        delete: function(id) {
            var postData = {id: id};
            return $http.patch('js/services/config_massifs.php', postData).then(function() {
            });
        }
    }
})

// Page -> Configuration des bases de données - Moyens
.factory('ajaxConfigMoyens', function($http) {
    return {
        add: function(ordre) {
            var postData = {ordre: ordre};
            return $http.put('js/services/config_moyens.php', postData).then(function() {
            });
        },
        update: function(moyen) {
            var postData = {moyen: moyen};
            return $http.post('js/services/config_moyens.php', postData).then(function() {
            });
        },
        delete: function(id) {
            var postData = {id: id};
            return $http.patch('js/services/config_moyens.php', postData).then(function() {
            });
        }
    }
})

// Page -> Configuration de l'année
.factory('ajaxConfig', function($http) {  // Communication avec tab_config
    return {
        get: function(crud) {
            var postData = {crud: crud};
            return $http.post('js/services/data_tabConfig.php', postData).then(function(response) {
                return response.data;
            });
        },
        update: function(crud, data) {
            var postData = {crud: crud, data: data};
            return $http.post('js/services/data_tabConfig.php', postData).then(function() {
            });
        }
    }
})

.factory('yearConfig', function(ajaxConfig, navBar) { // Lecture et mise à jour de l'année en cours
    return {
        init: function() {
            var configInfo = {};
            configInfo.selectedYear = (new Date()).getFullYear();
            configInfo.isHide = true;
            ajaxConfig.get('get').then(function(data) {
                configInfo.currentYear = data[0];
            });
            return configInfo;
        },
        update: function(selectedYear) {
            var configInfo = {};
            ajaxConfig.update('update', selectedYear).then(function() {
                configInfo.selectedYear = (new Date()).getFullYear();
                configInfo.currentYear = {annee:selectedYear};
                configInfo.isHide = false;
            });
            return configInfo;
        }
    }
})
// Page -> Gestion des fiches de secours
.factory('ajaxSecours', function($http) { // Communication avec tab_secours
    return {
        getId: function(crud) {
            var postData = {crud: crud};
            return $http.post('js/services/getData_tabSecours.php', postData).then(function(response) {
                return response.data;
            });
        },
        getSecours: function(crud, currentId) {
            var postData = {crud: crud, currentId: currentId};
            return $http.post('js/services/getData_tabSecours.php', postData).then(function(response) {
                return response.data;
            });
        },
        addSecours: function(crud) {
            var postData = {crud: crud};
            return $http.post('js/services/saveData_tabSecours.php', postData).then(function() {
            });
        },
        deleteSecours: function(crud, currentId) {
            var postData = {crud: crud, id: currentId};
            return $http.post('js/services/saveData_tabSecours.php', postData).then(function() {
            });
        },
        updateSecours: function(currentId, field, data) {
            var postData = {crud: 'update', id: currentId, field: field, data: data};
            return $http.post('js/services/saveData_tabSecours.php', postData).then(function() {
            });
        },
        searchPv: function(pv) {
            var postData = {crud: 'searchPv', pv: pv};
            return $http.post('js/services/getData_tabSecours.php', postData).then(function(response) {
                return response.data;
            });
        },
        searchId: function(id) {//mod
            var postData = {crud: 'searchId', fiche: id};
            return $http.post('js/services/getData_tabSecours.php', postData).then(function(response) {
                return response.data;
            });
        },
        searchVict: function(victime) {
            var postData = {crud: 'searchVictime', victime: victime};
            return $http.post('js/services/getData_tabSecours.php', postData).then(function(response) {
                return response.data;
            });
        },
        searchDate: function(date) {
            var postData = {crud: 'searchDate', searchDate: date};
            return $http.post('js/services/getData_tabSecours.php', postData).then(function(response) {
                return response.data;
            });
        }
    };
})

.factory('navBar', function(ajaxSecours, valueSecours, ajaxConfig, ajaxDeroulement, ajaxVictimes, ajaxMoyens) { // Gestion de la navigation
    return {
        init: function() {
            var navInfo = {}; // Infomations de navigation
            // Récupération des Id de l'année en cours
            ajaxSecours.getId('id').then(function(response) {
                valueSecours.data = response;
                valueSecours.totalSecours = navInfo.totalSecours = response.length;
                if (valueSecours.totalSecours > 0) {
                    valueSecours.id = navInfo.id = parseInt(response[valueSecours.totalSecours - 1].id);
                    valueSecours.currentSecours = navInfo.currentSecours = valueSecours.totalSecours;
                    // Récupération de la fiche avec le dernier Id
                    ajaxSecours.getSecours('get', valueSecours.id).then(function(data) {
                        navInfo.data = data[0];
                        // Chargement des données de la fiche avec le dernier Id
                        ajaxDeroulement.get(valueSecours.id).then(function(data) {
                            navInfo.dataDeroulement = {data: data};
                        });
                        ajaxVictimes.get(valueSecours.id).then(function(data) {
                            navInfo.dataVictimes = {data: data};
                        });
                        ajaxMoyens.get(valueSecours.id).then(function(data) {
                            navInfo.dataMoyens = {data: data};
                        });
                        // Gestion de l'activation des boutons de navigation
                        if (valueSecours.currentSecours < valueSecours.totalSecours) {
                            navInfo.first = navInfo.previous = {disabled: false};
                            navInfo.last = navInfo.next = {disabled: false};
                        } else if (valueSecours.currentSecours == 1) {
                            navInfo.first = navInfo.previous = {disabled: true};
                            navInfo.last = navInfo.next = {disabled: true};
                        } else {
                            navInfo.first = navInfo.previous = {disabled: false};
                            navInfo.last = navInfo.next = {disabled: true};
                        }
                    });
                } else {
                    valueSecours.totalSecours = valueSecours.currentSecours = 0;
                    navInfo.totalSecours = navInfo.currentSecours = 0;
                    navInfo.first = navInfo.previous = {disabled: true};
                    navInfo.last = navInfo.next = {disabled: true};
                }
            });
            ajaxConfig.get('get').then(function(data) {
                navInfo.year = valueSecours.year = data[0]['annee'];
                navInfo.unite = valueSecours.unite = data[0]['unite'];
                navInfo.cu = valueSecours.cu = data[0]['code_unite'];
                navInfo.commune = valueSecours.commune = data[0]['commune'];
            });
            return navInfo;
        },
        
        nav: function(action, currentSecours) {
            switch (action) {
                case 'first':
                    var navInfo = {}; // Infomations de navigation
                    if (valueSecours.totalSecours > 0) {
                        valueSecours.id = navInfo.id = parseInt(valueSecours.data[0].id);
                        valueSecours.currentSecours = navInfo.currentSecours
                                                    = valueSecours.totalSecours / valueSecours.totalSecours;
                        // Récupération de la fiche avec le dernier Id
                        ajaxSecours.getSecours('get', valueSecours.id).then(function(data) {
                            navInfo.data = data[0];
                            navInfo.totalSecours = valueSecours.totalSecours;
                            // Chargement des données de la fiche avec le dernier Id
                            ajaxDeroulement.get(valueSecours.id).then(function(data) {
                                navInfo.dataDeroulement = {data: data};
                            });
                            ajaxVictimes.get(valueSecours.id).then(function(data) {
                                navInfo.dataVictimes = {data: data};
                            });
                            ajaxMoyens.get(valueSecours.id).then(function(data) {
                                navInfo.dataMoyens = {data: data};
                            });

                            // Gestion de l'activation des boutons de navigation
                            navInfo.first = navInfo.previous = {disabled: true};
                            navInfo.last = navInfo.next = {disabled: false};
                        });
                    } else {
                        valueSecours.totalSecours = valueSecours.currentSecours = 0;
                        navInfo.totalSecours = navInfo.currentSecours = 0;
                        navInfo.first = navInfo.previous = {disabled: true};
                        navInfo.last = navInfo.next = {disabled: true};
                    }
                    navInfo.year = valueSecours.year;
                    navInfo.unite = valueSecours.unite;
                    navInfo.cu = valueSecours.cu;
                    navInfo.commune = valueSecours.commune;
                    return navInfo;
                    break;
                
                case 'last':
                    var navInfo = {}; // Infomations de navigation
                    if (valueSecours.totalSecours > 0) {
                        valueSecours.id = navInfo.id = parseInt(valueSecours.data[valueSecours.totalSecours - 1].id);
                        valueSecours.currentSecours = navInfo.currentSecours = valueSecours.totalSecours;
                        // Récupération de la fiche avec le premier Id
                        ajaxSecours.getSecours('get', valueSecours.id).then(function(data) {
                            navInfo.data = data[0];
                            navInfo.totalSecours = valueSecours.totalSecours;
                            // Chargement des données de la fiche avec le dernier Id
                            ajaxDeroulement.get(valueSecours.id).then(function(data) {
                                navInfo.dataDeroulement = {data: data};
                            });
                            ajaxVictimes.get(valueSecours.id).then(function(data) {
                                navInfo.dataVictimes = {data: data};
                            });
                            ajaxMoyens.get(valueSecours.id).then(function(data) {
                                navInfo.dataMoyens = {data: data};
                            });

                            // Gestion de l'activation des boutons de navigation
                            navInfo.first = navInfo.previous = {disabled: false};
                            navInfo.last = navInfo.next = {disabled: true};
                        });
                    } else {
                        valueSecours.totalSecours = valueSecours.currentSecours = 0;
                        navInfo.totalSecours = navInfo.currentSecours = 0;
                        navInfo.first = navInfo.previous = {disabled: true};
                        navInfo.last = navInfo.next = {disabled: true};
                    }
                    navInfo.year = valueSecours.year;
                    navInfo.unite = valueSecours.unite;
                    navInfo.cu = valueSecours.cu;
                    navInfo.commune = valueSecours.commune;
                    return navInfo;
                    break;
                    
                case 'previous':
                    var navInfo = {}; // Infomations de navigation
                    if ((valueSecours.totalSecours > 0) && (valueSecours.currentSecours > 1)) {
                        valueSecours.currentSecours--;
                        navInfo.currentSecours = valueSecours.currentSecours; 
                        valueSecours.id = navInfo.id = parseInt(valueSecours.data[valueSecours.currentSecours - 1].id);
                        // Récupération de la fiche avec le précédent Id
                        ajaxSecours.getSecours('get', valueSecours.id).then(function(data) {
                            navInfo.data = data[0];
                            navInfo.totalSecours = valueSecours.totalSecours;
                            // Chargement des données de la fiche avec le dernier Id
                            ajaxDeroulement.get(valueSecours.id).then(function(data) {
                                navInfo.dataDeroulement = {data: data};
                            });
                            ajaxVictimes.get(valueSecours.id).then(function(data) {
                                navInfo.dataVictimes = {data: data};
                            });
                            ajaxMoyens.get(valueSecours.id).then(function(data) {
                                navInfo.dataMoyens = {data: data};
                            });

                            // Gestion de l'activation des boutons de navigation
                            if (valueSecours.currentSecours > 1) {
                                navInfo.first = navInfo.previous = {disabled: false};
                                navInfo.last = navInfo.next = {disabled: false};
                            } else {
                                navInfo.first = navInfo.previous = {disabled: true};
                                navInfo.last = navInfo.next = {disabled: false};
                            }
                        });
                    } else {
                        valueSecours.totalSecours = valueSecours.currentSecours = 0;
                        navInfo.totalSecours = navInfo.currentSecours = 0;
                        navInfo.first = navInfo.previous = {disabled: true};
                        navInfo.last = navInfo.next = {disabled: true};
                    }
                    navInfo.year = valueSecours.year;
                    navInfo.unite = valueSecours.unite;
                    navInfo.cu = valueSecours.cu;
                    navInfo.commune = valueSecours.commune;
                    return navInfo;
                    break;
                    
                case 'next':
                    var navInfo = {}; // Infomations de navigation
                    if ((valueSecours.totalSecours > 0) && (valueSecours.currentSecours < valueSecours.totalSecours)) {
                        valueSecours.currentSecours++;
                        navInfo.currentSecours = valueSecours.currentSecours; 
                        valueSecours.id = navInfo.id = parseInt(valueSecours.data[valueSecours.currentSecours - 1].id);
                        // Récupération de la fiche avec le prochain Id
                        ajaxSecours.getSecours('get', valueSecours.id).then(function(data) {
                            navInfo.data = data[0];
                            navInfo.totalSecours = valueSecours.totalSecours;
                            // Chargement des données de la fiche avec le dernier Id
                            ajaxDeroulement.get(valueSecours.id).then(function(data) {
                                navInfo.dataDeroulement = {data: data};
                            });
                            ajaxVictimes.get(valueSecours.id).then(function(data) {
                                navInfo.dataVictimes = {data: data};
                            });
                            ajaxMoyens.get(valueSecours.id).then(function(data) {
                                navInfo.dataMoyens = {data: data};
                            });

                            // Gestion de l'activation des boutons de navigation
                            if (valueSecours.currentSecours < valueSecours.totalSecours) {
                                navInfo.first = navInfo.previous = {disabled: false};
                                navInfo.last = navInfo.next = {disabled: false};
                            } else {
                                navInfo.first = navInfo.previous = {disabled: false};
                                navInfo.last = navInfo.next = {disabled: true};
                            }
                        });
                    } else {
                        valueSecours.totalSecours = valueSecours.currentSecours = 0;
                        navInfo.totalSecours = navInfo.currentSecours = 0;
                        navInfo.first = navInfo.previous = {disabled: true};
                        navInfo.last = navInfo.next = {disabled: true};
                    }
                    navInfo.year = valueSecours.year;
                    navInfo.unite = valueSecours.unite;
                    navInfo.cu = valueSecours.cu;
                    navInfo.commune = valueSecours.commune;
                    return navInfo;
                    break;
                    
                    case 'searchId':
                        var navInfo = {}; // Infomations de navigation
                        navInfo.currentSecours = valueSecours.currentSecours;
                        valueSecours.id = navInfo.id = currentSecours;
                        // Récupération de la fiche avec l'Id sélectionné
                        ajaxSecours.getSecours('get', currentSecours).then(function(data) {
                            navInfo.data = data[0];
                            navInfo.totalSecours = valueSecours.totalSecours;
                            // Chargement des données de la fiche avec le dernier Id
                            ajaxDeroulement.get(valueSecours.id).then(function(data) {
                                navInfo.dataDeroulement = {data: data};
                            });
                            ajaxVictimes.get(valueSecours.id).then(function(data) {
                                navInfo.dataVictimes = {data: data};
                            });
                            ajaxMoyens.get(valueSecours.id).then(function(data) {
                                navInfo.dataMoyens = {data: data};
                            });

                            // Gestion de l'activation des boutons de navigation
                            if ((valueSecours.currentSecours < valueSecours.totalSecours) && 
                                (valueSecours.currentSecours != 1)) {
                                navInfo.first = navInfo.previous = {disabled: false};
                                navInfo.last = navInfo.next = {disabled: false};
                            } else if (valueSecours.currentSecours == 1) {
                                navInfo.first = navInfo.previous = {disabled: true};
                                navInfo.last = navInfo.next = {disabled: false};
                            } else {
                                navInfo.first = navInfo.previous = {disabled: false};
                                navInfo.last = navInfo.next = {disabled: true};
                            }
                    });

                    navInfo.year = valueSecours.year;
                    navInfo.unite = valueSecours.unite;
                    navInfo.cu = valueSecours.cu;
                    navInfo.commune = valueSecours.commune;
                    return navInfo;
                    break;
            }
            return navInfo;
        }
    }
})
        
        
