import React, { useContext, useEffect, useRef, useState } from "react";
import AppLayout from "@layouts/appLayout";
import { Flag, SquarePen, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "@components/header";
import skeleton from '@assets/imgs/skeletonImg.png'
import Alert from '@components/Alert';
import axiosClient from '@/axios-client';
import { AuthContext } from '@context/AuthContext';
import Swal from "sweetalert2";
import ConnectionError from '@components/errorConnection'

export default function UpdateProductShop() {

  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);

  const [loadinginput, setLoadingInput] = useState(false);

  const [errorConnection, setErrorConnection] = useState(false);

  const { currentUser, token } = useContext(AuthContext);
  
  const formRef = useRef();
  
  const [dataproduct,setDataProduct] = useState({});

  const [product,setProduct] = useState({});

  const [errors,setErrors] = useState({});

  const [success,setSucces] = useState("");

  const {productId} = useParams();

  const inputproducts = useRef([]);

  const addInputsProduct = el => {
    if (el && !inputproducts.current.includes(el)) {
        inputproducts.current.push(el)
    }
  }

  useEffect(() => {
    productId && getProductById();
  }, [productId]);
  
  const getProductById = async () => {
    setLoadingInput(true);
    axiosClient.get(`/product-shop/${productId}`).then(({data}) => {
      let list = data.data;
      setDataProduct(list);
      setProduct(list.product);
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
    if (inputproducts.current[1].value.trim() === '') {
        errors.name = 'Le nom est requis';
    }  
    if (inputproducts.current[2].value.trim() === '') {
        errors.quantity = 'La quantité est requise';
    }
    if (inputproducts.current[3].value.trim() === '') {
        errors.quantity_s = 'La quantité seuil est requise';
    } 
    if (inputproducts.current[4].value.trim() === '') {
        errors.price = 'Le prix est requis';
    }                  
    return errors;                
  }
  
  const UpdateProduct = async(e) => {
    e.preventDefault();
    let errors = validate();
    if(Object.keys(errors).length) return setErrors(errors);
    setLoadingSubmitButton(true);
    if (productId) {
        let data = {_method : 'PUT' , quantity : parseInt(inputproducts.current[2].value.trim()) , quantity_s : parseInt(inputproducts.current[3].value.trim()) , price : parseInt(inputproducts.current[4].value.trim()) };        
        await axiosClient.post(`/product-shop-edit/${productId}`,data).then(({data})  => {
            setSucces("Informations du Produit modifié avec succès !");
            setTimeout(() => { setSucces('');}, 5000);
            Swal.fire({position: 'Center',icon: 'success',title: 'Success!',text: 'Informations du Produit modifié avec succès.',showConfirmButton: true});            
            setErrors(errors);
        }).catch(err => {
            const response = err.response;
            if (response && response.status === 422) {
                errors.field = "Verifier les champs";
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
      <Header title={"Modifier ce produit"} />
        {errorConnection ?  <ConnectionError onRetry={getProductById} /> :
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
                {errors.field ? 
                  <Alert className={'alert-danger'} type="Danger" message={ errors.field  } />
                : null}                                
                <div class="row">
                  <div class="col-75">
                    <label for="fname">Reference</label>
                    <input type="text" disabled={'disabled'} ref={addInputsProduct} defaultValue={product ? product.reference : "" } />
                    {errors.reference && <span className="text-red-500">{errors.reference}</span>}
                    <br /><br />
                  </div>
                  <div class="col-75">
                    <label for="fname">Nom *</label>
                    <input type="text" disabled={'disabled'} ref={addInputsProduct} defaultValue={product ? product.name : "" } />
                    {errors.name && <span className="text-red-500">{errors.name}</span>}
                    <br /><br />
                  </div>
                    <div class="col-75">
                        <label for="fname">Quantité *</label>
                        <input type="number" disabled={loadinginput || currentUser.type != "admin" ? 'disabled' : ''} ref={addInputsProduct} defaultValue={dataproduct ? dataproduct.quantity : 0 } />
                        {errors.quantity && <span className="text-red-500">{errors.quantity}</span>}
                        <br /><br />
                    </div>  
                    <div class="col-75">
                        <label for="fname">Quantité Seuil *</label>
                        <input type="text" disabled={loadinginput ? 'disabled' : ''} ref={addInputsProduct} defaultValue={dataproduct ? dataproduct.quantityS : 0 } />
                        {errors.quantity_s && <span className="text-red-500">{errors.quantity_s}</span>}
                        <br /><br />
                    </div>   
                    <div class="col-75">
                        <label for="fname">Prix *</label>
                        <input type="text" disabled={loadinginput ? 'disabled' : ''} ref={addInputsProduct} defaultValue={dataproduct ? dataproduct.price : 0 } />
                        {errors.price && <span className="text-red-500">{errors.price}</span>}
                        <br /><br />
                    </div>                                          
                  <div class="col-75 link-login">
                    <button type="button" class="login" onClick={loadingsubmitbutton ? null : UpdateProduct}>
                      {loadingsubmitbutton ? <i class="fa fa-refresh fa-spin text-1xl text-white"></i> : 'Submit'}
                    </button>
                  </div>                
                </div>
              </div>
            </form>
          </div>
          <div class="col-25">
            <div class="container">
                                        
            </div>
          </div>          
        </div> }
      </div>
    </AppLayout>
  );
}
