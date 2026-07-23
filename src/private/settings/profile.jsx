import React, { useContext, useEffect, useRef, useState } from "react";
import AppLayout from "@layouts/appLayout";
import Header from "@components/header";
import user from '@assets/imgs/user-profile.png'
import axiosClient from '@/axios-client';
import Swal from "sweetalert2";
import Alert from '@components/Alert';
import { AuthContext } from '@context/AuthContext';
import { saveUserProfileToLocalStorage,getUserProfileFromLocalStorage } from '@local/User.js';
import '@assets/css/profile.css';
import { Building2, Save, Trash2, Upload } from "lucide-react";

export default function Profile() {

  const { currentUser } = useContext(AuthContext);

  const localuserProfile = getUserProfileFromLocalStorage();

  const [errors, setErrors] = useState({});

  const [selectedImage, setSelectedImage] = useState(null);

  const [fileurl, setFileUrl] = useState(null);

  const [institutionId, setInstitutionId] = useState(null);
  const [loadingInstitution, setLoadingInstitution] = useState(true);
  const [loadingsubmitinstitution, setLoadingSubmitInstitution] = useState(false);
  const [institutionConfig, setInstitutionConfig] = useState({
    name: '',
    state: '',
    matriculation: '',
    phone: '',
    pj: '',
    number_register: '',
    pj_register: '',
    num_declaration: '',
    cycle: '',
    telephone: '',
    couverture: '',
  });

  const inputusers = useRef([]);

  const [loadingsubmituser, setLoadingSubmitUser] = useState(false);

  const addInputsUser = el => {
    if (el && !inputusers.current.includes(el)) {
      inputusers.current.push(el)
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      if (fileurl && fileurl.startsWith('blob:')) {
        URL.revokeObjectURL(fileurl);
      }
      setFileUrl(URL.createObjectURL(file));
    } else {
      Swal.fire({position: 'Center',icon: 'warning',title: 'Oops!',text: 'Veuillez sélectionner un fichier image valide.',showConfirmButton: true});
    }
  };

  const handleImageRemove = () => {
    if (fileurl && fileurl.startsWith('blob:')) {
      URL.revokeObjectURL(fileurl);
    }
    setSelectedImage(null);
    setFileUrl(null);
    const inputElement = document.getElementById('uploadImage');
    if (inputElement) {
      inputElement.value = '';
    }
  };

  useEffect(() => {
    return () => {
      if (fileurl && fileurl.startsWith('blob:')) {
        URL.revokeObjectURL(fileurl);
      }
    };
  }, [fileurl]);

  useEffect(() => {
    axiosClient.get('/institutions')
      .then(({ data }) => {
        const inst = data.data[0];
        if (inst) {
          setInstitutionId(inst.Institution_id);
          setInstitutionConfig({
            name: inst.Institution_name ?? '',
            state: inst.Institution_state ?? '',
            matriculation: inst.Institution_matriculation ?? '',
            phone: inst.Institution_phone ?? '',
            pj: inst.Institution_pj ?? '',
            number_register: inst.Institution_number_register ?? '',
            pj_register: inst.Institution_pj_register ?? '',
            num_declaration: inst.Institution_num_declaration ?? '',
            cycle: inst.Institution_cycle ?? '',
            telephone: inst.Institution_telephone ?? '',
            couverture: inst.Institution_couverture ?? '',
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoadingInstitution(false));
  }, []);

  const handleInstitutionChange = (event) => {
    const { name, value } = event.target;
    setInstitutionConfig((prev) => ({ ...prev, [name]: value }));
  };

  const saveInstitutionConfig = async () => {
    if (!institutionId) return;
    setLoadingSubmitInstitution(true);
    try {
      await axiosClient.put(`/institution/${institutionId}`, institutionConfig);
      Swal.fire({
        position: 'center', icon: 'success',
        title: 'Configuration sauvegardée',
        text: 'Les informations de l\'institution ont été mises à jour.',
        showConfirmButton: true, confirmButtonColor: '#10518E',
      });
    } catch (err) {
      Swal.fire({
        position: 'center', icon: 'error',
        title: 'Erreur', text: 'Impossible de mettre à jour l\'institution.',
        showConfirmButton: true, confirmButtonColor: '#10518E',
      });
    } finally {
      setLoadingSubmitInstitution(false);
    }
  };

  const updateUser = async(event) => {
    event.preventDefault();
    const errors = {};

    if (inputusers.current[0].value.trim() === '') {
      errors.first_name = 'Le nom est requis';
    }  

    if (inputusers.current[1].value.trim() === '') {
      errors.second_name = 'Le prenom est requis';
    }

    if (inputusers.current[2].value.trim() === '') {
      errors.email = 'Adresse E-mail est requise';
    }    

    if (inputusers.current[3].value.trim() === '') {
      errors.pseudo = 'Le Pseudo est requis';
    } 

    if (inputusers.current[4].value.trim() === '') {
      errors.cni_number = 'Le Numero de Cni est requis';
    }     

    if (Object.keys(errors).length === 0) {
      setLoadingSubmitUser(true);
      setErrors({});

      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('first_name', inputusers.current[0].value.trim());
      formData.append('second_name', inputusers.current[1].value.trim());
      formData.append('email', inputusers.current[2].value.trim());
      formData.append('pseudo', inputusers.current[3].value.trim());
      formData.append('cni_number', inputusers.current[4].value.trim());
      formData.append('phone', inputusers.current[5].value.trim());

      if (selectedImage) {
        formData.append('img', selectedImage);
      }

      try {
        const { data } = await axiosClient.post(
          `/user/edit/${currentUser.id}`,
          formData,
          selectedImage ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined,
        );

        saveUserProfileToLocalStorage(data.user);
        Swal.fire({position: 'Center',icon: 'success',title: 'Good!',text: 'Informations modifiées avec succès',showConfirmButton: true,confirmButtonColor: '#10518E'});
      } catch (err) {
        const response = err.response;
        if (response && response.status === 422) {
          Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: 'Verifier les champs',showConfirmButton: true,confirmButtonColor: '#10518E'});
        } else if (response && response.status === 404) {
          Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: 'Cet Utilisateur n\'existe pas !',showConfirmButton: true,confirmButtonColor: '#10518E'});
        } else {
          errors.connection = "Une erreur s'est produite, Verifier votre connexion internet Svp";
        }

        setErrors(errors);
      } finally {
        setLoadingSubmitUser(false);
      }
    } else{
      setErrors(errors);
      setLoadingSubmitUser(false);
    }   
  }


  return (
    <AppLayout>
      <div className="content-wrapper mt-10 profile-page-shell">
        <Header title={'Mon Profil'} />
        <div className="profile-two-column">
          <div className="profile-card">
            <div className="profile-image-wrap">
              <img
                src={fileurl || (localuserProfile.profileImg === '' || localuserProfile.profileImg === 'null' ? user : localuserProfile.profileImg)}
                alt="Photo de profil"
              />
              <div className="profile-badge">
                <span>Photo de profil</span>
                {selectedImage ? <span>Nouveau fichier prêt</span> : <span>Image actuelle</span>}
              </div>
            </div>

            <div className="profile-upload-actions">
              <label htmlFor="uploadImage" className="profile-upload-btn" title="Téléverser une nouvelle image">
                <Upload size={18} />
                <input type="file" id="uploadImage" className="profile-file-input" accept="image/*" onChange={handleImageUpload} />
              </label>
              <label htmlFor="uploadImage" className="" title="Téléverser une nouvelle image">
                <button type="button" className="profile-remove-btn" onClick={handleImageRemove} disabled={!selectedImage}>
                    <Trash2 size={18} />
                  </button>
              </label>              
            </div>
          </div>

          <div className="profile-right-stack">
            <form className="profile-card">
              <div className="profile-card-head">
                <div className="profile-card-icon">
                  <Upload size={18} color="#10518E" />
                </div>
                <div>
                  <h3 className="profile-card-title">Informations personnelles</h3>
                  <p className="profile-card-subtitle">Mettez à jour vos données de compte.</p>
                </div>
              </div>

              {errors.connection ? <Alert className={'alert-warning'} type="Warning" message={ errors.connection  } /> : null}

              <div className="profile-fields-grid">
                <div className="profile-field">
                  <label htmlFor="first_name" className="profile-label">Nom</label>
                  <input id="first_name" className="profile-input" type="text" ref={addInputsUser} defaultValue={localuserProfile.profileFirstName} />
                  {errors.first_name && <span className="profile-error">{errors.first_name}</span>}
                </div>

                <div className="profile-field">
                  <label htmlFor="second_name" className="profile-label">Prénom</label>
                  <input id="second_name" className="profile-input" type="text" ref={addInputsUser} defaultValue={localuserProfile.profileSecondName} />
                  {errors.second_name && <span className="profile-error">{errors.second_name}</span>}
                </div>

                <div className="profile-field">
                  <label htmlFor="email" className="profile-label">Adresse E-mail</label>
                  <input id="email" className="profile-input" type="text" ref={addInputsUser} defaultValue={localuserProfile.profileEmail} />
                  {errors.email && <span className="profile-error">{errors.email}</span>}
                </div>

                <div className="profile-field">
                  <label htmlFor="pseudo" className="profile-label">Pseudo</label>
                  <input id="pseudo" className="profile-input" type="text" ref={addInputsUser} defaultValue={localuserProfile.profilePseudo} />
                  {errors.pseudo && <span className="profile-error">{errors.pseudo}</span>}
                </div>

                <div className="profile-field">
                  <label htmlFor="cni_number" className="profile-label">Numéro CNI</label>
                  <input id="cni_number" className="profile-input" type="text" ref={addInputsUser} defaultValue={localuserProfile.profileCniNumber} />
                  {errors.cni_number && <span className="profile-error">{errors.cni_number}</span>}
                </div>

                <div className="profile-field">
                  <label htmlFor="phone" className="profile-label">Numéro de téléphone</label>
                  <input id="phone" className="profile-input" type="text" ref={addInputsUser} defaultValue={localuserProfile.profilePhone} />
                </div>
              </div>

              <div className="profile-actions">
                <button type="button" className="profile-primary-btn" onClick={loadingsubmituser ? null : updateUser} disabled={loadingsubmituser}>
                  {loadingsubmituser ? <div className="spinner"></div> : 'Enregistrer les modifications'}
                </button>
              </div>
            </form>

            <div className="profile-card">
              <div className="profile-card-head">
                <div className="profile-card-icon">
                  <Building2 size={18} color="#10518E" />
                </div>
                <div>
                  <h3 className="profile-card-title">Configuration de l'institution</h3>
                  <p className="profile-card-subtitle">Paramètres visibles sur vos documents et écrans.</p>
                </div>
              </div>

              {loadingInstitution ? (
                <p className="text-center"><span className="loader"></span></p>
              ) : (
                <>
                  <div className="profile-fields-grid">
                    <div className="profile-field">
                      <label htmlFor="inst_name" className="profile-label">Nom <span className="text-danger">*</span></label>
                      <input id="inst_name" className="profile-input" name="name" type="text" value={institutionConfig.name} onChange={handleInstitutionChange} placeholder="Ex: Pharmacie Sainte Marie" />
                    </div>

                    <div className="profile-field">
                      <label htmlFor="inst_phone" className="profile-label">Téléphone <span className="text-danger">*</span></label>
                      <input id="inst_phone" className="profile-input" name="phone" type="text" value={institutionConfig.phone} onChange={handleInstitutionChange} placeholder="+237 ..." />
                    </div>

                    <div className="profile-field full">
                      <label htmlFor="inst_state" className="profile-label">Slogan / État <span className="text-danger">*</span></label>
                      <input id="inst_state" className="profile-input" name="state" type="text" value={institutionConfig.state} onChange={handleInstitutionChange} placeholder="Ex: Proche de vous, pour mieux vous servir" />
                    </div>

                    <div className="profile-field">
                      <label htmlFor="inst_matriculation" className="profile-label">Matriculation</label>
                      <input id="inst_matriculation" className="profile-input" name="matriculation" type="text" value={institutionConfig.matriculation} onChange={handleInstitutionChange} />
                    </div>

                    <div className="profile-field">
                      <label htmlFor="inst_telephone" className="profile-label">Téléphone 2</label>
                      <input id="inst_telephone" className="profile-input" name="telephone" type="text" value={institutionConfig.telephone} onChange={handleInstitutionChange} />
                    </div>

                    <div className="profile-field">
                      <label htmlFor="inst_num_declaration" className="profile-label">Num. Déclaration</label>
                      <input id="inst_num_declaration" className="profile-input" name="num_declaration" type="text" value={institutionConfig.num_declaration} onChange={handleInstitutionChange} />
                    </div>

                    <div className="profile-field">
                      <label htmlFor="inst_number_register" className="profile-label">Num. Registre</label>
                      <input id="inst_number_register" className="profile-input" name="number_register" type="text" value={institutionConfig.number_register} onChange={handleInstitutionChange} />
                    </div>

                    <div className="profile-field">
                      <label htmlFor="inst_cycle" className="profile-label">Cycle</label>
                      <input id="inst_cycle" className="profile-input" name="cycle" type="text" value={institutionConfig.cycle} onChange={handleInstitutionChange} />
                    </div>

                    <div className="profile-field">
                      <label htmlFor="inst_pj" className="profile-label">PJ</label>
                      <input id="inst_pj" className="profile-input" name="pj" type="text" value={institutionConfig.pj} onChange={handleInstitutionChange} />
                    </div>

                    <div className="profile-field">
                      <label htmlFor="inst_pj_register" className="profile-label">PJ Registre</label>
                      <input id="inst_pj_register" className="profile-input" name="pj_register" type="text" value={institutionConfig.pj_register} onChange={handleInstitutionChange} />
                    </div>

                    <div className="profile-field full">
                      <label htmlFor="inst_couverture" className="profile-label">Couverture</label>
                      <input id="inst_couverture" className="profile-input" name="couverture" type="text" value={institutionConfig.couverture} onChange={handleInstitutionChange} />
                    </div>
                  </div>

                  <div className="profile-actions">
                    <button type="button" className="profile-primary-btn" onClick={loadingsubmitinstitution ? null : saveInstitutionConfig} disabled={loadingsubmitinstitution}>
                      {loadingsubmitinstitution ? <div className="spinner"></div> : <><Save size={16} /> Sauvegarder</>}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
