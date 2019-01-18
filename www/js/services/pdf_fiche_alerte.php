<?php
// Récupération des données envoyées par le mainCtrl
$id = $_GET['id'];

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

$response = $bdd->query("SELECT * FROM tab_secours WHERE (id = $id)");
$dataSecours = $response->fetch(PDO::FETCH_ASSOC);
// Création du PDF
$pdf = new tFPDF('P','mm','A4');
$pdf->SetFillColor(200);
$pdf->SetTitle("Fiche de secours N°".$dataSecours[fiche],true);
$pdf->AddPage();
$pdf->AddFont('DejaVu','','DejaVuSerif.ttf',true);
$pdf->AddFont('DejaVu','B','DejaVuSerif-Bold.ttf',true);

// En-tête
// déterminer le département
$dept = substr($dataSecours[loc_commune], -5, 2);
$pdf->SetXY(10,10);
$pdf->SetFont('DejaVu','B',8);
$pdf->MultiCell(20,6,"OP:",'LT','L');
$pdf->SetXY(10,16);
$pdf->MultiCell(20,6,"CS:",'L','L');
$pdf->SetXY(10,22);
$pdf->MultiCell(20,6,"Planton:",'LB','L');
$pdf->SetFont('DejaVu','',8);
$pdf->SetXY(30,10);
$pdf->MultiCell(40,6,$dataSecours[op],'TR','L');
$pdf->SetXY(30,16);
$pdf->MultiCell(40,6,$dataSecours[gp],'R','L');
$pdf->SetXY(30,22);
$pdf->MultiCell(40,6,$dataSecours[planton],'BR','L');

$pdf->SetXY(75,10);
$pdf->SetFont('DejaVu','B',14);
//$pdf->Cell(60,18,"FICHE D'ALERTE",'LTRB',1,'C');
$pdf->MultiCell(60,12,"FICHE D'ALERTE",'LTR','C');
$pdf->SetFont('DejaVu','B',8);
$pdf->SetXY(75,22);
$pdf->MultiCell(60,6,$dataSecours[inter]." ".$dept,'LBR','C');

$pdf->SetXY(140,10);
$pdf->SetFont('DejaVu','B',8);
$pdf->MultiCell(40,6,"Fiche N°:",'LT','R');
$pdf->SetXY(140,16);
$pdf->MultiCell(40,6,"PV RA N° :",'L','R');
$pdf->SetXY(140,22);
$pdf->MultiCell(40,6,"Suivie par :",'LB','R');
$pdf->SetXY(180,10);
$pdf->SetFont('DejaVu','',8);
$pdf->MultiCell(20,6,$dataSecours[fiche],'TR','L');
$pdf->SetXY(180,16);
$pdf->MultiCell(20,6,$dataSecours[pv],'R','L');
$pdf->SetXY(180,22);
$pdf->MultiCell(20,6,$dataSecours[suivi],'BR','L');

// Alerte
$gdh_alerte = DateTime::createFromFormat('Y-m-d H:i:s.u', $dataSecours[alerte_gdh]);
$gdh_alerte = $gdh_alerte->format('d/m/Y à H:i');

if ($dataSecours[tph_nat]) { // Choix du N° de tph National/International
    $tph_alerte = 
        substr($dataSecours[tph_nat], 0, 2)."-".substr($dataSecours[tph_nat], 2, 2)."-".
        substr($dataSecours[tph_nat], 4, 2)."-".substr($dataSecours[tph_nat], 6, 2)."-".
        substr($dataSecours[tph_nat], 8, 2);
} else {
    $tph_alerte = $dataSecours[tph_intl];
};

if ($dataSecours[chk_conf3] == 1) { // Mise en conférence
    if ($dataSecours[chk_confCodis] == 'CODIS') {
        $conference[] = 'CODIS';
    };
    if ($dataSecours[chk_confSamu] == 'SMUR') {
        $conference[] = 'SAMU';
    };
    if ($dataSecours[chk_confCorg] == 'CORG') {
        $conference[] = 'CORG';
    };
    if ($dataSecours[chk_confPghm] == 'PGHM') {
        $conference[] = 'PGHM';
    };
    if ($dataSecours[chk_confRequerant] == 'Autre') {
        $conference[] = 'Requérant';
    };
    } else {
    $conference[] = "Pas de mise en conférence lors de l'alerte";
};
$pdf->Ln(2);
$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(0,5,"ALERTE",'LTR',1,'C',true);
$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(40,5,"Date et heure :",'LT',0);
$pdf->SetFont('DejaVu','',8);
$pdf->Cell(90,5,$gdh_alerte,'T',0);
$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(30,5,"Moyen d'alerte :",'T',0);
$pdf->SetFont('DejaVu','',8);
$pdf->Cell(0,5,$dataSecours[alerte_moyen],'RT',1);

