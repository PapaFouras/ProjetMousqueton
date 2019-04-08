<?php
// Récupération des données envoyées par le mainCtrl
$id = $_GET['id'];
$secours = $_GET['secours'];
$annee = $_GET['annee'];

// Récupération des informations de connection
include_once ('configConnect.php');

// Class -  TPDF
require('../../vendors/fpdf/tfpdf.php');
        
// Connexion à la base de donnée - ASM
try {
    $bdd = new PDO("pgsql:host=$servername;dbname=$dbname", $username, $password);
}
catch (Exception $e) {
    die('Erreur : ' . $e->getMessage());
}


// Configuration
$config = $bdd->query("SELECT * FROM tab_config");
$dataConfig = $config->fetch(PDO::FETCH_ASSOC);

// Secours
$response = $bdd->query("SELECT * FROM tab_secours WHERE (id = $id)");
$dataSecours = $response->fetch(PDO::FETCH_ASSOC);

// Moyens
$signature = $bdd->query("SELECT * FROM tab_moyens WHERE (secours_id = $id) AND (type = 'Secouriste') ORDER BY nom ASC");
$dataSignature = $signature->fetch(PDO::FETCH_ASSOC);

$enqueteurs = $bdd->query("SELECT * FROM tab_moyens WHERE (secours_id = $id) AND (type = 'Secouriste') ORDER BY nom ASC");
$enqueteurs->setFetchMode(PDO::FETCH_ASSOC);

$secouristes = $bdd->query("SELECT * FROM tab_moyens WHERE (secours_id = $id) AND (type = 'Secouriste') ORDER BY nom ASC");
$secouristes->setFetchMode(PDO::FETCH_ASSOC);

$moyens = $bdd->query("SELECT * FROM tab_moyens WHERE (secours_id = $id) ORDER BY nom ASC");
$moyens->setFetchMode(PDO::FETCH_ASSOC);

// Déroulement
$selectDeroulement=$bdd->query("SELECT * FROM tab_deroulement WHERE secours_id = $id");
$selectDeroulement->setFetchMode(PDO::FETCH_ASSOC);

// Victimes
$selectVictimes=$bdd->query("SELECT * FROM tab_victimes WHERE secours_id = $id ORDER BY nom");
$selectVictimes->setFetchMode(PDO::FETCH_ASSOC);

// Création du PDF
class PDF extends tFPDF {
    function Footer() {
        global $dataSecours, $dataConfig, $dataSignature;
        $mois = array(
        "","janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"
        ); 
        $date_cloture = date("d")." ".$mois[date("n")]." ".date("Y"); 
        $this->SetY(-40);
        $this->SetFont('DejaVu','I',7);
        $this->SetLeftMargin(10);
        $this->Ln(0);
        
        $this->Cell(95,4,'(DESTINATAIRES)',0,0);
        $this->Cell(35,4,'Date de clôture',0,0,'C');
        $this->Cell(60,4,'Vu et transmis par :',0,1,'C');
        
        $this->SetFont('DejaVu','',9);
        $this->Cell(95,4,"[ 1 ] - M. le procureur de la République à GRENOBLE",'LT',0);
        $this->Cell(35,4,$date_cloture,'LTR',0,'C');
        $this->Cell(60,4,"Le $date_cloture",'RT',1,'C');
        
        $this->Cell(95,4,"",'L',0);
        $this->SetFont('DejaVu','I',9);
        $this->Cell(35,4,'','LR',0,'C');
        $this->Cell(60,4,'','R',1,'C');
        
        $this->Cell(95,4,'','L',0);
        $this->SetFont('DejaVu','I',7);
        $this->Cell(35,4,'Signature(s)','LR',0,'C');
        $this->Cell(60,4,'Original signé','R',1,'C');
        
        $this->Cell(95,4,'','L',0);
        $this->SetFont('DejaVu','',8);
        $this->Cell(35,4,"$dataSignature[grade] $dataSignature[nom]",'LR',0,'C');
        $this->SetFont('DejaVu','',8);
        $this->Cell(60,4,"Le commandant du",'R',1,'C');
        
        $this->SetFont('DejaVu','',9);
        $this->Cell(95,4,'[ 1 ] - Archives','L',0);
        $this->SetFont('DejaVu','I',9);
        $this->Cell(35,4,'','LR',0,'C');
        $this->SetFont('DejaVu','',8);
        $this->Cell(60,4,$dataConfig[unite],'R',1,'C');
        
        $this->Cell(95,4,'','LB',0);
        $this->Cell(35,4,'','LBR',0);
        $this->Cell(60,4,'','RB',1);
    }
}

