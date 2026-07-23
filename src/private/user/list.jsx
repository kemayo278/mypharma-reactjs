import React, { useEffect, useState } from 'react'
import AppLayout from '@layouts/appLayout'
import { ArrowLeftRight, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, SquarePen, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '@components/header'
import axiosClient from "@/axios-client";
import Swal from "sweetalert2";
import CustomModal from '@components/CustomModal'
import ListileUser from '@components/user/ListTile'
import ConnectionError from '@components/errorConnection'
import EmptyFetch from '@components/Empty'
  
export default function Users() {

  const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(false);

  const [loadingskeletonbuttonmodal, setLoadingSkeletonButtonModal] = useState(false);

  const [users, setUsers] = useState([]);

  const [user, setUser] = useState({});

  const [userRole, setUserRole] = useState('');

  const [filteredUsers, setFilteredUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);

  const [errorConnection, setErrorConnection] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalOpen = async (userId) => {
    setLoadingSkeletonButtonModal(true);
    setShowModal(true);
    axiosClient.get(`/user/${userId}`).then( ({data})=> {
      let list = data.data;
      setUser(list);
      setUserRole(list.role.role_name);
      setLoadingSkeletonButtonModal(false);
    }).catch(err => {
      setLoadingSkeletonButtonModal(false);
    });
  }

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    const filtered = users.filter((user) =>{
      const searchString = `${user.user_first_name.toLowerCase()}  ${user.user_second_name.toLowerCase()} ${user.user_email.toLowerCase()} ${user.user_pseudo.toLowerCase()} `;
      return searchString.includes(searchTerm.toLowerCase());
    });
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    setLoadingSkeletonButton(true);
    axiosClient.get('/users')
    .then(({ data }) => {
      setUsers(data.data);
      setTotalPages(Math.ceil(data.data.length / usersPerPage));
      setLoadingSkeletonButton(false);
      setErrorConnection(false);
    })
    .catch(err => {
      setLoadingSkeletonButton(false);
      setErrorConnection(true);
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

  const ChangeStateUser  = async(id,user_state) => {
      Swal.fire({
        title: 'Choisir une operation', icon: 'question',showDenyButton: true,showCancelButton: true, confirmButtonColor: '#10518E',confirmButtonText: 'Activer',denyButtonText: `Desactiver`, cancelButtonText: 'Cancel'
      }).then(async (result) => {
        if (result.isConfirmed) {
          if(user_state !== "asset")
          {
            let state = "asset";
            const formData = new FormData();
            formData.append('_method', 'PUT');
            await axiosClient.post(`/setstate/${id}/${state}`,formData).then(async ({data})  => {
              getUsers();
              Swal.fire({position: 'top-right',icon: 'success',title: 'Good!',text: 'utilisateur a été activé avec succès',showConfirmButton: true,confirmButtonColor: '#10518E',})
            }).catch(err => {
              const response = err.response;
              if (response.data.message) {
                Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: `${response.data.message}` ,showConfirmButton: true,confirmButtonColor: '#10518E'})
              }else{
                Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: "une errreur s'est produite lors de l'execution, Verifier votre Connexion Internet" ,showConfirmButton: true,confirmButtonColor: '#10518E'})
              }
            });
          }
          else{
            Swal.fire({position: 'top-right',icon: 'warning',title: 'Information',text: 'Cet utilisateur est déjà actif',showConfirmButton: true,confirmButtonColor: '#10518E',})
          }
        }
        else if (result.isDenied) {
          if(user_state !== "idle")
          {
            let state = "idle";
            const formData = new FormData();
            formData.append('_method', 'PUT');
            await axiosClient.post(`/setstate/${id}/${state}`,formData).then(async ({data})  => {
              getUsers();
              Swal.fire({position: 'top-right',icon: 'success',title: 'Good!',text: 'utilisateur a été désactivé avec succès',showConfirmButton: true,confirmButtonColor: '#10518E',})
            }).catch(err => {
              const response = err.response;
              if (response.data.message) {
                Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: `${response.data.message}` ,showConfirmButton: true,confirmButtonColor: '#10518E'})
              }else{
                Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: "une errreur s'est produite lors de l'execution, Verifier votre Connexion Internet" ,showConfirmButton: true,confirmButtonColor: '#10518E'})
              }
            });
          }
          else{
            Swal.fire({position: 'top-right',icon: 'warning',title: 'Information',text: 'Cet utilisateur est déjà inactif',showConfirmButton: true,confirmButtonColor: '#10518E',})
          }
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
      <div className="content-wrapper mt-10 dashboard-page-theme">
        <Header title={'Listes des Utilisateurs'+' ('+ filteredUsers.length+ ')'} />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
          <Link
            to="/user/new"
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '9px 18px', borderRadius: '8px',
              border: 'none', backgroundColor: '#10518E',
              color: '#fff', fontWeight: '600', fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            <Plus size={16} color='white' /> Nouvel utilisateur
          </Link>
        </div>

        <CustomModal isOpen={showModal} onClose={handleModalClose} title="Toutes les Informations">
          {loadingskeletonbuttonmodal ? <p className="text-center"><span className="loader"></span></p> :
            <>
            <div style={{ overflowY : "scroll", scrollBehavior: "inherit", height:"34vh" }}>
              <ListileUser label='Noms' content={user.user_first_name} />
              <ListileUser label='Adresse E-mail' content={user.user_email} classState={'text-primary'} />
              <ListileUser label='Statut' content={user.user_state} />
              <ListileUser label='Degré' content={user.user_degree} />
              <ListileUser label='Pseudo' content={user.user_pseudo} classState={'text-primary'} />
              <ListileUser label='Role' content={userRole} />
            </div>
            </>
          }       
        </CustomModal>            
        {loadingskeletonbutton ? <p className="text-center"><span className="loader"></span></p> :
          <>
            {errorConnection ? 
              <ConnectionError onRetry={getUsers} /> :     
              <>
                {filteredUsers.length > 0 ?
                  <>
                    <div className="dashboard-table-wrap" style={{ overflowY : "scroll", scrollBehavior: "inherit" }}>
                      <table id="customers" className="dashboard-orders-table">
                          <thead>
                              <tr>
                                  <th style={{ borderTopLeftRadius:"5px",borderBottomLeftRadius:"5px" }}>#</th>
                                  <th>Image</th>
                                  <th>Nom(s)</th>
                                  <th>Statut</th>
                                  <th>Degree</th>
                                  <th>Email</th>
                                  <th style={{ borderTopRightRadius:"5px",borderBottomRightRadius:"5px" }}>Actions</th>
                              </tr>                
                          </thead>
                          <tbody>
                            {currentUsers && currentUsers.map((user,index) => {
                              const descendingIndex = users.length - index - (currentPage - 1) * usersPerPage;
                              let classState = "";
                              let contentState = "";
                              if (user.user_state === "asset") {classState = "text-primary";contentState = "activée";} 
                              else if (user.user_state === "idle") { classState = "text-danger";contentState = "desactivée";}
                              else{ classState = "text-warning";contentState = "en Attente";}
                              let Username = user.user_first_name+ ' '+user.user_second_name;
                              let Postname = user.role.role_name;
                              if (Username.length > 25) {
                                Username = Username.substr(0,23)+"..";
                              }
                              if (Postname.length > 15) {
                                Postname = Postname.substr(0,13)+"..";
                              }                        
                              return (    
                                <>
                                  {user.user_degree != 1 ?
                                  <tr key={index}>     
                                      <td>
                                          {descendingIndex}
                                      </td>
                                      <td>
                                          {user.user_img == "" || user.user_img == null ?
                                          <div style={{ alignItems:"center", textAlign:"center", backgroundColor:"#dafafe", padding:"4px", fontSize:"1.7rem",width:"70px" }}>
                                              {initials(user.user_first_name+ ' '+user.user_second_name)}
                                          </div>
                                          : 
                                          <a href={user.user_img} target='_blank'>
                                              <img src={user.user_img} style={{ height:"40px",width:"70px",objectFit:"cover" }} alt="" />
                                          </a>}
                                      </td>
                                      <td title={ user.user_first_name+ ' '+user.user_second_name } style={{ cursor:"pointer" }}>
                                          {Username}
                                      </td>
                                      <td>
                                        <span className={`${classState}`}>
                                            {contentState}
                                        </span>
                                      </td>
                                      <td style={{ fontSize:"21px" }}>
                                          {user.user_degree}
                                      </td>                              
                                      <td>
                                          {user.user_email}
                                      </td>
                                      <td style={{ display:"flex", width:"100%",height:"110px",alignItems:"center"}}>
                                        <div style={{ width:"40px" }}>
                                            <Link to={`/users/edit/${user.user_id}`} className="btn-update" title={"Modifier"}>
                                                <SquarePen size={15} color={'white'}/>
                                            </Link>  
                                        </div>                                    
                                          <div style={{ width:"40px" }}>
                                              <button className="btn-primary" onClick={() => handleModalOpen(user.user_id)} title={"voir toutes les informations de cet utilisateur"}>
                                                Voir..
                                              </button>                                                                                                                              
                                          </div>  
                                          <div style={{ width:"20px" }}></div>                                                
                                          <div style={{ width:"40px" }}>
                                              <button className="btn-state" onClick={() => ChangeStateUser(user.user_id,user.user_state)} title={"Changer l'etat de cet utilisateur"}>
                                                <ArrowLeftRight size={15} color={'black'}/>
                                              </button>                                             
                                          </div>                                   
                                      </td>                         
                                  </tr> : null }
                                </>
                              );
                            })}                         
                          </tbody>
                      </table> 
                      <div className="container-pagination">
                        <button className="button-pagination" id="startBtn" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
                          <ChevronsLeft color='grey' />
                        </button>
                        
                        <button className="button-pagination prevNext" id="prev" disabled={currentPage === 1} onClick={handlePrevPage}>
                            <ChevronLeft color='grey' />
                        </button>

                        <div className="links-pagination">
                          {[...Array(totalPages)].map((_, pageIndex) => (
                            <a key={pageIndex} className={`link-pagination ${currentPage === pageIndex + 1 ? 'active' : ''}`} onClick={() => goToPage(pageIndex + 1)}>
                              {pageIndex + 1}
                            </a>
                          ))}
                        </div>

                        <button className="button-pagination prevNext" id="next" disabled={currentPage === totalPages} onClick={handleNextPage}>
                          <ChevronRight color='grey' />
                        </button>

                        <button className="button-pagination" id="endBtn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
                          <ChevronsRight color='grey' />
                        </button>
                      </div>
                    </div>          
                  </>: 
                  <EmptyFetch onRetry={getUsers} title={'Aucune Resultat'} />
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
  
  