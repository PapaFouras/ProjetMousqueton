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
    @$id      = $request->id;
    @$massifs = $request->massifs;
    
    // Enregistrement des modifications
    $bdd->exec("UPDATE lst_massifs SET massifs = '$massifs' WHERE id = $id");
    
} else if ($_SERVER["REQUEST_METHOD"] === "PATCH") { // DELETE
    
    // Récupération des données
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    @$id = $request->id;
    
    // Suppression
    $bdd->exec("DELETE FROM lst_massifs WHERE id = $id");
    
} else if ($_SERVER["REQUEST_METHOD"] === "PUT") { // AJOUT
    
    // Récupération des données
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    @$massifs = $request->massifs;
    
    // Suppression
    $bdd->exec("INSERT INTO lst_massifs (massifs) VALUES ('$massifs')");
    
};
// Fermeture de la connexion
$bdd->closeCursor;
?>