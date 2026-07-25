import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import AppLayout from '@layouts/appLayout'
import { ArrowLeftRight, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, SquarePen, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Select from 'react-select';
import Header from '@components/header'
import axiosClient from "@/axios-client";
import Swal from "sweetalert2";
import ConnectionError from '@components/errorConnection'
import EmptyFetch from '@components/Empty'
import { getCurrentShopFromLocalStorage } from '@local/Shop.js';
import CustomModal from '@components/CustomModal'
import ListileUser from '@components/user/ListTile'
import { AuthContext } from '@context/AuthContext';
import Alert from '@components/Alert';
import useCart from '@private/order/cart';
import PrintOrder from '@private/print/order/order'
import { axiosClientAppart } from "../../axios-client";
import { getProductLots, formatDateDisplay, getAvailableLots, sortLotsByExpiry } from '@services/productHelpers';

export default function AddOrder() {

    const { cartItems, addToCart, removeFromCart, clearCart, getTotalPrice } = useCart();

    const currentShop = getCurrentShopFromLocalStorage();

    const { currentUser, token } = useContext(AuthContext);

    const [getorder, setGetOrder] = useState({});

    const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(true);

    const [products, setProducts] = useState([]);

    const [customers, setCustomers] = useState([]);

    const [filteredProducts, setFilteredProducts] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');

    const [errorConnection, setErrorConnection] = useState(false);

    const [loadingskeletonbuttonmodal, setLoadingSkeletonButtonModal] = useState(false);

    const [showModal, setShowModal] = useState(false)

    const [showModalOrder, setShowModalOrder] = useState(false);

    const [dataproduct, setDataProduct] = useState([]);

    const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);

    const [errors, setErrors] = useState({});

    const [saleType, setSaleType] = useState('direct');

    const [showModalDirectPay, setShowModalDirectPay] = useState(false);
    const [directPayMode, setDirectPayMode] = useState('');
    const [directPayTransfAmount, setDirectPayTransfAmount] = useState('');
    const [directPayEspeceAmount, setDirectPayEspeceAmount] = useState('');
    const [loadingDirectPay, setLoadingDirectPay] = useState(false);
    const [errorsDirectPay, setErrorsDirectPay] = useState({});

    const [selectedProductOption, setSelectedProductOption] = useState(null);

    const [orderForm, setOrderForm] = useState({
        customerType: 'CLIENT DIVERS',
        customerCustomName: '',
        titled: '',
        insuranceCompany: '',
        insurancePolicyNumber: '',
        insuredName: '',
        insuranceCoverageRate: '',
        insuranceClaimReference: '',
    });

    const navigate = useNavigate();

    const formRef = useRef();

    const inputquantity = useRef([]);

    const addInputsQuantity = el => {
        if (el && !inputquantity.current.includes(el)) {
            inputquantity.current.push(el)
        }
    }

    const getProductId = (product) => product?.id ?? product?.product_id ?? '';
    const getProductReference = (product) => product?.product_reference ?? product?.reference ?? '';
    const getProductName = (product) => product?.product_name ?? product?.name ?? '';
    const getProductSalePrice = (product) => product?.product_sale_price ?? product?.sale_price ?? 0;

    useEffect(() => {
        const filtered = products.filter((product) => {
            const searchString = `${String(getProductReference(product)).toLowerCase()} ${String(getProductName(product)).toLowerCase()}`;
            return searchString.includes(searchTerm.toLowerCase());
        });
        setFilteredProducts(filtered);
    }, [products, searchTerm]);


    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setDataProduct([]);
    };

    const handleModalOpen = async (product) => {
        setShowModal(true);
        setErrors({});
        setDataProduct(product);
        inputquantity.current = [];
    }

    const handleModalCloseOrder = () => {
        setShowModalOrder(false);
        setOrderForm({
            customerType: 'CLIENT DIVERS',
            customerCustomName: '',
            titled: '',
            insuranceCompany: '',
            insurancePolicyNumber: '',
            insuredName: '',
            insuranceCoverageRate: '',
            insuranceClaimReference: '',
        });
    };

    const handleModalOpenOrder = async (shopproduct) => {
        setShowModalOrder(true);
        setErrors({});
    }

    const handleModalOpenDirectPay = () => {
        setShowModalDirectPay(true);
        setDirectPayMode('');
        setDirectPayTransfAmount('');
        setDirectPayEspeceAmount('');
        setErrorsDirectPay({});
    };

    const handleModalCloseDirectPay = () => {
        setShowModalDirectPay(false);
        setDirectPayMode('');
        setDirectPayTransfAmount('');
        setDirectPayEspeceAmount('');
        setErrorsDirectPay({});
    };

    const handleAddDirectOrder = async (e) => {
        e.preventDefault();
        const errs = {};

        if (!directPayMode) {
            errs.paymentMode = 'Sélectionner un mode de paiement';
        }
        if (orderForm.customerType === 'AUTRE' && orderForm.customerCustomName.trim() === '') {
            errs.namecustomer = 'Nom du client requis';
        }
        const isMix = directPayMode === 'paid OM ESPECE' || directPayMode === 'paid MOMO ESPECE';
        if (isMix) {
            if (!directPayTransfAmount || directPayTransfAmount === '0') errs.transfAmount = 'Champ requis';
            if (!directPayEspeceAmount || directPayEspeceAmount === '0') errs.especeAmount = 'Champ requis';
            if (directPayTransfAmount && directPayEspeceAmount) {
                const sum = parseInt(directPayTransfAmount, 10) + parseInt(directPayEspeceAmount, 10);
                if (sum !== getTotalPrice()) {
                    errs.mixSum = `La somme (${sum}) ne correspond pas au total (${getTotalPrice()})`;
                }
            }
        }

        if (Object.keys(errs).length > 0) {
            setErrorsDirectPay(errs);
            return;
        }

        setLoadingDirectPay(true);
        setErrorsDirectPay({});

        let customerId = null;
        let customerName = null;
        if (orderForm.customerType === 'AUTRE') {
            customerName = orderForm.customerCustomName.trim();
        } else if (orderForm.customerType !== 'CLIENT DIVERS') {
            customerId = Number(orderForm.customerType);
        }

        const data = {
            user_id: currentUser.id,
            price: parseInt(getTotalPrice()),
            state: directPayMode,
            titled: orderForm.titled.trim(),
            sale_type: 'direct',
            amount_mix: isMix
                ? JSON.stringify({ transfAmount: directPayTransfAmount, especeAmount: directPayEspeceAmount })
                : null,
        };
        if (customerId !== null) data.customer_id = customerId;
        if (customerName) data.customer_name = customerName;
        data.products = cartItems.map((cartItem) => ({
            product_id: getProductId(cartItem.product),
            quantity: cartItem.quantity,
            sell_price: cartItem.price,
        }));

        await axiosClient.post('/storeOrderSale/add', data).then(({ data: res }) => {
            clearCart();
            handleModalCloseDirectPay();
            console.log(res);
            if (res.order) {
                setSelectedOrder(res.order);
                setSelectedInstitution(res.institution ?? null);
                setIsPrinting(true);
            } else {
                navigate('/user-orders');
            }
        }).catch(err => {
            const response = err.response;
            if (response && response.status === 422) {
                setErrorsDirectPay({ connection: "Champs invalides. Vider le panier et recommencer." });
            } else {
                setErrorsDirectPay({ connection: "Vérifier votre connexion Internet" });
            }
            setLoadingDirectPay(false);
        });
    };

    useEffect(() => {
        inputquantity.current = [];
        getProducts();
        getCustomers();
    }, []);

    const getProducts = async () => {
        setLoadingSkeletonButton(true);
        axiosClient.get(`/products`)
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

    const getCustomers = async () => {
        axiosClient.get(`/customers?status=active`)
            .then(({ data }) => {
                setCustomers(data.data);
                setErrorConnection(false);
            })
            .catch(err => {
                setErrorConnection(true);
            });
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(200);
    const [totalPages, setTotalPages] = useState(1);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    //   const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

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

    const handleOrderFormChange = (field, value) => {
        setOrderForm((prev) => ({ ...prev, [field]: value }));
    };

    const isInsuranceSale = saleType === 'insurance';

    const productOptions = useMemo(
        () =>
            products.map((product) => ({
                value: String(getProductId(product)),
                label: `${getProductReference(product)} - ${getProductName(product)}`,
                product,
            })),
        [products]
    );

    const adjustModalQuantity = (delta) => {
        const quantityInput = inputquantity.current[1];
        if (!quantityInput) return;
        const currentValue = parseInt(quantityInput.value || '1', 10);
        const nextValue = Math.max(1, currentValue + delta);
        quantityInput.value = String(nextValue);
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        if (inputquantity.current[0].value.trim() === '' || inputquantity.current[0].value.trim() === '0') {
            return;
        }
        if (inputquantity.current[1].value.trim() === '' || inputquantity.current[1].value.trim() === '0') {
            return;
        }
        addToCart(dataproduct, parseInt(inputquantity.current[1].value.trim()), parseInt(inputquantity.current[0].value.trim()));
        inputquantity.current = [];
        handleModalClose()
    };

    const handleAddOrder = async (e) => {
        e.preventDefault();
        const errors = {};

        if (orderForm.customerType === 'AUTRE') {
            if (orderForm.customerCustomName.trim() === '' || orderForm.customerCustomName.trim() === '0') {
                errors.namecustomer = 'Informations du client requis';
            }
        }

        if (isInsuranceSale) {
            if (orderForm.insuranceCompany.trim() === '') {
                errors.insuranceCompany = 'Compagnie assurance requise';
            }
            if (orderForm.insurancePolicyNumber.trim() === '') {
                errors.insurancePolicyNumber = 'Numero de police requis';
            }
            if (orderForm.insuredName.trim() === '') {
                errors.insuredName = 'Nom assure requis';
            }
        }

        if (Object.keys(errors).length === 0) {
            setLoadingSubmitButton(true);

            let customerId = null;
            let customerName = null;

            if (orderForm.customerType === 'AUTRE') {
                customerId = null;
                customerName = orderForm.customerCustomName.trim();
            } else {
                customerId = orderForm.customerType.trim();
            }

            setErrors(errors);

            let amountOrder = getTotalPrice();

            let state = 'unpaid and not cleared';

            let data = {
                user_id: currentUser.id,
                price: parseInt(amountOrder),
                state: state,
                titled: orderForm.titled.trim(),
                sale_type: saleType,
            };

            if (isInsuranceSale) {
                data.insurance_company = orderForm.insuranceCompany.trim();
                data.insurance_policy_number = orderForm.insurancePolicyNumber.trim();
                data.insured_name = orderForm.insuredName.trim();
                data.insurance_coverage_rate = orderForm.insuranceCoverageRate.trim();
                data.insurance_claim_reference = orderForm.insuranceClaimReference.trim();
            }

            if (customerId !== null && customerId !== '' && !isNaN(Number(customerId))) {
                data.customer_id = Number(customerId);
            }
            if (customerName !== null && customerName !== '') {
                data.customer_name = customerName;
            }

            data.amount_mix = null;
            data.products = cartItems.map((cartItem) => ({
                product_id: getProductId(cartItem.product),
                quantity: cartItem.quantity,
                sell_price: cartItem.price,
            }));

            console.log(data);

            await axiosClient.post('/storeOrderSale/add', data).then(async ({ data }) => {

                clearCart();
                handleModalCloseOrder();
                navigate('/user-orders');
                Swal.fire({ position: 'Center', icon: 'success', title: 'Success', text: 'Commande initiée avec succès.', showConfirmButton: true, confirmButtonColor: '#094b88' });
            }).catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    Swal.fire({ position: 'Center', icon: 'error', title: 'Error!', text: "Champs Manquant, Vider le panier, Actualiser la page et Recommencer", showConfirmButton: true, confirmButtonColor: '#032546' });
                } else {
                    errors.connection = "Verifier votre Connexion Internet";
                }
                setErrors(errors);
                setLoadingSubmitButton(false);
                return;
            });
        } else {
            setErrors(errors);
            setLoadingSubmitButton(false);
        }
    };

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [selectedInstitution, setSelectedInstitution] = useState(null);

    const [isPrinting, setIsPrinting] = useState(false);

    const handleBackClick = () => {
        setIsPrinting(false);
        setSelectedOrder(null);
    };

    return (
        <>
            {isPrinting ? (
                <PrintOrder order={selectedOrder} institution={selectedInstitution} onBack={handleBackClick} />
            ) : (
                <AppLayout onSearch={handleSearch}>
                    <div className="content-wrapper mt-10 dashboard-page-theme">
                        <Header title={'Nouvelle Commande'} />
                        <div className="sale-type-header">
                            <button
                                type="button"
                                className={`sale-type-btn ${saleType === 'bon' ? 'active' : ''}`}
                                onClick={() => setSaleType('bon')}
                            >
                                Vente par Bon
                            </button>
                            <button
                                type="button"
                                className={`sale-type-btn ${saleType === 'direct' ? 'active' : ''}`}
                                onClick={() => setSaleType('direct')}
                            >
                                Vente en Direct
                            </button>
                            <button
                                type="button"
                                className="sale-type-btn"
                                disabled
                                title="Bientôt disponible"
                                style={{ opacity: 0.45, cursor: 'not-allowed' }}
                            >
                                Vente Assurance
                            </button>
                        </div>
                        <CustomModal isOpen={showModal} onClose={handleModalClose} title="Compléter ces Informations">
                            {loadingskeletonbuttonmodal ? <p className="text-center"><span className="loader"></span></p> :
                                <>
                                    <ListileUser label='Produit' content={getProductName(dataproduct) + ' - ' + getProductReference(dataproduct)} />
                                    {getProductLots(dataproduct).length > 0 && (
                                        <div style={{ padding: '12px', backgroundColor: '#f0f8ff', borderRadius: '4px', marginBottom: '12px', fontSize: '13px' }}>
                                            <strong>Lots disponibles (FIFO):</strong>
                                            <div style={{ marginTop: '8px' }}>
                                                {getAvailableLots(sortLotsByExpiry(getProductLots(dataproduct))).map((lot, idx) => (
                                                    <div key={idx} style={{ marginBottom: '4px', paddingBottom: '4px', borderBottom: '1px solid #ddd' }}>
                                                        <span style={{ fontWeight: 'bold' }}>{lot.batch_number}</span> - 
                                                        Exp: {formatDateDisplay(lot.expiry_date)} | Qte: <span style={{ color: lot.available_quantity > 0 ? 'green' : 'red', fontWeight: 'bold' }}>{lot.available_quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <form action="" ref={formRef}>
                                        <div className='row'>
                                            <div class="col-75">
                                                <label for="fname">Prix *</label>
                                                <input type="number" ref={addInputsQuantity} defaultValue={getProductSalePrice(dataproduct)} />
                                                <br /><br />
                                            </div>
                                            <div class="col-75">
                                                <label for="fname">Quantité *</label>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <button
                                                        type="button"
                                                        className="sale-type-btn"
                                                        onClick={() => adjustModalQuantity(-1)}
                                                        style={{ minWidth: '42px', padding: '8px 12px' }}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        defaultValue={1}
                                                        autoFocus
                                                        ref={addInputsQuantity}
                                                        style={{ textAlign: 'center' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="sale-type-btn"
                                                        onClick={() => adjustModalQuantity(1)}
                                                        style={{ minWidth: '42px', padding: '8px 12px' }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <br /><br />
                                            </div>
                                            <div class="col-75 link-login">
                                                <button type="button" class="login" onClick={handleAddToCart}>
                                                    Ajouter à la Liste
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </>
                            }
                        </CustomModal>
                        <CustomModal isOpen={showModalOrder} onClose={handleModalCloseOrder} title="Finaliser La Commande">
                            <>
                                <form action="" ref={formRef}>
                                    {errors.connection ?
                                        <Alert className={'alert-warning'} type="Warning" message={errors.connection} />
                                        : null}
                                    <div className='row'>
                                        <div className="col-75">
                                            <label htmlFor="customerSelect">Infos Client *</label>
                                            <Select
                                                inputId="customerSelect"
                                                value={(() => {
                                                    if (orderForm.customerType === 'CLIENT DIVERS') return { value: 'CLIENT DIVERS', label: 'CLIENT DIVERS' };
                                                    if (orderForm.customerType === 'AUTRE') return { value: 'AUTRE', label: 'AUTRE — saisie manuelle' };
                                                    const found = customers.find(c => String(c.id) === String(orderForm.customerType));
                                                    return found ? { value: String(found.id), label: [found.name, found.phone].filter(Boolean).join(' - ') } : null;
                                                })()}
                                                onChange={(option) => handleOrderFormChange('customerType', option ? option.value : 'CLIENT DIVERS')}
                                                options={[
                                                    { value: 'CLIENT DIVERS', label: 'CLIENT DIVERS' },
                                                    { value: 'AUTRE', label: 'AUTRE — saisie manuelle' },
                                                    ...customers.map((c) => ({
                                                        value: String(c.id),
                                                        label: [c.name, c.phone, c.email].filter(Boolean).join(' - '),
                                                    })),
                                                ]}
                                                placeholder="Rechercher un client..."
                                                noOptionsMessage={() => 'Aucun client trouvé'}
                                                styles={{
                                                    control: (base) => ({ ...base, fontSize: '15px', minHeight: '46px', marginBottom: '4px' }),
                                                    menu: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                            />
                                            {errors.customer && <span className="text-danger">{errors.customer}</span>}
                                            <br />
                                        </div>
                                        <div className="col-75" style={{ display: orderForm.customerType === 'AUTRE' ? 'block' : 'none' }}>
                                            <label htmlFor="fname">Noms *</label>
                                            <input
                                                type="text"
                                                value={orderForm.customerCustomName}
                                                onChange={(e) => handleOrderFormChange('customerCustomName', e.target.value)}
                                            />
                                            {errors.namecustomer && <span className="text-danger">{errors.namecustomer}</span>}
                                            <br /><br />
                                        </div>
                                        <div class="col-75">
                                            <label for="fname">Intitule</label>
                                            <input
                                                type="text"
                                                value={orderForm.titled}
                                                onChange={(e) => handleOrderFormChange('titled', e.target.value)}
                                            />
                                            {errors.intitule && <span className="text-danger">{errors.intitule}</span>}
                                            <br /><br />
                                        </div>
                                        <div class="col-75 link-login">
                                            <button type="button" class="login" onClick={loadingsubmitbutton ? null : handleAddOrder}>
                                                {loadingsubmitbutton ? <div className="spinner"></div> : 'Terminer'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </>
                        </CustomModal>

                        {/* Modal Vente en Direct — paiement immédiat */}
                        <CustomModal isOpen={showModalDirectPay} onClose={handleModalCloseDirectPay} title="Vente en Direct — Paiement">
                            <>
                                <form onSubmit={handleAddDirectOrder}>
                                    {errorsDirectPay.connection &&
                                        <Alert className={'alert-warning'} type="Warning" message={errorsDirectPay.connection} />
                                    }
                                    <div className='row'>
                                        <div className="col-75">
                                            <label htmlFor="customerSelectDirect">Infos Client</label>
                                            <Select
                                                inputId="customerSelectDirect"
                                                value={(() => {
                                                    if (orderForm.customerType === 'CLIENT DIVERS') return { value: 'CLIENT DIVERS', label: 'CLIENT DIVERS' };
                                                    if (orderForm.customerType === 'AUTRE') return { value: 'AUTRE', label: 'AUTRE — saisie manuelle' };
                                                    const found = customers.find(c => String(c.id) === String(orderForm.customerType));
                                                    return found ? { value: String(found.id), label: [found.name, found.phone].filter(Boolean).join(' - ') } : null;
                                                })()}
                                                onChange={(option) => handleOrderFormChange('customerType', option ? option.value : 'CLIENT DIVERS')}
                                                options={[
                                                    { value: 'CLIENT DIVERS', label: 'CLIENT DIVERS' },
                                                    { value: 'AUTRE', label: 'AUTRE — saisie manuelle' },
                                                    ...customers.map((c) => ({
                                                        value: String(c.id),
                                                        label: [c.name, c.phone, c.email].filter(Boolean).join(' - '),
                                                    })),
                                                ]}
                                                placeholder="Rechercher un client..."
                                                noOptionsMessage={() => 'Aucun client trouvé'}
                                                styles={{
                                                    control: (base) => ({ ...base, fontSize: '15px', minHeight: '46px', marginBottom: '4px' }),
                                                    menu: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                            />
                                            <br />
                                        </div>
                                        <div className="col-75" style={{ display: orderForm.customerType === 'AUTRE' ? 'block' : 'none' }}>
                                            <label htmlFor="nameDirect">Noms *</label>
                                            <input
                                                id="nameDirect"
                                                type="text"
                                                value={orderForm.customerCustomName}
                                                onChange={(e) => handleOrderFormChange('customerCustomName', e.target.value)}
                                            />
                                            {errorsDirectPay.namecustomer && <span className="text-danger">{errorsDirectPay.namecustomer}</span>}
                                            <br /><br />
                                        </div>
                                        <div className="col-75">
                                            <label htmlFor="titledDirect">Intitulé</label>
                                            <input
                                                id="titledDirect"
                                                type="text"
                                                value={orderForm.titled}
                                                onChange={(e) => handleOrderFormChange('titled', e.target.value)}
                                            />
                                            <br /><br />
                                        </div>
                                        <div className="col-75">
                                            <label htmlFor="paymentModeDirect">Mode de paiement *</label>
                                            <select
                                                id="paymentModeDirect"
                                                value={directPayMode}
                                                onChange={(e) => {
                                                    setDirectPayMode(e.target.value);
                                                    setDirectPayTransfAmount('');
                                                    setDirectPayEspeceAmount('');
                                                    setErrorsDirectPay({});
                                                }}
                                                style={{ width: '100%', padding: '10px', fontSize: '15px', borderRadius: '6px', border: '1px solid #ccc' }}
                                            >
                                                <option value="">-- Sélectionner --</option>
                                                <option value="paid">ESPECE</option>
                                                <option value="paid OM">ORANGE MONEY</option>
                                                <option value="paid MOMO">MOMO</option>
                                                <option value="paid OFFRE">OFFRE</option>
                                                <option value="paid OM ESPECE">ORANGE MONEY + ESPECE</option>
                                                <option value="paid MOMO ESPECE">MOMO + ESPECE</option>
                                            </select>
                                            {errorsDirectPay.paymentMode && <span className="text-danger">{errorsDirectPay.paymentMode}</span>}
                                            <br /><br />
                                        </div>
                                        {(directPayMode === 'paid OM ESPECE' || directPayMode === 'paid MOMO ESPECE') && (
                                            <>
                                                <div className="col-75">
                                                    <label htmlFor="transfAmountDirect">
                                                        Montant {directPayMode === 'paid OM ESPECE' ? 'Orange Money' : 'MoMo'} (XAF)
                                                    </label>
                                                    <input
                                                        id="transfAmountDirect"
                                                        type="number"
                                                        min="0"
                                                        value={directPayTransfAmount}
                                                        onChange={(e) => setDirectPayTransfAmount(e.target.value)}
                                                    />
                                                    {errorsDirectPay.transfAmount && <span className="text-danger">{errorsDirectPay.transfAmount}</span>}
                                                    <br /><br />
                                                </div>
                                                <div className="col-75">
                                                    <label htmlFor="especeAmountDirect">Montant Espèces (XAF)</label>
                                                    <input
                                                        id="especeAmountDirect"
                                                        type="number"
                                                        min="0"
                                                        value={directPayEspeceAmount}
                                                        onChange={(e) => setDirectPayEspeceAmount(e.target.value)}
                                                    />
                                                    {errorsDirectPay.especeAmount && <span className="text-danger">{errorsDirectPay.especeAmount}</span>}
                                                    <br /><br />
                                                </div>
                                                {errorsDirectPay.mixSum && (
                                                    <div className="col-75">
                                                        <span className="text-danger">{errorsDirectPay.mixSum}</span>
                                                        <br /><br />
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        <div className="col-75" style={{ backgroundColor: '#f0f6ff', borderRadius: '8px', padding: '12px 16px', marginBottom: '12px' }}>
                                            <span style={{ fontSize: '15px', color: '#10518E', fontWeight: '600' }}>
                                                Total à encaisser : {getTotalPrice().toLocaleString('fr-FR')} XAF
                                            </span>
                                        </div>
                                        <div className="col-75 link-login">
                                            <button type="submit" className="login" disabled={loadingDirectPay}>
                                                {loadingDirectPay ? <div className="spinner"></div> : 'Payer'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </>
                        </CustomModal>
                        <div className="order-single-container" style={{ marginLeft: "auto", marginRight: "auto" }}>
                            {loadingskeletonbutton ? <p className="text-center"><span className="loader"></span></p> :
                                <>
                                    {errorConnection ?
                                        <ConnectionError onRetry={getProducts} /> :
                                        <>
                                            <div className="direct-sale-picker-card">
                                                <h4>
                                                    {saleType === 'insurance'
                                                        ? 'Selection produits - Vente assurance'
                                                        : 'Selection rapide des produits'}
                                                </h4>
                                                <p>
                                                    Recherchez un produit et ajoutez-le directement au panier.
                                                </p>
                                                <Select
                                                    classNamePrefix="pharma-select"
                                                    isSearchable
                                                    options={productOptions}
                                                    value={selectedProductOption}
                                                    onChange={(option) => setSelectedProductOption(option)}
                                                    placeholder="Rechercher un produit..."
                                                    noOptionsMessage={() => 'Aucun produit trouve'}
                                                />
                                                <button
                                                    type="button"
                                                    className="direct-add-btn"
                                                    disabled={!selectedProductOption}
                                                    onClick={() => {
                                                        if (!selectedProductOption) return;
                                                        handleModalOpen(selectedProductOption.product);
                                                        setSelectedProductOption(null);
                                                    }}
                                                >
                                                    Ajouter ce produit
                                                </button>
                                            </div>

                                            {isInsuranceSale ? (
                                                <div className="insurance-trace-card">
                                                    <h5>Traçabilite assurance</h5>
                                                    <div className="row">
                                                        <div class="col-75">
                                                            <label htmlFor="insurance_company_page">Compagnie assurance *</label>
                                                            <input
                                                                id="insurance_company_page"
                                                                type="text"
                                                                value={orderForm.insuranceCompany}
                                                                onChange={(e) => handleOrderFormChange('insuranceCompany', e.target.value)}
                                                            />
                                                            {errors.insuranceCompany && <span className="text-danger">{errors.insuranceCompany}</span>}
                                                        </div>
                                                        <div class="col-75">
                                                            <label htmlFor="insurance_policy_number_page">Numero de police *</label>
                                                            <input
                                                                id="insurance_policy_number_page"
                                                                type="text"
                                                                value={orderForm.insurancePolicyNumber}
                                                                onChange={(e) => handleOrderFormChange('insurancePolicyNumber', e.target.value)}
                                                            />
                                                            {errors.insurancePolicyNumber && <span className="text-danger">{errors.insurancePolicyNumber}</span>}
                                                        </div>
                                                        <div class="col-75">
                                                            <label htmlFor="insured_name_page">Nom assure *</label>
                                                            <input
                                                                id="insured_name_page"
                                                                type="text"
                                                                value={orderForm.insuredName}
                                                                onChange={(e) => handleOrderFormChange('insuredName', e.target.value)}
                                                            />
                                                            {errors.insuredName && <span className="text-danger">{errors.insuredName}</span>}
                                                        </div>
                                                        <div class="col-75">
                                                            <label htmlFor="insurance_coverage_rate_page">Taux de couverture (%)</label>
                                                            <input
                                                                id="insurance_coverage_rate_page"
                                                                type="number"
                                                                value={orderForm.insuranceCoverageRate}
                                                                onChange={(e) => handleOrderFormChange('insuranceCoverageRate', e.target.value)}
                                                            />
                                                        </div>
                                                        <div class="col-75">
                                                            <label htmlFor="insurance_claim_reference_page">Reference dossier assurance</label>
                                                            <input
                                                                id="insurance_claim_reference_page"
                                                                type="text"
                                                                value={orderForm.insuranceClaimReference}
                                                                onChange={(e) => handleOrderFormChange('insuranceClaimReference', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null}

                                            <div className="entry-cart-board">
                                                <div className="entry-cart-head">
                                                    <div>
                                                        <h4>Panier commande</h4>
                                                        <p>preparer la commande avant validation.</p>
                                                    </div>
                                                    <div className="entry-cart-badge">{cartItems.length} produit(s)</div>
                                                </div>

                                                {cartItems.length === 0 ? (
                                                    <div className="entry-cart-empty">Aucun produit dans le panier.</div>
                                                ) : (
                                                    <div className="entry-cart-items">
                                                        {cartItems.map((cartItem, index) => (
                                                            <div className="entry-cart-item" key={`${getProductId(cartItem.product)}-${index}`}>
                                                                <div>
                                                                    <strong>{getProductReference(cartItem.product)} - {getProductName(cartItem.product)}</strong>
                                                                    <div className="entry-cart-item-meta">
                                                                        <span>Qte: {cartItem.quantity}</span>
                                                                        <span>PU: {cartItem.price} XAF</span>
                                                                        <span>Total: {cartItem.price * cartItem.quantity} XAF</span>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    className="entry-cart-remove"
                                                                    onClick={() => removeFromCart(getProductId(cartItem.product))}
                                                                    title="Supprimer"
                                                                >
                                                                    <Trash2 size={15} color={'white'} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="entry-cart-footer">
                                                    <div className="entry-cart-total">Total: {getTotalPrice()} XAF</div>
                                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                        <button
                                                            type="button"
                                                            className="entry-cart-submit"
                                                            onClick={() => clearCart()}
                                                            disabled={cartItems.length === 0}
                                                            style={{ background: '#c93737' }}
                                                        >
                                                            Vider le panier
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="entry-cart-submit"
                                                            onClick={() => saleType === 'direct' ? handleModalOpenDirectPay() : handleModalOpenOrder('')}
                                                            disabled={cartItems.length === 0}
                                                        >
                                                            Finaliser
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </>
                            }
                        </div>
                    </div>
                </AppLayout>
            )}
        </>
    );
}
