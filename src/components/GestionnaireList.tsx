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
import { Button } from "react-bootstrap";

type Manager = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  siege: string;
  telephone: string;
  role: string;
};

// Temporary static data
const data: Manager[] = [
  {
    id: 1,
    nom: "Trabelsi",
    prenom: "Amira",
    email: "amira.trabelsi@example.com",
    siege: "Tunis",
    telephone: "22 334 556",
    role: "GESTIONNAIRE",
  },
  {
    id: 2,
    nom: "Ghariani",
    prenom: "Nidhal",
    email: "nidhal.ghariani@example.com",
    siege: "Sfax",
    telephone: "98 123 456",
    role: "TECHNICIEN",
  },
];

// Filter gestionnaires only
const gestionnaires = data.filter((item) => item.role === "GESTIONNAIRE");

const GestionnaireList = () => {
  const navigate = useNavigate();

  const handleEdit = (manager: Manager) => {
    navigate("/gestionnaireform", { state: { manager } });
  };

  const columns = useMemo<MRT_ColumnDef<Manager>[]>(() => [
    { accessorKey: "id", header: "ID", size: 50 },
    { accessorKey: "nom", header: "Nom", size: 120 },
    { accessorKey: "prenom", header: "Prénom", size: 120 },
    { accessorKey: "email", header: "Email", size: 200 },
    { accessorKey: "telephone", header: "Téléphone", size: 130 },
    { accessorKey: "siege", header: "Siège", size: 100 },
    {
      header: "Action",
      accessorKey: "action",
      size: 100,
      Cell: ({ row }) => (
        <Button
          variant="warning"
          size="sm"
          onClick={() => handleEdit(row.original)}
        >
          Modifier
        </Button>
      ),
    },
  ], []);

  const table = useMaterialReactTable({
    columns,
    data: gestionnaires,
    enableRowSelection: false, // optional feature
    enableColumnFilters: true,
    enablePagination: true,
  });

  const handleExportExcel = () => {
    const exportData = gestionnaires.map(({ role, ...rest }) => rest); // remove role
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
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-primary">Liste des gestionnaires</h2>
        <button className="btn btn-success" onClick={handleExportExcel}>
          Exporter en Excel
        </button>
      </div>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default GestionnaireList;
