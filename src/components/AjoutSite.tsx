import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLng, LatLngBounds } from "leaflet";
import { Container, Card, Form, Button, Row, Col, InputGroup, Modal } from "react-bootstrap";
import { FaMapMarkerAlt, FaSave, FaTimes, FaCheck, FaWifi } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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

      // Modified address formatting to show "Hiboun, Mahdia" style
      const village = data.address.village || "";
      const town = data.address.town || "";
      const city = data.address.city || "";
      const region = data.address.state || "";

      // Prioritize village/town over city for the first part
      const firstPart = village || town || city;
      const secondPart = region;

      let formattedAddress = "";
      if (firstPart && secondPart) {
        formattedAddress = `${firstPart.toLowerCase()}, ${secondPart.toLowerCase()}`;
      } else if (firstPart) {
        formattedAddress = firstPart.toLowerCase();
      } else if (secondPart) {
        formattedAddress = secondPart.toLowerCase();
      } else {
        formattedAddress = coordString;
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
      }).then(() => {
        // Navigate to "/sitemobile" after successful submission
        navigate("/sitemobile");
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
    <Container fluid className="px-4 py-4" style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <Row className="justify-content-center">
        <Col lg={8} xl={6}>
          <Card className="shadow border-0" style={{ borderRadius: '16px' }}>
            <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaWifi size={24} color="#3f51b5" />
                </div>
                <div>
                  <h2 className="mb-0 fw-bold" style={{ color: '#212529' }}>
                    {isEditMode ? "Modifier le Site" : "Ajouter un Site"}
                  </h2>
                  <p className="mb-0 text-muted">
                    {isEditMode ? "Mettre à jour les informations du site" : "Ajouter un nouveau site mobile"}
                  </p>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-4 pt-2">
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium text-muted small">Adresse</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="adresse"
                          value={siteData.adresse}
                          onClick={openMap}
                          readOnly
                          placeholder="Cliquez pour sélectionner sur la carte"
                          required
                          className="border-end-0"
                        />
                        <Button 
                          variant="outline-secondary" 
                          onClick={openMap}
                          className="border-start-0"
                        >
                          <FaMapMarkerAlt />
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium text-muted small">Coordonnées</Form.Label>
                      <Form.Control
                        type="text"
                        name="coordonnees"
                        value={siteData.coordonnees}
                        readOnly
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium text-muted small">Équipement</Form.Label>
                      <Form.Select 
                        name="equipement" 
                        value={siteData.equipement} 
                        onChange={handleChange} 
                        required
                      >
                        <option value="">-- Sélectionner --</option>
                        <option value="Huawei">Huawei</option>
                        <option value="Alcatel">Alcatel</option>
                        <option value="Ericsson">Ericsson</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium text-muted small">Technologie</Form.Label>
                      <Form.Select 
                        name="technologie" 
                        value={siteData.technologie} 
                        onChange={handleChange} 
                        required
                      >
                        <option value="">-- Sélectionner --</option>
                        <option value="Tec3G">3G</option>
                        <option value="Tec4G">4G</option>
                        <option value="Tec5G">5G</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium text-muted small">Type</Form.Label>
                      <Form.Select 
                        name="type" 
                        value={siteData.type} 
                        onChange={handleChange} 
                        required
                      >
                        <option value="">-- Sélectionner --</option>
                        <option value="Indoor">Indoor</option>
                        <option value="Outdoor">Outdoor</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium text-muted small">Accès</Form.Label>
                      <Form.Select 
                        name="acces" 
                        value={siteData.acces} 
                        onChange={handleChange} 
                        required
                      >
                        <option value="">-- Sélectionner --</option>
                        <option value="Autorisé">Autorisé</option>
                        <option value="NonAutorisé">Non Autorisé</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col xs={12} className="mt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-100 py-3 fw-bold d-flex align-items-center justify-content-center"
                      style={{ borderRadius: '8px' }}
                    >
                      <FaSave className="me-2" />
                      {isEditMode ? "Enregistrer les modifications" : "Ajouter le site"}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Map Modal */}
      <Modal show={showMap} onHide={() => setShowMap(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="d-flex align-items-center">
            <FaMapMarkerAlt className="me-2" />
            Sélectionnez un emplacement en Tunisie
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMap(false)}>
            <FaTimes className="me-2" />
            Annuler
          </Button>
          <Button 
            variant="primary" 
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
            <FaCheck className="me-2" />
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom styles */}
      <style>
        {`
          .card {
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.1) !important;
          }
          .form-control, .form-select {
            border-radius: 8px;
            padding: 10px 15px;
          }
          .form-control:read-only {
            background-color: #f8f9fa;
            cursor: pointer;
          }
          .form-control:read-only:focus {
            background-color: #f8f9fa;
          }
          .leaflet-container {
            border-radius: 0 0 12px 12px;
          }
          .modal-content {
            border-radius: 12px;
            overflow: hidden;
          }
          .input-group-text {
            border-radius: 8px 0 0 8px !important;
          }
          .form-control.border-end-0 {
            border-right: 0 !important;
            border-radius: 8px 0 0 8px !important;
          }
          .btn-outline-secondary {
            border-radius: 0 8px 8px 0 !important;
          }
        `}
      </style>
    </Container>
  );
};

export default AjoutSite;