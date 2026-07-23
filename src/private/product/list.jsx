import React, { useContext, useEffect, useMemo, useState } from 'react'
import AppLayout from '@layouts/appLayout'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, Image, Plus, Printer, SquarePen, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '@components/header'
import axiosClient from "@/axios-client";
import Swal from "sweetalert2";
import ConnectionError from '@components/errorConnection'
import EmptyFetch from '@components/Empty'
import PrintProducts from '../print/product/products'
import { AuthContext } from '@context/AuthContext';
import { getProductLots, formatDateDisplay, formatLotDisplay, isProductExpired, isExpiringSoon } from '@services/productHelpers';

export default function Products() {

  const { currentUser } = useContext(AuthContext);

  const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(true);

  const [products, setProducts] = useState([]);

  const [filteredProducts, setFilteredProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [errorConnection, setErrorConnection] = useState(false);

  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: '',
    stockStatus: 'all',
    priceRange: {
      min: '',
      max: ''
    },
    source: '',
    sortBy: 'none'
  });

  const [categories, setCategories] = useState([]);
  
  const [sources, setSources] = useState([]);

 useEffect(() => {
    let filtered = products.filter((product) => {
    const searchString = `${product.name || ''} ${product.reference || ''}`.toLowerCase();
        return searchString.includes(searchTerm.toLowerCase());
    });

    // Appliquer les filtres
    filtered = applyFilters(filtered);
    setFilteredProducts(filtered);
  }, [products, searchTerm, filters]);

  const applyFilters = (productsList) => {
    const filteredList = productsList.filter(product => {
      // Filtre par catégorie
      if (filters.category && product.category?.category_name !== filters.category) {
        return false;
      }

      // Filtre par état du stock
      if (filters.stockStatus === 'inStock'      && product.quantity <= 0)                  return false;
      if (filters.stockStatus === 'outOfStock'   && product.quantity > 0)                   return false;
      if (filters.stockStatus === 'lowStock'     && product.quantity > 5)                   return false;
      if (filters.stockStatus === 'expired'      && !productHasExpiredLot(product))         return false;
      if (filters.stockStatus === 'expiringSoon' && !productHasExpiringSoonLot(product))    return false;

      // Filtre par gamme de prix
      if (filters.priceRange.min && Number(product.sale_price) < parseFloat(filters.priceRange.min)) {
        return false;
      }
      if (filters.priceRange.max && Number(product.sale_price) > parseFloat(filters.priceRange.max)) {
        return false;
      }

      // Filtre par source
      if (filters.source && product.source !== filters.source) {
        return false;
      }

      return true;
    });

    if (filters.sortBy === 'referenceAsc') {
      return [...filteredList].sort((a, b) => (a.reference || '').localeCompare(b.reference || '', 'fr', { sensitivity: 'base' }));
    }

    if (filters.sortBy === 'referenceDesc') {
      return [...filteredList].sort((a, b) => (b.reference || '').localeCompare(a.reference || '', 'fr', { sensitivity: 'base' }));
    }

    if (filters.sortBy === 'nameAsc') {
      return [...filteredList].sort((a, b) => (a.name || '').localeCompare(b.name || '', 'fr', { sensitivity: 'base' }));
    }

    if (filters.sortBy === 'nameDesc') {
      return [...filteredList].sort((a, b) => (b.name || '').localeCompare(a.name || '', 'fr', { sensitivity: 'base' }));
    }

    return filteredList;
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    setLoadingSkeletonButton(true);
    axiosClient.get('/mostsoldproducts')
    .then(({ data }) => {
      console.log(data.data)
      setProducts(data.data);
      setTotalPages(Math.ceil(data.data.length / productsPerPage));
      
      // Extraire les catégories et sources uniques avec vérifications de sécurité
      const uniqueCategories = [...new Set(
        data.data
          .filter(product => product.category && product.category.category_name)
          .map(product => product.category.category_name)
      )];
      const uniqueSources = [...new Set(
        data.data
          .filter(product => product.source)
          .map(product => product.source)
      )];
      setCategories(uniqueCategories);
      setSources(uniqueSources);
      
      setLoadingSkeletonButton(false);
      setErrorConnection(false);
    })
    .catch(err => {
      setLoadingSkeletonButton(false);
      setErrorConnection(true);
    });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1); // Reset à la première page
  };

  const handlePriceRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value
      }
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      stockStatus: 'all',
      priceRange: {
        min: '',
        max: ''
      },
      source: '',
      sortBy: 'none'
    });
    setCurrentPage(1);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.stockStatus !== 'all') count++;
    if (filters.priceRange.min || filters.priceRange.max) count++;
    if (filters.source) count++;
    if (filters.sortBy && filters.sortBy !== 'none') count++;
    return count;
  };

  const handleDelete = async(id) => {
    Swal.fire({
      title: 'Suppression', text: 'Voulez-vous supprimer ce produit ?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#10518E', cancelButtonColor: '#d33', confirmButtonText: 'Supprimer', cancelButtonText: 'Fermer'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('_method', 'DELETE');
        axiosClient.post(`/product/${id}`,formData).then( () => {
          Swal.fire({position: 'top-right',icon: 'success',title: 'Thanks you!',text: 'produit supprimée avec succès',showConfirmButton: true,confirmButtonColor: '#10518E'});
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
  const [productsPerPage] = useState(70);
  const [totalPages, setTotalPages] = useState(1);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

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

  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrintClickProducts = () => {
    setIsPrinting(true);
  };

  const handleBackClickProducts = () => {
    setIsPrinting(false);
  };

  const productHasExpiredLot = (product) => {
    const lots = getProductLots(product);
    if (lots.length > 0) return lots.some(l => isProductExpired(l.expiry_date));
    return isProductExpired(product.expiry_date);
  };

  const productHasExpiringSoonLot = (product) => {
    const lots = getProductLots(product);
    if (lots.length > 0) return lots.some(l => isExpiringSoon(l.expiry_date));
    return isExpiringSoon(product.expiry_date);
  };

  // Helper to render product lots information
  const renderProductLots = (product) => {
    const lots = getProductLots(product);
    if (!lots || lots.length === 0) {
      return <span style={{ color: '#999', fontSize: '12px' }}>Aucun lot</span>;
    }
    
    return (
      <div style={{ fontSize: '12px', maxWidth: '300px' }}>
        {lots.map((lot, idx) => (
          <div key={idx} style={{ 
            marginBottom: idx < lots.length - 1 ? '5px' : '0',
            padding: '4px',
            backgroundColor: '#f0f0f0',
            borderRadius: '3px'
          }}>
            <strong>{lot.batch_number}</strong> 
            <br />
            Exp: {formatDateDisplay(lot.expiry_date)} | Qte: {lot.available_quantity}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <>
      {isPrinting ? (
        <PrintProducts products={filteredProducts} onBack={handleBackClickProducts} titled={'Etat des Produits en Stock'} />
      ) :  (  
      <AppLayout onSearch={handleSearch}>
        {loadingskeletonbutton ? <div className="content-wrapper mt-10 dashboard-page-theme"><br /> <p className="text-center"><span className="loader"></span></p> </div> :
          <>
            {errorConnection ? <ConnectionError onRetry={getProducts} /> :
              <div className="content-wrapper mt-10 dashboard-page-theme">
                <Header title={`Tous les Produits (${filteredProducts.length})`} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '5px', 
                        padding: '8px 16px', 
                        border: '1px solid #10518E', 
                        backgroundColor: showFilters ? '#10518E' : 'white',
                        color: showFilters ? 'white' : '#10518E',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      <Filter size={16} color='white' />
                      Filtres {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
                    </button>
                    
                    {getActiveFiltersCount() > 0 && (
                      <button 
                        onClick={clearFilters}
                        style={{ 
                          padding: '8px 16px', 
                          border: '1px solid #d33', 
                          backgroundColor: 'white',
                          color: '#d33',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Effacer les filtres
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {filteredProducts.length > 0 && (
                      <a title={'Imprimer Le Resultat'} style={{ cursor:"pointer" }} onClick={(e) => { e.preventDefault(); handlePrintClickProducts(); }}>
                        <Printer size={25} color={'#08447c'}/>
                      </a>
                    )}
                    {(currentUser.user_role === "admin" || currentUser.degree == "1") && (
                      <Link
                        to="/product/new"
                        style={{
                          display: 'flex', alignItems: 'center', gap: '7px',
                          padding: '9px 18px', borderRadius: '8px',
                          border: 'none', backgroundColor: '#10518E',
                          color: '#fff', fontWeight: '600', fontSize: '14px',
                          textDecoration: 'none',
                        }}
                      >
                        <Plus size={16} color='white' /> Nouveau produit
                      </Link>
                    )}
                  </div>
                </div>

                {/* Panneau de filtres */}
                {showFilters && (
                  <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '20px', 
                    borderRadius: '8px', 
                    marginBottom: '20px',
                    border: '1px solid #e9ecef'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                      
                      {/* Filtre par catégorie */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                          Catégorie
                        </label>
                        <select 
                          value={filters.category}
                          onChange={(e) => handleFilterChange('category', e.target.value)}
                          style={{ 
                            width: '100%', 
                            padding: '8px', 
                            borderRadius: '4px', 
                            border: '1px solid #ccc',
                            fontSize: '14px'
                          }}
                        >
                          <option value="">Toutes les catégories</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>

                      {/* Filtre par état du stock */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                          État du stock
                        </label>
                        <select 
                          value={filters.stockStatus}
                          onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
                          style={{ 
                            width: '100%', 
                            padding: '8px', 
                            borderRadius: '4px', 
                            border: '1px solid #ccc',
                            fontSize: '14px'
                          }}
                        >
                          <option value="all">Tous</option>
                          <option value="inStock">En stock</option>
                          <option value="lowStock">Stock faible (≤5)</option>
                          <option value="outOfStock">Rupture de stock</option>
                          <option value="expired">Périmés</option>
                          <option value="expiringSoon">Bientôt périmés (30j)</option>
                        </select>
                      </div>

                      {/* Filtre par gamme de prix */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                          Gamme de prix (XAF)
                        </label>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <input 
                            type="number"
                            placeholder="Min"
                            value={filters.priceRange.min}
                            onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                            style={{ 
                              flex: 1, 
                              padding: '8px', 
                              borderRadius: '4px', 
                              border: '1px solid #ccc',
                              fontSize: '14px'
                            }}
                          />
                          <input 
                            type="number"
                            placeholder="Max"
                            value={filters.priceRange.max}
                            onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                            style={{ 
                              flex: 1, 
                              padding: '8px', 
                              borderRadius: '4px', 
                              border: '1px solid #ccc',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                      </div>

                      {/* Filtre par source */}
                      <div  style={{ display:"none" }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                          Source
                        </label>
                        <select 
                          value={filters.source}
                          onChange={(e) => handleFilterChange('source', e.target.value)}
                          style={{ 
                            width: '100%', 
                            padding: '8px', 
                            borderRadius: '4px', 
                            border: '1px solid #ccc',
                            fontSize: '14px'
                          }}
                        >
                          <option value="">Toutes les sources</option>
                          {sources.map(source => (
                            <option key={source} value={source}>{source}</option>
                          ))}
                        </select>
                      </div>

                      {/* Tri alphabetique */}
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                          Tri alphabetique
                        </label>
                        <select
                          value={filters.sortBy}
                          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            fontSize: '14px'
                          }}
                        >
                          <option value="none">Aucun tri</option>
                          <option value="referenceAsc">Reference: A - Z</option>
                          <option value="referenceDesc">Reference: Z - A</option>
                          <option value="nameAsc">Nom: A - Z</option>
                          <option value="nameDesc">Nom: Z - A</option>
                        </select>
                      </div>
                      
                    </div>
                  </div>
                )}
                <div style={{ height:"44px" }}></div>
                <>
                  {filteredProducts.length > 0 && !loadingskeletonbutton ?
                    <>
                        <div className="dashboard-table-wrap" style={{ overflowY : "scroll", scrollBehavior: "inherit" }}>
                            <table id="customers" className="dashboard-orders-table">
                              <thead>
                                  <tr>
                                      <th style={{ borderTopLeftRadius:"5px",borderBottomLeftRadius:"5px" }}>#</th>
                                      <th>Reference</th>
                                      <th>Nom</th>
                                      <th>Quantité</th>
                                      <th>Lots</th>
                                      <th>Catégorie</th>
                                      <th>Prix</th>
                                      {/* <th>Source</th> */}
                                      {currentUser.user_role === "admin" || currentUser.degree == "1" ?
                                      <th style={{ borderTopRightRadius:"5px",borderBottomRightRadius:"5px" }}>Actions</th>
                                      : null }
                                  </tr>                
                              </thead>
                              <tbody>
                              {currentProducts && currentProducts.map((product,index) => {
                                  const isExpired  = productHasExpiredLot(product);
                                  const isExpiring = !isExpired && productHasExpiringSoonLot(product);
                                  const rowStyle   = isExpired
                                    ? { backgroundColor:'#fff1f1', borderLeft:'4px solid #dc2626' }
                                    : isExpiring
                                    ? { backgroundColor:'#fffbeb', borderLeft:'4px solid #f59e0b' }
                                    : {};
                                  return (
                                    <tr key={product.id || index} style={rowStyle}>
                                          <td>
                                        {product.picture == "" || product.picture == null ?
                                              <div style={{ alignItems:"center", textAlign:"center", backgroundColor:"#dafafe", padding:"4px", fontSize:"1.7rem",width:"70px" }}>
                                                  <Image />
                                              </div>
                                              :
                                        <a href={product.picture} target='_blank' rel="noreferrer">
                                          <img src={product.picture} style={{ height:"40px",width:"70px",objectFit:"cover" }} alt="" />
                                              </a>}
                                          </td>
                                      <td> {product.reference} </td>
                                      <td>
                                        {product.name}
                                        {isExpired && (
                                          <span style={{ marginLeft:'8px', display:'inline-block', padding:'2px 8px', borderRadius:'12px', fontSize:'11px', fontWeight:'700', backgroundColor:'#dc2626', color:'#fff' }}>
                                            Périmé
                                          </span>
                                        )}
                                        {isExpiring && (
                                          <span style={{ marginLeft:'8px', display:'inline-block', padding:'2px 8px', borderRadius:'12px', fontSize:'11px', fontWeight:'700', backgroundColor:'#f59e0b', color:'#fff' }}>
                                            Expire bientôt
                                          </span>
                                        )}
                                      </td>
                                      {product.quantity <= 0 ?
                                      <td className='font-bold txt-17' style={{ color:"red" }}> {product.quantity} </td>     
                                          :
                                      <td className='font-bold txt-17'> {product.quantity} </td>                                                   
                                          }
                                      <td>
                                        {renderProductLots(product)}
                                      </td>                                                 
                                      <td> {product.category?.category_name || '-'} </td>      
                                      <td className='font-bold txt-17'> {product.sale_price} XAF </td>                                       
                                      {/* <td> {product.source} </td> */}
                                          {currentUser.user_role === "admin" || currentUser.degree == "1" ?
                                          <td style={{ display:"flex", width:"100%",height:"70px",alignItems:"center" }}>
                                              <div style={{ width:"40px" }}>
                                        <Link to={`/product/edit/${product.id}`} className="btn-update" title={"Modifier"}>
                                                      <SquarePen size={15} color={'white'}/>
                                                  </Link>  
                                              </div>
                                              <div style={{ width:"40px" }}>
                                        <button className="btn-delete" onClick={() => handleDelete(product.id)} title={"Supprimer"}>
                                                      <Trash2 size={15} color={'white'}/>
                                                  </button> 
                                              </div>                                                                                     
                                          </td> : null }                         
                                      </tr>
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
                    </> :
                    <EmptyFetch onRetry={getProducts} title={'Aucun enregistement trouvé'} />
                  }
                </>   
              </div>
            } 
          </>
        }
      </AppLayout>
      )}
    </>
  )
}