$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(40,5,"Requérant :",'L',0);
$pdf->SetFont('DejaVu','',8);
$pdf->Cell(90,5,$dataSecours[requerant],'',0);
$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(30,5,"Téléphone :",'',0);
$pdf->SetFont('DejaVu','',8);
$pdf->Cell(0,5,$tph_alerte,'R',1);

$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(40,5,"Origine de l'alerte :",'L',0);
$pdf->SetFont('DejaVu','',8);
$pdf->Cell(0,5,$dataSecours[alerte_origine],'R',1);


$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(40,5,"Mise en conférence :",'LB',0);
$pdf->SetFont('DejaVu','',8);
$pdf->Cell(0,5,join(' - ', $conference),'RB',1);

// Accident
$gdh_accident = DateTime::createFromFormat('Y-m-d H:i:s.u', $dataSecours[acc_gdh]);
$gdh_accident = $gdh_accident->format('d/m/Y à H:i');

$activites = json_decode($dataSecours['acc_activites'])->{'activites'};
$blessures = json_decode($dataSecours['acc_blessures'])->{'blessures'};

$pdf->Ln(2);
$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(0,5,"ACCIDENT",'LTR',1,'C',true);
$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(40,5,"Activité :",'LT',0);
$pdf->SetFont('DejaVu','',8);
$pdf->Cell(90,5,$activites,'T',0);
$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(30,5,"Date et heure :",'T',0);
$pdf->SetFont('DejaVu','',8);
$pdf->Cell(30,5,$gdh_accident,'RT',1);

$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(40,5,"Blessures :",'L',0);
$pdf->SetFont('DejaVu','',8);
$pdf->Cell(90,5,$blessures,'',0);
$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(30,5,"Sexe :",'',0);
$pdf->SetFont('DejaVu','',8);
$pdf->Cell(30,5,$dataSecours[acc_sexe],'R',1);

if ($dataSecours[acc_bilan] == 1) { // Bilan
    $bilan[] = 'Inconscience';
} else if ($dataSecours[acc_bilan] == 2) {
    $bilan[] = 'Arrêt ventimatoire';
} else if ($dataSecours[acc_bilan] == 3) {
    $bilan[] = 'Arrêt circulatoire';
};
if ($dataSecours[chk_hemorragie] == 1) {
    $bilan[] = 'Hémorragie';
};
if (!$bilan) {    
    $bilan[] = 'Aucune détresse vitale';
};

$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(40,5,"Bilan vital :",'L',0);
$pdf->SetFont('DejaVu','',8);
$pdf->Cell(150,5,join(' - ', $bilan),'R',1);

if ($dataSecours[meteo]) { // Météorologie
    $meteo[] = $dataSecours[meteo];
};
if ($dataSecours[vent]) { // Météorologie
    $meteo[] = $dataSecours[vent];
};
if (!$meteo) {
    $meteo[] = 'Aucune précision';
};

$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(40,5,"Météorologie :",'L',0);
$pdf->SetFont('DejaVu','',8);
$pdf->Cell(150,5,join(' - ', $meteo),'R',1);

$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(0,5,"Renseignements divers :",'LTR',1);
$pdf->SetFont('DejaVu','',8);
$pdf->MultiCell(0,5,$dataSecours[acc_rsgts],'LRB');

// Localisation
$pdf->Ln(2);
$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(0,5,"LOCALISATION",'LTR',1,'C',true);
$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(50,5,"Lieu :",'LT',0);
$pdf->SetFont('DejaVu','',8);
$pdf->Cell(80,5,$dataSecours[loc_lieu],'T',0);
$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(20,5,"Altitude :",'T',0);
$pdf->SetFont('DejaVu','',8);
$pdf->Cell(40,5,$dataSecours[loc_alt].' mètres','RT',1);