$pdf = new PDF('P','mm','A4');
$pdf->SetTopMargin(5);
$pdf->SetFillColor(200);
$pdf->SetTitle("PV RJ",true);
$pdf->AliasNbPages();
$pdf->AddPage();
$pdf->AddFont('DejaVu','','DejaVuSans.ttf',true);
$pdf->AddFont('DejaVu','B','DejaVuSerif-Bold.ttf',true);
$pdf->AddFont('DejaVu','I','DejaVuSans-Oblique.ttf',true);

// En-tête
$pdf->SetFont('Arial','B',9);
$pdf->Cell(75,5,'GENDARMERIE NATIONALE','LTR',0,'C',true);
$pdf->Cell(115,5,'','',1);
$pdf->SetFont('DejaVu','',9);
$pdf->Cell(75,4,'GROUPEMENT DE GENDARMERIE','LR',0);
$pdf->SetFont('Arial','B',9);
$pdf->Cell(115,4,'PROCES VERBAL DE RENSEIGNEMENT JUDICIAIRE','',1);
$pdf->SetFont('DejaVu','',9);
$pdf->Cell(75,4,'DEPARTEMENTALE '.strtoupper($dataConfig[departement]),'LR',0);
$pdf->Cell(115,4,'','',1);
$pdf->Cell(75,4,'','LR',0);
$pdf->SetFont('Arial','B',9);
$pdf->Cell(115,4,'ACCIDENT EN MONTAGNE','',1);
$pdf->SetFont('DejaVu','',9);
$pdf->Cell(75,4,$dataConfig[unite],'LR',0);
$pdf->Cell(115,4,'','',1);
$pdf->SetFont('DejaVu','I',6);
$pdf->Cell(18,4,'Code unité','LTR',0,'C');
$pdf->Cell(20,4,'Nmr P.V.','LTR',0,'C');
$pdf->Cell(12,4,'Année','LTR',0,'C');
$pdf->Cell(25,4,'Nmr dossier justice','LTR',0,'C');
$pdf->Cell(70,4,'','',0);
$pdf->Cell(20,4,'Nmr pièce','LTR',0,'C');
$pdf->Cell(25,4,'N° feuillet','LTR',1,'C');

$pdf->SetFont('Arial','B',9);
$pdf->Cell(18,4,$dataConfig[code_unite],'LBR',0,'C');
$pdf->Cell(20,4,$dataSecours[pv],'LBR',0,'C');
$pdf->Cell(12,4,$annee,'LBR',0,'C');
$pdf->Cell(25,4,'','LBR',0,'C');
$pdf->Cell(70,4,'','B',0);
$pdf->Cell(20,4,'','LBR',0,'C');
$pdf->Cell(25,4,'      '.$pdf->PageNo().'/{nb}','LBR',1,'C'); // Feuillet

// Références de l'accident
$pdf->Ln(1);
$pdf->SetFont('Arial','B',7);
$pdf->Cell(0,5,"REFERENCES DE L'ACCIDENT",'LTBR',1,'C', true);
$pdf->SetFont('DejaVu','I',8);
$pdf->Cell(30,5,"Secours numéro",'LB',0);
$pdf->SetFont('DejaVu','',9);
$pdf->Cell(45,5,$secours,'B',0);
$pdf->SetFont('DejaVu','I',8);
$pdf->Cell(55,5,'Circonscription - Unité compétente','B',0);
$pdf->SetFont('DejaVu','',9);
$pdf->Cell(60,5,$dataConfig[unite],'BR',1);

