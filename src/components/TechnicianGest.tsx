import { useMemo } from "react";
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
import { FiDownload, FiUser, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaUserCheck, FaUserClock } from "react-icons/fa";
import { MdWork, MdEngineering } from "react-icons/md";

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

type Person = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  availability: 'available' | 'busy';
  currentSite?: string;
  lastActive: string;
  interventionId?: string;
};

// Temporary static data - this would come from API in real app
const data: Person[] = [
  {
    id: 1,
    nom: "Ghariani",
    prenom: "Nidhal",
    email: "nidhal.ghariani@example.com",
    telephone: "98 123 456",
    role: "TECHNICIEN",
    availability: "busy",
    currentSite: "Site A - Centre Ville",
    lastActive: "2023-05-15 08:30",
    interventionId: "INT-2023-001"
  },
  {
    id: 2,
    nom: "Masmoudi",
    prenom: "Yassine",
    email: "yassine.masmoudi@example.com",
    telephone: "21 345 678",
    role: "TECHNICIEN",
    availability: "available",
    lastActive: "2023-05-15 09:15"
  },
  {
    id: 3,
    nom: "Trabelsi",
    prenom: "Amira",
    email: "amira.trabelsi@example.com",
    telephone: "22 334 556",
    role: "GESTIONNAIRE",
    availability: "available",
    lastActive: "2023-05-15 10:00"
  },
  {
    id: 4,
    nom: "Ben Ali",
    prenom: "Omar",
    email: "omar.benali@example.com",
    telephone: "25 888 999",
    role: "TECHNICIEN",
    availability: "available",
    lastActive: "2023-05-14 16:45"
  },
  {
    id: 5,
    nom: "Kacem",
    prenom: "Salma",
    email: "salma.kacem@example.com",
    telephone: "23 111 222",
    role: "TECHNICIEN",
    availability: "available",
    lastActive: "2023-05-12 11:20"
  },
];

const TechnicianGest = () => {
  const navigate = useNavigate();
  
  // In a real app, this would come from auth context or API
  const currentManager = {
    id: 3,
    name: "Amira Trabelsi",
    position: "Gestionnaire Technique"
  };

  // Filter technicians
  const filteredTechniciens = data.filter(
    (item) => item.role === "TECHNICIEN"
  );

  const handleInterventionDetails = (interventionId: string) => {
    navigate(`/details-intervention/${interventionId}`);
  };

  const columns = useMemo<MRT_ColumnDef<Person>[]>(() => [
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
      header: "Technicien",
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
            <div className="text-muted small">
              <a href={`mailto:${row.original.email}`} className="text-decoration-none">
                <FiMail size={14} className="me-1" />
                {row.original.email}
              </a>
            </div>
          </div>
        </div>
      ),
    },
    { 
      accessorKey: "telephone", 
      header: "Contact", 
      size: 120,
      Cell: ({ row }) => (
        <div className="d-flex align-items-center">
          <FiPhone size={16} className="me-2 text-muted" />
          <a href={`tel:${row.original.telephone}`} className="text-dark text-decoration-none">
            {row.original.telephone}
          </a>
        </div>
      ),
    },
    { 
      accessorKey: "availability", 
      header: "Disponibilité", 
      size: 200,
      Cell: ({ row }) => {
        const isBusy = row.original.availability === 'busy';
        return (
          <div className="d-flex align-items-center">
            {isBusy ? (
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center mb-1">
                  <MdWork size={18} className="me-2 text-danger" />
                  <span className="fw-semibold small">En intervention</span>
                </div>
                {row.original.currentSite && (
                  <div className="text-muted small d-flex align-items-center mb-1">
                    <FiMapPin size={12} className="me-1" />
                    {row.original.currentSite}
                  </div>
                )}
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => row.original.interventionId && handleInterventionDetails(row.original.interventionId)}
                  className="mt-1"
                >
                  Détails Intervention
                </Button>
              </div>
            ) : (
              <>
                <FaUserCheck size={16} className="me-2 text-success" />
                <span className="fw-semibold">Disponible</span>
              </>
            )}
          </div>
        );
      },
    },
    { 
      accessorKey: "lastActive", 
      header: "Dernière activité", 
      size: 150,
      Cell: ({ row }) => (
        <div className="text-muted small">
          {new Date(row.original.lastActive).toLocaleString('fr-FR')}
        </div>
      ),
    },
  ], []);

  const table = useMaterialReactTable({
    columns,
    data: filteredTechniciens,
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
    const exportData = filteredTechniciens.map(({ role, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Techniciens");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(fileData, `techniciens_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <Container fluid className="px-4 py-4" style={{ backgroundColor: theme.background, minHeight: "100vh" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
            <MdEngineering size={24} color={theme.primary} />
          </div>
          <div>
            <h2 className="mb-0 fw-bold" style={{ color: theme.dark }}>
              Gestion des Techniciens
            </h2>
            <p className="mb-0 text-muted">
              <span className="fw-semibold">{currentManager.name}</span> - {currentManager.position}
            </p>
          </div>
        </div>
        <div>
          <Button
            variant="outline-primary"
            onClick={handleExportExcel}
            className="d-flex align-items-center"
          >
            <FiDownload className="me-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4 g-3">
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100" style={{ borderTop: `4px solid ${theme.primary}` }}>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-uppercase small text-muted">Total Techniciens</h6>
                  <h3 className="mb-0">{filteredTechniciens.length}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                  <MdEngineering color={theme.primary} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100" style={{ borderTop: `4px solid ${theme.success}` }}>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-uppercase small text-muted">Disponibles</h6>
                  <h3 className="mb-0">{filteredTechniciens.filter(t => t.availability === 'available').length}</h3>
                </div>
                <div className="bg-success bg-opacity-10 rounded-circle p-3">
                  <FaUserCheck color={theme.success} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100" style={{ borderTop: `4px solid ${theme.warning}` }}>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-uppercase small text-muted">En Intervention</h6>
                  <h3 className="mb-0">{filteredTechniciens.filter(t => t.availability === 'busy').length}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                  <MdWork color={theme.warning} />
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
          a {
            transition: color 0.2s;
          }
          a:hover {
            color: ${theme.primary} !important;
          }
          .btn-sm {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
          }
        `}
      </style>
    </Container>
  );
};
export default TechnicianGest;