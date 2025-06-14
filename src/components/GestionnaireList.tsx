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
import { Button, Container, Badge, Card, Row, Col } from "react-bootstrap";
import { FiEdit2, FiDownload, FiPlus, FiUser, FiTrash2, FiInfo } from "react-icons/fi";
import { FaUserCog, FaUserTie } from "react-icons/fa";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logoTT from '../assets/logoTT.png';

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

type Manager = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  siege: string;
  telephone: string;
  role: string;
};

type Technicien = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  siege: string;
  telephone: string;
  role: string;
  status?: 'disponible' | 'intervention';
};

type Site = {
  id: number;
  nom: string;
  region: string;
  adresse: string;
  gestionnaireId: number;
};

const data: Manager[] = [
  {
    id: 1,
    nom: "Trabelsi",
    prenom: "Amira",
    email: "amira.trabelsi@example.com",
    siege: "Tunis",
    telephone: "22 334 556",
    role: "GESTIONNAIRE"
  },
  {
    id: 2,
    nom: "Ben Salah",
    prenom: "Fatma",
    email: "fatma.bensalah@example.com",
    siege: "Sousse",
    telephone: "76 543 210",
    role: "GESTIONNAIRE"
  },
  {
    id: 3,
    nom: "Khemiri",
    prenom: "Ahmed",
    email: "ahmed.khemiri@example.com",
    siege: "Bizerte",
    telephone: "55 678 901",
    role: "GESTIONNAIRE"
  },
];

const techniciensData: Technicien[] = [
  {
    id: 1,
    nom: "Ghariani",
    prenom: "Nidhal",
    email: "nidhal.ghariani@example.com",
    siege: "Tunis",
    telephone: "98 123 456",
    role: "TECHNICIEN",
    status: "disponible"
  },
  {
    id: 2,
    nom: "Masmoudi",
    prenom: "Yassine",
    email: "yassine.masmoudi@example.com",
    siege: "Sousse",
    telephone: "21 345 678",
    role: "TECHNICIEN",
    status: "intervention"
  },
  {
    id: 3,
    nom: "Ben Ali",
    prenom: "Mohamed",
    email: "mohamed.benali@example.com",
    siege: "Bizerte",
    telephone: "23 456 789",
    role: "TECHNICIEN",
    status: "disponible"
  }
];

const sitesData: Site[] = [
  {
    id: 1,
    nom: "Site Tunis Centre",
    region: "Tunis",
    adresse: "Avenue Habib Bourguiba",
    gestionnaireId: 1
  },
  {
    id: 2,
    nom: "Site Sousse Médina",
    region: "Sousse",
    adresse: "Rue de la Médina",
    gestionnaireId: 2
  },
  {
    id: 3,
    nom: "Site Bizerte Port",
    region: "Bizerte",
    adresse: "Zone portuaire",
    gestionnaireId: 3
  },
  {
    id: 4,
    nom: "Site Tunis Nord",
    region: "Tunis",
    adresse: "Avenue de la Liberté",
    gestionnaireId: 1
  }
];

