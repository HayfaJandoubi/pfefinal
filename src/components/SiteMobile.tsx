import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Button, Container, Badge, Card, Row, Col, Dropdown } from "react-bootstrap";
import { FiDownload, FiPlus, FiWifi, FiAlertTriangle, FiCheckCircle, FiMapPin, FiTrash2, FiInfo } from "react-icons/fi";
import Swal from "sweetalert2";
import logoTT from '../assets/logoTT.png';

// Add type declaration for jsPDF
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number;
    };
  }
}

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

type SiteMobile = {
  adresse: string;
  coordonnees: string;
  equipement: string;
  technologie: string;
  type: string;
  acces: string;
  etat: string;
  numero: number;
};

type Intervention = {
  id: number;
  siteId: number;
  date: string;
  techniciens: string[];
  description: string;
  resolution: string;
  duree: string;
};

const originalData: SiteMobile[] = [
  {
    numero: 1,
    adresse: "Rue Habib Bourguiba",
    coordonnees: "36.8065, 10.1815",
    equipement: "Alcatel",
    technologie: "Tec4G",
    type: "Outdoor",
    acces: "Autorisé",
    etat: "Opérationnel",
  },
  {
    numero: 2,
    adresse: "Avenue de la Liberté",
    coordonnees: "36.8000, 10.1700",
    equipement: "Ericsson",
    technologie: "Tec5G",
    type: "Indoor",
    acces: "Non autorisé",
    etat: "En panne", 
  },
  {
    numero: 3,
    adresse: "Rue de Marseille",
    coordonnees: "36.8145, 10.1650",
    equipement: "Huawei",
    technologie: "Tec3G",
    type: "Outdoor",
    acces: "Autorisé",
    etat: "Opérationnel",
  },
];

const interventionsData: Intervention[] = [
  {
    id: 1,
    siteId: 1,
    date: "2023-05-15",
    techniciens: ["Nidhal Ghariani", "Yassine Masmoudi"],
    description: "Problème de connexion réseau",
    resolution: "Remplacement de carte réseau",
    duree: "2 heures"
  },
  {
    id: 2,
    siteId: 1,
    date: "2023-06-20",
    techniciens: ["Mohamed Ben Ali"],
    description: "Maintenance préventive",
    resolution: "Nettoyage et vérification des équipements",
    duree: "3 heures"
  },
  {
    id: 3,
    siteId: 2,
    date: "2023-07-10",
    techniciens: ["Yassine Masmoudi", "Amira Trabelsi"],
    description: "Panne complète du site",
    resolution: "Remplacement de l'alimentation principale",
    duree: "5 heures"
  },
  {
    id: 4,
    siteId: 3,
    date: "2023-08-05",
    techniciens: ["Nidhal Ghariani"],
    description: "Mise à jour du firmware",
    resolution: "Installation de la dernière version",
    duree: "1 heure"
  }
];

