import React, { useEffect, useMemo, useState } from 'react'
import AppLayout from '@layouts/appLayout'
import { ArrowLeftRight, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Image, RefreshCw, SquarePen, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '@components/header'
import axiosClient from "@/axios-client";
import Swal from "sweetalert2";
import ConnectionError from '@components/errorConnection'
import EmptyFetch from '@components/Empty'

export default function Statistics() {

    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0"); // Mois de 0 à 11
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

  const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(false);

  const [products, setProducts] = useState([]);

  const [filteredProducts, setFilteredProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [errorConnection, setErrorConnection] = useState(false);

  const [startDate, setStartDate] = useState(getCurrentDateTime());

  const [endDate, setEndDate] = useState(getCurrentDateTime());

  const [message, setMessage] = useState('');

  useEffect(() => {
    const filtered = products.filter((product) =>{
        const searchString = `${(product.name ?? '').toLowerCase()} ${(product.reference ?? '').toLowerCase()}`;
        return searchString.includes(searchTerm.toLowerCase());
    });
    setFilteredProducts(filtered);
  }, [products, searchTerm]);


  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    getProducts("","");
  }, []);

  const getProductsaa = async () => {
    setLoadingSkeletonButton(true);
    axiosClient.get('/products')
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

  const getProducts = async (startDate = '', endDate = '') => {
    if (startDate === '' || startDate === undefined) {
      startDate = formattedDate;
    }
    if (endDate === '' || endDate === undefined) {
      endDate = formattedDate;
    }
    setLoadingSkeletonButton(true);
    let data = {start_date : startDate, end_date : endDate};
    await axiosClient.post('/most-sold-products',data).then(({data})  => {
      let list = data.data;
      setProducts(list);
      setTotalPages(Math.ceil(data.data.length / productsPerPage));
      setLoadingSkeletonButton(false);
      setErrorConnection(false);
    }).catch(err => {
      setLoadingSkeletonButton(false);
      setErrorConnection(true);
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(140);
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

  const formatDisplayDate = (datetime) => datetime.replace("T", " ");

  const handleFetchProductDate = async(e) => {
    e.preventDefault();
    if (startDate === '') {
      return;
    } 
    if (endDate === '') {
      return;
    }

    let message = formatDisplayDate(startDate) + ' à ' + formatDisplayDate(endDate);
    if (startDate == formattedDate &&  endDate == formattedDate) {
      setMessage('');
      setStartDate(startDate);
      setEndDate(endDate);
    }else{
      setMessage(message);
      setStartDate(startDate);
      setEndDate(endDate);
    }
    getProducts(startDate,endDate)
  }
  
  return (
    <AppLayout onSearch={handleSearch}>
      <div className="content-wrapper mt-10 dashboard-page-theme">
        <Header title={'Statistiques de Vente'} />
        {loadingskeletonbutton ? <p className="text-center"><span className="loader"></span></p> :
          <>
            {errorConnection ? 
                <ConnectionError onRetry={getProducts} /> :
                <>
                    <div className="dashboard-filters-row">
                      <form action="" method="post" className="dashboard-date-filter-form">
                        <label className="dashboard-date-group">
                          <span>Du</span>
                          <input
                            type="datetime-local"
                            value={startDate}
                            onChange={(event) => setStartDate(event.target.value)}
                          />
                        </label>

                        <label className="dashboard-date-group">
                          <span>Au</span>
                          <input
                            type="datetime-local"
                            value={endDate}
                            onChange={(event) => setEndDate(event.target.value)}
                          />
                        </label>

                        <button
                          className="dashboard-filter-btn"
                          onClick={loadingskeletonbutton ? null : handleFetchProductDate}
                          type="submit"
                        >
                          Filtrer
                        </button>
                      </form>

                      <button
                        className="dashboard-refresh-btn"
                        title='Actualiser'
                        onClick={(e) => { e.preventDefault(); getProducts(startDate, endDate); }}
                      >
                        <span>{message === '' ? "Aujourd'hui" : message}</span>
                        <RefreshCw size={18} />
                      </button>
                    </div>

                    <div style={{ height:"14px" }}></div>                
                    {filteredProducts.length > 0 ?
                        <div className="dashboard-table-wrap" style={{ overflowY : "scroll", scrollBehavior: "inherit" }}>
                          <>
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
                                <table id="customers" className="dashboard-orders-table">
                                  <thead>
                                      <tr>
                                          <th style={{ borderTopLeftRadius:"5px",borderBottomLeftRadius:"5px" }}>#</th>
                                          <th>Reference</th>
                                          <th>Nom</th>
                                          <th>Quantité Vendu</th>
                                          <th>Prix</th>
                                          <th style={{ borderTopRightRadius:"5px",borderBottomRightRadius:"5px" }}>Commandes</th>
                                      </tr>                
                                  </thead>
                                  <tbody>
                                  {currentProducts && currentProducts.map((product,index) => {                               
                                      const descendingIndex = products.length - index - (currentPage - 1) * productsPerPage;
                                      return (    
                                          <tr key={index}>
                                              <td>
                                                  {!product.picture ?
                                                  <div style={{ alignItems:"center", textAlign:"center", backgroundColor:"#dafafe", padding:"4px", fontSize:"1.7rem",width:"70px" }}>
                                                      <Image />
                                                  </div>
                                                  :
                                                  <a href={product.picture} target='_blank'>
                                                      <img src={product.picture} style={{ height:"40px",width:"70px",objectFit:"cover" }} alt="" />
                                                  </a>}
                                              </td>
                                              <td> {product.reference} </td>
                                              <td> {product.name} </td>
                                              <td className='font-bold txt-17 text-primary' style={{ fontSize:"20px" }}> {product.totalQuantity} </td>
                                              <td className='font-bold txt-17'> {product.sale_price} XAF </td>
                                              <td className='font-bold txt-17 text-primary' style={{ fontSize:"20px" }}> {product.ordersCount} </td>                                                                                                                    
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
                          </> 
                      </div>
                      :
                      <EmptyFetch onRetry={getProducts("","")} title={'Aucun Produit'} />
                    }
                </>   
             }      
          </>
        }             
      </div>
    </AppLayout>
  )
}
