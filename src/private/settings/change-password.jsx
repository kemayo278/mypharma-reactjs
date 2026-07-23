import React, { useContext, useEffect, useRef, useState } from "react";
import AppLayout from "@layouts/appLayout";
import { SquarePen, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "@components/header";
import axiosClient from '@/axios-client';
import Swal from "sweetalert2";
import { AuthContext } from '@context/AuthContext';
import Alert from '@components/Alert';

export default function ChangePassword() {

  const inputpasswords = useRef([]);

  const formRef = useRef();

  const navigate = useNavigate();

  const addInputs = el => {
    if (el && !inputpasswords.current.includes(el)) {
      inputpasswords.current.push(el)
    }
  }

  const [validationerror , setValidationError] = useState("");

  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);

  const { currentUser, token } = useContext(AuthContext);

  const handleSubmit = async(event) => {
    event.preventDefault();
    const errors = {};

    if (inputpasswords.current[0].value.trim() === '') {
      errors.password = 'Entrez un nouveau mot de passe';
    }

    if (inputpasswords.current[1].value.trim() === '') {
      errors.repeatpassword = 'Repetez ce mot de passe';
    }  

    if (inputpasswords.current[0].value.trim() != inputpasswords.current[1].value.trim()) {
      errors.error = 'Mots de passe non identiques';
    }  

    if (Object.keys(errors).length === 0) {
      setLoadingSubmitButton(true);
      const data = {_method : 'PUT', password : inputpasswords.current[0].value.trim()};
      await axiosClient.post(`/changepassword/${currentUser.id}`,data).then(({data})  => {                    
        formRef.current.reset();
        setValidationError(errors);
        Swal.fire({position: 'Center',icon: 'success',title: 'Success',text: 'Mot de passe modifié avec succès.',showConfirmButton: true,confirmButtonColor: '#094b88'});
      }).catch(err => {
        Swal.fire({position: 'center',icon: 'warning',title: 'Oops',text: 'Une erreur s\'est produite, Verifier votre connexion et reessayer',showConfirmButton: true,confirmButtonColor: '#032546'})
        setLoadingSubmitButton(false);
        return;
      });
      setLoadingSubmitButton(false);  
    } else{
      setValidationError(errors);
      setLoadingSubmitButton(false);
    }           
  }


  return (
    <AppLayout>
      <div class="content-wrapper mt-10">
        <Header title={'Changer votre Mot de Passe'} />
        <div class="row">
          <div class="col-75">
            <form action="" ref={formRef}>
              <div class="container-form">
                <div class="row">
                  {validationerror.error ?
                    <div class="col-75">
                      <Alert className={'alert-danger'} type="Danger" message={ validationerror.error } />
                    </div>
                  : null }
                  <div class="col-75">
                    <label for="fname">Nouveau Mot de Passe</label>
                    <input type="text" ref={addInputs} />
                    {validationerror.password && <span className="text-red-500">{validationerror.password}<br/></span>} <br /><br />
                  </div>  
                  <div class="col-75">
                    <label for="fname">Repeter ce Mot de Passe</label>
                    <input type="text" ref={addInputs} />
                    {validationerror.repeatpassword && <span className="text-red-500">{validationerror.repeatpassword}<br/></span>} <br />
                  </div>                   
                  <div class="col-75 link-login"><br />
                    <button type="button" class="login" onClick={loadingsubmitbutton ? null :handleSubmit}>
                      {loadingsubmitbutton ? <div className="spinner"></div>  : null} Modifier
                    </button>
                  </div>                
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
