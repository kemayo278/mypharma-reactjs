import React, { useEffect, useRef, useState } from "react";
import AppLayout from "@layouts/appLayout";
import { SquarePen, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "@components/header";
import Alert from '@components/Alert';
import axiosClient from '@/axios-client';
import Swal from "sweetalert2";

const initialState = { department_name  : ""}

export default function UpdateUser() {

    const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);
    
    const formRef = useRef();

    const [errors,setErrors] = useState({});

    const [success,setSucces] = useState("");

    const [roles, setRoles] = useState([]);

    const [user,setUser] = useState({});

    const {userId} = useParams();

    const [loadinginput, setLoadingInput] = useState(false);

    const inputusers = useRef([]);

    const addInputsUser = el => {
        if (el && !inputusers.current.includes(el)) {
            inputusers.current.push(el)
        }
    }

    useEffect(() => {
        const getUserbyId = async () => {
            setLoadingInput(true);
            axiosClient.get(`/user/${userId}`).then( ({data})=> {
                setUser(data.data);
                setLoadingInput(false);
            }).catch(err => {
                console.log(err);
                setLoadingInput(false);
            });
            inputusers.current = [];
        };
        userId && getUserbyId();
    }, [userId]);

    useEffect(() => {
        const getRoles = async () => {
            axiosClient.get('/roles').then( ({data})=> {
                setRoles(data.data);
            }).catch(err => {
                console.log(err);
            });
        };     
        getRoles();
    }, []);

    const updateUser = async(event) => {
        event.preventDefault();
        const errors = {};

        if (inputusers.current[0].value.trim() === '') {
            errors.user_degree= 'Le Dégrée est requis';
        }

        if (inputusers.current[1].value.trim() === '') {
            errors.role_id= 'Le Role est vide';
        }

        if (Object.keys(errors).length === 0) {
            setLoadingSubmitButton(true);
            const data = { _method : 'PUT' , degree : inputusers.current[0].value.trim(), role_id : inputusers.current[1].value.trim() }
            await axiosClient.post(`/user/editroledegree/${userId}`,data).then(async ({data})  => {
                setSucces("Informations modifiées avec succès !!");
                setLoadingSubmitButton(false);  
                setTimeout(() => { setSucces('');}, 4000);
                setErrors(errors);
                // window.history.back();
            }).catch(err => {
                const response = err.response;
                if (response.data.message) {
                    Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: `${response.data.message}` ,showConfirmButton: true,confirmButtonColor: '#10518E'})
                }else{
                    Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: "une errreur s'est produite lors de l'execution, Verifier votre Connexion Internet" ,showConfirmButton: true,confirmButtonColor: '#10518E'})
                }
            });
            setLoadingSubmitButton(false);
        } else{
            setErrors(errors);
            setLoadingSubmitButton(false);
        }   
    }

  return (
    <AppLayout>
      <div class="content-wrapper mt-10">
        {loadinginput ? <p className="text-center"><span className="loader"></span></p> :
            <>
                <Header title={'Modifier ' + user.user_first_name+ ' '+user.user_second_name} />
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
                                        <label for="fname">Dégré </label>
                                        <select id="select-team-form" disabled={loadinginput ? 'disabled' : ''} ref={addInputsUser}  >
                                            <option selected={user.user_degree == 1 ? 'selected' : ''} value="1">1er Dégré</option>
                                            <option selected={user.user_degree == 2 ? 'selected' : ''} value="2">2e Dégré</option>
                                            <option selected={user.user_degree == 3 ? 'selected' : ''} value="3">3e Dégré</option>
                                            <option selected={user.user_degree == 4 ? 'selected' : ''} value="4">4e Dégré</option>
                                        </select>
                                        {errors.user_degree && <span className="text-danger">{errors.user_degree}</span>}
                                        <br /><br />
                                    </div>
                                    <div class="col-75">
                                        <label for="fname">Role</label>
                                        <select id="select-team-form" disabled={loadinginput ? 'disabled' : ''} ref={addInputsUser}  >
                                            {roles && roles.map((role) => (
                                                <option selected={user.role_id == role.role_id ? 'selected' : ''} value={role.role_id}>{role.role_name}</option>
                                            ))}
                                        </select>
                                        {errors.role_id && <span className="text-danger">{errors.role_id}</span>}
                                        <br /><br />
                                    </div>
                                    <div class="col-75 link-login">
                                        <button type="button" class="login" onClick={loadingsubmitbutton ? null :updateUser}>
                                        {loadingsubmitbutton ? <i class="fa fa-refresh fa-spin text-1xl text-white"></i> : 'Modifier'}
                                        </button>
                                    </div>                
                                </div>
                            </div>
                        </form>
                    </div>
                </div><br />
                <div class="row">
                    <div class="col-75">
                        <form ref={formRef}>
                            <div class="container-form">
                            <p>
                                <span style={{ fontWeight : "bold" }} class="text-danger">NB :</span> 1er Dégré correspond au super administrateur <br/><br/>
                                <p>
                                    2e Dégré : correspond au profil Economat
                                </p><br />
                                <p>
                                    3e Dégré : correspond au profil Caisse
                                </p><br />
                                <p>
                                    4e Dégré : correspond aux profiles intermediaires 
                                </p>
                            </p>
                            </div>
                        </form>
                    </div>
                </div>                 
            </>
        }
      </div>
    </AppLayout>
  );
}
