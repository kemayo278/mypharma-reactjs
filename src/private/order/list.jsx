import React, { useEffect, useRef, useState } from 'react'
import AppLayout from '@layouts/appLayout'
import { ArrowLeftRight, BadgeCent, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, Image, Monitor, Plus, Printer, RefreshCw, SquarePen, Trash2 } from 'lucide-react'
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
import PrintRecapOrders from '@private/print/order/recap'
import { getYesterdayWithCurrentTime } from "@services/util";
import { axiosClientAppart } from '../../axios-client'
import Select from 'react-select'

export default function Orders() {

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

  const formattedDateTimeDay = formatDate(new Date());

  const {userId} = useParams();

  const [showCustomerNameField, setShowCustomerNameField] = useState(false);

  const currentShop = getCurrentShopFromLocalStorage();

  const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(true);

  const [orders, setOrders] = useState([]);

  const [customers, setCustomers] = useState([]);

  const [getinstitution, setGetInstitution] = useState({});

  const [users, setUsers] = useState([]);

  const [getorder, setGetOrder] = useState({});

  const [getuser, setGetUser] = useState({});

  const [getcustomer, setGetCustomer] = useState({});

  const [customerName, setCustomerName] = useState('');

  const [payments, setPayments] = useState([]);

  const [loadingskeletonbuttonmodal, setLoadingSkeletonButtonModal] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [showModalPayment, setShowModalPayment] = useState(false);

  const [showModalReturn, setShowModalReturn] = useState(false);

  const [returns, setReturns] = useState([]);

  const [filteredOrders, setFilteredOrders] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [amountTotal, setAmountTotal] = useState(0);

  const [startDate, setStartDate] = useState(getYesterdayWithCurrentTime());

  const [endDate, setEndDate] = useState(getCurrentDateTime());

  const [message, setMessage] = useState('');

  const [errorConnection, setErrorConnection] = useState(false);

  const [errors,setErrors] = useState({});

  const [success,setSucces] = useState("");

  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);

  const [loadingsubmitbuttonrecap, setLoadingSubmitButtonRecap] = useState(false);

    // Nouveaux states pour la modal de sélection de client
  const [showModalSelectCustomer, setShowModalSelectCustomer] = useState(false);
  const [selectedOrderForCustomer, setSelectedOrderForCustomer] = useState({});
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [loadingAssignCustomer, setLoadingAssignCustomer] = useState(false);

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
    setGetCustomer(order.customer);
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
    console.log(order)
    setCustomerName(order.customerName);
    setShowModalPayment(true);
    setGetOrder(order);
    setPayments(order.payments);
    setErrors({});
    setLoadingSubmitButton(false);
    // setShowCustomerNameField(false);
  }

  
  // Fonction pour ouvrir la modal de sélection de client
  const handleModalOpenSelectCustomer = (order) => {
    setSelectedOrderForCustomer(order);
    const existing = customers.find(c => c.id === order.customer_id);
    setSelectedCustomerId(existing
      ? { value: existing.id, label: `${existing.name}${existing.phone ? ' - ' + existing.phone : ''}` }
      : null
    );
    setShowModalSelectCustomer(true);
    setErrors({});
  };

  // Fonction pour fermer la modal de sélection de client
  const handleModalCloseSelectCustomer = () => {
    setShowModalSelectCustomer(false);
    setSelectedOrderForCustomer({});
    setSelectedCustomerId(null);
    setErrors({});
  };

  // Fonction pour assigner un client à une commande
  const handleAssignCustomer = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      Swal.fire({
        position: 'top-right',
        icon: 'error',
        title: 'Erreur!',
        text: "Veuillez sélectionner un client",
        showConfirmButton: true,
        confirmButtonColor: '#10518E'
      });
      return;
    }

    setLoadingAssignCustomer(true);
    
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('customer_id', selectedCustomerId.value);

    try {
      await axiosClient.post(`/order/assign-customer/${selectedOrderForCustomer.order_id}`, formData);
      Swal.fire({
        position: 'top-right',
        icon: 'success',
        title: 'Succès!',
        text: 'Client assigné avec succès à la commande',
        showConfirmButton: true,
        confirmButtonColor: '#10518E'
      });

      // Actualiser la liste des commandes
      getOrders('','');
      handleModalCloseSelectCustomer();
      
    } catch (err) {
      const response = err.response;
      console.log('Error response:', response);
      if (response && response.data && response.data.message) {
        Swal.fire({
          position: 'top-right',
          icon: 'error',
          title: 'Erreur!',
          text: response.data.message,
          showConfirmButton: true,
          confirmButtonColor: '#10518E'
        });
      } else {
        Swal.fire({
          position: 'top-right',
          icon: 'error',
          title: 'Erreur!',
          text: "Une erreur s'est produite lors de l'assignation du client",
          showConfirmButton: true,
          confirmButtonColor: '#10518E'
        });
      }
    } finally {
      setLoadingAssignCustomer(false);
    }
  };

  useEffect(() => {
    inputpayment.current = [];
    inputorders.current = [];    
    userId && getOrders('','');
  }, [userId]);

  useEffect(() => {
    getCustomers();
  }, []);

  const getCustomers = async () => {
    axiosClient.get(`/customers`).then(({ data }) => {
      console.log(data.data);
      setCustomers(data.data);
      setErrorConnection(false);
    })
    .catch(err => {
      setErrorConnection(true);
    });
  };

  const getOrders = async (startDate = '', endDate = '') => {
    if (startDate === '' || startDate === undefined) {
      startDate = formattedDate;
    }
    if (endDate === '' || endDate === undefined) {
      endDate = formattedDate;
    }
    setLoadingSkeletonButton(true);
    let data = {start_date : startDate, end_date : endDate, user_id : userId};
    await axiosClient.post('/orders-unpaid-dates/between',data).then(({data})  => {
      let list = data.data;
      setGetUser(data.user);
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

  const [showNameField, setShowNameField] = useState(false);

  const handleSelectChangeName = (e) => {
    const value = e.target.value;
    setShowNameField(value === 'paid OM ESPECE' || value === 'paid MOMO ESPECE');
  };

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
    const errors = {};
    if (inputpayment.current[0].value.trim() === '' || inputpayment.current[0].value.trim() === '0' ) {
      Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: "Selectionner un Mode de Paiement" ,showConfirmButton: true,confirmButtonColor: '#10518E'})
      return;
    }
    console.log(inputpayment)
    if (inputpayment.current[0].value.trim() === 'paid OM ESPECE' || inputpayment.current[0].value.trim() === 'paid MOMO ESPECE') {
      if (inputpayment.current[2].value.trim() === '' || inputpayment.current[2].value.trim() === '0') {
        errors.transfAmount = "Champs requis"
      }
      if (inputpayment.current[3].value.trim() === '' || inputpayment.current[3].value.trim() === '0') {
        errors.especeAmount = "Champs requis"
      }      
      if(inputpayment.current[3].value.trim() != '' && inputpayment.current[3].value.trim() != '0' && inputpayment.current[2].value.trim() != '' && inputpayment.current[2].value.trim() != '0'){
        let sum = parseInt(inputpayment.current[2].value.trim()) + parseInt(inputpayment.current[3].value.trim());
        if (sum !== getorder.order_price) {
          Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: "Ces montants ne correspondent pas au montant de la commande" ,showConfirmButton: true,confirmButtonColor: '#10518E'})
          return;        
        }
      }
    }
    if (Object.keys(errors).length === 0) {
      setLoadingSubmitButton(true);
      setErrors(errors)
      let state = inputpayment.current[0].value.trim();
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('state', state);
      if (!getcustomer.customerName || getcustomer.customerName === '') {
        if (inputpayment.current[1] && inputpayment.current[1].value.trim() !== '') {
          formData.append('customer_name', inputpayment.current[1].value.trim());
        }
      }      
      if (inputpayment.current[0].value.trim() === 'paid OM ESPECE' || inputpayment.current[0].value.trim() === 'paid MOMO ESPECE') {
        let amountMix = {
          transfAmount: inputpayment.current[2].value.trim(),
          especeAmount: inputpayment.current[3].value.trim(),
        }        
        formData.append('amount_mix', JSON.stringify(amountMix));
      }
      // console.log(inputpayment)
      // return
      // axiosClientAppart.post(`/order/setstate/${getorder.order_id}`,formData)
      axiosClient.post(`/order/setstate/${getorder.order_id}`,formData).then( () => {
          inputpayment.current = [];
          axiosClient.get(`/order/${getorder.order_id}`).then(({data}) => {
            let list = data.data;
            getOrders("","")
            handleModalClosePayment();
            setGetOrder(list);
            setLoadingSubmitButton(false);
            setSelectedLabel("facture");
            setSelectedOrder(list);
            setIsPrinting(true);
          }).catch(err => {
              console.log(err);
              setLoadingSubmitButton(false);
              Swal.fire({position: 'Center',icon: 'warning',title: 'Warning!',text: "Cliquez ci dessous pour imprimer la commande" ,showConfirmButton: true, confirmButtonColor: '#032546'});  
              return;
          });        
          setLoadingSubmitButton(false);
      }).catch(err => {
        const response = err.response;
        console.log(response)
        setLoadingSubmitButton(false);
        if (response.data.message) {
          Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: `${response.data.message}` ,showConfirmButton: true,confirmButtonColor: '#10518E'})
        }else{
          Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: "une errreur s'est produite lors de l'execution, Verifier votre Connexion au Reseau" ,showConfirmButton: true,confirmButtonColor: '#10518E'})
        }
        setErrors(errors)
      });
    }else{
      setErrors(errors)
      return
    }
  }

  const handleDelete = async(id,reference) => {
    Swal.fire({
      title: 'Suppression', text: 'Voulez-vous supprimer cette commande '+reference+ ' ?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#10518E', cancelButtonColor: '#d33', confirmButtonText: 'Supprimer', cancelButtonText: 'Fermer'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('_method', 'DELETE');
        // Appart
        // axiosClientAppart.post(`/order/${id}`,formData)
        axiosClient.post(`/order/${id}`,formData).then( () => {
          Swal.fire({position: 'top-right',icon: 'success',title: 'Succès!',text: 'Commande supprimée avec succès',showConfirmButton: true,confirmButtonColor: '#10518E'});
          setOrders(orders.filter(order => order.order_id !== id));
          // getOrders("","")
        }).catch(err => {
          const response = err.response;
          if (response.data.message) {
            Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: `${response.data.message}` ,showConfirmButton: true,confirmButtonColor: '#10518E'})
          }else{
            Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: "une errreur s'est produite lors de l'execution, Verifier votre Connexion au Reseau" ,showConfirmButton: true,confirmButtonColor: '#10518E'})
          }
        });     
      }
    });
  };

  const handleSetStateUnpaid = async(id,reference,order) => {
    Swal.fire({
      title: 'Tirer le Bon De Commande', text: 'Voulez-vous Déstocker cette commande '+reference+ ' ?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#10518E', cancelButtonColor: '#d33', confirmButtonText: 'Oui', cancelButtonText: 'Fermer'
    }).then(async (result) => {
      if (result.isConfirmed) {
        let state = "unpaid and destocked";
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('state', state);
        // Appart
        // axiosClientAppart.post(`/order/setstate/${id}`,formData)        
        axiosClient.post(`/order/setstate/${id}`,formData).then(({data}) => {
          getOrders("","")
          handlePrintClick(order,"bon_commande")
          console.log(order)
        }).catch(err => {
          const response = err.response;
          if (response.data.message) {
            Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: `${response.data.message}` ,showConfirmButton: true,confirmButtonColor: '#10518E'})
          }else{
            Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: "une errreur s'est produite lors de l'execution, Verifier votre Connexion au Reseau" ,showConfirmButton: true,confirmButtonColor: '#10518E'})
          }
        });
      }
    });
  };

  const handleSetStateDette = async(id,reference,order) => {
    Swal.fire({
      title: 'Créance', text: 'Voulez-vous mettre en Dette cette commande '+reference+ ' ?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#10518E', cancelButtonColor: '#d33', confirmButtonText: 'Oui', cancelButtonText: 'Fermer'
    }).then(async (result) => {
      if (result.isConfirmed) {
        let state = "debt";
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('state', state);
        // Appart
        // axiosClientAppart.post(`/order/setstate/${id}`,formData)
        axiosClient.post(`/order/setstate/${id}`,formData).then( () => {
          getOrders("","");
          handlePrintClick({ ...order, order_state: 'debt' }, "dette");
        }).catch(err => {
          const response = err.response;
          if (response.data.message) {
            Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: `${response.data.message}` ,showConfirmButton: true,confirmButtonColor: '#10518E'})
          }else{
            Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: "une errreur s'est produite lors de l'execution, Verifier votre Connexion au Reseau" ,showConfirmButton: true,confirmButtonColor: '#10518E'})
          }
        });
      }
    });
  };

  function formatSelectedOrdersToString(selectedOrders) {
    return selectedOrders.map((id) => `-${id}`).join("");
  }

  const handleRecapOrders = async(ids) => {
    Swal.fire({
      title: 'Recapitulation', text: 'Voulez-vous faire un recap ?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#10518E', cancelButtonColor: '#d33', confirmButtonText: 'Oui', cancelButtonText: 'Annulez'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadingSubmitButtonRecap(true);
        let stringIds = formatSelectedOrdersToString(ids);
        axiosClient.post(`/orders/recap`,{order_ids : stringIds}).then(({data}) => {
          getOrders("","");
          setSelectedFromRecap([]);
          handlePrintClickOrdersRecap(data);   
          setLoadingSubmitButtonRecap(false);          
        }).catch(err => {
          const response = err.response;
          setLoadingSubmitButtonRecap(false);
          setSelectedFromRecap([]);
          if (response.data.message) {
            Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: `${response.data.message}` ,showConfirmButton: true,confirmButtonColor: '#10518E'})
          }else{
            Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: "une errreur s'est produite lors de l'execution, Verifier votre Connexion au Reseau" ,showConfirmButton: true,confirmButtonColor: '#10518E'})
          }
        });
      }
    });
  };

  useEffect(() => {
    // Vérifier si la commande a un customer lié pour afficher le champ nom
    if (getorder.order_id && (!getcustomer.customer_name || getcustomer.customer_name === '')) {
      setShowCustomerNameField(true);
    } else {
      setShowCustomerNameField(false);
    }
  }, [getorder, getcustomer]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [selectedLabel, setSelectedLabel] = useState(null);

  const [selectedOrdersRecap, setSelectedOrdersRecap] = useState([]);

  const [isPrinting, setIsPrinting] = useState(false);

  const [isPrintingOrdersRecap, setIsPrintingOrdersRecap] = useState(false);

  const handlePrintClick = (order,label) => {
    setSelectedOrder(order);
    setSelectedLabel(label);
    setIsPrinting(true);
  };

  const handlePrintClickOrdersRecap = (recap) => {
    setSelectedOrdersRecap(recap);
    setIsPrintingOrdersRecap(true);
  };

  const handleBackClickOrdersRecap = () => {
    setIsPrintingOrdersRecap(false);
    setSelectedOrdersRecap([]);
  };

  const handleBackClick = () => {
    setIsPrinting(false);
    setSelectedOrder(null);
  };

  const [selectedOrders, setSelectedOrders] = useState(null);
  
  const [isPrintingOrders, setIsPrintingOrders] = useState(false);

  const handlePrintClickOrders = () => {
    setSelectedOrders(filteredOrders);
    console.log(filteredOrders)
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

  const [selectedOrdersFromRecap, setSelectedFromRecap] = useState([]);

  const handleCheckboxChange = (orderId, isChecked) => {
    if (isChecked) {
      setSelectedFromRecap((prev) => [...prev, orderId]);
    } else {
      setSelectedFromRecap((prev) => prev.filter((id) => id !== orderId));
    }
  };
  

  return (
    <>
        {isPrinting ? (
          <PrintOrder label={selectedLabel} order={selectedOrder} onBack={handleBackClick} institution={getinstitution} />
        ) : isPrintingOrders ? (
          <PrintOrders orders={filteredOrders} onBack={handleBackClickOrders} message={message} titled={'Etat des Commandes'} />
        ) : isPrintingOrdersRecap ? (
          <PrintRecapOrders institution={selectedOrdersRecap.institution} product_recap={selectedOrdersRecap.product_recap} total_amount={selectedOrdersRecap.total_amount} order_references={selectedOrdersRecap.order_references} user_names={selectedOrdersRecap.user_names} order_titled={selectedOrdersRecap.order_titled} order_date={selectedOrdersRecap.order_date} onBack={handleBackClickOrdersRecap}/>
        ) : (
            <AppLayout onSearch={handleSearch}>
                {loadingskeletonbutton ? <div class="content-wrapper mt-10"><br /> <p className="text-center"><span className="loader"></span></p> </div> :
                    <>
                        {errorConnection ? <ConnectionError onRetry={getOrders} /> :
                            
                            <div class="content-wrapper mt-10">
                                <Header title={'Toutes les Commandes'} />
                                {selectedOrdersFromRecap.length >= 2 ?
                                <p>
                                  <button onClick={() => handleRecapOrders(selectedOrdersFromRecap)} style={{ padding:"10px",color:"#094b88",fontSize:"19px",cursor:"pointer" }}>
                                    {loadingsubmitbuttonrecap ? <div className="spinner"></div> : 'Faire un Recap'}
                                  </button>
                                </p> : null }
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
                                            <ListileUser label='Effectué Par' content={getuser.user_first_name + ' '+ getuser.user_second_name} />
                                            <ListileUser label='Client ' content={getcustomer.customer_name} />
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
                                                <label for="fname">Selectionner le Mode de paiement*</label>
                                                <select id="select-team-form" style={{ padding:"15px", fontSize:"21px" }} ref={addInputsPayment} onChange={handleSelectChangeName}>
                                                  <option value={''} selected> </option>
                                                  <optgroup label="Uniforme">
                                                    <option value={'paid'}>Espèce </option>
                                                    <option value={'paid OM'}>OM </option>
                                                    <option value={'paid MOMO'}>MOMO </option>
                                                    <option value={'paid OFFRE'}>OFFRE </option>
                                                  </optgroup>
                                                  <optgroup label="Mixte">
                                                    <option value="paid OM ESPECE">OM & ESPECE</option>
                                                    <option value="paid MOMO ESPECE">MOMO & ESPECE</option>
                                                  </optgroup>
                                                </select><br /><br />                                              
                                            </div>  
                                            {showCustomerNameField && (
                                              <div className="col-75">
                                                <label htmlFor="customerName">Nom du Client (Pas Obligatoire)</label>
                                                <input 
                                                  type="text" 
                                                  ref={addInputsPayment} 
                                                  defaultValue={customerName || ''}
                                                  placeholder="Entrez le nom du client"
                                                  style={{ fontSize: "19px" }} 
                                                />
                                                {errors.customerName && <span className="text-danger">{errors.customerName}</span>}
                                                <br /> <br />
                                              </div>
                                            )}                                                                                       
                                            {showNameField && (
                                              <>
                                                <div className="col-75">
                                                    <label htmlFor="fname">Montant Transféré</label>
                                                    <input type="number" ref={addInputsPayment} style={{ fontSize: "19px" }} />
                                                    {errors.transfAmount && <span className="text-danger">{errors.transfAmount}</span>}
                                                    <br /> <br />
                                                </div>       
                                                <div className="col-75"> 
                                                    <label htmlFor="fname">Montant Espece</label>
                                                    <input type="number" ref={addInputsPayment} style={{ fontSize: "19px" }} />
                                                    {errors.especeAmount && <span className="text-danger">{errors.especeAmount}</span>}
                                                    <br /> <br />
                                                </div>  
                                              </>   
                                            )}                                                                                                                                                                                                                                                         
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

                                <CustomModal isOpen={showModalSelectCustomer} onClose={handleModalCloseSelectCustomer} title={`Assigner un client - ${selectedOrderForCustomer.order_reference}`}>
                                  <div className="row">
                                    <div className="col-75">
                                      <p style={{ marginBottom: "20px", fontSize: "16px", color: "#495057" }}>
                                        <strong>Intitulé :</strong> {selectedOrderForCustomer.order_titled}<br/>
                                        <strong>Montant:</strong> {parseInt(selectedOrderForCustomer.order_price || 0, 10).toLocaleString("fr-FR")} XAF<br/>
                                        <strong>Client actuel:</strong> {selectedOrderForCustomer.customer?.name || selectedOrderForCustomer.name || 'Aucun client assigné'}
                                      </p>
                                      
                                      <label htmlFor="customerSelect" style={{ fontWeight: "bold", marginBottom: "10px", display: "block" }}>
                                        Sélectionner un client:
                                      </label>

                                      <Select
                                        inputId="customerSelect"
                                        value={selectedCustomerId}
                                        onChange={(option) => setSelectedCustomerId(option)}
                                        options={customers.map((c) => ({
                                          value: c.id,
                                          label: [c.name, c.phone, c.email].filter(Boolean).join(' - '),
                                        }))}
                                        placeholder="Rechercher un client..."
                                        noOptionsMessage={() => "Aucun client trouvé"}
                                        isClearable
                                        styles={{
                                          container: (base) => ({ ...base, marginBottom: "20px" }),
                                          control: (base) => ({ ...base, fontSize: "15px", minHeight: "46px" }),
                                          menu: (base) => ({ ...base, zIndex: 9999 }),
                                        }}
                                      />

                                      <div className="col-75 link-login">
                                        <button 
                                          type="button" 
                                          className="login" 
                                          onClick={loadingAssignCustomer ? null : handleAssignCustomer}
                                          style={{ marginRight: "10px" }}
                                        >
                                          {loadingAssignCustomer ? <div className="spinner"></div> : 'Assigner le Client'}
                                        </button>
                                        
                                        <button 
                                          type="button" 
                                          className="login-light" 
                                          onClick={handleModalCloseSelectCustomer}
                                        >
                                          Annuler
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </CustomModal>                                

                                <>
                                    {filteredOrders.length > 0 ?
                                        <>
                                            <div style={{ overflowY : "scroll", scrollBehavior: "inherit" }}>
                                                <table id="customers">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ borderTopLeftRadius:"5px",borderBottomLeftRadius:"5px" }}></th>
                                                            <th>Reference</th>
                                                            <th>Intitulé</th>
                                                            <th>Client</th>
                                                            <th>Montant</th>
                                                            <th>Etat</th>
                                                            {/* <th>Modifiée le</th> */}
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
                                                                <tr key={order.order_id}>
                                                                  <td>
                                                                    {order.order_state === 'unpaid and destocked' ? 
                                                                    <label class="containercheckbox">
                                                                      <input onChange={(e) => handleCheckboxChange( order.order_id, e.target.checked )} type="checkbox"/>
                                                                      <span class="checkmark"></span>
                                                                    </label> : null }
                                                                  </td>
                                                                  <td className="cell-ref">
                                                                    <span 
                                                                      className="ref" 
                                                                      onClick={() => handleModalOpenSelectCustomer(order)}
                                                                      style={{ 
                                                                        cursor: "pointer", 
                                                                        color: "#10518E", 
                                                                        textDecoration: "underline",
                                                                        fontWeight: "bold"
                                                                      }}
                                                                      title="Cliquez pour assigner un client"
                                                                    >
                                                                      {order.order_reference}
                                                                    </span>
                                                                    {order.returns.length > 0 ?
                                                                      <span onClick={() => handleModalOpenReturn(order)} className="badge badge-return" title="Retour en stock enregistré">
                                                                        <svg className="badge-ic" viewBox="0 0 24 24" aria-hidden="true">
                                                                          <path d="M12 5v4.5H7.5" />
                                                                          <path d="M21 12a9 9 0 1 1-9-9" />
                                                                        </svg>
                                                                        Retour Stock ({order.returns.length})
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
                                                                    <td style={{ display:"flex", width:"100%",height:"70px",alignItems:"center" }}>
                                                                        {order.order_state != 'unpaid and not cleared' ?
                                                                        <a className='btn btn-primary' onClick={(e) => { e.preventDefault(); handlePrintClick(order,"facture"); }} title={'Imprimer'}>
                                                                          Imprimer la Facture <Printer size={17} color={'#fff'}/>  
                                                                        </a> :  
                                                                        <a className='btn-btn-light' onClick={(e) => { e.preventDefault(); handlePrintClick(order,"bon_commande"); }} title={'Afficher'}>
                                                                          Detail
                                                                        </a>                                                                        
                                                                        }
                                                                        <div style={{ width:"12px" }}></div>
                                                                        <a onClick={() => handleDelete(order.order_id,order.order_reference)} title={"Supprimer"}>
                                                                          <Trash2 size={25} color={'red'}/>
                                                                        </a>
                                                                        <div style={{ width:"12px" }}></div>
                                                                        {order.order_state === 'unpaid and not cleared' ?
                                                                            <a className='btn btn-primary' onClick={() => handleSetStateUnpaid(order.order_id,order.order_reference,order)} title={"Déstocker et Imprimer"}>
                                                                              Tirer le Bon <Printer size={17} color={'#fff'}/>  
                                                                            </a> : 
                                                                            ( order.order_state === 'unpaid and destocked' ?
                                                                                <>
                                                                                    <a className='btn btn-success' onClick={() => handleModalOpenPayment(order)} title={"Finaliser"}>
                                                                                        Payer <Printer size={17} color={'#fff'}/>  
                                                                                    </a> 
                                                                                    <div style={{ width:"7px" }}></div>   
                                                                                    <a className='btn btn-primary' onClick={() => handleSetStateDette(order.order_id,order.order_reference,order)} title={"Passer en Creance"}>
                                                                                        Créance <Monitor size={17} color={'#fff'}/>  
                                                                                    </a>  
                                                                                    <div style={{ width:"7px" }}></div>   
                                                                                    <a className='btn-btn-light' 
                                                                                     onClick={(e) => { e.preventDefault(); handlePrintClick(order,"bon_commande"); console.log(order) }}
                                                                                     title={"Imprimer le Bon"}
                                                                                    >
                                                                                      Imprimer le Bon <Printer size={17} color={'#255'}/>  
                                                                                    </a>                                                                                                                                                                                                                                               
                                                                                </>
                                                                                : null
                                                                            )
                                                                        }                                                                                                                                                                                                                                                                                                              
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