// Articles OPJ
$heure_redaction = date('H \h\e\u\r\e\s i');
$jour = array("dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"); 
$mois = array("","janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"); 
$date_redaction = $jour[date("w")]." ".date("d")." ".$mois[date("n")]." ".date("Y"); 

$pdf->Cell(0,4,"Le $date_redaction à $heure_redaction.",'',1);
$pdf->Cell(30,4,"Nous soussigné(s) :",'',0);

while ($dataMoyens = $enqueteurs->fetch()) {
    $pdf->SetLeftMargin(45);
    $pdf->Cell(0,4,"$dataMoyens[grade] $dataMoyens[prenom] $dataMoyens[nom], Officier de Police Judiciaire en résidence à $dataConfig[commune]",'',1);
    $pdf->SetLeftMargin(10);
};

$pdf->Ln(0);
$pdf->Cell(0,4,"Vu les articles 16 à 19 du Code de Procédure Pénale",'',1);
$pdf->Cell(0,4,"Nous trouvant au bureau de notre unté à $dataConfig[commune], rapportons les opérations suivantes :",'',1);

// Date
$gdh_accident = DateTime::createFromFormat('Y-m-d H:i:s.u', $dataSecours[acc_gdh]);
$gdh_accident = $gdh_accident->format('d/m/Y à H:i');
$gdh_alerte = DateTime::createFromFormat('Y-m-d H:i:s.u', $dataSecours[alerte_gdh]);
$gdh_alerte = $gdh_alerte->format('d/m/Y à H:i');

while ($dataDeroulement = $selectDeroulement->fetch()) {
	if ($dataDeroulement['deroulement_texte'] == 'Fin du secours') {
        $gdh_fin_du_secours = DateTime::createFromFormat('Y-m-d H:i:s', $dataDeroulement['deroulement_gdh']);
        $gdh_fin_du_secours = $gdh_fin_du_secours->format('d/m/Y à H:i');
    };
    if ($dataDeroulement['deroulement_texte'] == 'Arrivée des secouristes sur les lieux du secours') {
        $gdh_arrivee_secours = DateTime::createFromFormat('Y-m-d H:i:s', $dataDeroulement['deroulement_gdh']);
        $gdh_arrivee_secours = $gdh_arrivee_secours->format('d/m/Y à H:i');
    };
};

$pdf->Ln(4);
$pdf->SetLeftMargin(40);
$pdf->SetFont('Arial','B',9);
$pdf->Cell(0,5,"DATES",'LRBT',1,'C');
$pdf->Ln(1);
$pdf->SetFont('DejaVu','I',9);
$pdf->Cell(35,4,"Accident",'',0);
$pdf->SetFont('DejaVu','',9);
$pdf->Cell(45,4,$gdh_accident,'',0);
$pdf->SetFont('DejaVu','I',9);
$pdf->Cell(35,4,"Alerte",'',0);
$pdf->SetFont('DejaVu','',9);
$pdf->Cell(45,4,$gdh_alerte,'',1);

$pdf->SetFont('DejaVu','I',9);
$pdf->Cell(35,4,"Arrivée sur les lieux",'',0);
$pdf->SetFont('DejaVu','',9);
$pdf->Cell(45,4,$gdh_arrivee_secours,'',0);
$pdf->SetFont('DejaVu','I',9);
$pdf->Cell(35,4,"Fin d'opération",'',0);
$pdf->SetFont('DejaVu','',9);
$pdf->Cell(45,4,$gdh_fin_du_secours,'',1);

