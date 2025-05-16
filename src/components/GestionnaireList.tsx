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
import { Button, Container, Badge, Dropdown, Card, Row, Col } from "react-bootstrap";
import { FiEdit2, FiDownload, FiPlus, FiUser, FiMoreVertical, FiSearch, FiFilter } from "react-icons/fi";
import { FaUserTie } from "react-icons/fa";

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
  status?: 'active' | 'inactive' | 'on-leave';
};

const data: Manager[] = [
  {
    id: 1,
    nom: "Trabelsi",
    prenom: "Amira",
    email: "amira.trabelsi@example.com",
    siege: "Tunis",
    telephone: "22 334 556",
    role: "GESTIONNAIRE",
    status: "active"
  },
  {
    id: 2,
    nom: "Ben Salah",
    prenom: "Fatma",
    email: "fatma.bensalah@example.com",
    siege: "Sousse",
    telephone: "76 543 210",
    role: "GESTIONNAIRE",
    status: "on-leave"
  },
  {
    id: 3,
    nom: "Khemiri",
    prenom: "Ahmed",
    email: "ahmed.khemiri@example.com",
    siege: "Bizerte",
    telephone: "55 678 901",
    role: "GESTIONNAIRE",
    status: "active"
  },
];

const GestionnaireList = () => {
  const navigate = useNavigate();
  const gestionnaires = data.filter((item) => item.role === "GESTIONNAIRE");

  const handleEdit = (manager: Manager) => {
    navigate("/gestionnaireform", { state: { manager } });
  };

  const handleAddNew = () => {
    navigate("/gestionnaireform");
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
              <div className="text-muted small">{row.original.email}</div>
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
          <Badge bg="light" text="dark" className="text-capitalize">
            {row.original.siege}
          </Badge>
        ),
      },
      { 
        accessorKey: "status", 
        header: "Statut", 
        size: 100,
        Cell: ({ row }) => {
          let badgeVariant = "light";
          let badgeText = "dark";
          let statusText = "Actif";
          
          if (row.original.status === "inactive") {
            badgeVariant = "danger";
            badgeText = "white";
            statusText = "Inactif";
          } else if (row.original.status === "on-leave") {
            badgeVariant = "warning";
            badgeText = "dark";
            statusText = "Congé";
          }
          
          return (
            <Badge bg={badgeVariant} text={badgeText} className="text-capitalize">
              {statusText}
            </Badge>
          );
        },
      },
      {
        header: "Action",
        size: 100,
        Cell: ({ row }) => (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handleEdit(row.original)}
            className="d-flex align-items-center"
          >
            <FiEdit2 className="me-1" />
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
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderTop: `4px solid ${theme.primary}` }}>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-uppercase small text-muted">Total</h6>
                  <h3 className="mb-0">{gestionnaires.length}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                  <FaUserTie color={theme.primary} />
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
                  <h6 className="text-uppercase small text-muted">Actifs</h6>
                  <h3 className="mb-0">{gestionnaires.filter(g => g.status === 'active').length}</h3>
                </div>
                <div className="bg-success bg-opacity-10 rounded-circle p-3">
                  <FiUser color={theme.success} />
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
                  <h6 className="text-uppercase small text-muted">En congé</h6>
                  <h3 className="mb-0">{gestionnaires.filter(g => g.status === 'on-leave').length}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                  <FiUser color={theme.warning} />
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
                  <h6 className="text-uppercase small text-muted">Inactifs</h6>
                  <h3 className="mb-0">{gestionnaires.filter(g => g.status === 'inactive').length}</h3>
                </div>
                <div className="bg-danger bg-opacity-10 rounded-circle p-3">
                  <FiUser color={theme.danger} />
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