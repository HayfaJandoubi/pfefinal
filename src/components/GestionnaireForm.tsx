import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AjouterUtilisateur = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userToEdit = location.state?.userToEdit || null;

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    siege: "",
    telephone: "",
    role: "",
    password: generatePassword(),
  });

  const [showPassword, setShowPassword] = useState(false);

  const tunisianRegions = [
    "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba",
    "Kairouan", "Kasserine", "Kébili", "Kef", "Mahdia", "Manouba", "Médenine",
    "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine",
    "Tozeur", "Tunis", "Zaghouan"
  ];

  function generatePassword(length = 10) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#&!";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    return password;
  }

  useEffect(() => {
    if (userToEdit) {
      // ✅ Update telephone by removing +216 if it's included
      const cleanPhone = userToEdit.telephone.replace("+216", "").trim();
      setFormData({ ...userToEdit, telephone: cleanPhone });
    }
  }, [userToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "nom" || name === "prenom") {
      const capitalized = value.replace(/\b\w/g, (c) => c.toUpperCase());
      setFormData((prev) => ({ ...prev, [name]: capitalized }));
    } else if (name === "telephone") {
      let formatted = value.replace(/[^\d]/g, "").slice(0, 8);
      formatted = formatted.replace(/(\d{2})(\d{3})(\d{3})/, "$1 $2 $3");
      setFormData((prev) => ({ ...prev, telephone: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.role) {
      Swal.fire({
        icon: "warning",
        title: "Rôle requis",
        text: "Veuillez sélectionner un rôle pour l'utilisateur.",
      });
      return;
    }

    try {
      Swal.fire({
        title: "Veuillez patienter...",
        text: userToEdit ? "Mise à jour en cours..." : "Ajout de l'utilisateur en cours.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await new Promise((res) => setTimeout(res, 1000));

      Swal.close();
      Swal.fire({
        icon: "success",
        title: userToEdit ? "Modification Réussie" : "Ajout Réussi",
        text: userToEdit
          ? "Les informations ont été mises à jour."
          : "L'utilisateur a été ajouté avec succès.",
      });

      navigate("/gestionnaires");
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur s'est produite.",
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3>{userToEdit ? "Modifier un Utilisateur" : "Ajouter un Utilisateur"}</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nom</label>
              <input
                type="text"
                name="nom"
                className="form-control"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Prénom</label>
              <input
                type="text"
                name="prenom"
                className="form-control"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Téléphone</label>
              <input
                type="text"
                name="telephone"
                className="form-control"
                value={formData.telephone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Siège</label>
              <select
                name="siege"
                className="form-select"
                value={formData.siege}
                onChange={handleChange}
                required
              >
                <option value="">-- Sélectionnez une région --</option>
                {tunisianRegions.map((region, idx) => (
                  <option key={idx} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label d-block">Rôle</label>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  name="role"
                  value="GESTIONNAIRE"
                  checked={formData.role === "GESTIONNAIRE"}
                  onChange={handleChange}
                  className="form-check-input"
                  id="gestionnaire"
                />
                <label htmlFor="gestionnaire" className="form-check-label">Gestionnaire</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  name="role"
                  value="TECHNICIEN"
                  checked={formData.role === "TECHNICIEN"}
                  onChange={handleChange}
                  className="form-check-input"
                  id="technicien"
                />
                <label htmlFor="technicien" className="form-check-label">Technicien</label>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Mot de passe</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control"
                  value={formData.password}
                  readOnly
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-success">
              {userToEdit ? "Enregistrer Modification" : "Ajouter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AjouterUtilisateur;
