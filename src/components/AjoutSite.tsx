import React, { useState } from "react";
import Swal from "sweetalert2";

const AjoutSite = () => {
  const [siteData, setSiteData] = useState({
    adresse: "",
    coordonnees: "",
    equipement: "",
    technologie: "",
    type: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSiteData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      Swal.fire({
        title: "Veuillez patienter...",
        text: "Ajout du site en cours.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // Simulate save (replace with API if needed)
      const existingSites = JSON.parse(localStorage.getItem("sitesEnAttente") || "[]");
      localStorage.setItem("sitesEnAttente", JSON.stringify([...existingSites, siteData]));

      await new Promise((res) => setTimeout(res, 1000));
      Swal.close();

      Swal.fire({
        icon: "success",
        title: "Ajout du site effectué avec succès !",
        text: "Veuillez attendre la validation de l’ajout par l’Admin.",
      });

      setSiteData({
        adresse: "",
        coordonnees: "",
        equipement: "",
        technologie: "",
        type: "",
      });
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur est survenue lors de l'ajout du site.",
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3>Ajouter un Site</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Adresse</label>
              <input
                type="text"
                name="adresse"
                className="form-control"
                value={siteData.adresse}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Coordonnées</label>
              <input
                type="text"
                name="coordonnees"
                className="form-control"
                value={siteData.coordonnees}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Équipement</label>
              <input
                type="text"
                name="equipement"
                className="form-control"
                value={siteData.equipement}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Technologie</label>
              <input
                type="text"
                name="technologie"
                className="form-control"
                value={siteData.technologie}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Type</label>
              <input
                type="text"
                name="type"
                className="form-control"
                value={siteData.type}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-success">
              Ajouter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AjoutSite;
