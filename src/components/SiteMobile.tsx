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
import { FiDownload, FiPlus, FiWifi, FiAlertTriangle, FiCheckCircle, FiMapPin } from "react-icons/fi";

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
    equipement: "Hwauei",
    technologie: "Tec3G",
    type: "Outdoor",
    acces: "Autorisé",
    etat: "Opérationnel",
  },
];

const SiteMobile = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<SiteMobile[]>(originalData);
  const previousDataRef = useRef<SiteMobile[]>(originalData);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const newData = [...data];
      const operationalSites = newData.filter(site => site.etat === "Opérationnel");
      if (operationalSites.length > 0) {
        operationalSites[0].etat = "En panne";
        setData(newData);
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    previousDataRef.current = [...data];
  }, [data]);

  // Calculate statistics
  const totalSites = data.length;
  const operationalSites = data.filter(site => site.etat === "Opérationnel").length;
  const downSites = data.filter(site => site.etat === "En panne").length;
  const authorizedAccess = data.filter(site => site.acces === "Autorisé").length;

  const columns = useMemo<MRT_ColumnDef<SiteMobile>[]>(() => [
    { 
      accessorKey: "numero", 
      header: "Numéro", 
      size: 30,
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
      size: 150 
    },
    { 
      accessorKey: "technologie", 
      header: "Technologie", 
      size: 100 
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
      header: "Action",
      id: "action",
      size: 80,
      Cell: ({ row }) => (
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