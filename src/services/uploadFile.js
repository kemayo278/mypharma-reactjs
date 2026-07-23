// Service d'upload de fichier avec XMLHttpRequest
let baseUrl = localStorage.getItem("apiUrl") || import.meta.env.VITE_API_URL;

// services/uploadFile.js
export function uploadFile(file, type) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append("picture", file);
    formData.append("type", type);

  //   xhr.open("POST", process.env.NEXT_PUBLIC_STORE_FILE_URL, true);
    xhr.open("POST", baseUrl+"/files", true);

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response.file);
          } catch (e) {
            console.error("Erreur JSON :", e);
            reject(new Error("Réponse invalide du serveur."));
          }
        } else {
          reject(new Error("Échec de l'upload."));
        }
      }
    };

    xhr.send(formData);
  });
}
  
  