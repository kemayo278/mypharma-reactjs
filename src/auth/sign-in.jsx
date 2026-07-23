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

export default function SignIn() {

  const {dispatch} = useContext(AuthContext);

  const inputs = useRef([]);

  const [validationerror , setValidationError] = useState("");

  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);

  const [errorauthentification,setErrorAuthentification] = useState("");

  const [rememberMe, setRememberMe] = useState(true);

  const [user, setUser] = useState({ email_or_pseudo : "", password : "" });

  const formRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    const rememberMeCookie = Cookies.get('rememberMeMyLounge');
    if (rememberMeCookie) {
      setRememberMe(true);
      const userData = JSON.parse(rememberMeCookie);
      setUser(userData);
    }else{
      const userData = { email_or_pseudo : "", password : "" };
      setUser(userData);
    }
  }, []);

  const addInputs = el => {
    if (el && !inputs.current.includes(el)) {
      inputs.current.push(el)
    }
  }

  const handleForm = async (event, attempt = 1, maxAttempts = 3) => {
    event.preventDefault();

    setValidationError({});
    setErrorAuthentification({});

    const errors = {};

    if (inputs.current[0].value.trim() === '') {
      errors.email_or_pseudo = 'Adresse E-mail ou Pseudo requis';
    }

    if (inputs.current[1].value.trim() === '') {
      errors.password = 'Mot de passe requis';
    }

    if (Object.keys(errors).length === 0) {
      setLoadingSubmitButton(true);
      const datauser = {
        email_or_pseudo: inputs.current[0].value.trim(),
        password: inputs.current[1].value.trim()
      };

      try {
          const { data } = await axiosClient.post('/login', datauser);
          const { user, token, resourceuser, dateEnd, message, nbDelay } = data;

          // Sauvegarder les données utilisateur
          saveUserProfileToLocalStorage(resourceuser);
          saveDelayToLocalStorage(dateEnd, message, nbDelay);

          // Gestion de "Se souvenir de moi"
          if (rememberMe) {
              const userData = {
                email_or_pseudo: inputs.current[0].value.trim(),
                password: inputs.current[1].value.trim(),
              };
              Cookies.set('rememberMeMyLounge', JSON.stringify(userData), { expires: 365 });
              setUser(userData);
          } else {
              Cookies.remove('rememberMeMyLounge');
          }

          // Mise à jour du contexte et redirection
          dispatch({ type: "LOGIN", payload: { user, token } });
          navigate('/home');
      } catch (err) {
        const response = err.response;

        if (err.code === "auth/network-request-failed") {
          errors.checkingnetwork = 'Connexion internet requise';
          setValidationError(errors);
        } else if (response) {
          if (response.status === 422) {
            errors.queryCheckuser_Email_Password = response.data.message;
            setErrorAuthentification(errors);
          } else if (response.status === 500) {
            const message = response.data.message || 'Une erreur est survenue';
            setErrorAuthentification({ queryCheckuser_State: message });
          }
        } else {
          if (attempt < maxAttempts) {
            console.warn(`Tentative ${attempt} échouée. Relance...`);
            setTimeout(() => handleForm(event, attempt + 1, maxAttempts), 2000); // Relancer après 2 secondes
          } else {
            errors.checkinglink = 'Oops ! Vérifiez votre connexion réseau et réessayez.';
            setValidationError(errors);
          }
        }
        setTimeout(() => setErrorAuthentification({}), 4000);
      } finally {
        setLoadingSubmitButton(false);
      }
    } else {
      setValidationError(errors);
    }
  };



  return (
    <div className="container-login">
      <HeadLogin title={'Se Connecter'} />
      <div className="login-wrapper">
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-overlay">
              <h1 className="hero-title">Connectez-vous a votre espace MyPharma</h1>
              <p className="hero-subtitle">
                Entrez vos identifiants pour acceder a votre compte en toute securite.
                Retrouvez rapidement votre espace de travail et reprenez vos operations.
              </p>
              <div className="hero-features">
                <div className="feature-item">
                  <span>Connexion simple, rapide et securisee</span>
                </div>
                <div className="feature-item">
                  <span>Acces direct a votre interface personnelle</span>
                </div>
              </div>
              <div className="hero-cta">
                <p className="cta-text">Besoin d'un compte ? Inscrivez-vous en quelques secondes.</p>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img src={heroImage} alt="Gestion PME" />
          </div>
        </div>
        
        <div className="form-section">
          <form id="form-login" ref={formRef}>
            <div className="form-header">
              <Link to={'/config'}>
                <img src={logo} alt="Logo" className='o-cover login-photo' style={{ width:"100%", height:"90px",objectFit:"contain", marginBottom: "20px" }} />
              </Link>
              <h3 className="form-title">
                Se Connecter
              </h3>
            </div>
            
            <div className="form-alerts">
              {errorauthentification.queryCheckuser_Email_Password ? 
                <Alert className={'alert-danger'} type="Erreur" message={ errorauthentification.queryCheckuser_Email_Password  } />
              : null}
              {errorauthentification.queryCheckuser_State ? 
                <Alert className={'alert-warning'} type="Erreur" message={ errorauthentification.queryCheckuser_State  } />
              : null}
              {validationerror.checkingnetwork ? 
                <Alert className={'alert-warning'} type="Erreur" message={ validationerror.checkingnetwork  } />
              : null}
              {validationerror.checkinglink ? 
                <Alert className={'alert-warning'} type="Erreur" message={ validationerror.checkinglink } />
              : null}
            </div>
            
            <div className="form-fields">            
              <div className="input-group">
                <input 
                  type="text" 
                  className='form-input' 
                  placeholder="Adresse E-mail ou Pseudo" 
                  defaultValue={user.email_or_pseudo} 
                  ref={addInputs}
                />
                {validationerror.email_or_pseudo && 
                  <span className="error-message">{validationerror.email_or_pseudo}</span>
                }
              </div>
              
              <div className="input-group">
                <input 
                  type="password" 
                  className='form-input' 
                  placeholder="Mot de Passe" 
                  defaultValue={user.password} 
                  ref={addInputs}
                />
                {validationerror.password && 
                  <span className="error-message">{validationerror.password}</span>
                }
              </div>
              
              <div className="remember-me-container">
                <label className="remember-me-label">
                  <input 
                    type="checkbox" 
                    checked={rememberMe} 
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="remember-me-checkbox"
                  />
                  <span className="remember-me-text">Se souvenir de moi</span>
                </label>
              </div>
            </div> 

            <div className="form-actions">
              <button 
                type="submit" 
                onClick={loadingsubmitbutton ? null : handleForm} 
                className={`submit-button ${loadingsubmitbutton ? 'loading' : ''}`}
                disabled={loadingsubmitbutton}
              >
                {loadingsubmitbutton ? <div className="spinner"></div> : 'Se Connecter'}
              </button>
              
              <div className="form-footer">
                <Link to='/register' className="register-link">
                  Créer un compte
                </Link>
              </div>
            </div>          
          </form>
        </div>
      </div>
    </div>
  )
}