// Lieu de l'accident
$pdf->Ln(4);
$pdf->SetLeftMargin(40);
$pdf->SetFont('Arial','B',9);
$pdf->Cell(0,5,"LIEU DE L'ACCIDENT",'LRBT',1,'C');
$pdf->Ln(1);
$pdf->SetFont('DejaVu','I',9);
$pdf->Cell(25,4,"Massif",'',0);
$pdf->SetFont('DejaVu','',9);
$pdf->Cell(55,4,$dataSecours[loc_massif],'',0);
$pdf->SetFont('DejaVu','I',9);
$pdf->Cell(25,4,"Altitude",'',0);
$pdf->SetFont('DejaVu','',9);
$pdf->Cell(55,4,$dataSecours[loc_alt],'',1);

$pdf->SetFont('DejaVu','I',9);
$pdf->Cell(25,4,"Commune",'',0);
$pdf->SetFont('DejaVu','',9);
$pdf->Cell(0,4,$dataSecours[loc_commune],'',1);
$pdf->SetFont('DejaVu','I',9);
$pdf->Cell(25,4,"Lieu précis",'',0);
$pdf->SetFont('DejaVu','',9);
$pdf->Cell(0,4,$dataSecours[loc_lieu],'',1);

// Noms des secouristes
$pdf->Ln(4);
$pdf->SetLeftMargin(40);
$pdf->SetFont('Arial','B',9);
$pdf->Cell(0,5,"NOMS DES SECOURISTES",'LRBT',1,'C');
$pdf->Ln(1);
$pdf->SetFont('DejaVu','',9);

while ($dataMoyens = $secouristes->fetch()) {
    if ($dataMoyens['grade'] == 'GND') {
        $qualite = "Agent";
    } else {
        $qualite = "Officier";
    };
    
    $pdf->MultiCell(0,4,"* $dataMoyens[grade] $dataMoyens[prenom] $dataMoyens[nom], $qualite de Police Judiciaire, en résidence à $dataConfig[commune]");
};

// Nature de l'accident
$activites = json_decode($dataSecours['acc_activites'])->{'activites'};

$pdf->Ln(4);
$pdf->SetLeftMargin(40);
$pdf->SetFont('Arial','B',9);
$pdf->Cell(0,5,"NATURE DE L'ACCIDENT",'LRBT',1,'C');
$pdf->Ln(1);
$pdf->SetFont('DejaVu','',9);
$pdf->Cell(0,4,"Accident : $activites",'',1);


// Victimes
$pdf->Ln(4);
$pdf->SetLeftMargin(40);
$pdf->SetFont('Arial','B',9);
$pdf->Cell(0,5,"IDENTITE DES PERSONNES SECOURUES",'LRBT',1,'C');
$pdf->Ln(1);
$pdf->SetFont('DejaVu','',9);

while ($dataVictime = $selectVictimes->fetch()) {
	if ($dataVictime['naissance_date']) {
        $gdh_victimes = DateTime::createFromFormat('Y-m-d H:i:s', $dataVictime['naissance_date']);
        $gdh_victimes = $gdh_victimes->format('d-m-Y');
    } else {
        $gdh_victimes = '';
    };
    
    if ($dataVictime['blessures']) {
        $blessuresVictime = array();
        $dataBlessures = json_decode($dataVictime['blessures'],true);
        if (count($dataBlessures) > 0) {
            foreach ($dataBlessures as $k => $data) {
              $blessuresVictime[] = $data['blessures'];
            };
        } else {
            $blessuresVictime[] = 'Pas de blessures';
        };
    };
	
    $pdf->MultiCell(0,4,"* Sexe : $dataVictime[sexe] - Identité : $dataVictime[nom] $dataVictime[prenom] - Né(e) le $gdh_victimes à $dataVictime[naissance_lieu] - Nationalité : $dataVictime[nationalite] - Demeurant : $dataVictime[adresse] à $dataVictime[adresse_commune] - Conséquences : $dataVictime[etat] (".join(' - ', $blessuresVictime).")");
	$pdf->Ln(1);
    
    $evacuation[] = $dataVictime['evacuation'];
};

