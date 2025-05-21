import { useMemo, useState, useEffect, useRef } from "react";
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
import { FiDownload, FiPlus, FiWifi, FiAlertTriangle, FiCheckCircle, FiMapPin, FiUser, FiInfo } from "react-icons/fi";

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

interface SitePanne {
  id: number;
  nom: string;
  adresse: string;
  coordonnees: string;
  typePanne: string;
  date: string;
  etat: "Non résolue" | "En cours" | "Résolue";
  gestionnaire: string;
  technicien?: string;
}

const SitePanne: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<SitePanne[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const previousDataRef = useRef<SitePanne[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchSitesPanne = async () => {
      try {
        // Example mock data - replace this with your API call
        const mockData: SitePanne[] = [
          {
            id: 1,
            nom: 'Site Sahloul',
            adresse: 'Sahloul, Sousse',
            coordonnees: '35.8256, 10.6084',
            typePanne: 'Problème réseau',
            date: '2023-05-15',
            etat: 'Non résolue',
            gestionnaire: 'gestionnaire1'
          },
          {
            id: 2,
            nom: 'Site Menzah',
            adresse: 'Menzah 6, Tunis',
            coordonnees: '36.8412, 10.2034',
            typePanne: 'Panne matérielle',
            date: '2023-05-10',
            etat: 'En cours',
            gestionnaire: 'gestionnaire1',
            technicien: 'Tech123'
          },
          {
            id: 3,
            nom: 'Site Lac',
            adresse: 'Lac 2, Tunis',
            coordonnees: '36.8389, 10.2267',
            typePanne: 'Problème électrique',
            date: '2023-05-05',
            etat: 'Résolue',
            gestionnaire: 'gestionnaire1',
            technicien: 'Tech456'
          }
        ];

        // Only show sites under the connected gestionnaire's supervision
        const gestionnaireActuel = 'gestionnaire1';
        const filteredSites = mockData.filter(site => site.gestionnaire === gestionnaireActuel);

        setData(filteredSites);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des sites en panne:', error);
        setLoading(false);
      }
    };

    fetchSitesPanne();
  }, []);

  useEffect(() => {
    previousDataRef.current = [...data];
  }, [data]);

  // Calculate statistics
  const totalPannes = data.length;
  const nonResolues = data.filter(site => site.etat === "Non résolue").length;
  const enCours = data.filter(site => site.etat === "En cours").length;
  const resolues = data.filter(site => site.etat === "Résolue").length;

  const columns = useMemo<MRT_ColumnDef<SitePanne>[]>(() => [
    { 
      accessorKey: "id", 
      header: "ID", 
      size: 30,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    { 
      accessorKey: "nom", 
      header: "Nom du site", 
      size: 150 
    },
    { 
      accessorKey: "adresse", 
      header: "Adresse", 
      size: 150 
    },
    { 
      accessorKey: "coordonnees", 
      header: "Coordonnées", 
      size: 120 
    },
    { 
      accessorKey: "typePanne", 
      header: "Type de panne", 
      size: 150 
    },
    { 
      accessorKey: "date", 
      header: "Date", 
      size: 100 
    },
    {
      accessorKey: "etat",
      header: "État",
      size: 100,
      Cell: ({ cell }) => {
        const etat = cell.getValue<string>();
        let badgeClass = "";
        switch(etat) {
          case "Non résolue":
            badgeClass = "bg-danger";
            break;
          case "En cours":
            badgeClass = "bg-warning";
            break;
          case "Résolue":
            badgeClass = "bg-success";
            break;
        }
        return (
          <span
            className={`badge px-2 py-1 rounded-pill fw-bold ${badgeClass} text-white`}
          >
            {etat}
          </span>
        );
      },
    },
    {
      header: "Action",
      id: "action",
      size: 100,
      Cell: ({ row }) => (
        <Button
          variant={row.original.etat === "Non résolue" ? "outline-primary" : "outline-info"}
          size="sm"
          onClick={() => {
            if (row.original.etat === "Non résolue") {
              navigate("/assigner-technicien", { state: { site: row.original } });
            } else {
              navigate("/details-intervention", { state: { site: row.original } });
            }
          }}
          className="d-flex align-items-center"
        >
          {row.original.etat === "Non résolue" ? (
            <>
              <FiUser className="me-1" />
              Assigner technicien
            </>
          ) : (
            <>
              <FiInfo className="me-1" />
              Détails intervention
            </>
          )}
        </Button>
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sites en panne");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, "sites_panne.xlsx");
    setShowDropdown(false);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Liste des Sites en Panne", 14, 15);

    const headers = [
      "ID", "Nom du site", "Adresse", "Coordonnées", 
      "Type de panne", "Date", "État"
    ];

    const rows = data.map(site => [
      site.id.toString(),
      site.nom,
      site.adresse,
      site.coordonnees,
      site.typePanne,
      site.date,
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

    doc.save("sites_panne.pdf");
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
        ...(row.original.etat === "Non résolue"
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
          : row.original.etat === "En cours"
          ? {
              borderLeft: "4px solid #ffc107",
              backgroundColor: "#fff3cd",
              color: "#856404",
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
          <div className="bg-danger bg-opacity-10 p-3 rounded-circle me-3">
            <FiAlertTriangle size={24} color={theme.danger} />
          </div>
          <div>
            <h2 className="mb-0 fw-bold" style={{ color: theme.dark }}>
              Liste des sites en panne
            </h2>
            <p className="mb-0 text-muted">
              Gestion des pannes sous votre supervision
            </p>
          </div>
        </div>
        <div className="d-flex gap-2">
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
          <Card className="border-0 shadow-sm h-100" style={{ borderTop: `4px solid ${theme.danger}` }}>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-uppercase small text-muted">Total pannes</h6>
                  <h3 className="mb-0">{totalPannes}</h3>
                </div>
                <div className="bg-danger bg-opacity-10 rounded-circle p-3">
                  <FiAlertTriangle color={theme.danger} />
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
                  <h6 className="text-uppercase small text-muted">Non résolues</h6>
                  <h3 className="mb-0">{nonResolues}</h3>
                </div>
                <div className="bg-danger bg-opacity-10 rounded-circle p-3">
                  <FiAlertTriangle color={theme.danger} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderTop: `4px solid ${theme.warning}` }}>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-uppercase small text-muted">En cours</h6>
                  <h3 className="mb-0">{enCours}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                  <FiAlertTriangle color={theme.warning} />
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
                  <h6 className="text-uppercase small text-muted">Résolues</h6>
                  <h3 className="mb-0">{resolues}</h3>
                </div>
                <div className="bg-success bg-opacity-10 rounded-circle p-3">
                  <FiCheckCircle color={theme.success} />
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

export default SitePanne;