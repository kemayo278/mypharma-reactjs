import React, { useContext, useEffect, useRef, useState } from "react";
import AppLayout from '@layouts/appLayout'
import { ArrowLeftRight, SquarePen, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '@components/header'
import axiosClient from "@/axios-client";
import Swal from "sweetalert2";
import CustomModal from '@components/CustomModal'
import ListileUser from '@components/user/ListTile'
import ConnectionError from '@components/errorConnection'
import EmptyFetch from '@components/Empty'
import { AuthContext } from '@context/AuthContext';
import { getCurrentShopFromLocalStorage } from '@local/Shop.js';

export default function Tacklers() {

  const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(false);

  const [loadingskeletonbuttonmodal, setLoadingSkeletonButtonModal] = useState(false);

  const { currentUser, token } = useContext(AuthContext);

  const currentShop = getCurrentShopFromLocalStorage();

  const [users, setUsers] = useState([]);

  const [user, setUser] = useState({});

  const [filteredUsers, setFilteredUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);

  const [errorConnection, setErrorConnection] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
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
    getTacklers();
  }, []);

  const getTacklers = async () => {
    setLoadingSkeletonButton(true);
    let url = '';
    if (currentUser.type === 'comptable') {
      url = `/tacklers/shop/${currentShop.shopId}`;
    }else{
      url = `/tacklers`;
    }       
    axiosClient.get(url)
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
      title: 'Suppression', text: 'Voulez-vous supprimer cette Takleuse ?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#10518E', cancelButtonColor: '#d33', confirmButtonText: 'Supprimer', cancelButtonText: 'Fermer'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('state', 'idle');
        axiosClient.post(`/user/editstate/${id}`,formData).then( () => {
          Swal.fire({position: 'top-right',icon: 'success',title: 'Succès!',text: 'Takleuse supprimée avec succès',showConfirmButton: true,confirmButtonColor: '#10518E'});
          getTacklers()
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
    
  return (
    <>
    <AppLayout onSearch={handleSearch}>
      <div class="content-wrapper mt-10">
        <Header title={'Listes des Takleuses'+' ('+ filteredUsers.length + ')'} />
        <CustomModal isOpen={showModal} onClose={handleModalClose} title="Toutes les Informations">
          {loadingskeletonbuttonmodal ? <p className="text-center" style={{ textAlign:"center" }}> <i class="fa fa-refresh fa-spin text-3xl mr-2 text-black"></i> </p> :
            <>
              <ListileUser label='Noms' content={user.user_fulname} />                                                  
            </>
          }       
        </CustomModal>    

        {loadingskeletonbutton ? <p className="text-center" style={{ textAlign:"center" }}> <i class="fa fa-refresh fa-spin text-3xl mr-2 text-black"></i> </p> :
          <>
            {errorConnection ? 
              <ConnectionError onRetry={getTacklers} /> :
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
                                      <Link to={`/tackler/edit/${user.id}`} class="btn-update" title={"Modifier"}>
                                        <SquarePen size={15} color={'white'}/>
                                      </Link>
                                    </div>
                                    <div style={{ width:"40px" }}>
                                      <button class="btn-delete" onClick={() => ChangeStateUser(user.id)} title={"Supprimer"}>
                                        <Trash2 size={15} color={'white'}/>
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
                  <EmptyFetch onRetry={getTacklers} title={'Aucune Takleuse'} />
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