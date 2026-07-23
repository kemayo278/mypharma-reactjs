import React, { useEffect, useRef, useState } from "react";
import AppLayout from "@layouts/appLayout";
import { Flag, SquarePen, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "@components/header";
import skeleton from '@assets/imgs/skeletonImg.png'
import Alert from '@components/Alert';
import axiosClient from '@/axios-client';
import Swal from "sweetalert2";
import ConnectionError from '@components/errorConnection'

export default function AddUser() {

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
        setSucces("Ce Compte a été créee avec succès. Il est en attente d'activation !");
        setTimeout(() => { setSucces('');}, 4000);
        Swal.fire({position: 'Center',icon: 'success',title: 'Success!',text: 'Votre Compte a été crée avec succès. Il est en attente d\'activation ',showConfirmButton: true,confirmButtonColor: '#094b88'});
        formRef.current.reset();
        setValidationError(errors);
        setLoadingSubmitButton(false);
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
            Swal.fire({position: 'Center',icon: 'warning  ',title: 'Warning!',text: 'Ce compte existe déja!',showConfirmButton: true});
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
    } else {
      setValidationError(errors);
    }
    setLoadingSubmitButton(false);

  }
  
  return (
    <AppLayout>
      <div class="content-wrapper mt-10">
      <Header title={"Ajouter un Utilisateur"} />
        <div class="row">
          <div class="col-75">
            <form ref={formRef}>
              <div class="container-form">
                {success ? 
                  <Alert className={'alert-success'} type="Success" message={ success  } />
                : null} 
                {validationerror.error ? 
                  <Alert className={'alert-danger'} type="Erreur" message={ validationerror.error  } />
                : null} 
                {validationerror.checkingnetwork ? 
                  <Alert className={'alert-warning'} type="Erreur" message={ validationerror.checkingnetwork  } />
                : null}                  
                <div class="row">
                  <div class="col-75">
                    <label for="fname">Nom *</label>
                    <input type="text" name="first_name" placeholder="" ref={addInputs}/>
                    {validationerror.first_name && <span className="text-danger">{validationerror.first_name}</span>} <br /><br />
                  </div>
                  <div class="col-75">
                    <label for="fname">Prénom *</label>
                    <input type="text" name="second_name" placeholder="" ref={addInputs}/>
                    {validationerror.second_name && <span className="text-danger">{validationerror.second_name}</span>}<br /> <br />
                  </div>
                  <div class="col-75">
                    <label for="fname">Adresse-Email *</label>
                    <input type="email" placeholder="" ref={addInputs} />
                    {validationerror.email && <span className="text-danger">{validationerror.email}</span>} <br /><br />
                  </div>  
                  <div class="col-75">
                    <label for="fname">Son poste *</label>
                    <select id="select-team-form" disabled={loadingpost ? 'disabled' : ''} ref={addInputs} >
                      <option value={''} selected> </option>
                      {roles && roles.map((role) => (
                        <option value={role.role_name}>{role.role_name}</option>
                      ))}
                    </select>
                    {validationerror.role_id && <span className="text-danger">{validationerror.role_id}</span>}<br /><br />
                  </div>        
                  <div class="col-75">
                    <label for="fname">Pseudo de Connexion *</label>
                    <input type="text" name="pseudo" placeholder="" ref={addInputs} />  
                    {validationerror.pseudo && <span className="text-danger">{validationerror.pseudo}</span>} <br /><br />
                  </div>     
                  <div class="col-75">
                    <label for="fname">Numéro CNI *</label>
                    <input type="text" name="cni_number" placeholder="" ref={addInputs} />  
                    {validationerror.cni_number && <span className="text-danger">{validationerror.cni_number}</span>} <br /><br />
                  </div>    
                  <div class="col-75">
                    <label for="fname">Numéro de Telephone *</label>
                    <input type="text" name="phone" placeholder="" ref={addInputs} />  
                    {validationerror.phone && <span className="text-danger">{validationerror.phone}</span>} <br /><br />    
                  </div>           
                  <div class="col-75">
                    <label for="fname">Mot De Passe *</label>
                    <input type={'password'} placeholder="" ref={addInputs} />
                    {validationerror.user_password && <span className="text-danger">{validationerror.user_password}</span>} <br /><br />    
                  </div>        
                  <div class="col-75">
                    <label for="fname">Saisir Encore Votre Mot De Passe *</label>
                    <input type={'password'} placeholder="" ref={addInputs} />
                    {validationerror.user_repeatpassword && <span className="text-danger">{validationerror.user_repeatpassword}</span>} <br /> <br /> 
                  </div>                                                                                               

                  <div class="col-75 link-login">
                    <button type="button" class="login" onClick={loadingsubmitbutton ? null : handleForm}>
                      {loadingsubmitbutton ? <div className="spinner"></div> : 'Ajouter'}
                    </button>
                  </div>                
                </div>
              </div>
            </form>
          </div>
          <div class="col-25">
            
          </div>          
        </div>
      </div>
    </AppLayout>
  );
}
