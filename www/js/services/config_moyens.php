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
    @$moyen     = $request->moyen;
    
    $id         = $moyen->id;
    //$ordre      = $moyen->ordre;
    $type       = $moyen->type;
    $organisme  = $moyen->organisme;
    $lieu       = $moyen->lieu;
    $nom        = $moyen->nom;
    $prenom     = $moyen->prenom;
    $grade      = $moyen->grade;
    $tph        = $moyen->tph;
    
    switch($type) {
        case 'Secouriste':
        $ordre = 1;
        break;
        
        case 'Hélicoptère':
        $ordre = 2;
        $prenom = $grade = '';
        break;
        
        case 'Equipage':
        $ordre = 3;
        break;
        
        case 'Médecin':
        $ordre = 4;
        $grade = "";
        break;
        
        case 'Equipe cynophile':
        $ordre = 5;
        break;
        
        case 'Autre':
        $ordre = 6;
        $nom = $prenom = $grade = '';
        break;
    };
    
    // Enregistrement des modifications
    $bdd->exec("UPDATE lst_personnels SET ordre     = $ordre,
                                          type      = '$type',
                                          organisme = '$organisme',
                                          lieu      = '$lieu',
                                          nom       = '$nom',
                                          prenom    = '$prenom',
                                          grade     = '$grade',
					  tph       = '$tph'
					WHERE id = $id");
    
} else if ($_SERVER["REQUEST_METHOD"] === "PATCH") { // DELETE
    
    // Récupération des données
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    @$id = $request->id;
    
    // Suppression
    $bdd->exec("DELETE FROM lst_personnels WHERE id = $id");
    
} else if ($_SERVER["REQUEST_METHOD"] === "PUT") { // AJOUT
    
    // Récupération des données
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    @$ordre  = $request->ordre;
    
    switch($ordre) {
        case 1:
        $type = 'Secouriste';
        break;
        
        case 2:
        $type = 'Hélicoptère';
        break;
        
        case 3:
        $type = 'Equipage';
        break;
        
        case 4:
        $type = 'Médecin';
        break;
        
        case 5:
        $type = 'Equipe cynophile';
        break;
        
        case 6:
        $type = 'Autre';
        break;
    };
        
    // Suppression
    $bdd->exec("INSERT INTO lst_personnels (ordre, type) VALUES ($ordre, '$type')");
    
};
// Fermeture de la connexion
$bdd = null;
?>
