import { Minus, Plus } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import CustomModal from '@components/CustomModal'
import Alert from '@components/Alert';
import axiosClient from '@/axios-client';
import Swal from "sweetalert2";

const CollapseObjectif = ({ id, title, isChecked, onCheckboxChange, children, isOpenByDefault, progress, progressClass,week,pourcent,Refresh,userId }) => {

  const [isOpen, setIsOpen] = useState(isOpenByDefault || false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const formRef = useRef();

  const [success,setSucces] = useState(""); 

  const [errors,setErrors] = useState({});

  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);
    
  const inputpourcents = useRef([]);

  const addInputsPourcent = el => {
    if (el && !inputpourcents.current.includes(el)) {
      inputpourcents.current.push(el)
    }
  }

  const toggleModalOpen = () => {
    setIsModalOpen(true);
  };

  const toggleModalClose = () => {
    setIsModalOpen(false);
  };
  
  useEffect(() => {
    if (isOpenByDefault) {
      setIsOpen(true);
    }
  }, [isOpenByDefault]);

  const handleUpdatePourcent = async(event) => {
    event.preventDefault();
    const errors = {};

    if (inputpourcents.current[0].value.trim() === '') {
      errors.pourcent = 'Champ obligatoire.';
    } else {
      const pourcentValue = parseFloat(inputpourcents.current[0].value);
      if (isNaN(pourcentValue) || pourcentValue < 0 || pourcentValue > 100) {
        errors.pourcent = 'Le pourcentage doit être compris entre 0 et 100.';
      }
    }    

    if (Object.keys(errors).length === 0) {
      setLoadingSubmitButton(true);
      const data = {_method : 'PUT', progression : inputpourcents.current[0].value.trim()};
      await axiosClient.post(`/updatePourcentobjectif/${id}`,data).then(async ({data})  => {           
        const datanotification = { user_id : userId , content : "Pourcentage d'un objectif a été mis a jour", state : "unread", type : "objectif" };
        await axiosClient.post('/storenotification',datanotification);             
        setLoadingSubmitButton(false);
        setSucces("operation effectuée avec succès !!");
        setTimeout(() => { setSucces('');}, 5000);
        Swal.fire({position: 'Center',icon: 'success',title: 'Success',text: 'operation effectuée avec succès.',showConfirmButton: true,confirmButtonColor: '#094b88'});
        Refresh();
      }).catch(err => {
        errors.error = "An error occurred while executing the program";
        setLoadingSubmitButton(false);
        setErrors(errors);
      });
    } else{
      setErrors(errors);
      setLoadingSubmitButton(false);
    }   
  }

  return (
    <div style={{ marginBottom: '10px' }}>
      <CustomModal isOpen={isModalOpen} onClose={toggleModalClose} title={title+" Du "+week}>       
        <form ref={formRef}>
          <div class="container-form">   
            {success ? 
              <Alert className={'alert-success'} type="Success" message={ success  } />
            : null}                                          
            <div class="row">
              <div class="col-75">
                <label for="fname">Pourcentage %</label>
                <input type="text" ref={addInputsPourcent} defaultValue={pourcent} />
                {errors.pourcent && <span className="text-red-500">{errors.pourcent}</span>} <br /><br />
              </div>                     
              <div class="col-75 link-login">
                <button type="button" class="login" onClick={loadingsubmitbutton ? null : handleUpdatePourcent }>
                  {loadingsubmitbutton ? <i class="fa fa-refresh fa-spin text-1xl text-white"></i> : 'Submit'}
                </button>
              </div>                
            </div>
          </div>
        </form>          
      </CustomModal>       
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ padding:"17px", border:"1px solid #e8e1e1", alignItems:"center" }}>
          <input type="checkbox" checked={isChecked} onChange={() => onCheckboxChange(id)} />
        </div>   
        <div style={{ width:"20px" }}></div>
        <button type="button" style={{ fontSize: '18px', flexGrow: 1 }} className={`collapsible-collapse ${isOpen ? 'active-collapse' : ''}`} onClick={toggle}>
          {title}
          {isOpen ? <Minus style={{ float: 'right' }} /> : <Plus style={{ float: 'right' }} />}
        </button>
        <div style={{ width:"5px" }}></div>
        <div class="w3-light-grey" style={{ width:"100px",cursor:"pointer" }} onClick={toggleModalOpen}>
          <div class={`${progressClass} w3-center`} style={{ width:progress+"%", height:"57px",alignItems:"center",alignContent:"center" }}>{progress}%</div>
        </div>
      </div>
      <div className="content" style={{ display: isOpen ? 'block' : 'none', marginTop: '10px' }}>
        {children}
      </div>
    </div>
  );
};

export default CollapseObjectif;
