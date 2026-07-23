import React, { useEffect, useState } from 'react'
import AppLayout from '@layouts/appLayout'
import { ArrowLeftRight, Plus, SquarePen, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '@components/header'
import axiosClient from "@/axios-client";
import Swal from "sweetalert2";
import ConnectionError from '@components/errorConnection'
import EmptyFetch from '@components/Empty'

export default function Category() {

    const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(false);

    const [categories, setCategories] = useState([]);
  
    const [filteredCategories, setFilteredCategories] = useState([]);
  
    const [searchTerm, setSearchTerm] = useState('');

    const [errorConnection, setErrorConnection] = useState(false);

    useEffect(() => {
      const filtered = categories.filter((category) =>{
        const searchString = `${category.category_name.toLowerCase()} ${category.category_description.toLowerCase()}`;
        return searchString.includes(searchTerm.toLowerCase());
      });
      setFilteredCategories(filtered);
    }, [categories, searchTerm]);
  
    const handleSearch = (term) => {
      setSearchTerm(term);
    };
  
    useEffect(() => {
      getCategories();
    }, []);
  
    const getCategories = async () => {
      setLoadingSkeletonButton(true);
      axiosClient.get('/categories').then( ({data})=> {
        setCategories(data.data);
        setLoadingSkeletonButton(false);
        setErrorConnection(false);
      }).catch(err => {
        setErrorConnection(true);
        setLoadingSkeletonButton(false);
      });
    };
  
    const handleDelete = async(id) => {
      Swal.fire({
        title: 'Suppression', text: 'Voulez-vous supprimer cette catégorie ?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#10518E', cancelButtonColor: '#d33', confirmButtonText: 'Supprimer', cancelButtonText: 'Fermer'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const formData = new FormData();
          formData.append('_method', 'DELETE');
          axiosClient.post(`/category/${id}`,formData).then( () => {
            Swal.fire({position: 'top-right',icon: 'success',title: 'Succès!',text: 'Catégorie supprimée avec succès',showConfirmButton: true,confirmButtonColor: '#10518E'});
            getCategories()
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
  
  return (
    <AppLayout onSearch={handleSearch}>
      <div className="content-wrapper mt-10 dashboard-page-theme">
        <Header title={'Toutes les Catégories'} />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
          <Link
            to="/category/new"
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '9px 18px', borderRadius: '8px',
              border: 'none', backgroundColor: '#10518E',
              color: '#fff', fontWeight: '600', fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            <Plus size={16} color='white' /> Nouvelle catégorie
          </Link>
        </div>

        {loadingskeletonbutton ? <p className="text-center"><span className="loader"></span></p> :
          <>
            {errorConnection ? 
              <ConnectionError onRetry={getCategories} /> :
              <>
                {filteredCategories.length > 0 ?
                  <div className="dashboard-table-wrap">
                    <table id="customers" className="dashboard-orders-table">
                      <thead>
                          <tr>
                              <th style={{ borderTopLeftRadius:"5px",borderBottomLeftRadius:"5px" }}>#</th>
                              <th>Nom</th>
                              <th>Description</th>
                              <th>Modifiée le</th>
                              <th style={{ borderTopRightRadius:"5px",borderBottomRightRadius:"5px" }}>Actions</th>
                          </tr>                
                      </thead>
                      <tbody>
                        {filteredCategories && filteredCategories.map((category,index) => {                               
                            return (    
                                <tr key={index}>
                                    <td> {category.category_id} </td>
                                    <td> {category.category_name} </td>   
                                    <td> {category.category_description} </td>   
                                    <td> {category.category_updated_at} </td>                                        
                                    <td style={{ display:"flex", width:"100%",height:"70px",alignItems:"center" }}>
                                      <div style={{ width:"40px" }}>
                                        <Link to={`/category/edit/${category.category_id}`} className="btn-update" title={"Modifier la catégorie"}>
                                          <SquarePen size={15} color={'white'}/>
                                        </Link>  
                                      </div>
                                      <div style={{ width:"40px" }}>
                                        <button className="btn-delete" onClick={() => handleDelete(category.category_id)} title={"Supprimer la catégorie"}>
                                          <Trash2 size={15} color={'white'}/>
                                        </button> 
                                      </div>                                                                                     
                                    </td>                         
                                </tr>
                            );
                        })}
                      </tbody>
                    </table>
                  </div> : 
                  <EmptyFetch onRetry={getCategories} title={'Aucun Catégorie'} />
                }
              </> 
            }
          </>
        }       
      </div>
    </AppLayout>
  )
}
