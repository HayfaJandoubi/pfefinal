import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { addTechnician } from "../services/technicianService";

const TechnicianForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    region: "",
    managerId: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [managers, setManagers] = useState([]);
  const [passwordError, setPasswordError] = useState("");

  const tunisianRegions = [
    "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa",
    "Jendouba", "Kairouan", "Kasserine", "Kébili", "Kef", "Mahdia",
    "Manouba", "Médenine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid",
    "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"
  ];

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/managers")
      .then((res) => setManagers(res.data))
      .catch((err) => console.error("Erreur managers:", err));
  }, []);

  useEffect(() => {
    const matchedManager = managers.find((m) => m.region === formData.region);
    if (matchedManager) {
      setFormData((prev) => ({
        ...prev,
        managerId: matchedManager.id,
      }));
    }
  }, [formData.region, managers]);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;

    if (name === "fullName") {
      const capitalized = value.replace(/\b\w/g, (c) => c.toUpperCase());
      setFormData((prev) => ({ ...prev, [name]: capitalized }));
    } else if (name === "phone") {
      let formatted = value.replace(/[^\d]/g, "").slice(0, 8);
      formatted = formatted.replace(/(\d{2})(\d{3})(\d{3})/, "$1 $2 $3");
      setFormData((prev) => ({ ...prev, phone: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (formData.password && value !== formData.password) {
      setPasswordError("⚠️Les mots de passe ne correspondent pas.");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      setPasswordError("⚠️Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      Swal.fire({
        title: "Veuillez patienter...",
        text: "Ajout du technicien en cours.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await addTechnician(formData);

      await axios.post("http://localhost:5000/api/send-email", {
        to: formData.email,
        subject: "Bienvenue dans la plateforme Tunisie Telecom",
        html: `
          <p>Bonjour ${formData.fullName},</p>
          <p>Votre compte a été créé avec succès. Voici vos informations de connexion :</p>
          <ul>
            <li><strong>Email :</strong> ${formData.email}</li>
            <li><strong>Mot de passe :</strong> ${formData.password}</li>
          </ul>
          <p>Merci de ne pas partager ces informations.</p>
          <p>L'équipe Tunisie Telecom.</p>
        `,
      });

      Swal.close();

      Swal.fire({
        icon: "success",
        title: "Ajout Réussi",
        text: "Le technicien a été ajouté avec succès.",
      });

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        region: "",
        managerId: "",
        password: "",
      });
      setConfirmPassword("");
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors de l'ajout du technicien.",
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3>Ajouter un Technicien</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nom complet</label>
              <input
                type="text"
                name="fullName"
                className="form-control"
                value={formData.fullName}
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
                name="phone"
                className="form-control"
                value={formData.phone ? `+216 ${formData.phone}` : "+216 "}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Région</label>
              <select
                name="region"
                className="form-select"
                value={formData.region}
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
              <label className="form-label">Gestionnaire</label>
              <input
                type="text"
                className="form-control"
                value={(() => {
                  const m = managers.find((mgr) => mgr.id === formData.managerId);
                  return m ? m.fullName : "";
                })()}
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirmer le mot de passe</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
              {passwordError && <div className="text-danger mt-1">{passwordError}</div>}
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

export default TechnicianForm;
