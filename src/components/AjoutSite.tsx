import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLng, LatLngBounds } from "leaflet";

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Tunisia bounds to restrict the map view
const TUNISIA_BOUNDS = new LatLngBounds(
  new LatLng(30.2306, 7.5219), // SW corner
  new LatLng(37.7612, 11.8807)  // NE corner
);

interface SiteData {
  adresse: string;
  coordonnees: string;
  equipement: string;
  technologie: string;
  type: string;
  acces: string;
}

const TunisiaMap = ({ 
  onSelect, 
  marker, 
  existingSites 
}: { 
  onSelect: (latlng: LatLng) => void, 
  marker: LatLng | null,
  existingSites: SiteData[]
}) => {
  const map = useMapEvents({
    click(e) {
      e.originalEvent.stopPropagation();
      onSelect(e.latlng);
    },
  });

  useEffect(() => {
    map.fitBounds(TUNISIA_BOUNDS);
    map.setMaxBounds(TUNISIA_BOUNDS);
  }, [map]);

  return (
    <>
      {marker && (
        <Marker position={marker}>
          <Popup>Nouvel emplacement sélectionné</Popup>
        </Marker>
      )}
      {existingSites.map((site, index) => {
        if (!site.coordonnees) return null;
        const [lat, lng] = site.coordonnees.split(",").map(parseFloat);
        return (
          <Marker key={index} position={new LatLng(lat, lng)}>
            <Popup>
              <div>
                <strong>Adresse:</strong> {site.adresse}<br />
                <strong>Équipement:</strong> {site.equipement}<br />
                <strong>Technologie:</strong> {site.technologie}<br />
                <strong>Type:</strong> {site.type}<br />
                <strong>Accès:</strong> {site.acces}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

const AjoutSite = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [temporaryMarker, setTemporaryMarker] = useState<LatLng | null>(null);
  const [existingSites, setExistingSites] = useState<SiteData[]>([]);
  const [siteData, setSiteData] = useState<SiteData>({
    adresse: "",
    coordonnees: "",
    equipement: "",
    technologie: "",
    type: "",
    acces: "",
  });

  const getUniqueLocationParts = (parts: any[]): string[] => {
    const uniqueParts: string[] = [];
    parts.forEach(part => {
      if (part && !uniqueParts.includes(part)) {
        uniqueParts.push(part);
      }
    });
    return uniqueParts;
  };

  useEffect(() => {
    const toEdit = localStorage.getItem("siteToEdit");
    const sites = JSON.parse(localStorage.getItem("sitesEnAttente") || "[]");
    setExistingSites(sites);

    if (toEdit) {
      const parsedData = JSON.parse(toEdit);
      setSiteData(parsedData);
      if (parsedData.coordonnees) {
        const [lat, lng] = parsedData.coordonnees.split(",").map(parseFloat);
        setTemporaryMarker(new LatLng(lat, lng));
      }
      setIsEditMode(true);
      localStorage.removeItem("siteToEdit");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSiteData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMapClick = async (latlng: LatLng) => {
    const coordString = `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`;
    setTemporaryMarker(latlng);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latlng.lat}&lon=${latlng.lng}&accept-language=fr`
      );
      const data = await res.json();
      
      if (data.address?.country !== "Tunisie" && data.address?.country !== "Tunisia") {
        Swal.fire({
          icon: "warning",
          title: "Emplacement invalide",
          text: "Veuillez sélectionner un emplacement en Tunisie.",
        });
        setTemporaryMarker(null);
        return;
      }

      const locationParts = [
        data.address.village,
        data.address.town,
        data.address.city,
        data.address.municipality,
        data.address.county,
        data.address.state
      ].filter(Boolean);

      let formattedAddress = coordString;
      const uniqueParts = getUniqueLocationParts(locationParts);
      if (uniqueParts.length > 0) {
        formattedAddress = uniqueParts.slice(0, 2).join(", ");
      }

      setSiteData((prev) => ({
        ...prev,
        coordonnees: coordString,
        adresse: formattedAddress,
      }));
    } catch (error) {
      console.error("Error fetching address:", error);
      setSiteData((prev) => ({
        ...prev,
        coordonnees: coordString,
        adresse: coordString,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!siteData.coordonnees) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Veuillez sélectionner un emplacement sur la carte.",
      });
      return;
    }

    try {
      Swal.fire({
        title: "Veuillez patienter...",
        text: isEditMode ? "Modification du site en cours." : "Ajout du site en cours.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const sites = JSON.parse(localStorage.getItem("sitesEnAttente") || "[]");

      let updatedSites;
      if (isEditMode) {
        updatedSites = sites.map((site: any) =>
          site.adresse === siteData.adresse ? siteData : site
        );
      } else {
        updatedSites = [...sites, siteData];
      }

      localStorage.setItem("sitesEnAttente", JSON.stringify(updatedSites));
      setExistingSites(updatedSites);

      await new Promise((res) => setTimeout(res, 1000));
      Swal.close();

      Swal.fire({
        icon: "success",
        title: isEditMode ? "Modification réussie !" : "Ajout effectué avec succès !",
        showConfirmButton: false,
        timer: 1500
      });

      if (!isEditMode) {
        setSiteData({
          adresse: "",
          coordonnees: "",
          equipement: "",
          technologie: "",
          type: "",
          acces: "",
        });
        setTemporaryMarker(null);
      }
      setIsEditMode(false);
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur est survenue lors de l'enregistrement.",
      });
    }
  };

  const openMap = () => {
    if (!isEditMode) {
      setTemporaryMarker(null);
      setSiteData(prev => ({
        ...prev,
        adresse: "",
        coordonnees: ""
      }));
    }
    setShowMap(true);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">{isEditMode ? "Modifier le Site" : "Ajouter un Site"}</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold">Adresse</label>
                  <div className="input-group">
                    <input
                      type="text"
                      name="adresse"
                      className="form-control"
                      value={siteData.adresse}
                      onClick={openMap}
                      readOnly
                      placeholder="Cliquez pour sélectionner sur la carte"
                      required
                    />
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button"
                      onClick={openMap}
                    >
                      📍
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Coordonnées</label>
                  <input
                    type="text"
                    name="coordonnees"
                    className="form-control"
                    value={siteData.coordonnees}
                    readOnly
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Équipement</label>
                  <select 
                    name="equipement" 
                    className="form-select" 
                    value={siteData.equipement} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="">-- Sélectionner --</option>
                    <option value="Huawei">Huawei</option>
                    <option value="Alcatel">Alcatel</option>
                    <option value="Ericsson">Ericsson</option>
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold">Technologie</label>
                  <select 
                    name="technologie" 
                    className="form-select" 
                    value={siteData.technologie} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="">-- Sélectionner --</option>
                    <option value="Tec3G">3G</option>
                    <option value="Tec4G">4G</option>
                    <option value="Tec5G">5G</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Type</label>
                  <select 
                    name="type" 
                    className="form-select" 
                    value={siteData.type} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="">-- Sélectionner --</option>
                    <option value="Indoor">Indoor</option>
                    <option value="Outdoor">Outdoor</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Accès</label>
                  <select 
                    name="acces" 
                    className="form-select" 
                    value={siteData.acces} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="">-- Sélectionner --</option>
                    <option value="Autorisé">Autorisé</option>
                    <option value="NonAutorisé">Non Autorisé</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button type="submit" className="btn btn-success px-4">
                {isEditMode ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showMap && (
        <div 
          className="modal fade show d-block" 
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Sélectionnez un emplacement en Tunisie</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowMap(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-0">
                <MapContainer
                  center={temporaryMarker || new LatLng(34.0, 9.0)}
                  zoom={temporaryMarker ? 12 : 7}
                  style={{ height: "500px", width: "100%" }}
                  minZoom={7}
                  maxBounds={TUNISIA_BOUNDS}
                  maxBoundsViscosity={1.0}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <TunisiaMap 
                    onSelect={handleMapClick} 
                    marker={temporaryMarker}
                    existingSites={existingSites}
                  />
                </MapContainer>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => {
                    if (temporaryMarker) {
                      setShowMap(false);
                    } else {
                      Swal.fire({
                        icon: "warning",
                        title: "Aucun emplacement sélectionné",
                        text: "Veuillez cliquer sur la carte pour sélectionner un emplacement.",
                      });
                    }
                  }}
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AjoutSite;