<?php
// Récupération des données envoyées par myController
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
@$crud         =   $request->crud; // Type d'opération à effectuer (Add - Remove - Update)
@$currentId    =   $request->currentId;
@$pv           =   $request->pv;
@$fiche        =   $request->fiche;
@$victime      =   $request->victime;
@$searchDate   =   $request->searchDate;

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
    case 'id' : // Récupération des données évennements 
        //$response = $bdd->query("SELECT id FROM tab_secours WHERE YEAR(alerte_gdh) = $selectedYear");
		$response = $bdd->query("SELECT id FROM tab_secours WHERE EXTRACT(YEAR FROM alerte_gdh) = $selectedYear ORDER BY id");
		$data = $response->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    break;

    case 'get' : // Récupération des données de la fiche de secours demandée
        $response = $bdd->query("SELECT * FROM tab_secours WHERE (id = $currentId)");
        $data = $response->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    break;
    
    case 'searchPv' : // Récupération de l'Id correspondant au PV
        $response = $bdd->query("SELECT id FROM tab_secours WHERE (pv = $pv) AND EXTRACT(YEAR FROM (alerte_gdh)) = $selectedYear");
        $data = $response->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    break;

    case 'searchId' : // Récupération de l'Id correspondant au fiche
        $response = $bdd->query("SELECT id FROM tab_secours WHERE (fiche = $fiche) AND EXTRACT(YEAR FROM (alerte_gdh)) = $selectedYear");
        $data = $response->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    break;
    
    case 'searchVictime' : // Récupération des données selon la victime
	//$response = $bdd->query('SELECT * FROM tab_victimes WHERE nom LIKE "%'.$victime.'%" ORDER BY nom');
	$response = $bdd->query("SELECT * FROM tab_victimes WHERE nom LIKE '%".$victime."%' ORDER BY nom");
        $data = $response->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    break;
    
    case 'searchDate' : // Récupération des données selon la date
        $response = $bdd->query("SELECT * FROM tab_secours WHERE DATE(alerte_gdh)='$searchDate' ORDER BY alerte_gdh");
        $data = $response->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    break;
};
// Fermeture de la connexion à la BDD
$bdd->closeCursor;
?>