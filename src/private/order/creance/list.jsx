import React, { useEffect, useRef, useState } from 'react'
import AppLayout from '@layouts/appLayout'
import { ArrowLeftRight, BadgeCent, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, Image, Plus, Printer, RefreshCw, SquarePen, Trash2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Header from '@components/header'
import axiosClient from "@/axios-client";
import Swal from "sweetalert2";
import CustomModal from '@components/CustomModal'
import ListileUser from '@components/user/ListTile'
import ConnectionError from '@components/errorConnection'
import EmptyFetch from '@components/Empty'
import { getCurrentShopFromLocalStorage } from '@local/Shop.js';
import Alert from '@components/Alert';
import PrintOrder from '@private/print/order/order'
import PrintOrders from '@private/print/order/orders'
import { axiosClientAppart } from '../../../axios-client'

export default function Creance() {

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const getMinuteDifference = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffInMs = Math.abs(d2 - d1);
    return Math.floor(diffInMs / (1000 * 60));
  };

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

  // const formattedDateTimeDay = formatDate(new Date());

  const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(true);

  const [orders, setOrders] = useState([]);

  const [getinstitution, setGetInstitution] = useState({});

  const [users, setUsers] = useState([]);

  const [getorder, setGetOrder] = useState({});

  const [getuser, setGetUser] = useState({});

  const [payments, setPayments] = useState([]);

  const [loadingskeletonbuttonmodal, setLoadingSkeletonButtonModal] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [showModalPayment, setShowModalPayment] = useState(false);

  const [filteredOrders, setFilteredOrders] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [amountTotal, setAmountTotal] = useState(0);

  const [startDate, setStartDate] = useState(getCurrentDateTime());

  const [endDate, setEndDate] = useState(getCurrentDateTime());

  const [showModalReturn, setShowModalReturn] = useState(false);

  const [returns, setReturns] = useState([]);

  const [message, setMessage] = useState('');

  const [errorConnection, setErrorConnection] = useState(false);

  const [errors,setErrors] = useState({});

  const [success,setSucces] = useState("");

  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);

  useEffect(() => {
    const filtered = orders.filter((order) =>{
        const searchString = `${order.order_reference.toLowerCase()} ${order.order_titled.toLowerCase()} ${order.order_created_at.toLowerCase()}`;
        return searchString.includes(searchTerm.toLowerCase());
    });
    setFilteredOrders(filtered);
  }, [orders, searchTerm]);


  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalOpen = async (order) => {
    setShowModal(true);
    setGetOrder(order);
    setGetUser(order.user);
  }

  const handleModalClosePayment = () => {
    setShowModalPayment(false);
    setErrors({});
  };

  const handleModalCloseReturn = () => {
    setShowModalReturn(false);
    setErrors({});
  };

  const handleModalOpenReturn = async (order) => {
    setShowModalReturn(true);
    setReturns(order.returns);
    setErrors({});
  }

  const handleModalOpenPayment = async (order) => {
    inputpayment.current = [];
    setShowModalPayment(true);
    setGetOrder(order);
    setPayments(order.payments);
    setErrors({});
    setLoadingSubmitButton(false);
  }

  useEffect(() => {
    inputpayment.current = [];
    inputorders.current = [];    
    getOrders('','');
  }, []);

  const getOrders = async (startDate = '', endDate = '') => {
    if (startDate === '' || startDate === undefined || startDate === 'undefined') {
      startDate = formattedDate;
    }
    if (endDate === '' || endDate === undefined || endDate === 'undefined') {
      endDate = formattedDate;
    }
    setLoadingSkeletonButton(true);
    let data = {start_date : startDate, end_date : endDate};
    await axiosClient.post('/orders-debt-between',data).then(({data})  => {
      let list = data.data;
      setGetInstitution(data.institution);
      setOrders(list);
      setAmountTotal(0);
      setTotalPages(Math.ceil(data.data.length / ordersPerPage));
      setLoadingSkeletonButton(false);
      setErrorConnection(false);
    }).catch(err => {
      console.log(err);
      setLoadingSkeletonButton(false);
      setErrorConnection(true);
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(40);
  const [totalPages, setTotalPages] = useState(1);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const Orders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

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

  const inputorders = useRef([]);

  const addInputsOrder = el => {
    if (el && !inputorders.current.includes(el)) {
        inputorders.current.push(el)
    }
  }

  const inputpayment = useRef([]);

  const addInputsPayment= el => {
    if (el && !inputpayment.current.includes(el)) {
        inputpayment.current.push(el)
    }
  }

  const formatDisplayDate = (datetime) => datetime.replace("T", " "); 

  const handleFetchOrderDate = async(e) => {
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
    getOrders(startDate,endDate)
  }

  const handleAddPayment = async(e) => {
    e.preventDefault();
    if (inputpayment.current[0].value.trim() === '' || inputpayment.current[0].value.trim() === '0' ) {
      Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: "Selectionner un Mode de Paiement" ,showConfirmButton: true,confirmButtonColor: '#10518E'})
      return;
    }
    setLoadingSubmitButton(true);
    let state = inputpayment.current[0].value.trim();
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('state', state);
    // axiosClientAppart.post(`/order/setstate/${getorder.order_id}`,formData)
    axiosClient.post(`/order/setstate/${getorder.order_id}`,formData).then( () => {
        inputpayment.current = [];
        axiosClient.get(`/order/${getorder.order_id}`).then(({data}) => {
          let list = data.data;
          getOrders("","");
          handleModalClosePayment();
          setLoadingSubmitButton(false);
          setGetOrder(list);
          setSelectedOrder(list);
          setIsPrinting(true);
        }).catch(err => {
            console.log(err);
            setLoadingSubmitButton(false);
            // navigate('/user-orders');
            Swal.fire({position: 'Center',icon: 'warning',title: 'Warning!',text: "Cliquez ci dessous pour imprimer la commande" ,showConfirmButton: true, confirmButtonColor: '#032546'});  
            return;
        });        
        setLoadingSubmitButton(false);
    }).catch(err => {
      const response = err.response;
      setLoadingSubmitButton(false);
      if (response.data.message) {
        Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: `${response.data.message}` ,showConfirmButton: true,confirmButtonColor: '#10518E'})
      }else{
        Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: "une errreur s'est produite lors de l'execution, Verifier votre Connexion au Reseau" ,showConfirmButton: true,confirmButtonColor: '#10518E'})
      }
    });
  }

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrintClick = (order) => {
      setSelectedOrder(order);
      setIsPrinting(true);
  };

  const handleBackClick = () => {
    setIsPrinting(false);
    setSelectedOrder(null);
  };

  const [selectedOrders, setSelectedOrders] = useState(null);
  
  const [isPrintingOrders, setIsPrintingOrders] = useState(false);

  const handlePrintClickOrders = () => {
    setSelectedOrders(filteredOrders);
    setIsPrintingOrders(true);
  };

  const handleBackClickOrders = () => {
    setIsPrintingOrders(false);
    setSelectedOrders([]);
  };

  const [refundedAmount, setRefundedAmount] = useState(0);

  const handleRefundCalculation = (e) => {
    const receivedAmount = parseFloat(e.target.value) || 0;
    const totalPrice = parseFloat(getorder.order_price);
    const refund = receivedAmount - totalPrice;
    setRefundedAmount(refund);
  };
  

  return (
    <>
        {isPrinting ? (
            <PrintOrder order={selectedOrder} onBack={handleBackClick} institution={getinstitution} label={'dette'} />
        ) : isPrintingOrders ? (
            <PrintOrders orders={filteredOrders} onBack={handleBackClickOrders} message={message} titled={'Etat de Créance'} />
        ) : (
            <AppLayout onSearch={handleSearch}>
            {loadingskeletonbutton ? <div className="content-wrapper mt-10 dashboard-page-theme"><br /> <p className="text-center"><span className="loader"></span></p> </div> :
                    <>
                        {errorConnection ? <ConnectionError onRetry={getOrders} /> :
                  <div className="content-wrapper mt-10 dashboard-page-theme">
                                <Header title={'Etat de Créance'} />

                                <p style={{ float:"right" }}>
                                  <h2 className='text-primary' style={{ fontStyle:"italic" }}>{amountTotal ? "Total : "+amountTotal+" Xaf" : "" }</h2>
                                </p><br /><br />

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
                                      onClick={loadingskeletonbutton ? null : handleFetchOrderDate}
                                      type="submit"
                                    >
                                      Filtrer
                                    </button>
                                  </form>

                                  <button
                                    className="dashboard-refresh-btn"
                                    title='Actualiser'
                                    onClick={(e) => { e.preventDefault(); getOrders(startDate,endDate); }}
                                  >
                                    <span>{message === '' ? "Hier et Aujourd'hui" : message}</span>
                                    <RefreshCw size={18} />
                                  </button>
                                </div>

                                <div style={{ height:"14px" }}></div>

                                {filteredOrders.length > 0 ?
                                    <div style={{ float:"right" }}>
                                        <a title={'Imprimer Le Resultat'} style={{ cursor:"pointer" }} onClick={(e) => { e.preventDefault(); handlePrintClickOrders(); }}>
                                            <Printer size={25} color={'#08447c'}/>  
                                        </a> 
                                    </div> :
                                null }

                                <div style={{ height:"44px" }}></div>

                                <CustomModal isOpen={showModal} onClose={handleModalClose} title={'Reference - ' + getorder.order_reference}>
                                    {loadingskeletonbuttonmodal ? <p className="text-center"><span className="loader"></span></p> :
                                        <>
                                            <ListileUser label='Effectué Par' content={(getuser?.user_first_name ?? '') + ' ' + (getuser?.user_second_name ?? '')} />
                                        </>
                                    }       
                                </CustomModal>   

                                <CustomModal isOpen={showModalPayment} onClose={handleModalClosePayment} title={'Finaliser'}>
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
                                        <p style={{ fontStyle:"italic", fontSize:"16px" }} className='text-danger'>
                                            Vous etes sur le point d'attester que vous avez percu l'argent de cette commande
                                        </p><br />                
                                        <div class="row">
                                            <div className="col-75">
                                                <label htmlFor="fname" style={{ fontWeight: "bold", fontSize: "23px" }}>
                                                    Prix Total :{" "} {parseInt(getorder.order_price, 10).toLocaleString("fr-FR")}
                                                </label>
                                            </div>
                                            <div className="col-75">
                                                <label htmlFor="fname">Montant Perçu</label>
                                                <input type="number" onInput={handleRefundCalculation} style={{ fontSize: "19px" }} /><br /> <br />
                                            </div>
                                            <div className="col-75">
                                                <label htmlFor="fname">Remboursement</label>
                                                <input type="text" value={refundedAmount.toLocaleString("fr-FR")} readOnly style={{ fontSize: "19px" }} /><br /> <br />
                                            </div>
                                            <div class="col-75">
                                                <label for="fname">Selectionner le Mode de paiement* </label>
                                                <select id="select-team-form" style={{ padding:"15px" }} ref={addInputsPayment} >
                                                    <option value={''} selected> </option>
                                                    <option value={'paid'}>Espece </option>
                                                    <option value={'paid OM'}>OM </option>
                                                    <option value={'paid MOMO'}>MOMO </option>
                                                    <option value={'paid OFFRE'}>OFFRE </option>
                                                </select> <br /><br />
                                            </div>                                                                                                                               
                                            <div class="col-75 link-login">
                                                <button type="button" class="login" onClick={loadingsubmitbutton ? null : handleAddPayment}>
                                                    {loadingsubmitbutton ? <div className="spinner"></div> : 'Payer'}
                                                </button><br />
                                            </div>                           
                                        </div>
                                    </>    
                                </CustomModal>

                                <CustomModal isOpen={showModalReturn} onClose={handleModalCloseReturn} title={'Retour en Stock'}>
                                  <div style={{ overflowY : "scroll", scrollBehavior: "inherit" }}>
                                    <table id="customers">
                                        <thead>
                                            <tr>
                                                <th style={{ borderTopLeftRadius:"5px",borderBottomLeftRadius:"5px" }}></th>
                                                <th>Produit</th>
                                                <th>Quantité</th>
                                                <th style={{ borderTopRightRadius:"5px",borderBottomRightRadius:"5px" }}>Date</th>
                                            </tr>                
                                        </thead>
                                        <tbody>
                                        {returns && returns.map((returnSale,index) => {                               
                                            return (
                                                <>
                                                  <tr>
                                                    <td>
                                                      {returnSale.product.product_picture == "" || returnSale.product.product_picture == null ?
                                                      <div style={{ alignItems:"center", textAlign:"center", backgroundColor:"#dafafe", padding:"4px", fontSize:"1.7rem",width:"70px" }}>
                                                          <Image />
                                                      </div>
                                                      : 
                                                      <a href={returnSale.product.product_picture} target='_blank'>
                                                          <img src={returnSale.product.product_picture} style={{ height:"40px",width:"70px",objectFit:"cover" }} alt="" />
                                                      </a>}                                                                      
                                                    </td>                                                            
                                                    <td>{returnSale.product.product_name}</td>
                                                    <td>{returnSale.quantity}</td>
                                                    <td>
                                                      {returnSale.created_at ? formatDisplayDate(returnSale.created_at) : "Aucune date"}
                                                    </td>
                                                  </tr>
                                                </> 
                                            );
                                        })} 
                                        </tbody>
                                    </table>
                                  </div>
                                </CustomModal>     

                                <>
                                    {filteredOrders.length > 0 ?
                                        <>
                                      <div className="dashboard-table-wrap" style={{ overflowY : "scroll", scrollBehavior: "inherit" }}>
                                        <table id="customers" className="dashboard-orders-table">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ borderTopLeftRadius:"5px",borderBottomLeftRadius:"5px" }}>Reference</th>
                                                            <th>Intitulé</th>
                                                            <th>Client</th>
                                                            <th>Montant</th>
                                                            <th>Etat</th>
                                                            <th>Modifiée le</th>
                                                            <th style={{ borderTopRightRadius:"5px",borderBottomRightRadius:"5px" }}>Actions</th>
                                                        </tr>                
                                                    </thead>
                                                    <tbody>
                                                    {Orders && Orders.map((order,index) => {                               
                                                        const descendingIndex = orders.length - index - (currentPage - 1) * ordersPerPage;
                                                        let iconComponent = null;
                                                        if (order.order_state === 'paid') {
                                                            iconComponent = (
                                                                <>
                                                                <span class="text-success">Payé</span> <i class="fa fa-check text-success" style={{ fontSize: "1rem" }} aria-hidden="true"></i>
                                                                </>
                                                            );
                                                        }
                                                        else if (order.order_state === 'paid OM') {
                                                            iconComponent = (
                                                                <>
                                                                <span class="text-success">Payé Par OM</span> <i class="fa fa-check text-success" style={{ fontSize: "1rem" }} aria-hidden="true"></i>
                                                                </>
                                                            );
                                                        }  
                                                        else if (order.order_state === 'paid MOMO') {
                                                            iconComponent = (
                                                                <>
                                                                <span class="text-success">Payé Par MOMO</span> <i class="fa fa-check text-success" style={{ fontSize: "1rem" }} aria-hidden="true"></i>
                                                                </>
                                                            );
                                                        }   
                                                        else if (order.order_state === 'paid OM ESPECE') {
                                                          iconComponent = (
                                                              <>
                                                              <span class="text-success">Payé Par OM & ESPECE</span> <i class="fa fa-check text-success" style={{ fontSize: "1rem" }} aria-hidden="true"></i>
                                                              </>
                                                          );
                                                        }                                                
                                                        else if (order.order_state === 'paid MOMO ESPECE') {
                                                          iconComponent = (
                                                              <>
                                                              <span class="text-success">Payé Par MOMO & ESPECE</span> <i class="fa fa-check text-success" style={{ fontSize: "1rem" }} aria-hidden="true"></i>
                                                              </>
                                                          );
                                                        }                                                            
                                                        else if (order.order_state === 'paid OFFRE') {
                                                            iconComponent = (
                                                                <>
                                                                    <span class="text-success">Payé Par Offre</span> <i class="fa fa-check text-success" style={{ fontSize: "1rem" }} aria-hidden="true"></i>
                                                                </>
                                                            );
                                                        }                                                           
                                                        else if (order.order_state === 'debt') {
                                                            iconComponent = (
                                                                <>
                                                                    <span class="text-danger">Dette</span> <i class="fa fa-close text-danger" style={{ fontSize: "1rem" }} aria-hidden="true"></i>
                                                                </>
                                                            )
                                                        }  
                                                        else if (order.order_state === 'unpaid and not cleared') {
                                                            iconComponent = (
                                                                <>
                                                                    <span class="text-warning">Impayé et non Déstocké</span> <i class="fa fa-close text-warning" style={{ fontSize: "1rem" }} aria-hidden="true"></i>
                                                                </>
                                                            )
                                                        }   
                                                        else if (order.order_state === 'unpaid and destocked') {
                                                            iconComponent = (
                                                              <>
                                                                <span class="text-danger">Impayé et Déstocké</span> <i class="fa fa-close text-danger" style={{ fontSize: "1rem" }} aria-hidden="true"></i>
                                                              </>
                                                            )
                                                        }                                                                                                                                                                                                                                                                                
                                                        else{
                                                            iconComponent = (
                                                                <>
                                                                <span class="text-danger">Avancé</span> <i class="fa fa-close text-danger" style={{ fontSize: "1rem" }} aria-hidden="true"></i>
                                                                </>
                                                            );                                            
                                                        }
                                                        return (
                                                            <>
                                                                <tr key={index}>
                                                                  <td className="cell-ref">
                                                                    <span className="ref">{order.order_reference}</span>
                                                                    {order.returns.length > 0 ?
                                                                      <span onClick={() => handleModalOpenReturn(order)} className="badge badge-return" title="Retour en stock enregistré">
                                                                        <svg className="badge-ic" viewBox="0 0 24 24" aria-hidden="true">
                                                                          <path d="M12 5v4.5H7.5" />
                                                                          <path d="M21 12a9 9 0 1 1-9-9" />
                                                                        </svg>
                                                                          Return Sale ({order.returns.length})
                                                                      </span>
                                                                      : null }
                                                                    </td>  
                                                                    <td> {order.order_titled} </td>   
                                                                                                                                      <td style={{ fontSize: "14px" }}>
                                                                    {order.customer?.customer_name || order.customerName || (
                                                                      <span style={{ color: "#6c757d", fontStyle: "italic" }}>
                                                                        Aucun client
                                                                      </span>
                                                                    )}
                                                                  </td>                     
                                                                    <td className='font-bold txt-17'> {order.order_price} XAF </td>        
                                                                    <td> {iconComponent} </td>    
                                                                    <td> {order.order_updated_at} </td>
                                                                    <td style={{ display:"flex", width:"100%",height:"70px",alignItems:"center" }}>
                                                                        <a onClick={(e) => { e.preventDefault(); handlePrintClick(order); }} title={'Imprimer'}>
                                                                            <Printer size={25} color={'#08447c'}/>  
                                                                        </a> 
                                                                        <div style={{ width:"10px" }}></div>
                                                                        <a onClick={() => handleModalOpen(order)} title={'Voir'}>
                                                                            <Eye size={25} color={'#08447c'}/>  
                                                                        </a>        
                                                                        <div style={{ width:"10px" }}></div>
                                                                        <a className='btn btn-success' onClick={() => handleModalOpenPayment(order)} title={"Finaliser"}>
                                                                            Payer <Printer size={17} color={'#fff'}/>  
                                                                        </a>                                                                                                                                                                                                                                                                                                                                                                              
                                                                    </td>
                                                                </tr>
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
                                        </> :
                                        <EmptyFetch onRetry={getOrders} title={'Aucun enregistement trouvé'} />
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
