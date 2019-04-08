<?php
// Récupération des données envoyées
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
@$crud          =   $request->crud; // Type d'opération à effectuer (Add - Remove - Update)
@$id_secours    =   $request->id_secours;
@$type          =   $request->type;
@$organisme     =   $request->organisme;
@$lieu          =   $request->lieu;
@$nom           =   $request->nom;
@$prenom        =   $request->prenom;
@$grade         =   $request->grade;
@$moyen_nom     =   $request->moyen_nom;
@$moyen_lieu    =   $request->moyen_lieu;


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
    case 'get' : // Récupération des données tab_moyens
        $response = $bdd->query("SELECT * FROM tab_moyens WHERE (secours_id = $id_secours)");
        $data = $response->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    break;
    
    case 'add' : // Ajout d'un moyen
        if (is_string($lieu)) {
            $lieu = addslashes($lieu); // Conversion des chaines avec des apostrophes...
        };
        $bdd->exec("INSERT INTO tab_moyens
                    VALUES (DEFAULT, $id_secours, '$type', '$organisme', '$lieu', '$nom', '$prenom', '$grade')");
    break;
    
    case 'delete' : // Suppression d'un moyen avec id_secours et moyen_nom et moyen_lieu
        $bdd->exec("DELETE FROM tab_moyens WHERE secours_id = $id_secours AND nom = '$moyen_nom' AND lieu = '$moyen_lieu'");
    break;
};
$bdd = null;
?>