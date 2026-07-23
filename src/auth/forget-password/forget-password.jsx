import React, { useContext, useEffect, useRef, useState } from 'react'
import logo from '@assets/imgs/logokokitechgroup.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '@context/AuthContext';
import Alert from '@components/Alert';
import axiosClient from '@/axios-client';
import { saveUserProfileToLocalStorage } from '@local/User.js';
import HeadLogin from '@components/headlogin';
import Swal from 'sweetalert2';

export default function ForgetPassword() {

  const inputs = useRef([]);

  const [validationerror , setValidationError] = useState("");

  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);

  const formRef = useRef();

  const navigate = useNavigate();

  const addInputs = el => {
    if (el && !inputs.current.includes(el)) {
      inputs.current.push(el)
    }
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleForm = async (event) =>{
    event.preventDefault();
    const errors = {};

    if (inputs.current[0].value.trim() === '') {
      errors.email = 'Adresse E-mail requis';
    } else if (!isValidEmail(inputs.current[0].value)) {
      errors.email = 'Format d\'adresse mail invalide';
    }

    if (Object.keys(errors).length === 0) {
      setLoadingSubmitButton(true);
      const datauser = {email : inputs.current[0].value.trim() }
      await axiosClient.post('/forgetpassword', datauser).then(({data})  => {
        navigate('/sign-in');
        setLoadingSubmitButton(false);
        Swal.fire({position: 'Center',icon: 'success',title: 'Succès!',text: "Vous avez reçu un nouveau mot de passe sur votre adresse mail" ,showConfirmButton: true, confirmButtonColor: '#08447c'});              
      }).catch(err => {
        setLoadingSubmitButton(false);
        const response = err.response;
        if(err.code === "auth/network-request-failed"){
            errors.checkingnetwork = 'Connexion internet requise';
            setValidationError(errors);
        }
        else if (response && response.status === 404) {
          errors.error = response.data.error;
          setValidationError(errors);
        }
        else if (response && response.status === 500) {
          errors.error = 'An error occurred while executing the program, check connection internet';
          setValidationError(errors);
        }
        else{
            errors.error = 'An error occurred while executing the program, check connection internet';
            setValidationError(errors);
        }
        setLoadingSubmitButton(false);
      });
    }else{
      setValidationError(errors);
    }
  }

  return (
    <div class="container-login flex-login">
      <div class="facebook-page-login flex-login">
        <HeadLogin title={'Renitialiser Mot de Passe'} />
        <form id="form-login" ref={formRef}>
          {validationerror.checkingnetwork ? 
            <Alert className={'alert-warning'} type="Oops" message={ validationerror.checkingnetwork  } />
          : null}     
          {validationerror.error ? 
            <Alert className={'alert-danger'} type="Erreur" message={ validationerror.error  } />
          : null}  
          <input type="text" class="mt-20" placeholder="Adresse E-mail" ref={addInputs}/>
          {validationerror.email && <span className="text-danger">{validationerror.email}</span>} <br />

          <div class="link-login mt-20">
            <button type="button" onClick={loadingsubmitbutton ? null : handleForm } class="login">
              {loadingsubmitbutton ? <i class="fa fa-refresh fa-spin" style={{textAlign:"center" }}></i> : null}  Soumettre
            </button>
          </div>
          <hr/>
          <div class="button-login">
            <Link to='/sign-in'>
              Se Connecter
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
