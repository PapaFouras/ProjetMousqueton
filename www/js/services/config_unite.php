<?php
// Récupération des informations de connection
include_once 'configConnect.php';
// Connexion à la base de donnée - ASM
try {
    $bdd = new PDO("pgsql:host=$servername;dbname=$dbname", $username, $password);
}
catch (Exception $e) {
    die('Erreur : ' . $e->getMessage());
}
// Détermination du type CRUD (Get, Post, Put, Delete)
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    
    $response = $bdd->query("SELECT * FROM tab_config");
    $data = $response->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
    
} else if ($_SERVER["REQUEST_METHOD"] === "POST") {
    
    // Récupération des données
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    @$code_unite    = $request->code_unite;
    @$unite         = $request->unite;
    @$commune       = $request->commune;
    @$departement   = $request->departement;
    
    // Enregistrement des modifications
    $bdd->exec("UPDATE tab_config SET unite = '$unite',
                                      code_unite = '$code_unite',
                                      commune = '$commune',
                                      departement = '$departement'
                                      WHERE id = 1");
}
// Fermeture de la connexion
//$bdd->closeCursor;
?>