// Destination
$pdf->Ln(4);
$pdf->SetLeftMargin(40);
$pdf->SetFont('Arial','B',9);
$pdf->Cell(0,5,"DESTINATION DES VICTIMES",'LRBT',1,'C');
$pdf->Ln(1);
$pdf->SetFont('DejaVu','',9);
$pdf->Cell(0,4,join(', ', $evacuation),'',1);

// Moyens employés
if ($dataSecours[caravane] == 1) {
    $caravane = 'Héliportée';
} else if ($dataSecours[caravane] == 2) {
    $caravane = 'Mixte';
} else if ($dataSecours[caravane] == 3) {
    $caravane = 'Terrestre';
} else {
    $caravane = 'Non défini';
};

while ($dataMoyensEmployes = $moyens->fetch()) {
	if ($dataMoyensEmployes['type'] == 'Hélicoptère') {
        $helico[] = "$dataMoyensEmployes[organisme] $dataMoyensEmployes[lieu]";
    };
    if ($dataMoyensEmployes['type'] == 'Médecin') {
        $medecin[] = "Dr $dataMoyensEmployes[nom] - $dataMoyensEmployes[organisme] $dataMoyensEmployes[lieu]";
    };
    if ($dataMoyensEmployes['type'] == 'Equipage') {
        $equipage[] = "$dataMoyensEmployes[organisme] : $dataMoyensEmployes[nom]";
    };
};

if (join('',$helico) == '') {
    $helico = 'Aucun moyen aérien engagé';
} else {
    $helico = join(' - ', $helico);
};
//if (join('',$medecin) == '') {
if (empty($medecin)) {
    $medecin = 'Aucun médecin engagé';
} else {
    $medecin = join(' - ', $medecin);
};
if (join('',$equipage) == '') {
    $equipage = '';
} else {
    $equipage = join(' - ', $equipage);
};

$pdf->Ln(4);
$pdf->SetLeftMargin(40);
$pdf->SetFont('Arial','B',9);
$pdf->Cell(0,5,"MOYENS EMPLOYES",'LRBT',1,'C');
$pdf->Ln(1);
$pdf->SetFont('DejaVu','I',9);
$pdf->Cell(30,4,'Opération','',0);
$pdf->SetFont('DejaVu','',9);
$pdf->Cell(160,4,$caravane,'',1);
$pdf->SetFont('DejaVu','I',9);
$pdf->Cell(30,4,'Hélicoptère','',0);
$pdf->SetFont('DejaVu','',9);
$pdf->Cell(160,4,$helico,'',1);
$pdf->SetFont('DejaVu','I',9);
$pdf->Cell(30,4,'Service de santé','',0);
$pdf->SetFont('DejaVu','',9);
$pdf->Cell(160,4,$medecin,'',1);
$pdf->SetFont('DejaVu','I',9);
$pdf->Cell(30,4,'Divers','',0);
$pdf->SetFont('DejaVu','',9);
$pdf->Cell(160,4,$equipage,'',1);

// Compte rendu
$pdf->Ln(4);
$pdf->SetLeftMargin(40);
$pdf->SetFont('Arial','B',9);
$pdf->Cell(0,5,"COMPTE RENDU DE L'OPERATION",'LRBT',1,'C');
$pdf->Ln(1);
$pdf->SetFont('DejaVu','',9);
$pdf->MultiCell(0,4,$dataSecours[rsgts_circonstances]);
$pdf->MultiCell(0,4,$dataSecours[rsgts_mp]);
$pdf->MultiCell(0,4,$dataSecours[rsgts_professionnel]);

// Finalisation du PDF
//$bdd->closeCursor;
$pdf->Output("RA ".$dataSecours[pv]."_PGHM_".$annee.".pdf","I");
?>
