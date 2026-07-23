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
        axiosClient.get(`/customers`)
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
                                className={`sale-type-btn ${saleType === 'direct' ? 'active' : ''}`}
                                onClick={() => setSaleType('direct')}
                            >
                                Vente Directe
                            </button>
                            <button
                                type="button"
                                className={`sale-type-btn ${saleType === 'insurance' ? 'active' : ''}`}
                                onClick={() => setSaleType('insurance')}
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
                                                            onClick={() => handleModalOpenOrder('')}
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
