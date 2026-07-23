import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import AppLayout from '@layouts/appLayout'
import { ArrowLeftRight, SquarePen, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '@components/header'
import axiosClient from "@/axios-client";
import Swal from "sweetalert2";
import ConnectionError from '@components/errorConnection'
import EmptyFetch from '@components/Empty'
import { AuthContext } from '@context/AuthContext';
import { getCurrentShopFromLocalStorage } from '@local/Shop.js';

export default function ProductShops() {

  const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(false);

  const [products, setProducts] = useState([]);

  const { currentUser, token } = useContext(AuthContext);

  const currentShop = getCurrentShopFromLocalStorage();

  const [filteredProducts, setFilteredProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [errorConnection, setErrorConnection] = useState(false);

  useEffect(() => {
    const filtered = products.filter((shopproduct) =>{
        const searchString = `${shopproduct.product.name.toLowerCase()} ${shopproduct.product.reference.toLowerCase()} ${shopproduct.product.category.name.toLowerCase()}`;
        return searchString.includes(searchTerm.toLowerCase());
    });
    setFilteredProducts(filtered);
  }, [products, searchTerm]);


  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    setLoadingSkeletonButton(true);
    axiosClient.get(`/products/shop/${currentShop.shopId}`)
    .then(({ data }) => {
      setProducts(data.data);
      setTotalPages(Math.ceil(data.data.length / productsPerPage));
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
      title: 'Suppression', text: 'Voulez-vous supprimer ce produit dans cette boutique ?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#10518E', cancelButtonColor: '#d33', confirmButtonText: 'Supprimer', cancelButtonText: 'Fermer'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('state', 'idle');
        axiosClient.post(`/product-shop/editstate/${id}`,formData).then( () => {
          Swal.fire({position: 'top-right',icon: 'success',title: 'Succès!',text: 'Produit supprimée avec succès',showConfirmButton: true,confirmButtonColor: '#10518E'});
          getProducts()
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
  const [productsPerPage] = useState(140);
  const [totalPages, setTotalPages] = useState(1);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  // const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredProducts.length / productsPerPage));
    if (currentPage > Math.ceil(filteredProducts.length / productsPerPage)) {
      setCurrentPage(1);
    }
  }, [filteredProducts, productsPerPage, currentPage]);
  
  const currentProducts = useMemo(() => {
    return filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  }, [filteredProducts, indexOfFirstProduct, indexOfLastProduct]);

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
        <Header title={'Tous les Produits de '+ currentShop.shopName} />
        {loadingskeletonbutton ? <p className="text-center" style={{ textAlign:"center" }}> <i class="fa fa-refresh fa-spin text-3xl mr-2 text-black"></i> </p> :
          <>
            {errorConnection ? 
                <ConnectionError onRetry={getProducts} /> :
                <>
                    {currentProducts.length > 0 ?
                      <div style={{ overflowY : "scroll", scrollBehavior: "inherit" }}>
                          <>
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
                              <table id="customers">
                                  <thead>
                                      <tr>
                                          <th style={{ borderTopLeftRadius:"5px",borderBottomLeftRadius:"5px" }}>#</th>
                                          <th>Reference</th>
                                          <th>Nom</th>
                                          <th>Prix</th>
                                          <th>Stock</th>
                                          <th>Catégorie</th>
                                          <th style={{ borderTopRightRadius:"5px",borderBottomRightRadius:"5px" }}>Actions</th>
                                      </tr>                
                                  </thead>
                                  <tbody>
                                  {currentProducts && currentProducts.map((shopproduct,index) => {                               
                                      const descendingIndex = products.length - index - (currentPage - 1) * productsPerPage;
                                      let classState = 'font-bold txt-24';
                                      if (shopproduct.quantity < 0) {
                                        classState = 'font-bold txt-24 text-primary';
                                      }
                                      return (    
                                          <tr key={index}>
                                              <td> 
                                                  {shopproduct.product.img == "" || shopproduct.product.img == null ?
                                                  <div style={{ alignItems:"center", textAlign:"center", backgroundColor:"#dafafe", padding:"4px", fontSize:"1.7rem",width:"70px" }}>
                                                      <i class="fa fa-image" style={{color:"#A8B2A8FF"}}></i>
                                                  </div>
                                                  : 
                                                  <a href={shopproduct.product.img} target='_blank'>
                                                      <img src={shopproduct.product.img} style={{ height:"40px",width:"70px",objectFit:"cover" }} alt="" />
                                                  </a>}
                                              </td>
                                              <td> {shopproduct.product.reference} </td>   
                                              <td> {shopproduct.product.name} </td>  
                                              <td> {shopproduct.price} XAF </td> 
                                              <td className={'font-bold txt-24'} style={{ color : shopproduct.quantity < 0 ? "#c42618" : "" }} > {shopproduct.quantity} </td>                                    
                                              <td> {shopproduct.product.category.name} </td>                                     
                                              <td style={{ display:"flex", width:"100%",height:"70px",alignItems:"center" }}>
                                                {currentUser.type === 'admin' || currentUser.type === 'comptable_s' ?
                                                  <div style={{ width:"40px" }}>
                                                    <Link to={`/product-shop/edit/${shopproduct.id}`} class="btn-update" title={"Modifier Prix Ou Quantité"}>
                                                      <SquarePen size={15} color={'white'}/>
                                                    </Link>
                                                  </div>
                                                : null }
                                                  <div style={{ width:"40px" }}>
                                                    <button class="btn-delete" onClick={() => handleDelete(shopproduct.id)} title={"Supprimer"}>
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
                      </div>
                      :
                      <EmptyFetch onRetry={getProducts} title={'Aucun Produit'} />
                    }
                </>   
             }      
          </>
        }             
      </div>
    </AppLayout>
  )
}