$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(50,5,"Complément de localisation :",'L',0);
$pdf->SetFont('DejaVu','',8);
$pdf->Cell(140,5,$dataSecours[loc_complement],'R',1);

$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(50,5,"Commune :",'L',0);
$pdf->SetFont('DejaVu','',8);
$pdf->Cell(80,5,$dataSecours[loc_commune],'',0);
$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(20,5,"Massif :",'',0);
$pdf->SetFont('DejaVu','',8);
$pdf->Cell(40,5,$dataSecours[loc_massif],'R',1);

if ($dataSecours[loc_gps]) { // Formatage des coordonnées GPS
    $gps = "N ".
        substr($dataSecours[loc_gps], 0, 2).".".substr($dataSecours[loc_gps], 2, 6)."° - E ".
        substr($dataSecours[loc_gps], 8, 1).".".substr($dataSecours[loc_gps], 9, 15)."°";
}
$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(50,5,"Coordonnées WGS84 :",'LB',0);
$pdf->SetFont('DejaVu','',8);
$pdf->Cell(80,5,$gps,'B',0);
$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(20,5,"UTM :",'B',0);
$pdf->SetFont('DejaVu','',8);
$pdf->Cell(40,5,$dataSecours[loc_utm],'BR',1);


// Recherches
if ($dataSecours[chk_rech] == 1) {
    $pdf->Ln(2);
    $pdf->SetFont('DejaVu','B',8);
    $pdf->Cell(0,5,"RECHERCHES",'1',1,'C',true);
    $pdf->SetFont('DejaVu','B',8);
    $pdf->Cell(0,5,"Véhicule :",'LR',1);
    $pdf->SetFont('DejaVu','',8);
    $pdf->MultiCell(0,5,$dataSecours[rech_vl],'LR');
    $pdf->SetFont('DejaVu','B',8);
    $pdf->Cell(0,5,"Descriptions vestimentaires :",'LR',1);
    $pdf->SetFont('DejaVu','',8);
    $pdf->MultiCell(0,5,$dataSecours[rech_pers],'LRB');
};

