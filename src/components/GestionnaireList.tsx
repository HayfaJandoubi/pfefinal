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

type Manager = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  region: string;
};

const data: Manager[] = [
  {
    id: 1,
    fullName: "Mme Trabelsi",
    email: "trabelsi@example.com",
    phone: "11112233",
    region: "Tunis",
  },
  {
    id: 2,
    fullName: "Mr Ghariani",
    email: "ghariani@example.com",
    phone: "99887766",
    region: "Sfax",
  },
];

const GestionnaireList = () => {
  const columns = useMemo<MRT_ColumnDef<Manager>[]>(
    () => [
      { accessorKey: "id", header: "ID", size: 50 },
      { accessorKey: "fullName", header: "Nom Complet", size: 150 },
      { accessorKey: "email", header: "Email", size: 200 },
      { accessorKey: "phone", header: "Téléphone", size: 120 },
      { accessorKey: "region", header: "Région", size: 100 },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
  });

  const navigate = useNavigate();

  const handleAddManager = () => {
    navigate("/gestionnaireform");
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
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
      {/* Header with title and buttons */}
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="w-100 text-center">
          <h2 className="text-primary">Liste des gestionnaires</h2>
        </div>
        <div className="position-absolute end-0 me-4">
          <button className="btn btn-primary me-2" onClick={handleAddManager}>
            Ajouter un gestionnaire
          </button>
          <button className="btn btn-success" onClick={handleExportExcel}>
            Exporter en Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <MaterialReactTable table={table} />
    </div>
  );
};

export default GestionnaireList;