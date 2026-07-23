import React, { useEffect, useRef, useState } from 'react'
import AppLayout from '@layouts/appLayout'
import { ArrowLeftRight, ShoppingBag, SquarePen, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '@components/header'
import axiosClient from "@/axios-client";
import Swal from "sweetalert2";
import CustomModal from '@components/CustomModal'
import ListileUser from '@components/user/ListTile'
import ConnectionError from '@components/errorConnection'
import EmptyFetch from '@components/Empty'
import Alert from '@components/Alert';

export default function Comptables() {

  const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(false);

  const [loadingskeletonbuttonmodal, setLoadingSkeletonButtonModal] = useState(false);

  const [users, setUsers] = useState([]);

  const [getshops, setGetShops] = useState([]);

  const [shops, setShops] = useState([]);

  const [user, setUser] = useState({});

  const [filteredUsers, setFilteredUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);

  const [errors,setErrors] = useState({});

  const [success,setSucces] = useState("");

  const [errorConnection, setErrorConnection] = useState(false);

  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);

  const inputshop = useRef([]);

  const addInputsShop = el => {
    if (el && !inputshop.current.includes(el)) {
      inputshop.current.push(el)
    }
  }

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalOpen = async (userId,user) => {
    inputshop.current = [];
    setLoadingSkeletonButtonModal(true);
    setShowModal(true);
    setUser(user);
    setErrors({});
    getShopsUserById(userId);
  }

  const getShopsUserById = async (userId) => {
    setLoadingSkeletonButtonModal(true);
    axiosClient.get(`/shops/user/${userId}`).then( ({data})=> {
      let list = data.data;
      setGetShops(list);
      setLoadingSkeletonButtonModal(false);
    }).catch(err => {
      console.log(err);
      setLoadingSkeletonButtonModal(false);
    });    
  };

  useEffect(() => {
    inputshop.current = [];
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

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    const filtered = users.filter((user) =>{
      const searchString = `${user.lastname.toLowerCase()}  ${user.firstname.toLowerCase()}`;
      return searchString.includes(searchTerm.toLowerCase());
    });
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  useEffect(() => {
    getComptables();
  }, []);

  const getComptables = async () => {
    setLoadingSkeletonButton(true);
    axiosClient.get('/comptables')
    .then(({ data }) => {
      setUsers(data.data);
      setTotalPages(Math.ceil(data.data.length / usersPerPage));
      setLoadingSkeletonButton(false);
      setErrorConnection(false);
    }).catch(err => {
      setErrorConnection(true);
      setLoadingSkeletonButton(false);
    });
  };


  function initials(str) {
    const words = str.split(' ').slice(0, 3);
    let initials = '';
    words.forEach(word => {
      if (word.length > 0) {
        initials += word[0].toUpperCase();
      }
    });
    return initials;
  }

  const ChangeStateUser = async(id) => { 
    Swal.fire({
      title: 'Suppression', text: 'Voulez-vous supprimer ce Comptable ?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#10518E', cancelButtonColor: '#d33', confirmButtonText: 'Supprimer', cancelButtonText: 'Fermer'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('state', 'idle');
        axiosClient.post(`/user/editstate/${id}`,formData).then( () => {
          Swal.fire({position: 'top-right',icon: 'success',title: 'Succès!',text: 'Comptable supprimée avec succès',showConfirmButton: true,confirmButtonColor: '#10518E'});
          getComptables()
        }).catch(err => {
          const response = err.response;
          if (response.data.message) {
            Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: `${response.data.message}` ,showConfirmButton: true,confirmButtonColor: '#10518E'})
          }else{
            Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: "une errreur s'est produite lors de l'execution, Verifier votre Connexion Internet" ,showConfirmButton: true,confirmButtonColor: '#10518E'})
          }
        });
      }
    });
  };

  const DeleteUserShop = async(id) => { 
    Swal.fire({
      title: 'Suppression', text: 'Voulez-vous supprimer cette boutique à cet utilisateur ?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#10518E', cancelButtonColor: '#d33', confirmButtonText: 'Supprimer', cancelButtonText: 'Fermer'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const datausershop = { user_id : user.id , shop_id : id }
        axiosClient.post(`/user-shop/delete`,datausershop).then( () => {
          Swal.fire({position: 'top-right',icon: 'success',title: 'Succès!',text: 'boutique supprimée avec succès',showConfirmButton: true,confirmButtonColor: '#10518E'});
          getShopsUserById(user.id);
        }).catch(err => {
          const response = err.response;
          if (response.data.error) {
            Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: `${response.data.error}` ,showConfirmButton: true,confirmButtonColor: '#10518E'})
          }else{
            Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: "une errreur s'est produite lors de l'execution, Verifier votre Connexion Internet" ,showConfirmButton: true,confirmButtonColor: '#10518E'})
          }
        });
      }
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const handleAddShop = async(e) => {
    e.preventDefault();
    if (inputshop.current[0].value.trim() === '' || inputshop.current[0].value.trim() === '0' ) {
      return;
    }  
    setLoadingSubmitButton(true);
    await axiosClient.post('/user-shop/add',{user_id : user.id, shop_id : inputshop.current[0].value.trim()}).then(({data})  => {
        setSucces("Boutique ajoutée avec succès à cet utilisateur !!");
        setTimeout(() => { setSucces('');}, 4000);
        setLoadingSubmitButton(false);
        setErrors(errors);
        getShopsUserById(user.id);
        // formRef.current.reset();
        // getProducts();
    }).catch(err => {
      const response = err.response;
      if (response && response.status === 422) {
        errors.shop = "Verifier votre Connexion Internet";
      }
      else if (response && response.status === 500) {
        errors.error = "Cet utilisateur est deja lié à cette boutique";
      }        
      else{
        errors.connection = "Verifier votre Connexion Internet";
      }
      setErrors(errors);
      setLoadingSubmitButton(false);
    })
  }
    
  return (
    <>
    <AppLayout onSearch={handleSearch}>
      <div class="content-wrapper mt-10">
        <Header title={'Listes des Comptables'+' ('+ filteredUsers.length + ')'} />
        <CustomModal isOpen={showModal} onClose={handleModalClose} title="Ajouter une Boutique">
          {loadingskeletonbuttonmodal ? <p className="text-center" style={{ textAlign:"center" }}> <i class="fa fa-refresh fa-spin text-3xl mr-2 text-black"></i> </p> :
            <>
              {success ? 
                <Alert className={'alert-success'} type="Success" message={ success  } />
              : null}
              {errors.connection ? 
                <Alert className={'alert-warning'} type="Warning" message={ errors.connection  } />
              : null}  
              {errors.error ? 
                <Alert className={'alert-danger'} type="Error" message={ errors.error  } />
              : null}                         
              <ListileUser label='Noms' content={user.lastname+' '+user.firstname} />
              <div class="row">
                <div class="col-75">
                  <label for="fname">Boutique *</label>
                  <select id="select-team-form" ref={addInputsShop}>
                    <option value={''}></option>
                    {shops && shops.map((shop) => (
                      <option value={shop.id}>{shop.name}</option>
                    ))}
                  </select>
                  {errors.shop && <span className="text-red-500">{errors.shop}</span>}
                  <br /><br />
                </div>
                <div class="col-75 link-login">
                  <button type="button" class="login" onClick={loadingsubmitbutton ? null : handleAddShop}>
                    {loadingsubmitbutton ? <i class="fa fa-refresh fa-spin text-1xl text-white"></i> : 'Submit'}
                  </button><br />
                </div>
                <div style={{ overflowY : "scroll", scrollBehavior: "inherit",height:"30vh",marginLeft:"auto",marginRight:"auto" }}><br /><br />
                  <table id="customers">
                    <thead>
                        <tr>
                            <th style={{ borderTopLeftRadius:"5px",borderBottomLeftRadius:"5px" }}>#</th>
                            <th>Nom</th>
                            <th>Adresse</th>
                            <th>Telephone</th>
                            <th style={{ borderTopRightRadius:"5px",borderBottomRightRadius:"5px" }}>Actions</th>
                        </tr>                
                    </thead>
                    <tbody>
                    {getshops && getshops.map((shop,index) => {                               
                        const descendingIndex = getshops.length - 1;
                        return (
                          <tr key={index}>
                            <td> {descendingIndex} </td>  
                            <td> {shop.name} </td>   
                            <td> {shop.address} </td>                   
                            <td> {shop.phone} </td>   
                            <td>
                              <div style={{ width:"40px" }}>
                                <button class="btn-delete" onClick={() => DeleteUserShop(shop.id)} title={"Supprimer"}>
                                  <Trash2 size={15} color={'white'}/>
                                </button> 
                              </div>                                
                            </td>   
                          </tr>
                        );
                    })} 
                    </tbody>
                  </table> 
                </div>                               
              </div>
            </>
          }
        </CustomModal>    

        {loadingskeletonbutton ? <p className="text-center" style={{ textAlign:"center" }}> <i class="fa fa-refresh fa-spin text-3xl mr-2 text-black"></i> </p> :
          <>
            {errorConnection ? 
              <ConnectionError onRetry={getComptables} /> :
              <>
                {filteredUsers.length > 0 ?
                <>
                  <table id="customers">
                    <thead>
                        <tr>
                            <th style={{ borderTopLeftRadius:"5px",borderBottomLeftRadius:"5px" }}>#</th>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Email</th>
                            <th style={{ borderTopRightRadius:"5px",borderBottomRightRadius:"5px" }}>Actions</th>
                        </tr>                
                    </thead>
                    <tbody>
                      {currentUsers && currentUsers.map((user,index) => {                               
                          return (    
                              <tr key={index}>
                                  <td>
                                    {user.img == "" || user.img == null ?
                                    <div style={{ alignItems:"center", textAlign:"center", backgroundColor:"#dafafe", padding:"4px", fontSize:"1.7rem",width:"70px" }}>
                                        {initials(user.lastname)}
                                    </div>
                                    : 
                                    <a href={user.img} target='_blank'>
                                        <img src={user.img} style={{ height:"40px",width:"70px",objectFit:"cover" }} alt="" />
                                    </a>}
                                  </td>
                                  <td> {user.lastname} </td>   
                                  <td> {user.firstname} </td>   
                                  <td> {user.email} </td>                                        
                                  <td style={{ display:"flex", width:"100%",height:"70px",alignItems:"center" }}>
                                    <div style={{ width:"40px" }}>
                                      <Link to={`/comptable/edit/${user.id}`} class="btn-update" title={"Modifier"}>
                                        <SquarePen size={15} color={'white'}/>
                                      </Link>
                                    </div>
                                    <div style={{ width:"40px" }}>
                                      <button class="btn-delete" onClick={() => ChangeStateUser(user.id)} title={"Supprimer"}>
                                        <Trash2 size={15} color={'white'}/>
                                      </button> 
                                    </div>                                            
                                    <div style={{ width:"40px" }}>
                                        <button class="btn-state" title={"Boutiques"} onClick={() => handleModalOpen(user.id,user)} >
                                          <ShoppingBag size={15} color={'black'}/>
                                        </button>                                             
                                    </div>                                                                                                                         
                                  </td>                         
                              </tr>
                          );
                      })}
                    </tbody>
                  </table> 
                  <div className="container-pagination">
                    <button className="button-pagination" id="startBtn" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
                        <i className="fa-solid fa-angles-left"></i>
                    </button>
                      
                    <button className="button-pagination prevNext" id="prev" disabled={currentPage === 1} onClick={handlePrevPage}>
                        <i className="fa-solid fa-angle-left"></i>
                    </button>
          
                    <div className="links-pagination">
                      {[...Array(totalPages)].map((_, pageIndex) => (
                        <a key={pageIndex} className={`link-pagination ${currentPage === pageIndex + 1 ? 'active' : ''}`} onClick={() => goToPage(pageIndex + 1)}>
                          {pageIndex + 1}
                        </a>
                      ))}
                    </div>
        
                    <button className="button-pagination prevNext" id="next" disabled={currentPage === totalPages} onClick={handleNextPage}>
                      <i className="fa-solid fa-angle-right"></i>
                    </button>
          
                    <button className="button-pagination" id="endBtn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
                      <i className="fa-solid fa-angles-right"></i>
                    </button>
                    </div> 
                    </> 
                  : 
                  <EmptyFetch onRetry={getComptables} title={'Aucune Comptable'} />
                }
              </> 
            }
          </>
        }

      </div>
      <div>
      </div>
    </AppLayout>    
    </>    
    
  )
}