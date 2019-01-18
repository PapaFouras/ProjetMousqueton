<?php
// Récupération des données envoyées
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
@$crud      = $request->crud; // Type de données à récupérer
@$val       = $request->val; // Valeur de la donnée à rechercher...
@$lieu      = $request->lieu;
@$massif    = $request->massif;
@$commune   = $request->commune;
@$altitude  = $request->altitude;
@$gps       = $request->gps;
@$geom       = $request->geom;


// Récupération des informations de connection
include_once 'configConnect.php';
// Connexion à la base de donnée - ASM
try {
    $bdd = new PDO("pgsql:host=$servername;dbname=$dbname", $username, $password);
}
catch (Exception $e) {
    die('Erreur : ' . $e->getMessage());
}
switch ($crud) {
    case 'get' : // Récupération des données de lst_lieux
        $response = $bdd->query("SELECT * FROM lst_lieux WHERE lieu LIKE '%".$val."%'");
        $data = $response->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    break;
    case 'add' : // Ajout de données à lst_lieux
        $bdd->exec("INSERT INTO lst_lieux VALUE ('', $lieu, $massif, $commune, $altitude, $gps)");
    break;
    case 'lieu' : // Récupération des données de data_exchange
        $response = $bdd->query('SELECT * FROM data_exchange');
        $data = $response->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    break;
};
$bdd->closeCursor;
?>
