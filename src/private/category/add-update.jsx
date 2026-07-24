import React, { useEffect, useRef, useState } from "react";
import AppLayout from "@layouts/appLayout";
import { SquarePen, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "@components/header";
import Alert from '@components/Alert';
import axiosClient from '@/axios-client';
import Swal from "sweetalert2";

const initialState = { category_name  : "", category_description  : ""}

export default function AddUpdateCategory() {

  const navigate = useNavigate();

  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);

  const [errorConnection, setErrorConnection] = useState(false);

  const [loadinginput, setLoadingInput] = useState(false);
  
  const formRef = useRef();
  
  const [datacategory,setDataCategory] = useState(initialState);

  const [errors,setErrors] = useState({});

  const [success,setSucces] = useState("");

  const {category_name,category_description} = datacategory;

  const {categoryId} = useParams();

  useEffect(() => {
    categoryId && getCategoryById();
  }, [categoryId]);
  
  const getCategoryById = async () => {
    setLoadingInput(true);
    axiosClient.get(`/categories/${categoryId}`).then(({data}) => {
      let list = data.data;
      setDataCategory(list);
      setLoadingInput(false);
      setErrorConnection(false);
    }).catch(err => {
      const response = err.response;
      if (response && response.status === 404) {
        window.history.back();
      }else{
        setErrorConnection(true);
      }
      setLoadingInput(false);
    });
  };

  const handleChange = (e) => {
    setDataCategory({ ...datacategory,[e.target.name] : e.target.value });
  }

  const validate = () => {
    let errors = {};
    if (!category_name || category_name.trim() === "") {
      errors.name  = "le nom es requis";
    }
    // if (!category_description || category_description.trim() === "") {
    //   errors.description  = "la description est requise";
    // }
    return errors;
  }
  
  const handleAddUpdateCategory = async(e) => {
    e.preventDefault();
    let errors = validate();
    if(Object.keys(errors).length) return setErrors(errors);
    setLoadingSubmitButton(true);
    if (!categoryId) {
      await axiosClient.post('/category',{name : datacategory.category_name, description : datacategory.category_description}).then(({data})  => {
        setSucces("Catégorie ajoutée avec succès !!");
        setTimeout(() => { setSucces('');}, 15000);
        setErrors(errors);
        setDataCategory(initialState);
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
      })
    } else {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('name', datacategory.category_name);
      formData.append('description', datacategory.category_description);
      await axiosClient.post(`/category/${categoryId}`,formData).then(({data})  => {
        setSucces("Catégorie modifiée avec succès !!");
        setTimeout(() => { setSucces('');}, 15000);
        setErrors(errors);
      }).catch(err => {
        const response = err.response;
        errors.connection = "Verifier votre Connexion Internet";
        setErrors(errors); 
        setLoadingSubmitButton(false);       
      })
    }
    setLoadingSubmitButton(false);
  }

  return (
    <AppLayout>
      <div class="content-wrapper mt-10">
        <Header title={ categoryId ? "Modifier cette catégorie" : "Ajouter une catégorie"} />
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
                    <label for="fname">Nom</label>
                    <input type="text" disabled={loadinginput ? 'disabled' : ''} name="category_name" value={category_name} onChange={handleChange} />
                    {errors.name && <span className="text-red-500">{errors.name}</span>} <br /><br />
                  </div>
                  <div class="col-75">
                    <label for="fname">Description</label>
                    <input type="text" disabled={loadinginput ? 'disabled' : ''} name="category_description" value={category_description} onChange={handleChange} />
                    {errors.description && <span className="text-red-500">{errors.description}</span>} <br /><br />
                  </div>                  
                  <div class="col-75 link-login">
                    <button type="button" className="login"  onClick={loadingsubmitbutton ? null : handleAddUpdateCategory} disabled={loadingsubmitbutton}>
                      {loadingsubmitbutton ? <div className="spinner"></div> : "Valider" }
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
