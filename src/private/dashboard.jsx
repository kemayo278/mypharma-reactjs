import React, { useEffect, useMemo, useRef, useState } from 'react'
import AppLayout from '@layouts/appLayout'
import { ArrowLeftRight, BadgeCent, ChevronLeft, ChevronRight, Image, ChevronsLeft, ChevronsRight, Eye, Plus, Printer, RefreshCw, SquarePen, Trash2, Filter } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Header from '@components/header'
import axiosClient from "@/axios-client";
import Swal from "sweetalert2";
import CustomModal from '@components/CustomModal'
import ListileUser from '@components/user/ListTile'
import ConnectionError from '@components/errorConnection'
import { getYesterdayWithCurrentTime } from "@services/util.js";
import EmptyFetch from '@components/Empty'
import { getCurrentShopFromLocalStorage } from '@local/Shop.js';
import Alert from '@components/Alert';
import PrintOrder from '@private/print/order/order'
import PrintOrders from '@private/print/order/orders'
import PrintRecapOrders from '@private/print/order/recap'

export default function Dashboard() {

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
    const month = String(now.getMonth() + 1).padStart(2, "0");
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

  // States
  const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(true);
  const [orders, setOrders] = useState([]);
  const [getinstitution, setGetInstitution] = useState({});
  const [users, setUsers] = useState([]);
  const [getorder, setGetOrder] = useState({});
  const [getuser, setGetUser] = useState({});
  const [getcustomer, setGetCustomer] = useState({});
  const [payments, setPayments] = useState([]);
  const [loadingskeletonbuttonmodal, setLoadingSkeletonButtonModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalPayment, setShowModalPayment] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [amountTotal, setAmountTotal] = useState(0);
  const [startDate, setStartDate] = useState(getYesterdayWithCurrentTime());
  const [endDate, setEndDate] = useState(getCurrentDateTime());
  const [message, setMessage] = useState('');
  const [errorConnection, setErrorConnection] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSucces] = useState("");
  const [showModalReturn, setShowModalReturn] = useState(false);
  const [returns, setReturns] = useState([]);
  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);
  const [loadingsubmitbuttonrecap, setLoadingSubmitButtonRecap] = useState(false);
  
  // Nouveaux states pour les filtres
  const [sourceFilter, setSourceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableSources, setAvailableSources] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(100);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrdersRecap, setSelectedOrdersRecap] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isPrintingOrdersRecap, setIsPrintingOrdersRecap] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState(null);
  const [isPrintingOrders, setIsPrintingOrders] = useState(false);
  const [refundedAmount, setRefundedAmount] = useState(0);
  const [selectedOrdersFromRecap, setSelectedFromRecap] = useState([]);

  // Fonction pour compter les filtres actifs
  const getActiveFiltersCount = () => {
    let count = 0;
    if (sourceFilter !== 'all') count++;
    if (categoryFilter !== 'all') count++;
    return count;
  };

  // Fonction pour effacer tous les filtres
  const clearFilters = () => {
    setSourceFilter('all');
    setCategoryFilter('all');
    setCurrentPage(1);
  };

  // Extraire toutes les sources disponibles des commandes
  const extractAvailableSources = (orders) => {
    const sourcesSet = new Set();
    
    orders.forEach(order => {
      if (order.sales) {
        order.sales.forEach(sale => {
          if (sale.product && sale.product.product_source) {
            sourcesSet.add(sale.product.product_source);
          }
        });
      }
    });
    
    return Array.from(sourcesSet).map(source => ({
      value: source.toLowerCase(),
      label: source,
      emoji: source.toLowerCase() === 'bar' ? '🍹' : '🍽️'
    }));
  };

  // Extraire toutes les catégories disponibles des commandes
  const extractAvailableCategories = (orders) => {
    const categoriesMap = new Map();
    
    orders.forEach(order => {
      if (order.sales) {
        order.sales.forEach(sale => {
          if (sale.product && sale.product.category_id) {
            const categoryKey = sale.product.category_id.toString();
            if (!categoriesMap.has(categoryKey)) {
              // Priorité : objet category complet, sinon utiliser category_id
              if (sale.product.category && sale.product.category.category_name) {
                categoriesMap.set(categoryKey, {
                  id: sale.product.category_id,
                  name: sale.product.category.category_name
                });
              } else {
                // Fallback pour les cas sans objet category complet
                categoriesMap.set(categoryKey, {
                  id: sale.product.category_id,
                  name: `Catégorie ${sale.product.category_id}`
                });
              }
            }
          }
        });
      }
    });
    
    return Array.from(categoriesMap.values());
  };

  // Effet pour le filtrage
  useEffect(() => {
    const filtered = orders.filter((order) => {
      // Filtre par terme de recherche
      const searchString = `${order.order_reference.toLowerCase()} ${order.order_titled.toLowerCase()} ${order.user.user_first_name.toLowerCase()} ${order.user.user_second_name.toLowerCase()} ${order.order_created_at.toLowerCase()}`;
      const matchesSearch = searchString.includes(searchTerm.toLowerCase());
      
      // Filtre par source
      let matchesSource = true;
      if (sourceFilter !== 'all') {
        matchesSource = order.sales && order.sales.some(sale => {
          const productSource = sale.product?.product_source;
          if (!productSource) return false;
          
          // Gestion des variations de casse et de nommage
          const normalizedSource = productSource.toLowerCase().trim();
          const normalizedFilter = sourceFilter.toLowerCase().trim();
          
          return normalizedSource === normalizedFilter || 
                 (normalizedFilter === 'kitchen' && (normalizedSource === 'cuisine' || normalizedSource === 'kitchen')) ||
                 (normalizedFilter === 'bar' && normalizedSource === 'bar');
        });
      }
      
      // Filtre par catégorie
      let matchesCategory = true;
      if (categoryFilter !== 'all') {
        matchesCategory = order.sales && order.sales.some(sale => 
          sale.product && sale.product.category_id && 
          sale.product.category_id.toString() === categoryFilter
        );
      }
      
      return matchesSearch && matchesSource && matchesCategory;
    });
    setFilteredOrders(filtered);
    
    // Recalculer le total des pages
    setTotalPages(Math.ceil(filtered.length / ordersPerPage));
    
    // Réinitialiser à la première page si nécessaire
    if (currentPage > Math.ceil(filtered.length / ordersPerPage) && filtered.length > 0) {
      setCurrentPage(1);
    }
  }, [orders, searchTerm, sourceFilter, categoryFilter, ordersPerPage, currentPage]);

  // Mettre à jour les catégories et sources disponibles quand les commandes changent
  useEffect(() => {
    const categories = extractAvailableCategories(orders);
    const sources = extractAvailableSources(orders);
    setAvailableCategories(categories);
    setAvailableSources(sources);
  }, [orders]);

  // Fonctions de gestion des filtres
  const handleSourceFilterChange = (e) => {
    setSourceFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  // Fonctions pour compter les commandes par filtre
  const getOrderCountBySource = (source) => {
    if (source === 'all') return orders.length;
    return orders.filter(order => 
      order.sales && order.sales.some(sale => {
        const productSource = sale.product?.product_source;
        if (!productSource) return false;
        
        const normalizedSource = productSource.toLowerCase().trim();
        const normalizedFilter = source.toLowerCase().trim();
        
        return normalizedSource === normalizedFilter || 
               (normalizedFilter === 'kitchen' && (normalizedSource === 'cuisine' || normalizedSource === 'kitchen')) ||
               (normalizedFilter === 'bar' && normalizedSource === 'bar');
      })
    ).length;
  };

  const getOrderCountByCategory = (categoryId) => {
    if (categoryId === 'all') return orders.length;
    return orders.filter(order => 
      order.sales && order.sales.some(sale => 
        sale.product && sale.product.category_id && 
        sale.product.category_id.toString() === categoryId
      )
    ).length;
  };

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

  const handleModalCloseReturn = () => {
    setShowModalReturn(false);
    setErrors({});
  };

  const handleModalOpenReturn = async (order) => {
    setShowModalReturn(true);
    setReturns(order.returns);
    setErrors({});
  }

  const handleModalClosePayment = () => {
    setShowModalPayment(false);
    setErrors({});
  };

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
    await axiosClient.post('/orders-paid-between',data).then(({data})  => {
      let list = data.data;
      setGetInstitution(data.institution);
      setOrders(list);
      setAmountTotal(0);
      setTotalPages(Math.ceil(data.data.length / ordersPerPage));
      setLoadingSkeletonButton(false);
      setErrorConnection(false);
    }).catch(err => {
      setLoadingSkeletonButton(false);
      setErrorConnection(true);
    });
  };

  // Pagination
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
    if (startDate === '') return;
    if (endDate === '') return;

    let message = formatDisplayDate(startDate) + ' à ' + formatDisplayDate(endDate);
    if (startDate == formattedDate &&  endDate == formattedDate) {
      setMessage(message);
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

  function formatSelectedOrdersToString(selectedOrders) {
    return selectedOrders.map((id) => `-${id}`).join("");
  }

  const handleRecapOrders = async(ids) => {
    Swal.fire({
      title: 'Recapitulation', text: 'Voulez-vous faire un recap de ces factures ?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#10518E', cancelButtonColor: '#d33', confirmButtonText: 'Oui', cancelButtonText: 'Annulez'
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

  const handlePrintClick = (order) => {
    setSelectedOrder(order);
    setIsPrinting(true);
  };

  const handleBackClick = () => {
    setIsPrinting(false);
    setSelectedOrder(null);
  };

  const handlePrintClickOrdersRecap = (recap) => {
    setSelectedOrdersRecap(recap);
    setIsPrintingOrdersRecap(true);
  };

  const handleBackClickOrdersRecap = () => {
    setIsPrintingOrdersRecap(false);
    setSelectedOrdersRecap([]);
  };

  const handlePrintClickOrders = () => {
    setSelectedOrders(filteredOrders);
    setIsPrintingOrders(true);
  };

  const handleBackClickOrders = () => {
    setIsPrintingOrders(false);
    setSelectedOrders([]);
  };

  const handleRefundCalculation = (e) => {
    const receivedAmount = parseFloat(e.target.value) || 0;
    const totalPrice = parseFloat(getorder.order_price);
    const refund = receivedAmount - totalPrice;
    setRefundedAmount(refund);
  };

  const handleCheckboxChange = (orderId, isChecked) => {
    if (isChecked) {
      setSelectedFromRecap((prev) => [...prev, orderId]);
    } else {
      setSelectedFromRecap((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const dashboardStats = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => {
      const amount = parseFloat(order?.order_price);
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);

    const paidOrders = filteredOrders.filter((order) =>
      String(order?.order_state || '').toLowerCase().startsWith('paid')
    ).length;

    const unpaidOrders = filteredOrders.filter((order) => {
      const state = String(order?.order_state || '').toLowerCase();
      return state.includes('debt') || state.includes('unpaid');
    }).length;

    const sourceAccumulator = {};
    filteredOrders.forEach((order) => {
      const uniqueSources = new Set(
        (order?.sales || [])
          .map((sale) => sale?.product?.product_source)
          .filter(Boolean)
          .map((source) => source.toLowerCase().trim())
      );

      uniqueSources.forEach((source) => {
        sourceAccumulator[source] = (sourceAccumulator[source] || 0) + 1;
      });
    });

    const topSources = Object.entries(sourceAccumulator)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([source, count]) => ({ source, count }));

    const now = new Date();
    const dayKeys = [];
    for (let offset = 6; offset >= 0; offset--) {
      const date = new Date(now);
      date.setDate(now.getDate() - offset);
      dayKeys.push(date.toISOString().slice(0, 10));
    }

    const trendMap = dayKeys.reduce((acc, key) => {
      acc[key] = { count: 0, revenue: 0 };
      return acc;
    }, {});

    filteredOrders.forEach((order) => {
      const rawDate = String(order?.order_created_at || '');
      const parsedDate = new Date(rawDate.replace(' ', 'T'));
      if (Number.isNaN(parsedDate.getTime())) {
        return;
      }

      const dateKey = parsedDate.toISOString().slice(0, 10);
      if (!trendMap[dateKey]) {
        return;
      }

      const amount = parseFloat(order?.order_price);
      trendMap[dateKey].count += 1;
      trendMap[dateKey].revenue += Number.isFinite(amount) ? amount : 0;
    });

    const trendDays = dayKeys.map((key) => {
      const [year, month, day] = key.split('-');
      return {
        key,
        label: `${day}/${month}`,
        count: trendMap[key].count,
        revenue: trendMap[key].revenue,
      };
    });

    const maxRevenue = Math.max(...trendDays.map((day) => day.revenue), 1);
    const trendPoints = trendDays
      .map((day, index) => {
        const x = trendDays.length === 1 ? 0 : (index / (trendDays.length - 1)) * 100;
        const y = 60 - (day.revenue / maxRevenue) * 52;
        return `${x},${y}`;
      })
      .join(' ');

    return {
      totalOrders,
      totalRevenue,
      paidOrders,
      unpaidOrders,
      averageTicket: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      topSources,
      trendDays,
      trendPoints,
      maxSourceCount: Math.max(...topSources.map((item) => item.count), 1),
    };
  }, [filteredOrders]);

  return (
    <>
      {isPrinting ? (
        <PrintOrder order={selectedOrder} onBack={handleBackClick} institution={getinstitution} label={'facture'} />
      ) : isPrintingOrders ? (
        <PrintOrders orders={filteredOrders} onBack={handleBackClickOrders} message={message} titled={'Etat de Caisse'} />
      ) : isPrintingOrdersRecap ? (
        <PrintRecapOrders institution={selectedOrdersRecap.institution} product_recap={selectedOrdersRecap.product_recap} total_amount={selectedOrdersRecap.total_amount} order_references={selectedOrdersRecap.order_references} user_names={selectedOrdersRecap.user_names} order_titled={selectedOrdersRecap.order_titled} order_date={selectedOrdersRecap.order_date} onBack={handleBackClickOrdersRecap}/>
      ) : (
        <AppLayout onSearch={handleSearch}>
          {loadingskeletonbutton ? <div class="content-wrapper mt-10"><br /> <p className="text-center"><span className="loader"></span></p> </div> :
            <>
              {errorConnection ? <ConnectionError onRetry={getOrders} /> :
                <div className="content-wrapper mt-10 dashboard-page-theme">
                    {/* <Header title={`Tableau de Bord (${filteredOrders.length})`} /> */}
                    <Header title={`Tableau de Bord`} />

                    <div className="dashboard-analytics">
                      <div className="dashboard-kpi-grid">
                        <div className="dashboard-kpi-card">
                          <span>Chiffre d'affaires</span>
                          <strong>{dashboardStats.totalRevenue.toLocaleString('fr-FR')} XAF</strong>
                        </div>
                        <div className="dashboard-kpi-card">
                          <span>Panier moyen</span>
                          <strong>{dashboardStats.averageTicket.toLocaleString('fr-FR')} XAF</strong>
                        </div>
                        <div className="dashboard-kpi-card">
                          <span>Commandes payees</span>
                          <strong>{dashboardStats.paidOrders}</strong>
                        </div>
                        <div className="dashboard-kpi-card">
                          <span>Commandes a risque</span>
                          <strong>{dashboardStats.unpaidOrders}</strong>
                        </div>
                      </div>

                      <div className="dashboard-chart-grid">
                        <div className="dashboard-chart-card">
                          <h4>Courbe du CA (7 derniers jours)</h4>
                          <svg viewBox="0 0 100 64" preserveAspectRatio="none" className="dashboard-line-chart">
                            <polyline
                              fill="none"
                              stroke="#0b74c9"
                              strokeWidth="2"
                              points={dashboardStats.trendPoints}
                            />
                          </svg>
                          <div className="dashboard-chart-labels">
                            {dashboardStats.trendDays.map((day) => (
                              <span key={day.key}>{day.label}</span>
                            ))}
                          </div>
                        </div>

                        <div className="dashboard-chart-card" style={{ display:"none" }}>
                          <h4>Repartition par source</h4>
                          <div className="dashboard-source-bars">
                            {dashboardStats.topSources.length > 0 ? (
                              dashboardStats.topSources.map((item) => (
                                <div className="dashboard-source-row" key={item.source}>
                                  <span>{item.source}</span>
                                  <div className="dashboard-source-track">
                                    <div
                                      className="dashboard-source-fill"
                                      style={{ width: `${(item.count / dashboardStats.maxSourceCount) * 100}%` }}
                                    ></div>
                                  </div>
                                  <strong>{item.count}</strong>
                                </div>
                              ))
                            ) : (
                              <p className="dashboard-no-data">Pas assez de donnees pour la source.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Section des filtres compacte */}
                    <div style={{ marginBottom:"20px" }}>
                        <div style={{ display: 'none', alignItems: 'center', gap: '10px' }}>
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
                                <Filter size={16} />
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

                        {/* Panel des filtres - affiché seulement si showFilters = true */}
                        {showFilters && (
                            <div style={{ 
                                marginTop:"10px", 
                                backgroundColor:"#f8f9fa", 
                                padding:"15px", 
                                borderRadius:"8px", 
                                border:"1px solid #dee2e6",
                                animation: "slideDown 0.3s ease-in-out"
                            }}>
                                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px", alignItems:"start" }}>
                                    
                                    {/* Filtre par source */}
                                    <div>
                                        <label style={{ 
                                            display:"block", 
                                            fontWeight:"bold", 
                                            color:"#495057", 
                                            marginBottom:"8px",
                                            fontSize:"14px"
                                        }}>
                                            🍽️ Source:
                                        </label>
                                        <select 
                                            value={sourceFilter}
                                            onChange={handleSourceFilterChange}
                                            style={{ 
                                                width:"100%",
                                                padding:"8px 12px", 
                                                border:"1px solid #dee2e6",
                                                borderRadius:"4px",
                                                fontSize:"14px",
                                                backgroundColor:"#fff",
                                                cursor:"pointer"
                                            }}
                                        >
                                            <option value="all">Toutes les sources ({getOrderCountBySource('all')})</option>
                                            {availableSources.map((source) => (
                                                <option key={source.value} value={source.value}>
                                                    {source.emoji} {source.label} ({getOrderCountBySource(source.value)})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Filtre par catégorie */}
                                    <div>
                                        <label style={{ 
                                            display:"block", 
                                            fontWeight:"bold", 
                                            color:"#495057", 
                                            marginBottom:"8px",
                                            fontSize:"14px"
                                        }}>
                                            📁 Catégorie:
                                        </label>
                                        <select 
                                            value={categoryFilter}
                                            onChange={handleCategoryFilterChange}
                                            style={{ 
                                                width:"100%",
                                                padding:"8px 12px", 
                                                border:"1px solid #dee2e6",
                                                borderRadius:"4px",
                                                fontSize:"14px",
                                                backgroundColor:"#fff",
                                                cursor:"pointer"
                                            }}
                                        >
                                            <option value="all">Toutes les catégories ({getOrderCountByCategory('all')})</option>
                                            {availableCategories.map((category) => (
                                                <option key={category.id} value={category.id.toString()}>
                                                    {category.name} ({getOrderCountByCategory(category.id.toString())})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {selectedOrdersFromRecap.length >= 2 ?
                    <p>
                      <button className='login' onClick={() => handleRecapOrders(selectedOrdersFromRecap)} style={{ padding:"10px",color:"#fff",fontSize:"19px",cursor:"pointer",backgroundColor:"#094b88" }}>
                        {loadingsubmitbuttonrecap ? <div className="spinner"></div> : 'Imprimer'}
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
                      <div className="dashboard-table-actions">
                        <a title={'Imprimer Le Resultat'} style={{ cursor:"pointer" }} onClick={(e) => { e.preventDefault(); handlePrintClickOrders(); }}>
                          <Printer size={25} color={'#0f5f9b'}/>  
                        </a> 
                      </div> :
                    null }

                    <div style={{ height:"44px" }}></div>

                    {/* Modals - Code inchangé */}
                    <CustomModal isOpen={showModal} onClose={handleModalClose} title={'Reference - ' + getorder.order_reference}>
                        {loadingskeletonbuttonmodal ? <p className="text-center"><span className="loader"></span></p> :
                          <>
                            <ListileUser label='Effectué Par' content={getuser.user_first_name + ' '+ getuser.user_second_name} />
                            <ListileUser label='Client ' content={!getorder.customerName || getorder.customerName == "" ? "Client Divers" : getorder.customerName} />
                            {getorder.amountMix ? 
                              <>
                                <ListileUser label='Montant Transféré ' content={getorder.amountMix.transfAmount+" XAF"} />
                                <ListileUser label='Montant Espece ' content={getorder.amountMix.especeAmount+" XAF"} />
                              </>
                              :
                              null
                            }
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
                                    <label for="fname">Selectionner le Mode de paiement </label>
                                    <select id="select-team-form" ref={addInputsPayment} >
                                        <option value={''} selected> </option>
                                        <option value={'paid'}>Espece </option>
                                        <option value={'paid OM'}>OM </option>
                                        <option value={'paid MOMO'}>MOMO </option>
                                        <option value={'paid OFFRE'}>OFFRE </option>
                                    </select> <br /><br />
                                </div>                                                                                                                               
                                <div class="col-75 link-login">
                                    <button type="button" class="login" onClick={loadingsubmitbutton ? null : handleAddPayment}>
                                      {loadingsubmitbutton ? <div className="spinner"></div> : 'Submit'}
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
                                <div className="dashboard-table-wrap">
                                  <table id="customers" className="dashboard-orders-table">
                                        <thead>
                                            <tr>
                                                <th style={{ borderTopLeftRadius:"5px",borderBottomLeftRadius:"5px" }}></th>
                                                <th>Reference</th>
                                                <th>Intitulé</th>
                                                <th>Montant</th>
                                                <th>Etat</th>
                                                <th>Date</th>
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
                                                      <td>
                                                        <label class="containercheckbox">
                                                          <input onChange={(e) => handleCheckboxChange( order.order_id, e.target.checked )} type="checkbox"/>
                                                          <span class="checkmark"></span>
                                                        </label>
                                                    </td>                                                                  
                                                    <td className="cell-ref">
                                                      <span className="ref">{order.order_reference}</span>
                                                      {order.returns && order.returns.length > 0 ?
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

                                                    <td className='font-bold txt-17'> {order.order_price} XAF </td>        
                                                    <td style={{ fontWeight:"bold" }}> {iconComponent} </td>    
                                                    <td> {order.order_created_at} </td>
                                                    <td style={{ display:"flex", width:"100%",height:"70px",alignItems:"center" }}>
                                                        <a onClick={(e) => { e.preventDefault(); handlePrintClick(order); }} title={'Imprimer'}>
                                                          <Printer size={25} color={'#08447c'}/>  
                                                        </a> 
                                                        <div style={{ width:"14px" }}></div>
                                                        <a onClick={() => handleModalOpen(order)} title={'Voir'}>
                                                          <Eye size={25} color={'#08447c'}/>  
                                                        </a>                                                                                                                                                                                                                                                                                                             
                                                    </td>
                                                </tr>
                                                </> 
                                            );
                                        })} 
                                        </tbody>
                                    </table> 
                                    
                                    {/* Pagination */}
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