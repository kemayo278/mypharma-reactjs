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

export default function AddUpdateTackler() {

  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);

  const [loadinginput, setLoadingInput] = useState(false);

  const [errorConnection, setErrorConnection] = useState(false);
  
  const formRef = useRef();
  
  const [datatackler,setDataTackler] = useState({});

  const [errors,setErrors] = useState({});

  const [success,setSucces] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);

  const [shops, setShops] = useState([]);

  const {tacklerId} = useParams();

  const inputtacklers = useRef([]);

  const addInputsTackler = el => {
    if (el && !inputtacklers.current.includes(el)) {
        inputtacklers.current.push(el)
    }
  }

  useEffect(() => {
    inputtacklers.current = [];
    getShops();
  }, []);

  const getShops = async () => {
    try {
      axiosClient.get('/shops').then( ({data})=> {
        setShops(data.data);
      }); 
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    tacklerId && getTacklerById();
  }, [tacklerId]);
  
  const getTacklerById = async () => {
    setLoadingInput(true);
    axiosClient.get(`/user/${tacklerId}`).then(({data}) => {
      let list = data.data;
      setDataTackler(list);
      setErrorConnection(false);
    }).catch(err => {
        const response = err.response;
        if (response && response.status === 404) {
          window.history.back();
        }else{
          setErrorConnection(true);
        }
    });
    setLoadingInput(false);
  };

  const validate = () => {
    let errors = {};
    if (inputtacklers.current[0].value.trim() === '') {
        errors.lastname = 'Le nom est requis';
    }  
    if (inputtacklers.current[1].value.trim() === '') {
        errors.firstname = 'Le prenom est requis';
    }  
    if (inputtacklers.current[2].value.trim() === '') {
        errors.email = 'L\'adresse email est requise';
    }  
    if (inputtacklers.current[3].value.trim() === '') {
        errors.sexe = 'Le sexe est requis';
    } 
    if (!tacklerId) {
        if (inputtacklers.current[4].value.trim() === '') {
            errors.shop = 'Selectionner une boutique';
        }     
    }                   
    return errors;                
  }
  
  const handleAddUpdateTackler = async(e) => {
    e.preventDefault();
    let errors = validate();
    console.log(inputtacklers);
    if(Object.keys(errors).length) return setErrors(errors);
    setLoadingSubmitButton(true);
    if (!tacklerId) {
      let datauser = {lastname : inputtacklers.current[0].value.trim(), firstname : inputtacklers.current[1].value.trim(), email : inputtacklers.current[2].value.trim(), state : 'asset', password : '123456', type : 'tackler'
        , sexe : inputtacklers.current[3].value.trim(), contact_name : inputtacklers.current[5].value.trim(), contact_cni : inputtacklers.current[6].value.trim(), contact_phone : inputtacklers.current[7].value.trim(), contact_link : inputtacklers.current[8].value.trim()};
      await axiosClient.post('/signup',datauser).then(async ({data})  => {
        const { user, token } = data;
        const datausershop = { user_id : user.id , shop_id : inputtacklers.current[4].value.trim() }
        await axiosClient.post('/user-shop/add',datausershop);
        setErrors(errors);
        setLoadingSubmitButton(false);
        Swal.fire({position: 'Center',icon: 'success',title: 'Succès!',text: "Takleuse ajoutée avec succès" ,showConfirmButton: true, confirmButtonColor: '#032546'});  
        formRef.current.reset();
      }).catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          if (response.data.errors.email) {
            errors.email = response.data.errors.email;
          }   
        }else{
          errors.connection = "Verifier votre Connexion Internet";
        }
        setErrors(errors);   
        setLoadingSubmitButton(false);  
      })
    } else { 
        let data = {_method : 'PUT', lastname : inputtacklers.current[0].value.trim(), firstname : inputtacklers.current[1].value.trim(), email : inputtacklers.current[2].value.trim()
            , sexe : inputtacklers.current[3].value.trim(), contact_name : inputtacklers.current[5].value.trim(), contact_cni : inputtacklers.current[6].value.trim(), contact_phone : inputtacklers.current[7].value.trim(), contact_link : inputtacklers.current[8].value.trim()};            
        await axiosClient.post(`/user/edit/${tacklerId}`,data).then(({data})  => {
            Swal.fire({position: 'Center',icon: 'success',title: 'Succès!',text: "Informations de la Takleuse modifiées avec succès !" ,showConfirmButton: true, confirmButtonColor: '#032546'});  
            setErrors(errors);
        }).catch(err => {
            const response = err.response;
            console.log(response.data.errors);
            if (response && response.status === 422) {
              if (response.data.errors.email) {
                errors.email = response.data.errors.email;
              }   
            }else{
              errors.connection = "Verifier votre Connexion Internet";
            }
            setErrors(errors);   
            setLoadingSubmitButton(false);  
        })
    }

    setLoadingSubmitButton(false);
  }

  return (
    <AppLayout>
      <div class="content-wrapper mt-10">
      <Header title={ tacklerId ? "Modifier cette Takleuse" : "Ajouter une Takleuse"} />
        {errorConnection ?  <ConnectionError onRetry={getTacklerById} /> :
        <div class="row">
          <div class="col-75">
            <form ref={formRef}>
              <div class="container-form">
                {success ? 
                  <Alert className={'alert-success'} type="Success" message={ success  } />
                : null}    
                {errors.connection ? 
                  <Alert className={'alert-warning'} type="Warning" message={ errors.connection  } />
                : null}                 
                <div class="row">
                  <div class="col-75">
                    <label for="fname">Nom </label>
                    <input type="text" disabled={loadinginput || tacklerId ? 'disabled' : ''} ref={addInputsTackler} defaultValue={datatackler ? datatackler.lastname : "" } />
                    {errors.lastname && <span className="text-red-500">{errors.lastname}</span>}
                    <br /><br />
                  </div>
                  <div class="col-75">
                    <label for="fname">Prénom *</label>
                    <input type="text" disabled={loadinginput || tacklerId ? 'disabled' : ''} ref={addInputsTackler} defaultValue={datatackler ? datatackler.firstname : "" } />
                    {errors.firstname && <span className="text-red-500">{errors.firstname}</span>}
                    <br /><br />
                  </div>
                  <div class="col-75">
                    <label for="fname">Adresse-Email *</label>
                    <input type="text" disabled={loadinginput || tacklerId ? 'disabled' : ''} ref={addInputsTackler} defaultValue={datatackler ? datatackler.email : "" } />
                    {errors.email && <span className="text-red-500">{errors.email}</span>}
                    <br /><br />
                  </div>  
                  <div class="col-75">
                    <label for="fname">Sexe *</label>
                    <select id="select-team-form" disabled={loadinginput ? 'disabled' : ''} ref={addInputsTackler} >
                      <option value={''}></option>
                      <option selected={datatackler.sexe == 'masc' ? 'selected' : ''} value={'masc'}>Masculin</option>
                      <option selected={datatackler.sexe == 'fem' ? 'selected' : ''} value={'fem'}>Feminin</option>
                    </select>
                    {errors.sexe && <span className="text-danger">{errors.sexe}</span>}
                    <br /><br />
                  </div>                                  
                  <div class="col-75">
                    <label for="fname">Boutique *</label>
                    <select id="select-team-form" disabled={loadinginput || tacklerId ? 'disabled' : ''} ref={addInputsTackler} >
                      <option value={''}></option>
                      {shops && shops.map((shop) => (
                        <option selected={datatackler.categoryId == shop.id ? 'selected' : ''} value={shop.id}>{shop.name}</option>
                      ))}
                    </select>
                    {errors.shop && <span className="text-danger">{errors.shop}</span>}
                    <br /><br />
                  </div>  
                  <hr />
                  <p className="txt-24 text-center">
                    Informations du garant
                  </p>
                  <div class="col-75">
                    <label for="fname">Noms </label>
                    <input type="text" disabled={loadinginput ? 'disabled' : ''} ref={addInputsTackler} defaultValue={datatackler ? datatackler.contact_name : "" } />
                    <br /><br />
                  </div>
                  <div class="col-75">
                    <label for="fname">Numero CNI  </label>
                    <input type="text" disabled={loadinginput ? 'disabled' : ''} ref={addInputsTackler} defaultValue={datatackler ? datatackler.contact_cni : "" } />
                    <br /><br />
                  </div>
                  <div class="col-75">
                    <label for="fname">Telephone  </label>
                    <input type="text" disabled={loadinginput ? 'disabled' : ''} ref={addInputsTackler} defaultValue={datatackler ? datatackler.contact_phone : "" } />
                    <br /><br />
                  </div>    
                  <div class="col-75">
                    <label for="fname">Lien   </label>
                    <input type="text" disabled={loadinginput ? 'disabled' : ''} ref={addInputsTackler} defaultValue={datatackler ? datatackler.contact_link : "" } />
                    <br /><br />
                  </div>                                  

                  <div class="col-75 link-login">
                    <button type="button" class="login" onClick={loadingsubmitbutton ? null : handleAddUpdateTackler}>
                      {loadingsubmitbutton ? <i class="fa fa-refresh fa-spin text-1xl text-white"></i> : 'Submit'}
                    </button>
                  </div>                
                </div>
              </div>
            </form>
          </div>
          <div class="col-25">
            
          </div>          
        </div> }
      </div>
    </AppLayout>
  );
}
