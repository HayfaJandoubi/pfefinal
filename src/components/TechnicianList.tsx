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

type Technician = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  region: string;
  gestionnaire: string;
};

const data: Technician[] = [
  {
    id: 1,
    fullName: "Ali Ben Salah",
    email: "ali@example.com",
    phone: "22556677",
    region: "Tunis",
    gestionnaire: "Mme Trabelsi",
  },
  {
    id: 2,
    fullName: "Sami Ferchichi",
    email: "sami@example.com",
    phone: "55443322",
    region: "Sfax",
    gestionnaire: "Mr Ghariani",
  },
];

const TechnicianList = () => {
  const columns = useMemo<MRT_ColumnDef<Technician>[]>(
    () => [
      { accessorKey: "id", header: "ID", size: 50 },
      { accessorKey: "fullName", header: "Nom Complet", size: 150 },
      { accessorKey: "email", header: "Email", size: 200 },
      { accessorKey: "phone", header: "Téléphone", size: 120 },
      { accessorKey: "region", header: "Région", size: 100 },
      { accessorKey: "gestionnaire", header: "Gestionnaire", size: 150 },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
  });

  const navigate = useNavigate();

    const handleAddTechnician = () => {
    navigate("/technicienform");
    };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
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
        <div>
        <button className="btn btn-primary me-2" onClick={handleAddTechnician}>
         Ajouter un technicien
        </button>

          <button className="btn btn-success" onClick={handleExportExcel}>
            Exporter en Excel
          </button>
        </div>
      </div>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default TechnicianList;
