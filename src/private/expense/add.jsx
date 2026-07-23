import React, { useContext, useEffect, useRef, useState } from "react";
import AppLayout from "@layouts/appLayout";
import { Landmark, ReceiptText, UserRound } from "lucide-react";
import { useParams } from "react-router-dom";
import Header from "@components/header";
import skeleton from '@assets/imgs/skeletonImg.png'
import Alert from '@components/Alert';
import axiosClient from '@/axios-client';
import { AuthContext } from '@context/AuthContext';
import ConnectionError from '@components/errorConnection'
import { getCurrentShopFromLocalStorage } from '@local/Shop.js';

export default function AddExpense() {

  const { currentUser } = useContext(AuthContext);

   const currentShop = getCurrentShopFromLocalStorage();

  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);

  const [loadinginput, setLoadingInput] = useState(false);
  
  const [errorConnection, setErrorConnection] = useState(false);
  
  const formRef = useRef();
  
  const [dataproduct,setDataProduct] = useState({});

  const [errors,setErrors] = useState({});

  const [success,setSucces] = useState("");

  const [users, setUsers] = useState([]);

  const {productId} = useParams();

  const inputexpenses = useRef([]);

  const addInputsExpense = el => {
    if (el && !inputexpenses.current.includes(el)) {
        inputexpenses.current.push(el)
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      axiosClient.get('/users').then( ({data})=> {
        setUsers(data.data);
      }); 
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    productId && getProductById();
  }, [productId]);
  
  const getProductById = async () => {
    setLoadingInput(true);
    axiosClient.get(`/product/${productId}`).then(({data}) => {
      let list = data.data;
      setDataProduct(list);
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
    if (inputexpenses.current[0].value.trim() === '') {
        errors.type = 'Le type est requis';
    }  
    if (inputexpenses.current[1].value.trim() === '') {
        errors.amount = 'Le montant est requis';
    }   
    if (inputexpenses.current[2].value.trim() === '') {
        errors.pattern = 'Le motif est requis';
    }  
    if (inputexpenses.current[3].value.trim() === '') {
        errors.user = 'utilisateur requis';
    }                        
    return errors;                
  }
  
  const handleAddExpense = async(e) => {
    e.preventDefault();
    let errors = validate();
    if(Object.keys(errors).length) return setErrors(errors);
    setLoadingSubmitButton(true);
    let data = {type : inputexpenses.current[0].value.trim(), amount : inputexpenses.current[1].value.trim(), pattern : inputexpenses.current[2].value.trim(), user_id : inputexpenses.current[3].value.trim(), shop_id : currentShop.shopId};
    await axiosClient.post('/expense/add',data).then(({data})  => {
        setSucces("Dépense ajoutée avec succès !!");
        setTimeout(() => { setSucces('');}, 4000);
        setErrors(errors);
        formRef.current.reset();
        setLoadingSubmitButton(false);
    }).catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
            if (response.data.errors.user_id) {
                errors.user = response.data.errors.user_id;
            }
            if (response.data.errors.amount) {
                errors.amount = response.data.errors.amount;
            }   
            if (response.data.errors.shop_id) {
                errors.connection = response.data.errors.shop_id;
            }
        }else{
            errors.connection = "Verifier votre Connexion Internet";
        }
        setErrors(errors);
        setLoadingSubmitButton(false);
    });
    setLoadingSubmitButton(false);
  }

  return (
    <AppLayout>
      <div className="content-wrapper mt-10 expense-page-shell">
      <Header title={"Ajouter une Dépense"} />
        {errorConnection ?  <ConnectionError onRetry={getProductById} /> :
        <div className="row pharma-product-layout mt-3 expense-form-shell">
          <div className="col-75">
            <form ref={formRef}>
              <div className="container-form pharma-product-card expense-form-card">
                {success ? 
                  <Alert className={'alert-success'} type="Success" message={ success  } />
                : null}    
                {errors.connection ? 
                  <Alert className={'alert-warning'} type="Warning" message={ errors.connection  } />
                : null}                 
                <div className="row">
                  <div className="col-75">
                    <p className="pharma-form-section-title">Informations Depense</p>
                    <label htmlFor="expense-type">Type *</label>
                    <select id="select-team-form" disabled={loadinginput ? 'disabled' : ''} ref={addInputsExpense} >
                      <option value={''}></option>
                      <option value={'Versement Bancaire'}>Versement Bancaire</option>
                      <option value={'Achats de Materiel'}>Achats de Materiel </option>
                      <option value={'Achats Emballage'}>Achats Emballage </option>
                      <option value={'Sortie Technicien'}>Sortie Technicien </option>
                      <option value={'Réparation des équipements '}>Réparation des équipements </option>
                      <option value={'Charges Sociales'}>Charges Sociales </option>
                    </select>
                    {errors.type && <span className="text-danger">{errors.type}</span>}
                    <br /><br />
                  </div>                    
                  <div className="col-75">
                    <label htmlFor="expense-amount">Montant *</label>
                    <input type="number" ref={addInputsExpense}/>
                    {errors.amount && <span className="text-red-500">{errors.amount}</span>}
                    <br /><br />
                  </div>
                  <div className="col-75">
                    <label htmlFor="expense-pattern">Motif *</label>
                    <input type="text" ref={addInputsExpense} />
                    {errors.pattern && <span className="text-red-500">{errors.pattern}</span>}
                    <br /><br />
                  </div>
                  <div className="col-75">
                    <label htmlFor="expense-user">Qui fait la depense *</label>
                    <select id="select-team-form" ref={addInputsExpense} >
                      <option value={''}></option>
                      {users && users.map((user) => (
                        <option selected={currentUser.id == user.id ? 'selected' : ''} value={user.id}>{currentUser.id == user.id ? 'moi meme' : user.lastname + ' ' + user.firstname}</option>
                      ))}
                    </select>
                    {errors.user && <span className="text-danger">{errors.user}</span>}
                    <br /><br />
                  </div>                                              
                  <div className="col-75 link-login">
                    <button type="button" className="expense-submit-btn" onClick={loadingsubmitbutton ? null : handleAddExpense}>
                      {loadingsubmitbutton ? <i className="fa fa-refresh fa-spin text-1xl text-white"></i> : 'Enregistrer la depense'}
                    </button>
                  </div>                
                </div>
              </div>
            </form>
          </div>
          <div className="col-25">
            <div className="pharma-product-sidecard expense-side-card">
              <div className="pharma-product-illustration-wrap">
                <img src={skeleton} alt="Illustration depense" className="pharma-product-preview" />
              </div>
              <p className="mt-3 mb-1 fw-bold d-flex align-items-center gap-2"><ReceiptText size={16} /> Bonnes pratiques</p>
              <p className="text-muted mb-2">Renseigne un motif court, clair et verificable.</p>
              <p className="mt-2 mb-1 fw-bold d-flex align-items-center gap-2"><Landmark size={16} /> Suivi budget</p>
              <p className="text-muted mb-2">Classe chaque depense dans le bon type pour les statistiques.</p>
              <p className="mt-2 mb-1 fw-bold d-flex align-items-center gap-2"><UserRound size={16} /> Responsable</p>
              <p className="text-muted mb-0">Associe toujours la depense a un utilisateur.</p>
            </div>
          </div>          
        </div> }
      </div>
    </AppLayout>
  );
}
