import React, { useContext, useEffect, useRef, useState } from 'react'
import heroImage from '@assets/imgs/african-american-pharmacist.jpg'
import logo from '@assets/imgs/hospital-icon.png'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '@context/AuthContext';
import Cookies from "js-cookie";
import Alert from '@components/Alert';
import axiosClient from '@/axios-client';
import { saveUserProfileToLocalStorage } from '@local/User.js';
import { saveDelayToLocalStorage } from '@local/Delay.js';
import '@assets/css/login.css';
import HeadLogin from '@components/headlogin';

export default function Register() {

  const navigate = useNavigate();

  const inputs = useRef([]);

  const [validationerror , setValidationError] = useState("");

  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);

  const [loadingpost, setLoadingPost] = useState(false);

  const [success,setSucces] = useState("");

  const [roles, setRoles] = useState([]);

  const formRef = useRef();

  const addInputs = el => { 
    if (el && !inputs.current.includes(el)) {
      inputs.current.push(el)
    }
  }

  useEffect(() => {
    const getRoles = async () => {
      setLoadingPost(true);
      try {
        axiosClient.get('/roles').then( ({data})=> {
          setRoles(data.data);
        }); 
        setLoadingPost(false);
      } catch (error) {
        console.log(error);
      }
      setLoadingPost(false);
    };
    inputs.current = [];
    getRoles();
  }, []);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleForm = async (event) =>{
    event.preventDefault();
    const errors = {};

    if (inputs.current[0].value.trim() === '') {
      errors.first_name = 'entrez votre nom';
    }

    if (inputs.current[1].value.trim() === '') {
      errors.second_name = 'entrez votre prenom';
    }

    if (inputs.current[2].value.trim() === '') {
      errors.email = 'entrez votre adresse-email';
    } else if (!isValidEmail(inputs.current[2].value)) {
      errors.email = 'Format d\'adresse-email invalide';
    }

    if (inputs.current[3].value.trim() === '') {
      errors.role_id = 'entrez votre poste';
    } 

    if (inputs.current[4].value.trim() === '') {
      errors.pseudo = 'entrez votre pseudo';
    }

    if (inputs.current[5].value.trim() === '') {
      errors.cni_number = 'entrez votre Numero de CNI';
    }

    if (inputs.current[6].value.trim() === '') {
      errors.phone = 'entrez votre numero de téléphone';
    }
    
    if (inputs.current[7].value.trim() === '') {
      errors.user_password = 'entrez votre mot de passe';
    }else if (inputs.current[7].value.trim().length < 6) {
      errors.user_password = 'votre mot de passe doit avoir au moins 6 caracteres';
    }
    
    if (inputs.current[8].value.trim() === '') {
      errors.user_repeatpassword = 'répeter votre mot de passe';
    }
    else if (inputs.current[8].value.trim().length < 6) {
      errors.user_repeatpassword = 'il doit avoir au moins 6 caracteres';
    }
    else if (inputs.current[8].value.trim() != inputs.current[7].value.trim()) {
      errors.user_repeatpassword = 'Les mots de passe doivent etre identiques';
    }

    let checksuccess = 0;

    if (Object.keys(errors).length === 0) {
      setLoadingSubmitButton(true);
      let user_state = "waiting_for";
      const datauser = {
        first_name : inputs.current[0].value.trim(),
        second_name : inputs.current[1].value.trim(),
        email: inputs.current[2].value.trim(),
        role_id : inputs.current[3].value.trim(),
        pseudo : inputs.current[4].value.trim(),
        cni_number: inputs.current[5].value.trim(),
        phone: inputs.current[6].value.trim(),
        password: inputs.current[7].value.trim(),
        img : "",
        state : user_state,
      }
      await axiosClient.post('/signup',datauser).then(({data})  => {
        setSucces("Votre Compte a été créee avec succès. Il est en attente d'activation !");
        setTimeout(() => { setSucces('');}, 4000);
        Swal.fire({position: 'Center',icon: 'success',title: 'Success!',text: 'Votre Compte a été crée avec succès. Il est en attente d\'activation ',showConfirmButton: true,confirmButtonColor: '#094b88'});
        formRef.current.reset();
        setValidationError(errors);
        setLoadingSubmitButton(false);
        checksuccess = 1;
      }).catch(err => {
        setLoadingSubmitButton(false);
        const response = err.response;
        console.log(response);
        if(err.code === "auth/network-request-failed"){
          errors.checkingnetwork = 'Connexion internet requise';
          setValidationError(errors);
        }
        else if (response && response.status === 422) {
          if (response.data.errors.cni_number) {
            errors.cni_number = response.data.errors.cni_number;
          }
          if (response.data.errors.email) {
            errors.user_email = response.data.errors.email;
            Swal.fire({position: 'Center',icon: 'warning',title: 'Warning!',text: 'Ce compte existe déja!',showConfirmButton: true});
          }
          if (response.data.errors.pseudo) {
            errors.pseudo = response.data.errors.pseudo;
          } 
          if (response.data.errors.password) {  
            errors.user_password = response.data.errors.password;
          }                   
        }
        else if (response && response.status === 500) {
          if (response.data.errors.cni_number) {
            errors.cni_number = response.data.errors.cni_number;
          }             
        }
        else{
          errors.checkingnetwork = 'Verifier votre Connexion au Reseau';
        }
        setValidationError(errors);
      })
      setValidationError(errors);
      if (checksuccess == 1) {
        navigate('/sign-in'); 
      }
    } else {
      setValidationError(errors);
    }
    setLoadingSubmitButton(false);

  }

  return (
    <>
      {loadingpost ? 
        <div className='starting-page'>
          <p className="text-center" style={{ textAlign:"center" }}> 
            <i className="fa fa-refresh fa-spin text-3xl mr-2 text-black"></i> 
          </p>
        </div>        
      :
      <div className="container-login">
        <HeadLogin title={'S\'Inscrire'} />
        <div className="login-wrapper">
          {/* Section image et texte - 3/5 de l'écran en desktop */}
          <div className="hero-section">
            <div className="hero-content">
              <div className="hero-overlay">
                <h1 className="hero-title">Creez votre compte MyPharma</h1>
                <p className="hero-subtitle">
                  Renseignez vos informations pour ouvrir votre espace en quelques instants.
                  Votre compte sera pret pour une connexion rapide et securisee.
                </p>
                <div className="hero-features">
                  <div className="feature-item">
                    <span>Inscription simple et guidee</span>
                  </div>
                  <div className="feature-item">
                    <span>Activation du compte en toute securite</span>
                  </div>
                </div>
                <div className="hero-cta">
                  <p className="cta-text">Vous avez deja un compte ? Connectez-vous.</p>
                </div>
              </div>
            </div>
            <div className="hero-image">
              <img src={heroImage} alt="Gestion PME" />
            </div>
          </div>
          
          {/* Section formulaire d'inscription - 2/5 de l'écran en desktop */}
          <div className="form-section">
          <form id="form-login" ref={formRef}>
            <div className="form-header">
              <Link to={'/config'}>
                <img src={logo} alt="Logo" className='o-cover login-photo' style={{ width:"100%", height:"90px",objectFit:"contain", marginBottom: "20px" }} />
              </Link>
              <h3 className="form-title">
                Créer un Compte
              </h3>
            </div>
            
            <div className="form-alerts">            
              {success ? 
                <Alert className={'alert-success'} type="Success" message={ success  } />
              : null} 
              {validationerror.error ? 
                <Alert className={'alert-danger'} type="Erreur" message={ validationerror.error  } />
              : null} 
              {validationerror.checkingnetwork ? 
                <Alert className={'alert-warning'} type="Erreur" message={ validationerror.checkingnetwork  } />
              : null}
            </div>
            
            <div className="form-fields form-fields-register">
              <div className="input-row">
                <div className="input-group">
                  <input type="text" name="first_name" className="form-input" placeholder="Saisir Votre Nom" ref={addInputs}/>
                  {validationerror.first_name && <span className="error-message">{validationerror.first_name}</span>}
                </div>
                
                <div className="input-group">
                  <input type="text" name="second_name" className="form-input" placeholder="Saisir Votre Prénom" ref={addInputs}/>
                  {validationerror.second_name && <span className="error-message">{validationerror.second_name}</span>}
                </div>
              </div>
              
              <div className="input-group">
                <input type="email" className="form-input" placeholder="Saisir Votre Adresse Mail" ref={addInputs} />
                {validationerror.email && <span className="error-message">{validationerror.email}</span>}
              </div>
              
              <div className="input-group">
                <select disabled={loadingpost ? 'disabled' : ''} className="form-input form-select" ref={addInputs}>
                  <option value={''} defaultValue> Sélectionner votre poste</option>
                  {roles && roles.map((role, index) => (
                    <option key={index} value={role.role_name}>{role.role_name}</option>
                  ))}
                </select>
                {validationerror.role_id && <span className="error-message">{validationerror.role_id}</span>}
              </div>
              
              <div className="input-group">
                <input type="text" name="pseudo" className="form-input" placeholder="Saisir Votre Pseudo de Connexion" ref={addInputs} />
                {validationerror.pseudo && <span className="error-message">{validationerror.pseudo}</span>}
              </div>
              
              <div className="input-row">
                <div className="input-group">
                  <input type="text" name="cni_number" className="form-input" placeholder="Saisir Votre Numéro CNI" ref={addInputs} />
                  {validationerror.cni_number && <span className="error-message">{validationerror.cni_number}</span>}
                </div>
                
                <div className="input-group">
                  <input type="text" name="phone" className="form-input" placeholder="Saisir Votre Numéro de Téléphone" ref={addInputs} />
                  {validationerror.phone && <span className="error-message">{validationerror.phone}</span>}
                </div>
              </div>
              
              <div className="input-row">
                <div className="input-group">
                  <input type={'password'} className="form-input" placeholder="Saisir Votre Mot De Passe" ref={addInputs} />
                  {validationerror.user_password && <span className="error-message">{validationerror.user_password}</span>}
                </div>
                
                <div className="input-group">
                  <input type={'password'} className="form-input" placeholder="Confirmer Votre Mot De Passe" ref={addInputs} />
                  {validationerror.user_repeatpassword && <span className="error-message">{validationerror.user_repeatpassword}</span>}
                </div>
              </div>
            </div> 

            <div className="form-actions">
              <button 
                type="button" 
                onClick={loadingsubmitbutton ? null : handleForm} 
                className={`submit-button ${loadingsubmitbutton ? 'loading' : ''}`}
                disabled={loadingsubmitbutton}
              >
                {loadingsubmitbutton ? <div className="spinner"></div> : 'Créer le Compte'}
              </button>
              
              <div className="form-footer">
                <Link to='/sign-in' className="register-link">
                  Se Connecter
                </Link>
              </div>
            </div>
          </form>
          </div>
        </div>
      </div>
      }
    </>
  )
}
