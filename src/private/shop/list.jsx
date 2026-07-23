import React, { useEffect, useState } from 'react'
import AppLayout from '@layouts/appLayout'
import { ArrowLeftRight, SquarePen, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '@components/header'
import axiosClient from "@/axios-client";
import Swal from "sweetalert2";
import ConnectionError from '@components/errorConnection'
import EmptyFetch from '@components/Empty'

export default function Shops() {

  const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(false);

  const [shops, setShops] = useState([]);

  const [filteredShops, setFilteredShops] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [errorConnection, setErrorConnection] = useState(false);

  useEffect(() => {
    const filtered = shops.filter((shop) =>{
        const searchString = `${shop.name.toLowerCase()} ${shop.address.toLowerCase()} ${shop.phone.toLowerCase()}`;
        return searchString.includes(searchTerm.toLowerCase());
    });
    setFilteredShops(filtered);
  }, [shops, searchTerm]);


  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    getShops();
  }, []);

  const getShops = async () => {
    setLoadingSkeletonButton(true);
    axiosClient.get('/shops')
    .then(({ data }) => {
      setShops(data.data);
      setTotalPages(Math.ceil(data.data.length / shopsPerPage));
      setLoadingSkeletonButton(false);
      setErrorConnection(false);
    })
    .catch(err => {
      setLoadingSkeletonButton(false);
      setErrorConnection(true);
    });
  };

  const handleDelete = async(id) => {
    Swal.fire({
      title: 'Suppression', text: 'Voulez-vous supprimer ce produit dans toutes les boutiques ?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#10518E', cancelButtonColor: '#d33', confirmButtonText: 'Supprimer', cancelButtonText: 'Fermer'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('_method', 'DELETE');
        axiosClient.post(`/shop/${id}`,formData).then( () => {
          Swal.fire({position: 'top-right',icon: 'success',title: 'Thanks you!',text: 'produit supprimée avec succès',showConfirmButton: true,confirmButtonColor: '#10518E'});
          getShops()
        }).catch(err => {
          const response = err.response;
          if (response.data.error) {
            Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: `Impossible de supprimer ce produit` ,showConfirmButton: true,confirmButtonColor: '#10518E'})
          }else{
            Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: "une errreur s'est produite lors de l'execution, Verifier votre Connexion Internet" ,showConfirmButton: true,confirmButtonColor: '#10518E'})
          }
        });
      }
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [shopsPerPage] = useState(13);
  const [totalPages, setTotalPages] = useState(1);
  const indexOfLastShop = currentPage * shopsPerPage;
  const indexOfFirstShop = indexOfLastShop - shopsPerPage;
  const currentShops = filteredShops.slice(indexOfFirstShop, indexOfLastShop);

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
    <AppLayout onSearch={handleSearch}>
      <div class="content-wrapper mt-10">
        <Header title={'Toutes les Boutiques'} />
        {loadingskeletonbutton ? <p className="text-center" style={{ textAlign:"center" }}> <i class="fa fa-refresh fa-spin text-3xl mr-2 text-black"></i> </p> :
          <>
            {errorConnection ? 
                <ConnectionError onRetry={getShops} /> :
                <>
                    {filteredShops.length > 0 ?
                        <>
                            <table id="customers">
                                <thead>
                                    <tr>
                                        <th style={{ borderTopLeftRadius:"5px",borderBottomLeftRadius:"5px" }}>#</th>
                                        <th>Nom</th>
                                        <th>Adresse</th>
                                        <th>Téléphone</th>
                                        <th>Modifiée le</th>
                                        <th style={{ borderTopRightRadius:"5px",borderBottomRightRadius:"5px" }}>Actions</th>
                                    </tr>                
                                </thead>
                                <tbody>
                                {currentShops && currentShops.map((shop,index) => {                               
                                    const descendingIndex = shops.length - index - (currentPage - 1) * shopsPerPage;
                                    return (    
                                        <tr key={index}>
                                            <td> 
                                                {shop.img == "" || shop.img == null ?
                                                <div style={{ alignItems:"center", textAlign:"center", backgroundColor:"#dafafe", padding:"4px", fontSize:"1.7rem",width:"70px" }}>
                                                    <i class="fa fa-image" style={{color:"#A8B2A8FF"}}></i>
                                                </div>
                                                : 
                                                <a href={shop.img} target='_blank'>
                                                    <img src={shop.img} style={{ height:"40px",width:"70px",objectFit:"cover" }} alt="" />
                                                </a>}
                                            </td>
                                            <td> {shop.name} </td>   
                                            <td> {shop.address} </td>                              
                                            <td> {shop.phone} </td>   
                                            <td> {shop.updatedAt} </td>                                       
                                            <td style={{ display:"flex", width:"100%",height:"70px",alignItems:"center" }}>
                                                <div style={{ width:"40px" }}>
                                                    <Link to={`/admin/shop/edit/${shop.id}`} class="btn-update" title={"Modifier"}>
                                                        <SquarePen size={15} color={'white'}/>
                                                    </Link>  
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
                        </> :
                        <EmptyFetch onRetry={getShops} title={'Aucune Boutique'} />
                    }
                </>   
             }      
          </>
        }             
      </div>
    </AppLayout>
  )
}
