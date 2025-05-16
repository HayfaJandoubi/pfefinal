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

  const columns = useMemo<MRT_ColumnDef<SiteMobile>[]>(() => [
    { accessorKey: "numero", header: "Numéro", size: 30 },
    { accessorKey: "adresse", header: "Adresse", size: 200 },
    { accessorKey: "coordonnees", header: "Coordonnées", size: 150 },
    { accessorKey: "equipement", header: "Équipement", size: 150 },
    { accessorKey: "technologie", header: "Technologie", size: 100 },
    { accessorKey: "type", header: "Type", size: 100 },
    { accessorKey: "acces", header: "Accès", size: 100 },
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
    muiTableBodyRowProps: ({ row }) => ({
      style: row.original.etat === "En panne"
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
        : {},
    }),
  });

  return (
    <div className="container mt-4">
      <style>
        {`
          @keyframes pulse {
            0% { box-shadow: 0 0 10px rgba(220, 53, 69, 0.6); }
            50% { box-shadow: 0 0 15px rgba(220, 53, 69, 0.9); }
            100% { box-shadow: 0 0 10px rgba(220, 53, 69, 0.6); }
          }
        `}
      </style>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-primary">Liste des sites mobiles</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={() => navigate("/ajoutsite")}>
            Ajouter site mobile
          </button>
          <div className="dropdown">
            <button
              className="btn btn-success dropdown-toggle"
              onClick={() => setShowDropdown(!showDropdown)}
              aria-expanded={showDropdown}
            >
              Exporter
            </button>
            <div
              className={`dropdown-menu ${showDropdown ? "show" : ""}`}
              style={{ display: showDropdown ? "block" : "none" }}
            >
              <button className="dropdown-item" onClick={handleExportExcel}>
                Exporter en Excel
              </button>
              <button className="dropdown-item" onClick={handleExportPDF}>
                Exporter en PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <MaterialReactTable table={table} />
    </div>
  );
};

export default SiteMobile;