// Affichage des moyens
$selectMoyens = $bdd->query("SELECT * FROM tab_moyens WHERE (secours_id = $id)
                             ORDER BY CASE type WHEN 'Hélicoptère' THEN 5
                                                WHEN 'Equipage' THEN 4
                                                WHEN 'Secouriste' THEN 3
                                                WHEN 'Médecin' THEN 2
                                                WHEN 'Equipe cynophile' THEN 1
                                                ELSE 0
                                                END DESC, type ASC, organisme DESC, nom ASC");
$selectMoyens->setFetchMode(PDO::FETCH_ASSOC);

$pdf->Ln(2);
$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(0,5,"MOYENS ENGAGES",1,1,'C',true);

while ($dataMoyens = $selectMoyens->fetch()) {
    $pdf->SetFont('DejaVu','B',8);
	$pdf->Cell(50,5,$dataMoyens['type'],'L',0);
	$pdf->SetFont('DejaVu','',8);
	$pdf->Cell(50,5,$dataMoyens['organisme'],'',0);
	$pdf->SetFont('DejaVu','',8);
	$pdf->Cell(45,5,$dataMoyens['lieu'],'',0);
	$pdf->SetFont('DejaVu','',8);
	$pdf->Cell(45,5,$dataMoyens['nom'],'R',1);
};

if ($dataSecours[caravane] == 1) {
    $caravane = 'Héliportée';
} else if ($dataSecours[caravane] == 2) {
    $caravane = 'Mixte';
} else if ($dataSecours[caravane] == 3) {
    $caravane = 'Terrestre';
} else if ($dataSecours[caravane] == 4) {
    $caravane = 'Aucun moyen engagé';
} else if ($dataSecours[caravane] == 5) {
    $caravane = 'Intervention confiée au SDIS';
} else if ($dataSecours[caravane] == 6) {
    $caravane = 'Intervention confiée aux pisteurs';
} else if ($dataSecours[caravane] == 7) {
    $caravane = 'Intervention confiée à la Gendarmerie';
} else {
    $caravane = 'Non défini';
};

$selectMoyens->closeCursor();

$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(50,5,"Type d'opération :",'LTB',0);
$pdf->SetFont('DejaVu','',8);
$pdf->Cell(140,5,$caravane,'RTB',1);

// Renseignements divers et professionnels
$pdf->Ln(2);
$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(0,5,"COMMENTAIRES",1,1,'C',true);

$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(0,5,"Mesures prises :",'LR',1);
$pdf->SetFont('DejaVu','',8);
$mp_relevage = ($dataSecours[chk_mprelevage]) ? 'Relevage - ' : '';
$mp_collier = ($dataSecours[chk_mpcollier]) ? 'Pose collier cervical - ' : '';
$mp_attelle = ($dataSecours[chk_mpattelle]) ? 'Pose attelle d\'immobilisation - ' : '';
$mp_ked = ($dataSecours[chk_mpked]) ? 'Pose attelle d\'immobilisation cervico-thoracique - ' : '';
$mp_mid = ($dataSecours[chk_mpmid]) ? 'Immobilisation par matelas à dépression - ' : '';
$mp_perche = ($dataSecours[chk_mpperche]) ? 'Conditionnement en perche Franco Guarda - ' : '';
$mp_treuillage = ($dataSecours[chk_mptreuillage]) ? 'Evacuation par treuillage - ' : '';
$mp_o2 = ($dataSecours[chk_mpo2]) ? 'Victime placée sous O2 - ' : '';
$mp_mam = ($dataSecours[chk_mpmam]) ? 'Aide à la médicalisation - ' : '';
$pdf->MultiCell(0,5,$mp_relevage.$mp_collier.$mp_attelle.$mp_ked.$mp_mid.$mp_perche.$mp_treuillage.$mp_o2.$mp_mam,'LR');
$pdf->SetFont('DejaVu','',8);
$pdf->MultiCell(0,5,$dataSecours[rsgts_mp],'LRB');
$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(0,5,"Circonstances de l'accident :",'LR',1);
$pdf->SetFont('DejaVu','',8);
$pdf->MultiCell(0,5,$dataSecours[rsgts_circonstances],'LRB');
$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(0,5,"Renseignements divers :",'LR',1);
$pdf->SetFont('DejaVu','',8);
$pdf->MultiCell(0,5,$dataSecours[rsgts_divers],'LRB');

if ($dataSecours[rsgts_check] == 1) {
	$pdf->Ln(2);
	$pdf->SetFont('DejaVu','B',8);
	$pdf->Cell(0,5,"SENSIBILITE",'1',1,'C',true);
	$pdf->SetFont('DejaVu','B',8);
	$pdf->Cell(0,5,"  ",'LR',1);
	$pdf->SetFont('DejaVu','',8);
	$pdf->MultiCell(0,5,$dataSecours[rsgts_professionnel],'LRB');
};

// Déroulement
$selectDeroulement=$bdd->query("SELECT * FROM tab_deroulement WHERE secours_id = $id ORDER BY deroulement_gdh");
$selectDeroulement->setFetchMode(PDO::FETCH_ASSOC);

$pdf->AddPage();
$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(0,5,"DEROULEMENT CHRONOLOGIQUE",1,1,'C',true);

while ($dataDeroulement = $selectDeroulement->fetch()) {
    $gdh_deroulement = DateTime::createFromFormat('Y-m-d H:i:s', $dataDeroulement['deroulement_gdh']);
	$gdh_deroulement = $gdh_deroulement->format('d-m-Y à H:i');
	$pdf->SetFont('DejaVu','B',6);
	$pdf->Cell(0,5,$gdh_deroulement,'LRT',1);
	$pdf->SetFont('DejaVu','',8);
	$pdf->MultiCell(0,5,$dataDeroulement['deroulement_texte'],'LRB','J');
};

$selectDeroulement->closeCursor();

// Victimes
$selectVictimes=$bdd->query("SELECT * FROM tab_victimes WHERE secours_id = $id ORDER BY nom");
$selectVictimes->setFetchMode(PDO::FETCH_ASSOC);

$pdf->Ln(2);
$pdf->SetFont('DejaVu','B',8);
$pdf->Cell(0,5,"VICTIME(S)",1,1,'C',true);

while ($dataVictime = $selectVictimes->fetch()) {
	if ($dataVictime['naissance_date']) {
        $gdh_victimes = DateTime::createFromFormat('Y-m-d H:i:s', $dataVictime['naissance_date']);
        $gdh_victimes = $gdh_victimes->format('d-m-Y');
    } else {
        $gdh_victimes = '';
    };
	
    $pdf->SetFont('DejaVu','B',8);
	$pdf->Cell(25,5,"Nom :",'TL',0,'R');
	$pdf->SetFont('DejaVu','',8);
	$pdf->Cell(60,5,$dataVictime['nom'],'T',0);
	$pdf->SetFont('DejaVu','B',8);
	$pdf->Cell(20,5,"Prénom :",'T',0,'R');
	$pdf->SetFont('DejaVu','',8);
	$pdf->Cell(60,5,$dataVictime['prenom'],'T',0);
	$pdf->SetFont('DejaVu','B',8);
	$pdf->Cell(15,5,"Sexe :",'T',0,'R');
	$pdf->SetFont('DejaVu','',8);
	$pdf->Cell(10,5,$dataVictime['sexe'],'TR',1,'L');
	
	$pdf->SetFont('DejaVu','B',8);
	$pdf->Cell(25,5,"Né(e) le :",'L',0,'R');
	$pdf->SetFont('DejaVu','',8);
	$pdf->Cell(20,5,$gdh_victimes,'',0);
	$pdf->SetFont('DejaVu','B',8);
	$pdf->Cell(5,5,"à :",'',0,'R');
	$pdf->SetFont('DejaVu','',8);
	$pdf->Cell(70,5,$dataVictime['naissance_lieu'],'',0);
	$pdf->SetFont('DejaVu','B',8);
	$pdf->Cell(20,5,"Nationalité :",'',0,'R');
	$pdf->SetFont('DejaVu','',8);
	$pdf->Cell(50,5,$dataVictime['nationalite'],'R',1);
	
	$pdf->SetFont('DejaVu','B',8);
	$pdf->Cell(25,5,"Adresse :",'L',0,'R');
	$pdf->SetFont('DejaVu','',8);
	$pdf->Cell(95,5,$dataVictime['adresse'],'',0);
    $pdf->SetFont('DejaVu','B',8);
	$pdf->Cell(20,5,"Ville :",'',0,'R');
	$pdf->SetFont('DejaVu','',8);
	$pdf->Cell(50,5,$dataVictime['adresse_commune'],'R',1);
	
	$pdf->SetFont('DejaVu','B',8);
	$pdf->Cell(25,5,"Profession :",'L',0,'R');
	$pdf->SetFont('DejaVu','',8);
	$pdf->Cell(95,5,$dataVictime['profession'],'',0);
	$pdf->SetFont('DejaVu','B',8);
	$pdf->Cell(20,5,"Téléphone :",'',0,'R');
	$pdf->SetFont('DejaVu','',8);
	$pdf->Cell(50,5,$dataVictime['tph'],'R',1);
    
    if ($dataVictime['filiation'] != "") {
		$pdf->SetFont('DejaVu','B',8);
		$pdf->Cell(25,5,"Filiation :",'L',0,'R');
		$pdf->SetFont('DejaVu','',8);
		$pdf->Cell(165,5,$dataVictime['filiation'],'R',1);
	};
	
	if ($dataVictime['blessures']) {
        $blessuresVictime = array();
        $dataBlessures = json_decode($dataVictime['blessures'],true);
        foreach ($dataBlessures as $k => $data) {
          $blessuresVictime[] = $data['blessures'];
        };
    };

    $pdf->SetFont('DejaVu','B',8);
	$pdf->Cell(25,5,"Blessures :",'L',0,'R');
	$pdf->SetFont('DejaVu','',8);
	$pdf->Cell(95,5,join(' - ', $blessuresVictime),'',0);
	$pdf->SetFont('DejaVu','B',8);
	$pdf->Cell(20,5,"Etat :",'',0,'R');
	$pdf->SetFont('DejaVu','',8);
	$pdf->Cell(50,5,$dataVictime['etat'],'R',1);
	
	$pdf->SetFont('DejaVu','B',8);
	$pdf->Cell(25,5,"Evacuation :",'LB',0,'R');
	$pdf->SetFont('DejaVu','',8);
	$pdf->Cell(165,5,$dataVictime['evacuation'],'RB',1);
	
	$pdf->Ln(2);
};

$selectVictimes->closeCursor();

// Finalisation du PDF
$bdd->closeCursor;
$pdf->Output("Fiche de secours - N°".$id,"I");
?>
