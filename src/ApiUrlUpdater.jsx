import React, { useEffect, useState } from "react";
import { updateAxiosBaseUrl } from "./axios-client";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

function ApiUrlUpdater() {
  const [apiUrl, setApiUrl] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false); // Contrôle l'accès au formulaire
  const [password, setPassword] = useState(""); // Stocke le mot de passe entré par l'utilisateur

  // Charger l'URL initiale depuis localStorage au chargement du composant
  useEffect(() => {
    const savedUrl = localStorage.getItem("apiUrl") || "";
    setApiUrl(savedUrl);
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === "KGS2024") {
      setIsAuthorized(true);
    } else {
      Swal.fire({position: 'Center',icon: 'error',title: 'Oops!',text: 'Mot de passe incorrect. Veuillez réessayer.',showConfirmButton: true,confirmButtonColor: '#094b88'});
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();

    if (!apiUrl) {
      alert("Veuillez entrer une URL valide.");
      return;
    }

    updateAxiosBaseUrl(apiUrl);
    Swal.fire({position: 'Center',icon: 'success',title: 'Success',text: 'Nouvelle URL de l\'API configurée.',showConfirmButton: true,confirmButtonColor: '#094b88'});
  };

  return (
    <div style={{ margin: "20px", fontFamily: "Arial, sans-serif" }}>
      {!isAuthorized ? (
        <form onSubmit={handlePasswordSubmit} style={{ maxWidth: "400px" }}>
          <h2>Accès Restreint</h2>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="password" style={{ display: "block", marginBottom: "5px" }}>
              Entrez le mot de passe :
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "10px 15px",
              fontSize: "16px",
              color: "#fff",
              backgroundColor: "#007bff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Valider
            </button><br /><br /><br />
            <p>
                <Link className="btn-btn-danger" style={{ color:"white" }} to={'/'}>
                    Retour
                </Link>
            </p>
        </form>
      ) : (
        <form onSubmit={handleUrlSubmit} style={{ maxWidth: "400px" }}>
          <h2>Modifier l'URL de l'API</h2>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="apiUrl" style={{ display: "block", marginBottom: "5px" }}>
              Nouvelle URL de l'API :
            </label>
            <input
              type="text"
              id="apiUrl"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://example.com/api"
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "10px 15px",
              fontSize: "16px",
              color: "#fff",
              backgroundColor: "#007bff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Mettre à jour l'URL
        </button><br /><br /><br />
        <p>
            <Link className="btn-btn-danger" style={{ color:"white" }} to={'/'}>
                Retour
            </Link>
        </p>
        </form>
      )}
    </div>
  );
}

export default ApiUrlUpdater;
