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

export default function AddUpdateShop() {

  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);

  const [loadinginput, setLoadingInput] = useState(false);

  const [errorConnection, setErrorConnection] = useState(false);
  
  const formRef = useRef();
  
  const [datashop,setDataShop] = useState({});

  const [errors,setErrors] = useState({});

  const [success,setSucces] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);

  const {shopId} = useParams();

  const inputshops = useRef([]);

  const addInputsShop = el => {
    if (el && !inputshops.current.includes(el)) {
        inputshops.current.push(el)
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setFileUrl(URL.createObjectURL(file));
    } else {
      Swal.fire({position: 'Center',icon: 'warning',title: 'Oops!',text: 'Veuillez sélectionner un fichier image valide.',showConfirmButton: true});
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    const inputElement = document.getElementById('uploadImage');
    if (inputElement) {
      inputElement.value = '';
    }
  };

  useEffect(() => {
    inputshops.current = [];
  }, []);

  useEffect(() => {
    shopId && getShopById();
  }, [shopId]);
  
  const getShopById = async () => {
    setLoadingInput(true);
    axiosClient.get(`/shop/${shopId}`).then(({data}) => {
      let list = data.data;
      setDataShop(list);
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
    if (inputshops.current[0].value.trim() === '') {
        errors.name = 'Le nom est requis';
    }  
    if (inputshops.current[1].value.trim() === '') {
        errors.address = 'L\'adresse est requise';
    }  
    if (inputshops.current[1].value.trim() === '') {
        errors.phone = 'Le numero est requis';
    }                         
    return errors;                
  }
  
  const handleAddUpdateShop = async(e) => {
    e.preventDefault();
    let errors = validate();
    console.log(inputshops);
    if(Object.keys(errors).length) return setErrors(errors);
    setLoadingSubmitButton(true);
    if (!shopId) {
      const formData = new FormData();
      formData.append('name', inputshops.current[0].value.trim());
      formData.append('address', inputshops.current[1].value.trim());
      formData.append('phone', inputshops.current[2].value.trim());
      formData.append('matriculation', inputshops.current[3].value.trim());
      formData.append('number_register', inputshops.current[4].value.trim());
      formData.append('pj', inputshops.current[5].value.trim());
      formData.append('pj_register', inputshops.current[6].value.trim());
      formData.append('num_declaration', inputshops.current[7].value.trim());
      formData.append('couverture', inputshops.current[8].value.trim());
      if (selectedImage) {
        formData.append('img', selectedImage); 
      }      
      await axiosClient.post('/shop/add',formData).then(({data})  => {
        setSucces("Boutique créee avec succès !");
        setTimeout(() => { setSucces('');}, 5000);
        setErrors(errors);
        setLoadingSubmitButton(false);
        formRef.current.reset();
      }).catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          if (response.data.errors.name) {
            errors.name = response.data.errors.name;
          } 
        }else{
            errors.connection = "Verifier votre Connexion Internet";
        }
        setErrors(errors);   
        setLoadingSubmitButton(false);    
      })
    } else {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', inputshops.current[0].value.trim());
        formData.append('address', inputshops.current[1].value.trim());
        formData.append('phone', inputshops.current[2].value.trim());
        formData.append('matriculation', inputshops.current[3].value.trim());
        formData.append('number_register', inputshops.current[4].value.trim());
        formData.append('pj', inputshops.current[5].value.trim());
        formData.append('pj_register', inputshops.current[6].value.trim());
        formData.append('num_declaration', inputshops.current[7].value.trim());
        formData.append('couverture', inputshops.current[8].value.trim());
        if (selectedImage) {
            formData.append('img', selectedImage); 
        }        
        await axiosClient.post(`/shop/${shopId}`,formData).then(({data})  => {
            setSucces("Informations de la boutique modifié avec succès !");
            setErrors(errors);
        }).catch(err => {
            const response = err.response;
            if (response && response.status === 422) {
              if (response.data.errors.name) {
                errors.name = response.data.errors.name;
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
      <Header title={ shopId ? "Modifier cette boutique" : "Ajouter une boutique"} />
        {errorConnection ?  <ConnectionError onRetry={getShopById} /> :
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
                    <label for="fname">Nom *</label>
                    <input type="text" disabled={loadinginput ? 'disabled' : ''} ref={addInputsShop} defaultValue={datashop ? datashop.name : "" } />
                    {errors.name && <span className="text-red-500">{errors.name}</span>}
                    <br /><br />
                  </div>
                  <div class="col-75">
                    <label for="fname">Adresse *</label>
                    <input type="text" disabled={loadinginput ? 'disabled' : ''} ref={addInputsShop} defaultValue={datashop ? datashop.address : "" } />
                    {errors.address && <span className="text-red-500">{errors.address}</span>}
                    <br /><br />
                  </div>
                  <div class="col-75">
                    <label for="fname">Téléphone *</label>
                    <input type="text" disabled={loadinginput ? 'disabled' : ''} ref={addInputsShop} defaultValue={datashop ? datashop.phone : "" } placeholder="699999999/677777777" />
                    {errors.phone && <span className="text-red-500">{errors.phone}</span>}
                    <br /><br />
                  </div>     
                  <div class="col-75">
                    <label for="fname">Immatriculation </label>
                    <input type="text" disabled={loadinginput ? 'disabled' : ''} ref={addInputsShop} defaultValue={datashop ? datashop.matriculation : "" } />
                    <br /><br />
                  </div>  
                  <div class="col-75">
                    <label for="fname">Numéro de Registre </label>
                    <input type="text" disabled={loadinginput ? 'disabled' : ''} ref={addInputsShop} defaultValue={datashop ? datashop.numberRegister : "" } />
                    <br /><br />
                  </div>  
                  <div class="col-75">
                    <label for="fname">Pj </label>
                    <input type="text" disabled={loadinginput ? 'disabled' : ''} ref={addInputsShop} defaultValue={datashop ? datashop.pj : "" } />
                    <br /><br />
                  </div>    
                  <div class="col-75">
                    <label for="fname">Pj Register </label>
                    <input type="text" disabled={loadinginput ? 'disabled' : ''} ref={addInputsShop} defaultValue={datashop ? datashop.pjRegister : "" } />
                    <br /><br />
                  </div> 
                  <div class="col-75">
                    <label for="fname">Numéro de declaration </label>
                    <input type="text" disabled={loadinginput ? 'disabled' : ''} ref={addInputsShop} defaultValue={datashop ? datashop.numDeclaration : "" } />
                    <br /><br />
                  </div>   
                  <div class="col-75">
                    <label for="fname">Couverture </label>
                    <input type="text" disabled={loadinginput ? 'disabled' : ''} ref={addInputsShop} defaultValue={datashop ? datashop.couverture : "" } />
                    <br /><br />
                  </div>                                                                                                                                                  
                  <div class="col-75 link-login">
                    <button type="button" class="login" onClick={loadingsubmitbutton ? null : handleAddUpdateShop}>
                      {loadingsubmitbutton ? <i class="fa fa-refresh fa-spin text-1xl text-white"></i> : 'Submit'}
                    </button>
                  </div>                
                </div>
              </div>
            </form>
          </div>
          <div class="col-25">
            <div class="container">
                <div class="row">
                  {selectedImage ? (
                    <img src={URL.createObjectURL(selectedImage)} className="img-thumbnail" alt="Forest" style={{ width:"100%",objectFit:"cover", height:"180px" }}/>
                  ) : (
                    <img src={datashop.img == "" || datashop.img == null ? skeleton : datashop.img  } className="img-thumbnail" alt="Forest" style={{ width:"100%",objectFit:"cover", height:"180px" }}/>
                  )}
                </div><br />
                <div class="row">
                  <div className="col-50">
                    <label htmlFor="uploadImage" className="btn-btn-primary" title="Upload new profile image">
                      <i className="fa fa-upload" style={{ color : "white" }}></i>
                      <input type="file" id="uploadImage" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                  </div>   
                  <div className="col-50">
                    {selectedImage && (
                      <label htmlFor="uploadImage" onClick={handleImageRemove} className="btn-btn-danger" title="supprimer">
                        <i className="fa fa-trash" style={{ color : "white" }}></i>
                      </label>
                    )}
                  </div>                                                                                     
                </div>                              
            </div>
          </div>          
        </div> }
      </div>
    </AppLayout>
  );
}
