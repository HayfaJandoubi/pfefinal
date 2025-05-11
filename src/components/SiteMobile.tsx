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
  adresse: string;
  coordonnees: string;
  equipement: string;
  technologie: string;
  type: string;
  acces: string;
  numero?: number; 
};


const originalData: SiteMobile[] = [
  {
    adresse: "Rue Habib Bourguiba",
    coordonnees: "36.8065, 10.1815",
    equipement: "alcatel",
    technologie: "4G",
    type: "Outdoor",
    acces: "autorisé",
  },
  {
    adresse: "Avenue de la Liberté",
    coordonnees: "36.8000, 10.1700",
    equipement: "Ericsson",
    technologie: "5G",
    type: "indoor",
    acces: "non autorisé",
  },
  {
    adresse: "Rue de Marseille",
    coordonnees: "36.8145, 10.1650",
    equipement: "hwauei",
    technologie: "3G",
    type: "outdoor",
    acces: "autorisé",
  },
];

const dataWithIndex = originalData.map((item, index) => ({
  ...item,
  numero: index + 1,
}));

const SiteMobile = () => {
  const navigate = useNavigate();

  const columns = useMemo<MRT_ColumnDef<SiteMobile>[]>(() => [
    {
      accessorKey: "numero",
      header: "Numéro",
      size: 30,
    },
    { accessorKey: "adresse", header: "Adresse", size: 200 },
    { accessorKey: "coordonnees", header: "Coordonnées", size: 200 },
    { accessorKey: "equipement", header: "Équipement", size: 200 },
    { accessorKey: "technologie", header: "Technologie", size: 100 },
    { accessorKey: "type", header: "Type", size: 150 },
    { accessorKey: "acces", header: "Accès", size: 150 },
    {
      header: "Action",
      id: "action",
      size: 100,
      Cell: ({ row }) => (
        <button
          className="btn btn-sm btn-warning"
          onClick={() => {
            localStorage.setItem("siteToEdit", JSON.stringify(row.original));
            navigate("/ajoutsite");
          }}
        >
          Modifier
        </button>
      ),
    },
  ], [navigate]);

  const table = useMaterialReactTable({
    columns,
    data: dataWithIndex,
  });

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dataWithIndex);
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
        <div className="d-flex gap-2">
        <button className="btn btn-primary" onClick={() => navigate("/ajoutsite")}>
            Ajouter site mobile
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
