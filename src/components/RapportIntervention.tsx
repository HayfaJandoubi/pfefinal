import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col, Badge, Alert } from "react-bootstrap";
import { FiArrowLeft, FiDownload, FiPrinter } from "react-icons/fi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const theme = {
  primary: "#3f51b5",
  secondary: "#6c757d",
  success: "#4caf50",
  info: "#00acc1",
  warning: "#ff9800",
  danger: "#f44336",
  light: "#f8f9fa",
  dark: "#212529",
  background: "#f5f7fa",
  card: "#ffffff"
};

interface InterventionDetails {
  id: number;
  nomSite: string;
  adresse: string;
  coordonnees: string;
  typePanne: string;
  dateDeclaration: string;
  dateIntervention: string;
  technicien: string;
  etat: "Non résolue" | "En cours" | "Résolue";
  descriptionPanne: string;
  actionsRealisees: string;
  materielUtilise: string;
  dureeIntervention: string;
  notesComplementaires?: string;
}

const RapportIntervention = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const intervention: InterventionDetails = state?.intervention || {
    id: 1,
    nomSite: "Site Sahloul",
    adresse: "Sahloul, Sousse",
    coordonnees: "35.8256, 10.6084",
    typePanne: "Problème réseau",
    dateDeclaration: "2023-05-15 09:30",
    dateIntervention: "2023-05-16 14:00",
    technicien: "Mohamed Ali",
    etat: "En cours",
    descriptionPanne: "Perte intermittente du signal réseau dans la zone nord du site",
    actionsRealisees: "Vérification des équipements, diagnostic du problème",
    materielUtilise: "Analyseur de spectre, multimètre",
    dureeIntervention: "2 heures",
    notesComplementaires: "Nécessite un remplacement de la carte réseau"
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add logo and header
    doc.setFontSize(18);
    doc.setTextColor(theme.primary);
    doc.text("Rapport d'Intervention Technique", 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(theme.dark);
    doc.text(`Intervention #${intervention.id} - ${intervention.nomSite}`, 105, 30, { align: 'center' });
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(theme.secondary);
    doc.text(`Généré le: ${new Date().toLocaleDateString()}`, 105, 36, { align: 'center' });
    
    // Add horizontal line
    doc.setDrawColor(theme.primary);
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);
    
    // Basic information table
    autoTable(doc, {
      startY: 45,
      head: [['Informations Générales', '']],
      body: [
        ['Site', intervention.nomSite],
        ['Adresse', intervention.adresse],
        ['Coordonnées', intervention.coordonnees],
        ['Type de panne', intervention.typePanne],
        ['Date déclaration', intervention.dateDeclaration],
        ['Date intervention', intervention.dateIntervention],
        ['Technicien', intervention.technicien],
        ['État', intervention.etat],
        ['Durée intervention', intervention.dureeIntervention]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: theme.primary,
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 'auto' }
      }
    });
    
    // Technical details
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Détails Techniques', '']],
      body: [
        ['Description de la panne', intervention.descriptionPanne],
        ['Actions réalisées', intervention.actionsRealisees],
        ['Matériel utilisé', intervention.materielUtilise],
        ['Notes complémentaires', intervention.notesComplementaires || 'Aucune']
      ],
      theme: 'grid',
      headStyles: {
        fillColor: theme.primary,
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 'auto' }
      },
      styles: {
        minCellHeight: 20,
        valign: 'top'
      }
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(theme.secondary);
      doc.text(`Page ${i} sur ${pageCount}`, 105, 285, { align: 'center' });
      doc.text("© Société Telecom - Tous droits réservés", 105, 290, { align: 'center' });
    }
    
    doc.save(`rapport_intervention_${intervention.id}.pdf`);
  };

  const printReport = () => {
    generatePDF();
    // In a real app, you might open print dialog here
    alert("Le rapport a été généré et est prêt pour impression.");
  };

  return (
    <Container fluid className="px-4 py-4" style={{ backgroundColor: theme.background, minHeight: "100vh" }}>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Button 
            variant="outline-primary" 
            onClick={() => navigate(-1)}
            className="d-flex align-items-center mb-3"
          >
            <FiArrowLeft className="me-2" /> Retour
          </Button>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1 fw-bold" style={{ color: theme.dark }}>
                Rapport d'intervention
              </h2>
              <p className="mb-0 text-muted">
                Intervention #{intervention.id} - {intervention.nomSite}
              </p>
            </div>
            <div className="d-flex gap-3">
              <Button 
                variant="primary" 
                onClick={generatePDF}
                className="d-flex align-items-center"
              >
                <FiDownload className="me-2" /> Télécharger PDF
              </Button>
              <Button 
                variant="success" 
                onClick={printReport}
                className="d-flex align-items-center"
              >
                <FiPrinter className="me-2" /> Imprimer
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Report Preview */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0 fw-bold">Aperçu du rapport</h5>
            </Card.Header>
            <Card.Body>
              <Alert variant="info" className="mb-4">
                Ceci est un aperçu des informations qui seront incluses dans le rapport PDF.
                Cliquez sur "Télécharger PDF" pour générer le document complet.
              </Alert>
              
              <div className="mb-4">
                <h4 className="text-primary mb-3">Rapport d'Intervention Technique</h4>
                <p className="text-center text-muted mb-4">
                  Intervention #{intervention.id} - {intervention.nomSite}<br />
                  Généré le: {new Date().toLocaleDateString()}
                </p>
                <hr className="border-primary" />
              </div>
              
              <h5 className="fw-bold mb-3">Informations Générales</h5>
              <table className="table table-bordered mb-5">
                <tbody>
                  <tr>
                    <th scope="row" style={{ width: '30%' }}>Site</th>
                    <td>{intervention.nomSite}</td>
                  </tr>
                  <tr>
                    <th scope="row">Adresse</th>
                    <td>{intervention.adresse}</td>
                  </tr>
                  <tr>
                    <th scope="row">Coordonnées</th>
                    <td>{intervention.coordonnees}</td>
                  </tr>
                  <tr>
                    <th scope="row">Type de panne</th>
                    <td>{intervention.typePanne}</td>
                  </tr>
                  <tr>
                    <th scope="row">Date déclaration</th>
                    <td>{intervention.dateDeclaration}</td>
                  </tr>
                  <tr>
                    <th scope="row">Date intervention</th>
                    <td>{intervention.dateIntervention}</td>
                  </tr>
                  <tr>
                    <th scope="row">Technicien</th>
                    <td>{intervention.technicien}</td>
                  </tr>
                  <tr>
                    <th scope="row">État</th>
                    <td>
                      <Badge 
                        bg={
                          intervention.etat === "Non résolue" ? "danger" : 
                          intervention.etat === "En cours" ? "warning" : "success"
                        }
                      >
                        {intervention.etat}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Durée intervention</th>
                    <td>{intervention.dureeIntervention}</td>
                  </tr>
                </tbody>
              </table>
              
              <h5 className="fw-bold mb-3">Détails Techniques</h5>
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th scope="row" style={{ width: '30%' }}>Description de la panne</th>
                    <td>{intervention.descriptionPanne}</td>
                  </tr>
                  <tr>
                    <th scope="row">Actions réalisées</th>
                    <td>{intervention.actionsRealisees}</td>
                  </tr>
                  <tr>
                    <th scope="row">Matériel utilisé</th>
                    <td>{intervention.materielUtilise}</td>
                  </tr>
                  <tr>
                    <th scope="row">Notes complémentaires</th>
                    <td>{intervention.notesComplementaires || 'Aucune'}</td>
                  </tr>
                </tbody>
              </table>
              
              <div className="text-center mt-5 text-muted small">
                <hr className="border-primary" />
                <p className="mb-0">© Société Telecom - Tous droits réservés</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Custom styles */}
      <style>
        {`
          .card {
            border-radius: 12px;
          }
          table {
            font-size: 0.9rem;
          }
          table th {
            background-color: ${theme.background};
          }
        `}
      </style>
    </Container>
  );
};

export default RapportIntervention;