const GestionnaireList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const gestionnaires = data.filter((item) => item.role === "GESTIONNAIRE");

  const handleEdit = (manager: Manager) => {
    navigate("/gestionnaireform", { state: { userToEdit: manager } });
  };

  const handleAddNew = () => {
    navigate("/gestionnaireform");
  };

  const handleDelete = (manager: Manager) => {
    Swal.fire({
      title: 'Confirmer la suppression',
      html: `Voulez-vous vraiment supprimer le gestionnaire <b>${manager.prenom} ${manager.nom}</b> ?`,
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
                    <option value="demission">Démission</option>
                    <option value="retraite">Retraite</option>
                    <option value="licenciement">Licenciement</option>
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
              console.log('Gestionnaire supprimé:', manager.id, 'Raison:', result.value);
              resolve(true);
              
              Swal.fire(
                'Supprimé!',
                'Le gestionnaire a été supprimé avec succès.',
                'success'
              );
            }
          });
        });
      }
    });
  };

  const handleExportDetailsPDF = (manager: Manager) => {
    const content = document.getElementById('gestionnaire-details-content');
    if (!content) return;
    
    const clone = content.cloneNode(true) as HTMLElement;
    
    // Remove the export button from the clone
    const exportBtn = clone.querySelector('#export-pdf-btn');
    if (exportBtn) exportBtn.remove();
    
    // Remove pagination controls
    const paginationControls = clone.querySelectorAll('[style*="display: flex; justify-content: center;"]');
    paginationControls.forEach(control => control.remove());
    
    // Show all data (remove pagination)
    const tables = clone.querySelectorAll('table');
    tables.forEach(table => {
      const tbody = table.querySelector('tbody');
      if (tbody) {
        const allRows = Array.from(table.querySelectorAll('tr[style*="background-color: white;"]') || [])
          .concat(Array.from(table.querySelectorAll('tr:not([style*="background-color: white;"])') || []));
        
        tbody.innerHTML = '';
        allRows.forEach(row => tbody.appendChild(row));
      }
    });

    // Adjust styling for PDF
    clone.style.width = '800px';
    clone.style.padding = '20px';
    clone.style.fontSize = '14px';
    
    // Create a temporary container for the clone
    const tempContainer = document.createElement('div');
    tempContainer.appendChild(clone);
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    document.body.appendChild(tempContainer);
    
    html2canvas(clone, {
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
      allowTaint: true
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190; // Slightly smaller than A4 width
      const pageHeight = 277; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 10; // Start 10mm from top
      
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`gestionnaire_${manager.nom}_${manager.prenom}.pdf`);
      document.body.removeChild(tempContainer);
    });
  };

  const handleDetails = (manager: Manager) => {
    const techniciens = techniciensData.filter(t => t.siege === manager.siege);
    const sites = sitesData.filter(s => s.gestionnaireId === manager.id);
    
    const totalPagesTech = Math.ceil(techniciens.length / itemsPerPage);
    const paginatedTechniciens = techniciens.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    const totalPagesSites = Math.ceil(sites.length / itemsPerPage);
    const paginatedSites = sites.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    Swal.fire({
      title: ``,
      html: `
        <div id="gestionnaire-details-content" style="font-family: Arial, sans-serif; width: 800px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
            <div>
              <h1 style="color: ${theme.primary}; margin: 0 0 5px 0; font-weight: 600; font-size: 20px;">FICHE GESTIONNAIRE</h1>
              <h2 style="color: ${theme.primary}; margin: 0 0 5px 0; font-weight: 600;">${manager.prenom} ${manager.nom}</h2>
              <p style="color: ${theme.secondary}; margin: 0; font-size: 14px;">Gestionnaire Tunisie Telecom</p>
            </div>
            <div style="width: 200px; height: 70px; display: flex; align-items: center; justify-content: flex-end;">
              <img src="${logoTT}" alt="Logo TT" style="max-height: 100%;" />
            </div>
          </div>
          
          <div style="background-color: ${theme.background}; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="color: ${theme.primary}; margin-top: 0; margin-bottom: 15px;">Informations Personnelles</h4>
            <div style="display: flex; gap: 20px; margin-bottom: 10px;">
              <div style="flex: 1;">
                <div style="margin-bottom: 10px;">
                  <p style="margin: 0 0 5px 0; font-size: 13px; color: ${theme.secondary}; font-weight: 500;">EMAIL</p>
                  <p style="margin: 0;"><a href="mailto:${manager.email}" style="color: ${theme.primary}; text-decoration: none;">${manager.email}</a></p>
                </div>
              </div>
              <div style="flex: 1;">
                <div style="margin-bottom: 10px;">
                  <p style="margin: 0 0 5px 0; font-size: 13px; color: ${theme.secondary}; font-weight: 500;">TÉLÉPHONE</p>
                  <p style="margin: 0;"><a href="tel:${manager.telephone}" style="color: ${theme.primary}; text-decoration: none;">${manager.telephone}</a></p>
                </div>
              </div>
            </div>
            <div style="text-align: center;">
              <p style="margin: 0 0 5px 0; font-size: 13px; color: ${theme.secondary}; font-weight: 500;">SIÈGE</p>
              <p style="margin: 0;">${manager.siege}</p>
            </div>
          </div>
          
          <div style="margin-bottom: 15px; display: flex; justify-content: flex-end;">
            <button id="export-pdf-btn" class="btn btn-primary" style="background-color: ${theme.primary}; border: none; padding: 8px 16px; border-radius: 4px; color: white; font-size: 14px;">
              <i class="fas fa-download"></i> Exporter en PDF
            </button>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h4 style="color: ${theme.primary}; margin-top: 0; margin-bottom: 15px;">Techniciens sous sa gestion</h4>
            ${techniciens.length > 0 ? `
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                <thead>
                  <tr style="background-color: ${theme.primary}; color: white;">
                    <th style="padding: 10px; text-align: left; font-size: 13px;">Nom</th>
                    <th style="padding: 10px; text-align: left; font-size: 13px;">Email</th>
                    <th style="padding: 10px; text-align: left; font-size: 13px;">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  ${paginatedTechniciens.map((tech, index) => `
                    <tr style="border-bottom: 1px solid #ddd; ${index % 2 === 0 ? `background-color: white;` : ''}">
                      <td style="padding: 10px; font-size: 13px;">${tech.prenom} ${tech.nom}</td>
                      <td style="padding: 10px; font-size: 13px;">${tech.email}</td>
                      <td style="padding: 10px; font-size: 13px;">
                        ${tech.status === 'disponible' ? 'Disponible' : 'En intervention'}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              ${totalPagesTech > 1 ? `
                <div style="display: flex; justify-content: center;">
                  <div style="display: flex; gap: 5px;">
                    ${Array.from({ length: totalPagesTech }, (_, i) => i + 1).map(page => `
                      <button 
                        data-page="${page}"
                        data-section="tech"
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
            `<p style="color: ${theme.secondary}; text-align: center; font-size: 13px;">Aucun technicien sous sa gestion</p>`}
          </div>
          
          <div>
            <h4 style="color: ${theme.primary}; margin-top: 0; margin-bottom: 15px;">Sites sous sa gestion</h4>
            ${sites.length > 0 ? `
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                <thead>
                  <tr style="background-color: ${theme.primary}; color: white;">
                    <th style="padding: 10px; text-align: left; font-size: 13px;">Nom</th>
                    <th style="padding: 10px; text-align: left; font-size: 13px;">Région</th>
                    <th style="padding: 10px; text-align: left; font-size: 13px;">Adresse</th>
                  </tr>
                </thead>
                <tbody>
                  ${paginatedSites.map((site, index) => `
                    <tr style="border-bottom: 1px solid #ddd; ${index % 2 === 0 ? `background-color: white;` : ''}">
                      <td style="padding: 10px; font-size: 13px;">${site.nom}</td>
                      <td style="padding: 10px; font-size: 13px;">${site.region}</td>
                      <td style="padding: 10px; font-size: 13px;">${site.adresse}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              ${totalPagesSites > 1 ? `
                <div style="display: flex; justify-content: center;">
                  <div style="display: flex; gap: 5px;">
                    ${Array.from({ length: totalPagesSites }, (_, i) => i + 1).map(page => `
                      <button 
                        data-page="${page}"
                        data-section="site"
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
            `<p style="color: ${theme.secondary}; text-align: center; font-size: 13px;">Aucun site sous sa gestion</p>`}
          </div>
        </div>
      `,
      width: '850px',
      showConfirmButton: false,
      showCloseButton: true,
      didOpen: () => {
        const exportBtn = document.getElementById('export-pdf-btn');
        if (exportBtn) {
          exportBtn.addEventListener('click', () => handleExportDetailsPDF(manager));
        }

        const pageButtons = document.querySelectorAll('[data-page]');
        pageButtons.forEach(button => {
          button.addEventListener('click', (e) => {
            e.preventDefault();
            const page = parseInt((e.currentTarget as HTMLElement).dataset.page || '1');
            const section = (e.currentTarget as HTMLElement).dataset.section;
            setCurrentPage(page);
            handleDetails(manager);
          });
        });
      }
    });
  };

  const columns = useMemo<MRT_ColumnDef<Manager>[]>(
    () => [
      { 
        accessorKey: "id", 
        header: "ID", 
        size: 50,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      { 
        id: "profile",
        header: "Gestionnaire",
        size: 200,
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <div className="me-3" style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: "#3f51b5",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: 14
            }}>
              {`${row.original.prenom[0]}${row.original.nom[0]}`.toUpperCase()}
            </div>
            <div>
              <div className="fw-semibold">{`${row.original.prenom} ${row.original.nom}`}</div>
              <div className="small">
                <a href={`mailto:${row.original.email}`} className="text-primary">
                  {row.original.email}
                </a>
              </div>
            </div>
          </div>
        ),
      },
      { 
        accessorKey: "telephone", 
        header: "Téléphone", 
        size: 130,
        Cell: ({ row }) => (
          <a href={`tel:${row.original.telephone}`} className="text-dark">
            {row.original.telephone}
          </a>
        ),
      },
      { 
        accessorKey: "siege", 
        header: "Siège", 
        size: 100,
        Cell: ({ row }) => (
          <Badge bg="light" text="dark" className="text-capitalize" style={{ fontSize: '14px', padding: '6px 10px' }}>
            {row.original.siege}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        size: 200,
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleEdit(row.original)}
              className="d-flex align-items-center"
            >
              <FiEdit2 className="me-1" />
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
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: gestionnaires,
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
    muiTableBodyRowProps: {
      sx: {
        '&:hover': {
          backgroundColor: 'rgba(63, 81, 181, 0.05) !important',
        },
      },
    },
  });

  const handleExportExcel = () => {
    const exportData = gestionnaires.map(({ role, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Gestionnaires");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(fileData, "gestionnaires.xlsx");
  };

  return (
    <Container fluid className="px-4 py-4" style={{ backgroundColor: theme.background, minHeight: "100vh" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
            <FaUserTie size={24} color={theme.primary} />
          </div>
          <div>
            <h2 className="mb-0 fw-bold" style={{ color: theme.dark }}>
              Liste des gestionnaires
            </h2>
            <p className="mb-0 text-muted">
              Gestion des comptes gestionnaires
            </p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="outline-primary"
            onClick={handleExportExcel}
            className="d-flex align-items-center"
          >
            <FiDownload className="me-2" />
            Exporter
          </Button>
          <Button
            variant="primary"
            onClick={handleAddNew}
            className="d-flex align-items-center"
          >
            <FiPlus className="me-2" />
            Ajouter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
  <Col md={4}>
          <Card className="border-0 shadow-sm h-100" style={{ borderTop: `4px solid ${theme.primary}` }}>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-uppercase small text-muted">Total Gesstionnaires</h6>
                  <h3 className="mb-0">{gestionnaires.length}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                  <FaUserCog color={theme.primary} />
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

export default GestionnaireList;