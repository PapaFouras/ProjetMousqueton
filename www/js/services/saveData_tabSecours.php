<?php
// Récupération des données envoyées par myController
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
@$crud  =   $request->crud; // Type d'opération à effectuer (Add - Remove - Update)
@$id    =   $request->id; // Id ud champ concerné par update
@$field =   $request->field; // Nom du champ concerné par update
@$data  =   $request->data; //Données du champ concerné par update


// Récupération des informations de connection
include_once 'configConnect.php';
// Connexion à la base de donnée - ASM
try {
    $bdd = new PDO("pgsql:host=$servername;dbname=$dbname", $username, $password);
}
catch (Exception $e) {
    die('Erreur : ' . $e->getMessage());
}

// Récupération de l'année séléctionnée par l'utilisateur
$annee = $bdd->query('SELECT * FROM tab_config');
$annee = $annee->fetchAll(PDO::FETCH_ASSOC);
$selectedYear = $annee[0]['annee'];

switch ($crud) {
    case 'add' : // Ajout d'une fiche avec la date du jour  
		//recherche dernier numéro de fiche
		$response = $bdd->query("SELECT MAX(fiche) FROM tab_secours WHERE EXTRACT(YEAR FROM alerte_gdh) = $selectedYear");
		$data = $response->fetchAll(PDO::FETCH_ASSOC);
		$prochain=$data[0][max]+1;

        $prepare = $bdd->prepare("INSERT INTO tab_secours (alerte_gdh, acc_gdh, acc_activites, acc_blessures, caravane, fiche)
                                  VALUES (NOW(), NOW(), '{}', '{}', 1, $prochain)");
        $prepare->execute ();
    break;
    case 'remove' : // Suppression d'une fiche avec son Id 
        $bdd->exec("DELETE FROM tab_secours WHERE id = $id");
	//if last one
		$response = $bdd->query("SELECT MAX(id) FROM tab_secours");
		$data = $response->fetchAll(PDO::FETCH_ASSOC);
		$prochain=$data[0][max];
        
	$bdd->exec("ALTER SEQUENCE tab_secours_id_seq RESTART WITH $prochain");
        $bdd->exec("DELETE FROM tab_deroulement WHERE secours_id = $id");//OR CASCADING?
        $bdd->exec("DELETE FROM tab_victimes WHERE secours_id = $id");//OR CASCADING?
        $bdd->exec("DELETE FROM tab_moyens WHERE secours_id = $id");//OR CASCADING?
    break;
    case 'update' : // Update d'une fiche avec son Id
	if ($field=="geom") {
	//45124216 5878823
	$lat = substr($data,0,2) . "." . substr($data,2,6);
  	$lon = substr($data,8,1) . "." . substr($data,9,6);
	$bdd->exec("UPDATE tab_secours SET geom = ST_GeomFromText('POINT($lon $lat)', 4326) WHERE id = $id");
	} else {
	if ($field=="alerte_gdh" && strlen($data)==19) {
		$data = $data . ".111111";		
	}
	if ($field=="acc_gdh" && strlen($data)==19) {
		$data = $data . ".111111";		
	}
    if (is_string($data)) {
            //$data = addslashes($data); // Conversion des chaines avec des apostrophes... ??erreur rend impossible le remplissage des champs onglet alerte
    }
    if ($data !==""){
	$data = pg_escape_string($data);
        $bdd->exec("UPDATE tab_secours SET \"$field\" = '$data' WHERE id = $id");
    }
	}
    break;
};
$bdd->closeCursor;
?>
