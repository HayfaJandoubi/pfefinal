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

// Data type
type SiteMobile = {
  numero: string;
  adresse: string;
  coordonnees: string;
  equipement: string;
  technologie: string;
  type: string;
};

// Sample data
const data: SiteMobile[] = [
  {
    numero: "001",
    adresse: "Rue Habib Bourguiba",
    coordonnees: "36.8065, 10.1815",
    equipement: "Antenne 4G",
    technologie: "LTE",
    type: "Urbain",
  },
  {
    numero: "002",
    adresse: "Avenue de la Liberté",
    coordonnees: "36.8000, 10.1700",
    equipement: "Routeur 5G",
    technologie: "5G",
    type: "Suburbain",
  },
  {
    numero: "003",
    adresse: "Rue de Marseille",
    coordonnees: "36.8145, 10.1650",
    equipement: "BTS 3G",
    technologie: "UMTS",
    type: "Rural",
  },
];

const SiteMobile = () => {
  const navigate = useNavigate();

  const columns = useMemo<MRT_ColumnDef<SiteMobile>[]>(() => [
    { accessorKey: "numero", header: "Numéro", size: 100 },
    { accessorKey: "adresse", header: "Adresse", size: 200 },
    { accessorKey: "coordonnees", header: "Coordonnées", size: 200 },
    { accessorKey: "equipement", header: "Équipement", size: 150 },
    { accessorKey: "technologie", header: "Technologie", size: 150 },
    { accessorKey: "type", header: "Type", size: 100 },
  ], []);

  const table = useMaterialReactTable({
    columns,
    data,
  });

  const handleNavigateToPending = () => {
    navigate("/sitesenattente");
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sites Mobiles");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(fileData, "sites_mobiles.xlsx");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-primary">Liste des sites mobiles</h2>
        <div>
          <button className="btn btn-secondary me-2" onClick={handleNavigateToPending}>
            Sites mobiles en attente
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

export default SiteMobile;
