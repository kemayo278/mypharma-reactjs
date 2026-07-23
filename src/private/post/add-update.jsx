import React, { useEffect, useRef, useState } from "react";
import AppLayout from "@layouts/appLayout";
import { SquarePen, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "@components/header";
import user from '@assets/imgs/218.jpg'
import axiosClient from '@/axios-client';
import Swal from "sweetalert2";

const initialState = { post_name  : "" , post_department : ""}

export default function AddUpdatePost() {

  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);

  const [loadinginput, setLoadingInput] = useState(false);
  
  const formRef = useRef();
  
  const [datapost,setDataPost] = useState(initialState);

  const [errors,setErrors] = useState({});

  const [success,setSucces] = useState("");

  const {post_name,post_department} = datapost;

  const [departments, setDepartments] = useState([]);

  const {postId} = useParams();

  useEffect(() => {
    getDepartments();
  }, []);

  const getDepartments = async () => {
    try {
      axiosClient.get('/departments').then( ({data})=> {
        setDepartments(data.data);
      }); 
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    postId && getPostById();
  }, [postId]);
  
  const getPostById = async () => {
    setLoadingInput(true);
    axiosClient.get(`/posts/${postId}`).then(({data}) => {
      let list = data.data;
      setDataPost(list);
    }).catch(err => {
      window.history.back();
    });
    setLoadingInput(false);
  };  

  const handleChange = (e) => {
    setDataPost({ ...datapost,[e.target.name] : e.target.value });
  }

  const validate = () => {
    let errors = {};
    if (!post_name || post_name.trim() === "") {
      errors.post_name  = "Post Name is required";
    }  
    if (!post_department || post_department.trim() === "") {
      errors.post_department  = "Post Department is required";
    }      
    return errors;                
  }
  
  const handleAddPost = async(e) => {
    e.preventDefault();
    let errors = validate();
    if(Object.keys(errors).length) return setErrors(errors);
    setLoadingSubmitButton(true);

    if (!postId) {
      const data = { name : datapost.post_name, department_id : parseInt(datapost.post_department) }

      await axiosClient.post('/posts',data).then(({data})  => {
        setSucces("Post added success !!");
        setDataPost(initialState);
        setTimeout(() => { setSucces('');}, 3000);
        setErrors(errors);
      }).catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          if (response.data.errors.name) {
            errors.post_name = response.data.errors.name;
            setErrors(errors);
          }
        }
      })

    } else {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('name', datapost.post_name);
      formData.append('department_id', parseInt(datapost.post_department));
      await axiosClient.post(`/posts/${postId}`,formData).then(({data})  => {
        setSucces("Post updated success !!");
        setTimeout(() => { setSucces('');}, 3000);
        setErrors(errors);
      }).catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          if (response.data.errors.name) {
            errors.post_name = response.data.errors.name;
            setErrors(errors);
          }
        }
      })
    }

    setLoadingSubmitButton(false);
  }

  return (
    <AppLayout>
      <div class="content-wrapper mt-10">
      <Header title={ postId ? "Modifier ce poste" : "Ajouter un poste"} />
        <div class="row">
          <div class="col-75">
            <form ref={formRef}>
              <div class="container-form">
                {success ? 
                  <Alert className={'alert-success'} type="Success" message={ success  } />
                : null}    
                {errors.error ? 
                  <Alert className={'alert-warning'} type="Danger" message={ errors.error  } />
                : null}                 
                <div class="row">
                  <div class="col-75">
                    <label for="fname">Nom</label>
                    <input type="text" disabled={loadinginput ? 'disabled' : ''} name="post_name" value={post_name} onChange={handleChange} />
                    {errors.post_name && <span className="text-red-500">{errors.post_name}</span>} 
                    {errors.post_nameInCollection && <span className="text-red-500">{errors.post_nameInCollection}</span>}
                    <br /><br />
                  </div>
                  <div class="col-75">
                    <label for="fname">Departement</label>
                    <select id="select-team-form" disabled={loadinginput ? 'disabled' : ''} name="post_department" value={post_department} onChange={handleChange} >
                      <option value={''} selected></option>
                      {departments && departments.map((department) => (
                        <option value={department.department_id}>{department.department_name}</option>
                      ))}
                    </select>
                    {errors.post_department && <span className="text-danger">{errors.post_department}</span>}
                    <br /><br />
                  </div>   
                  <div class="col-75 link-login">
                    <button type="button" class="login" onClick={loadingsubmitbutton ? null :handleAddPost}>
                      {loadingsubmitbutton ? <i class="fa fa-refresh fa-spin text-1xl text-white"></i> : null} Submit
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
