<?php
// Récupération des données envoyées
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
@$dataType  = $request->dataType; // Type de données à récupérer
@$val       = $request->val; // Valeur de la donnée à rechercher...

// Récupération des informations de connection
include_once 'configConnect.php';
// Connexion à la base de donnée - ASM
try {
    $bdd = new PDO("pgsql:host=$servername;dbname=$dbname", $username, $password);

}
catch (Exception $e) {
    die('Erreur : ' . $e->getMessage());
}
switch ($dataType) {

    case 'nationalites' : // Récupération des données de lst_nationalités
	{
		$response = $bdd->query("SELECT pays FROM lst_nationalites WHERE pays LIKE '".$val."%'");
        $data = $response->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
		break;
	}
    case 'communes' : // Récupération des données de lst_communes
	{
        $response = $bdd->query("SELECT dept, commune FROM lst_communes WHERE commune LIKE '".$val."%'");
        $data = $response->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    break;
	}
    case 'evacuation' : // Récupération des données de lst_evacuation
	{
        $response = $bdd->query('SELECT * FROM lst_evacuation ORDER BY lieu_evacuation');
        $data = $response->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    break;
	}
    case 'blessures' : // Récupération des données de lst_blessures
    {    $response = $bdd->query('SELECT categorie, blessures FROM lst_blessures ORDER BY categorie, blessures');
        $data = $response->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    break;
	}
    case 'personnels' : // Récupération des données de lst_personnels
	{   $response = $bdd->query('SELECT * FROM lst_personnels');
        $data = $response->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    break;}
    case 'activites' : // Récupération des données de lst_activites
    {    $response = $bdd->query('SELECT categorie, activites FROM lst_activites');
        $data = $response->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    break;
	}
    case 'massifs' : // Récupération des données de lst_massifs
	{
	 $response = $bdd->query('SELECT * FROM lst_massifs ORDER BY massifs');
        $data = $response->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    break;
	}
    };
$bdd = null;
?>
