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
// Détermination du type CRUD (Get, Post, Put, Patch)
if ($_SERVER["REQUEST_METHOD"] === "POST") { // UPDATE
    
    // Récupération des données
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    @$id              = $request->id;
    @$lieu_evacuation = $request->lieu_evacuation;
    
    // Enregistrement des modifications
    $bdd->exec("UPDATE lst_evacuation SET lieu_evacuation = '$lieu_evacuation' WHERE id = $id");
    
} else if ($_SERVER["REQUEST_METHOD"] === "PATCH") { // DELETE
    
    // Récupération des données
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    @$id = $request->id;
    
    // Suppression
    $bdd->exec("DELETE FROM lst_evacuation WHERE id = $id");
    
} else if ($_SERVER["REQUEST_METHOD"] === "PUT") { // AJOUT
    
    // Récupération des données
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    @$lieu_evacuation = $request->lieu_evacuation;
    
    // Suppression
    $bdd->exec("INSERT INTO lst_evacuation (lieu_evacuation) VALUES ('$lieu_evacuation')");
    
};
// Fermeture de la connexion
$bdd->closeCursor;
?>