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

type Person = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  siege: string;
  telephone: string;
  role: string;
};

// Temporary static data
const data: Person[] = [
  {
    id: 1,
    nom: "Ghariani",
    prenom: "Nidhal",
    email: "nidhal.ghariani@example.com",
    siege: "Sfax",
    telephone: "98 123 456",
    role: "TECHNICIEN",
  },
  {
    id: 2,
    nom: "Masmoudi",
    prenom: "Yassine",
    email: "yassine.masmoudi@example.com",
    siege: "Sousse",
    telephone: "21 345 678",
    role: "TECHNICIEN",
  },
  {
    id: 3,
    nom: "Trabelsi",
    prenom: "Amira",
    email: "amira.trabelsi@example.com",
    siege: "Tunis",
    telephone: "22 334 556",
    role: "GESTIONNAIRE",
  },
  {
    id: 4,
    nom: "Ben Ali",
    prenom: "Omar",
    email: "omar.benali@example.com",
    siege: "Sfax",
    telephone: "25 888 999",
    role: "GESTIONNAIRE",
  },
  {
    id: 5,
    nom: "Kacem",
    prenom: "Salma",
    email: "salma.kacem@example.com",
    siege: "Sousse",
    telephone: "23 111 222",
    role: "GESTIONNAIRE",
  },
];

// Separate lists
const techniciens = data.filter((item) => item.role === "TECHNICIEN");
const gestionnaires = data.filter((item) => item.role === "GESTIONNAIRE");

const TechnicienList = () => {
  const navigate = useNavigate();

  const handleEdit = (technicien: Person) => {
    navigate("/gestionnaireform", { state: { manager: technicien } }); 
  };

  const techniciensWithManager = techniciens.map((tech) => {
    const manager = gestionnaires.find((g) => g.siege === tech.siege);
    return {
      ...tech,
      gestionnaire: manager ? `${manager.nom} ${manager.prenom}` : "N/A",
    };
  });

  const columns = useMemo<MRT_ColumnDef<any>[]>(() => [
    { accessorKey: "id", header: "ID", size: 50 },
    { accessorKey: "nom", header: "Nom", size: 120 },
    { accessorKey: "prenom", header: "Prénom", size: 120 },
    { accessorKey: "email", header: "Email", size: 200 },
    { accessorKey: "telephone", header: "Téléphone", size: 130 },
    { accessorKey: "siege", header: "Siège", size: 100 },
    { accessorKey: "gestionnaire", header: "Gestionnaire", size: 160 },
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
    data: techniciensWithManager,
    enableRowSelection: false,
    enableColumnFilters: true,
    enablePagination: true,
  });

  const handleExportExcel = () => {
    const exportData = techniciensWithManager.map(({ role, ...rest }) => rest);
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
    saveAs(fileData, "techniciens.xlsx");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-primary">Liste des techniciens</h2>
        <button className="btn btn-success" onClick={handleExportExcel}>
          Exporter en Excel
        </button>
      </div>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default TechnicienList;