const SiteMobile = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<SiteMobile[]>(originalData);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Calculate statistics
  const totalSites = data.length;
  const operationalSites = data.filter(site => site.etat === "Opérationnel").length;
  const downSites = data.filter(site => site.etat === "En panne").length;
  const authorizedAccess = data.filter(site => site.acces === "Autorisé").length;

  const handleDelete = (site: SiteMobile) => {
    Swal.fire({
      title: 'Confirmer la suppression',
      html: `Voulez-vous vraiment supprimer le site <b>${site.adresse}</b> ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: theme.danger,
      cancelButtonColor: theme.secondary,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return new Promise((resolve) => {
          Swal.fire({
            title: 'Raison de suppression',
            html: `
              <form id="deleteReasonForm">
                <div class="mb-3">
                  <select class="form-select" id="reasonSelect" required>
                    <option value="">Sélectionnez une raison</option>
                    <option value="doesnt_work">Le site ne fonctionne plus</option>
                    <option value="not_needed">N'est plus nécessaire dans cette zone</option>
                    <option value="other">Autre raison</option>
                  </select>
                </div>
                <div class="mb-3" id="otherReasonContainer" style="display: none;">
                  <textarea class="form-control" id="otherReason" placeholder="Précisez la raison..." rows="3"></textarea>
                </div>
              </form>
            `,
            showCancelButton: true,
            confirmButtonText: 'Confirmer',
            cancelButtonText: 'Annuler',
            preConfirm: () => {
              const select = document.getElementById('reasonSelect') as HTMLSelectElement;
              const otherReason = document.getElementById('otherReason') as HTMLTextAreaElement;
              
              if (!select.value) {
                Swal.showValidationMessage('Veuillez sélectionner une raison');
                return false;
              }
              
              if (select.value === 'other' && !otherReason.value.trim()) {
                Swal.showValidationMessage('Veuillez préciser la raison');
                return false;
              }
              
              return {
                reason: select.value,
                details: select.value === 'other' ? otherReason.value.trim() : select.options[select.selectedIndex].text
              };
            },
            didOpen: () => {
              const select = document.getElementById('reasonSelect') as HTMLSelectElement;
              const container = document.getElementById('otherReasonContainer') as HTMLDivElement;
              
              select.addEventListener('change', (e) => {
                container.style.display = (e.target as HTMLSelectElement).value === 'other' ? 'block' : 'none';
              });
            }
          }).then((result) => {
            if (result.isConfirmed) {
              const newData = data.filter(s => s.numero !== site.numero);
              setData(newData);
              resolve(true);
              
              Swal.fire(
                'Supprimé!',
                'Le site a été supprimé avec succès.',
                'success'
              );
            }
          });
        });
      }
    });
  };

  const handleExportInterventionPDF = (site: SiteMobile) => {
    const interventions = interventionsData.filter(i => i.siteId === site.numero);
    
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Détails du site et historique des interventions`, 14, 15);
    doc.setFontSize(12);
    doc.text(`Site ${site.numero} - ${site.adresse}`, 14, 25);
    doc.text(`État: ${site.etat}`, 14, 30);

    // Add site details table
    const siteHeaders = ["Attribut", "Valeur"];
    const siteRows = [
      ["Numéro", site.numero.toString()],
      ["Adresse", site.adresse],
      ["Coordonnées", site.coordonnees],
      ["Équipement", site.equipement],
      ["Technologie", site.technologie],
      ["Type", site.type],
      ["Accès", site.acces],
      ["État", site.etat]
    ];

    // First table
    autoTable(doc, {
      head: [siteHeaders],
      body: siteRows,
      startY: 40,
      styles: {
        cellPadding: 2,
        fontSize: 8,
        valign: 'middle',
        halign: 'left'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 40 }
    });

    // Add space between tables
    const spaceBetweenTables = 15;
    const currentY = doc.lastAutoTable?.finalY || 70; // Fallback to 70 if not available

    // Add interventions table
    doc.text("Historique des interventions", 14, currentY + spaceBetweenTables);

    const interventionHeaders = [
      "Date", "Techniciens", "Description", "Résolution", "Durée"
    ];

    const interventionRows = interventions.map(intervention => [
      intervention.date,
      intervention.techniciens.join(", "),
      intervention.description,
      intervention.resolution,
      intervention.duree
    ]);

    autoTable(doc, {
      head: [interventionHeaders],
      body: interventionRows,
      startY: currentY + spaceBetweenTables + 10, // Add extra space for the text
      styles: {
        cellPadding: 2,
        fontSize: 8,
        valign: 'middle',
        halign: 'left'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    doc.save(`details_site_${site.numero}.pdf`);
  };

  const handleDetails = (site: SiteMobile) => {
    const interventions = interventionsData.filter(i => i.siteId === site.numero);
    const totalPages = Math.ceil(interventions.length / itemsPerPage);
    const paginatedInterventions = interventions.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    Swal.fire({
      title: ``,
      html: `
        <div id="interventions-details-content" style="font-family: Arial, sans-serif; width: 800px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
            <div>
              <h1 style="color: ${theme.primary}; margin: 0 0 5px 0; font-weight: 600; font-size: 20px;">DÉTAILS DU SITE</h1>
              <h2 style="color: ${theme.primary}; margin: 0 0 5px 0; font-weight: 600;">Site ${site.numero}</h2>
              <p style="color: ${theme.secondary}; margin: 0; font-size: 14px;">${site.adresse}</p>
            </div>
            <div style="width: 200px; height: 70px; display: flex; align-items: center; justify-content: flex-end;">
              <img src="${logoTT}" alt="Logo TT" style="max-height: 100%;" />
            </div>
          </div>
          
          <div style="background-color: ${theme.background}; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="color: ${theme.primary}; margin-top: 0; margin-bottom: 15px;">Informations du Site</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p style="margin: 0 0 5px 0; font-size: 13px; color: ${theme.secondary}; font-weight: 500;">NUMÉRO</p>
                <p style="margin: 0;">${site.numero}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; font-size: 13px; color: ${theme.secondary}; font-weight: 500;">ADRESSE</p>
                <p style="margin: 0;">${site.adresse}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; font-size: 13px; color: ${theme.secondary}; font-weight: 500;">COORDONNÉES</p>
                <p style="margin: 0;">${site.coordonnees}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; font-size: 13px; color: ${theme.secondary}; font-weight: 500;">ÉQUIPEMENT</p>
                <p style="margin: 0;">${site.equipement}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; font-size: 13px; color: ${theme.secondary}; font-weight: 500;">TECHNOLOGIE</p>
                <p style="margin: 0;">${site.technologie}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; font-size: 13px; color: ${theme.secondary}; font-weight: 500;">TYPE</p>
                <p style="margin: 0;">${site.type}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; font-size: 13px; color: ${theme.secondary}; font-weight: 500;">ACCÈS</p>
                <p style="margin: 0;">${site.acces}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; font-size: 13px; color: ${theme.secondary}; font-weight: 500;">ÉTAT</p>
                <p style="margin: 0; color: ${site.etat === 'Opérationnel' ? theme.success : theme.danger}; font-weight: bold;">
                  ${site.etat}
                </p>
              </div>
            </div>
          </div>
          
          <div style="margin-bottom: 15px; display: flex; justify-content: flex-end;">
            <button id="export-pdf-btn" class="btn btn-primary" style="background-color: ${theme.primary}; border: none; padding: 8px 16px; border-radius: 4px; color: white; font-size: 14px;">
              <i class="fas fa-download"></i> Exporter en PDF
            </button>
          </div>
          
          <div>
            <h4 style="color: ${theme.primary}; margin-top: 0; margin-bottom: 15px;">Historique des interventions</h4>
            ${interventions.length > 0 ? `
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                <thead>
                  <tr style="background-color: ${theme.primary}; color: white;">
                    <th style="padding: 10px; text-align: left; font-size: 13px;">Date</th>
                    <th style="padding: 10px; text-align: left; font-size: 13px;">Techniciens</th>
                    <th style="padding: 10px; text-align: left; font-size: 13px;">Description</th>
                    <th style="padding: 10px; text-align: left; font-size: 13px;">Résolution</th>
                    <th style="padding: 10px; text-align: left; font-size: 13px;">Durée</th>
                  </tr>
                </thead>
                <tbody>
                  ${paginatedInterventions.map((intervention, index) => `
                    <tr style="border-bottom: 1px solid #ddd; ${index % 2 === 0 ? `background-color: white;` : ''}">
                      <td style="padding: 10px; font-size: 13px;">${intervention.date}</td>
                      <td style="padding: 10px; font-size: 13px;">${intervention.techniciens.join(", ")}</td>
                      <td style="padding: 10px; font-size: 13px;">${intervention.description}</td>
                      <td style="padding: 10px; font-size: 13px;">${intervention.resolution}</td>
                      <td style="padding: 10px; font-size: 13px;">${intervention.duree}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              ${totalPages > 1 ? `
                <div style="display: flex; justify-content: center;">
                  <div style="display: flex; gap: 5px;">
                    ${Array.from({ length: totalPages }, (_, i) => i + 1).map(page => `
                      <button 
                        data-page="${page}"
                        style="
                          width: 30px;
                          height: 30px;
                          border: none;
                          border-radius: 4px;
                          background-color: ${page === currentPage ? theme.primary : 'white'};
                          color: ${page === currentPage ? 'white' : theme.dark};
                          cursor: pointer;
                          font-size: 12px;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          border: 1px solid ${page === currentPage ? theme.primary : '#e0e0e0'};
                        "
                      >
                        ${page}
                      </button>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            ` : 
            `<p style="color: ${theme.secondary}; text-align: center; font-size: 13px;">Aucune intervention enregistrée pour ce site</p>`}
          </div>
        </div>
      `,
      width: '850px',
      showConfirmButton: false,
      showCloseButton: true,
      didOpen: () => {
        const exportBtn = document.getElementById('export-pdf-btn');
        if (exportBtn) {
          exportBtn.addEventListener('click', () => handleExportInterventionPDF(site));
        }

        const pageButtons = document.querySelectorAll('[data-page]');
        pageButtons.forEach(button => {
          button.addEventListener('click', (e) => {
            e.preventDefault();
            const page = parseInt((e.currentTarget as HTMLElement).dataset.page || '1');
            setCurrentPage(page);
            handleDetails(site);
          });
        });
      }
    });
  };

  const columns = useMemo<MRT_ColumnDef<SiteMobile>[]>(() => [
    { 
      accessorKey: "numero", 
      header: "Numéro", 
      size: 10,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    { 
      accessorKey: "adresse", 
      header: "Adresse", 
      size: 200 
    },
    { 
      accessorKey: "coordonnees", 
      header: "Coordonnées", 
      size: 150 
    },
    { 
      accessorKey: "equipement", 
      header: "Équipement", 
      size: 100 
    },
    { 
      accessorKey: "technologie", 
      header: "Technologie", 
      size: 50 
    },
    { 
      accessorKey: "type", 
      header: "Type", 
      size: 100 
    },
    { 
      accessorKey: "acces", 
      header: "Accès", 
      size: 100 
    },
    {
      accessorKey: "etat",
      header: "État",
      size: 80,
      Cell: ({ cell }) => {
        const etat = cell.getValue<string>();
        return (
          <span
            className={`badge px-2 py-1 rounded-pill fw-bold ${
              etat === "En panne"
                ? "bg-danger text-white"
                : "bg-success text-white"
            }`}
          >
            {etat}
          </span>
        );
      },
    },
    {
      header: "Actions",
      id: "actions",
      size: 150,
      Cell: ({ row }) => (
        <div className="d-flex gap-2">
          <Button
            variant="outline-warning"
            size="sm"
            onClick={() => {
              localStorage.setItem("siteToEdit", JSON.stringify(row.original));
              navigate("/ajoutsite");
            }}
            className="d-flex align-items-center"
          >
            <FiPlus className="me-1" />
            Modifier
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleDelete(row.original)}
            className="d-flex align-items-center"
          >
            <FiTrash2 className="me-1" />
            Supprimer
          </Button>
          <Button
            variant="outline-info"
            size="sm"
            onClick={() => handleDetails(row.original)}
            className="d-flex align-items-center"
          >
            <FiInfo className="me-1" />
          </Button>
        </div>
      ),
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
  ], [navigate]);

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sites Mobiles");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, "sites_mobiles.xlsx");
    setShowDropdown(false);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Liste des Sites Mobiles", 14, 15);

    const headers = [
      "Numéro", "Adresse", "Coordonnées", "Équipement",
      "Technologie", "Type", "Accès", "État"
    ];

    const rows = data.map(site => [
      site.numero.toString(),
      site.adresse,
      site.coordonnees,
      site.equipement,
      site.technologie,
      site.type,
      site.acces,
      site.etat
    ]);

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 25,
      styles: {
        cellPadding: 2,
        fontSize: 8,
        valign: 'middle',
        halign: 'left'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    doc.save("sites_mobiles.pdf");
    setShowDropdown(false);
  };

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: false,
    enableColumnFilters: true,
    enablePagination: true,
    initialState: {
      density: "comfortable",
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "12px",
        border: "1px solid #e0e0e0",
        overflow: "hidden",
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontWeight: 600,
        backgroundColor: theme.background,
        color: theme.dark,
        fontSize: "0.8rem",
      },
    },
    muiTableBodyCellProps: {
      sx: {
        borderBottom: "1px solid #f0f0f0",
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        '&:hover': {
          backgroundColor: 'rgba(63, 81, 181, 0.05) !important',
        },
        ...(row.original.etat === "En panne"
          ? {
              borderLeft: "4px solid #dc3545",
              borderRight: "4px solid #dc3545",
              borderTop: "4px solid #dc3545",
              borderBottom: "4px solid #dc3545",
              backgroundColor: "#f8d7da",
              color: "#721c24",
              fontWeight: "bold",
              boxShadow: "0 0 10px rgba(220, 53, 69, 0.6)",
              borderRadius: "0px",
              margin: "4px 0",
              animation: "pulse 1.5s infinite",
            }
          : {}),
      },
    }),
  });

  return (
    <Container fluid className="px-4 py-4" style={{ backgroundColor: theme.background, minHeight: "100vh" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
            <FiWifi size={24} color={theme.primary} />
          </div>
          <div>
            <h2 className="mb-0 fw-bold" style={{ color: theme.dark }}>
              Liste des sites mobiles
            </h2>
            <p className="mb-0 text-muted">
              Gestion des sites mobiles et de leur état
            </p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="primary"
            onClick={() => navigate("/ajoutsite")}
            className="d-flex align-items-center"
          >
            <FiPlus className="me-2" />
            Ajouter site
          </Button>
          <Dropdown show={showDropdown} onToggle={setShowDropdown}>
            <Dropdown.Toggle variant="success" className="d-flex align-items-center">
              <FiDownload className="me-2" />
              Exporter
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleExportExcel}>Exporter en Excel</Dropdown.Item>
              <Dropdown.Item onClick={handleExportPDF}>Exporter en PDF</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderTop: `4px solid ${theme.primary}` }}>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-uppercase small text-muted">Total sites</h6>
                  <h3 className="mb-0">{totalSites}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                  <FiWifi color={theme.primary} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderTop: `4px solid ${theme.success}` }}>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-uppercase small text-muted">Opérationnels</h6>
                  <h3 className="mb-0">{operationalSites}</h3>
                </div>
                <div className="bg-success bg-opacity-10 rounded-circle p-3">
                  <FiCheckCircle color={theme.success} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderTop: `4px solid ${theme.danger}` }}>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-uppercase small text-muted">En panne</h6>
                  <h3 className="mb-0">{downSites}</h3>
                </div>
                <div className="bg-danger bg-opacity-10 rounded-circle p-3">
                  <FiAlertTriangle color={theme.danger} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderTop: `4px solid ${theme.info}` }}>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-uppercase small text-muted">Accès autorisé</h6>
                  <h3 className="mb-0">{authorizedAccess}</h3>
                </div>
                <div className="bg-info bg-opacity-10 rounded-circle p-3">
                  <FiMapPin color={theme.info} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Table Card */}
      <Card className="shadow-sm border-0 overflow-hidden">
        <Card.Body className="p-0">
          <MaterialReactTable table={table} />
        </Card.Body>
      </Card>

      {/* Custom styles */}
      <style>
        {`
          @keyframes pulse {
            0% { box-shadow: 0 0 10px rgba(220, 53, 69, 0.6); }
            50% { box-shadow: 0 0 15px rgba(220, 53, 69, 0.9); }
            100% { box-shadow: 0 0 10px rgba(220, 53, 69, 0.6); }
          }
          .card {
            border-radius: 12px;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.1) !important;
          }
          .MuiTable-root {
            border-radius: 12px;
            overflow: hidden;
          }
          .MuiTableHead-root {
            background-color: ${theme.background};
          }
          .MuiTableCell-head {
            font-weight: 600;
            font-size: 0.8rem;
          }
          .MuiTableRow-root:hover {
            background-color: rgba(63, 81, 181, 0.05) !important;
          }
          .MuiTablePagination-root {
            border-top: 1px solid rgba(224, 224, 224, 1);
            padding: 16px;
          }
          .dropdown-menu {
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border: none;
          }
        `}
      </style>
    </Container>
  );
};

export default SiteMobile;