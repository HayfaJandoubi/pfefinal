import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import "bootstrap/dist/css/bootstrap.min.css";

type SiteMobile = {
  numero: string;
  adresse: string;
  coordonnees: string;
  equipement: string;
  technologie: string;
  type: string;
};

const initialPendingSites: SiteMobile[] = [
  {
    numero: "004",
    adresse: "Rue du Lac",
    coordonnees: "36.8500, 10.2400",
    equipement: "Antenne 4G",
    technologie: "LTE",
    type: "Urbain",
  },
  {
    numero: "005",
    adresse: "Route Nationale 1",
    coordonnees: "36.9000, 10.3000",
    equipement: "Routeur 5G",
    technologie: "5G",
    type: "Rural",
  },
];

const SiteEnAttente = () => {
  const [pendingSites, setPendingSites] = useState<SiteMobile[]>(initialPendingSites);

  const handleValidate = (site: SiteMobile) => {
    // Retrieve old validated list
    const existing = JSON.parse(localStorage.getItem("validatedSites") || "[]");

    // Add new validated site
    const updated = [...existing, site];
    localStorage.setItem("validatedSites", JSON.stringify(updated));

    // Remove site from pending
    setPendingSites((prev) => prev.filter((s) => s.numero !== site.numero));
  };

  const columns = useMemo<MRT_ColumnDef<SiteMobile>[]>(
    () => [
      { accessorKey: "numero", header: "Numéro", size: 100 },
      { accessorKey: "adresse", header: "Adresse", size: 200 },
      { accessorKey: "coordonnees", header: "Coordonnées", size: 200 },
      { accessorKey: "equipement", header: "Équipement", size: 150 },
      { accessorKey: "technologie", header: "Technologie", size: 150 },
      { accessorKey: "type", header: "Type", size: 100 },
      {
        accessorKey: "action",
        header: "Action",
        Cell: ({ row }) => (
          <button
            className="btn btn-sm btn-success"
            onClick={() => handleValidate(row.original)}
          >
            Valider l'ajout
          </button>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: pendingSites,
  });

  return (
    <div className="container mt-4">
      <h2 className="text-warning text-center mb-4">Sites mobiles en attente</h2>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default SiteEnAttente;
