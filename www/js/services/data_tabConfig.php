<?php
// Récupération des données envoyées par le controlleur
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
@$crud  = $request->crud; // Type d'opération à effectuer (Add - Update)
@$data  = $request->data;

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
    case 'get' : // Récupération de l'année 
        $response = $bdd->query("SELECT * FROM tab_config");
        $data = $response->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    break;
    case 'update' : // Update de l'année
        $bdd->exec("UPDATE tab_config SET annee = '$data' WHERE id = 1");
    break;
};
$bdd->closeCursor;
?>