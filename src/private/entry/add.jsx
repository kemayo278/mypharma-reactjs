import React, { useContext, useEffect, useMemo, useState } from "react";
import AppLayout from '@layouts/appLayout'
import Header from '@components/header'
import axiosClient from "@/axios-client";
import Swal from "sweetalert2";
import ConnectionError from '@components/errorConnection'
import Select from 'react-select';
import { AuthContext } from '@context/AuthContext';
import Alert from '@components/Alert';
import { Trash2 } from 'lucide-react';

export default function AddEntry() {
  const { currentUser } = useContext(AuthContext);

  const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(true);
  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);
  const [errorConnection, setErrorConnection] = useState(false);
  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [providers, setProviders] = useState([]);
  const [entryCart, setEntryCart] = useState([]);
  const [selectedProductOption, setSelectedProductOption] = useState(null);
  const [showNameField, setShowNameField] = useState(false);
  const [entryForm, setEntryForm] = useState({
    quantity: '1',
    purchasePrice: '',
    batchNumber: '',
    expiryDate: '',
    manufactureDate: '',
    providerType: '',
    providerName: '',
    providerEmail: '',
    providerPhone: '',
    providerLocation: '',
    invoiceNumber: '',
  });

  const getProductId = (product) => product?.product_id ?? product?.id ?? '';
  const getProductReference = (product) => product?.product_reference ?? product?.reference ?? '';
  const getProductName = (product) => product?.product_name ?? product?.name ?? '';
  const getProductPurchasePrice = (product) => product?.product_purchase_price ?? product?.purchase_price ?? '';

  const productOptions = useMemo(
    () =>
      products.map((product) => ({
        value: String(getProductId(product)),
        label: `${getProductReference(product)} - ${getProductName(product)}`,
        product,
      })),
    [products]
  );

  const fetchInitialData = async () => {
    setLoadingSkeletonButton(true);
    try {
      const [productsResponse, providersResponse] = await Promise.all([
        axiosClient.get('/products'),
        axiosClient.get('/providers'),
      ]);
      setProducts(productsResponse.data.data || []);
      setProviders(providersResponse.data.data || []);
      setErrorConnection(false);
    } catch (err) {
      setErrorConnection(true);
    } finally {
      setLoadingSkeletonButton(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleProductChange = (option) => {
    setSelectedProductOption(option);
    setErrors({});
    if (!option) {
      return;
    }

    setEntryForm((prev) => ({
      ...prev,
      purchasePrice: String(getProductPurchasePrice(option.product) || ''),
    }));
  };

  const handleEntryFormChange = (field, value) => {
    setEntryForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChangeName = (event) => {
    const value = event.target.value;
    setShowNameField(value === 'AUTRE');
    handleEntryFormChange('providerType', value);
  };

  const resetForm = () => {
    setEntryCart([]);
    setSelectedProductOption(null);
    setShowNameField(false);
    setErrors({});
    setEntryForm({
      quantity: '1',
      purchasePrice: '',
      batchNumber: '',
      expiryDate: '',
      manufactureDate: '',
      providerType: '',
      providerName: '',
      providerEmail: '',
      providerPhone: '',
      providerLocation: '',
      invoiceNumber: '',
    });
  };

  const clearSelectedProductFields = () => {
    setSelectedProductOption(null);
    setEntryForm((prev) => ({
      ...prev,
      quantity: '1',
      purchasePrice: '',
      batchNumber: '',
      expiryDate: '',
      manufactureDate: '',
    }));
  };

  const handleAddToCart = () => {
    const validationErrors = {};

    if (!selectedProductOption || !selectedProductOption.product) {
      validationErrors.product = 'Selectionnez un produit';
    }
    if (entryForm.providerType.trim() === '') {
      validationErrors.customer = 'Selectionnez d\'abord un fournisseur';
    }
    if (entryForm.providerType === 'AUTRE' && entryForm.providerName.trim() === '') {
      validationErrors.namecustomer = 'Nom du fournisseur requis';
    }

    const quantityValue = parseInt(entryForm.quantity, 10);
    if (Number.isNaN(quantityValue) || quantityValue <= 0) {
      validationErrors.quantity = 'Quantite invalide';
    }

    const priceValue = parseInt(entryForm.purchasePrice, 10);
    if (Number.isNaN(priceValue) || priceValue <= 0) {
      validationErrors.purchase_price = 'Prix invalide';
    }


    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors((prev) => ({ ...prev, product: undefined, customer: undefined, namecustomer: undefined, quantity: undefined, purchase_price: undefined, batch_number: undefined, expiry_date: undefined, cart: undefined }));

    const product = selectedProductOption.product;
    const providerNameForCart = entryForm.providerType === 'AUTRE'
      ? entryForm.providerName.trim()
      : entryForm.providerType.trim();

    const cartItem = {
      key: `${getProductId(product)}-${entryForm.batchNumber.trim() || 'no-lot'}-${entryForm.expiryDate || 'no-exp'}`,
      product_id: getProductId(product),
      product_reference: getProductReference(product),
      product_name: getProductName(product),
      provider_name: providerNameForCart,
      quantity: quantityValue,
      entry_purchase_price: priceValue,
      batch_number: entryForm.batchNumber.trim(),
      expiry_date: entryForm.expiryDate,
      manufacture_date: entryForm.manufactureDate ? entryForm.manufactureDate : null,
    };

    setEntryCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.key === cartItem.key && item.entry_purchase_price === cartItem.entry_purchase_price);
      if (existingIndex === -1) {
        return [...prev, cartItem];
      }

      return prev.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: item.quantity + cartItem.quantity }
          : item
      );
    });

    clearSelectedProductFields();
  };

  const handleRemoveCartItem = (itemKey) => {
    setEntryCart((prev) => prev.filter((item) => item.key !== itemKey));
  };

  const totalCartAmount = useMemo(
    () => entryCart.reduce((total, item) => total + item.entry_purchase_price * item.quantity, 0),
    [entryCart]
  );

  const handleAddEntry = async () => {
    const validationErrors = {};

    if (entryForm.providerType.trim() === '') {
      validationErrors.customer = 'Informations du fournisseur requises';
    }
    if (entryForm.providerType === 'AUTRE' && entryForm.providerName.trim() === '') {
      validationErrors.namecustomer = 'Nom du fournisseur requis';
    }
    if (entryForm.invoiceNumber.trim() === '') {
      validationErrors.invoice_number = 'Champ Requis';
    }
    if (entryCart.length === 0) {
      validationErrors.cart = 'Ajoutez au moins un produit au panier';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoadingSubmitButton(true);
    setErrors({});

    try {
      let providerId = entryForm.providerType.trim();

      if (providerId === 'AUTRE') {
        const providerPayload = {
          name: entryForm.providerName.trim(),
          email: entryForm.providerEmail.trim(),
          phone: entryForm.providerPhone.trim(),
          location: entryForm.providerLocation.trim(),
        };
        await axiosClient.post('/provider/add', providerPayload);
        providerId = entryForm.providerName.trim();
      }

      const entryPayload = {
        user_id: currentUser.id,
        provider_id: providerId,
        invoice_number: entryForm.invoiceNumber.trim(),
        date_entry: '',
      };

      const { data: entryData } = await axiosClient.post('/entry/add', entryPayload);

      await Promise.all(
        entryCart.map((item) => {
          const entryProductPayload = {
            entry_id: entryData.id,
            product_id: item.product_name,
            entry_purchase_price: item.entry_purchase_price,
            quantity: item.quantity,
            batch_number: item.batch_number,
            expiry_date: item.expiry_date,
            manufacture_date: item.manufacture_date,
          };
          return axiosClient.post('/entryproduct/add', entryProductPayload);
        })
      );

      Swal.fire({
        position: 'Center',
        icon: 'success',
        title: 'Success',
        text: 'Entree en stock enregistree avec succes.',
        showConfirmButton: true,
        confirmButtonColor: '#094b88',
      });
      resetForm();
    } catch (err) {
      const response = err.response;
      if (response && response.status === 422) {
        Swal.fire({
          position: 'Center',
          icon: 'error',
          title: 'Error!',
          text: 'Champs invalides. Verifiez les informations puis recommencez.',
          showConfirmButton: true,
          confirmButtonColor: '#032546',
        });
      } else {
        setErrors({ connection: 'Verifier votre connexion Internet' });
      }
    } finally {
      setLoadingSubmitButton(false);
    }
  };

  return (
    <AppLayout onSearch={() => {}}>
      <div className="content-wrapper mt-10 dashboard-page-theme">
        <Header title={'Nouvelle Entree'} />

        <div className="order-single-container" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          {loadingskeletonbutton ? (
            <p className="text-center"><span className="loader"></span></p>
          ) : errorConnection ? (
            <ConnectionError onRetry={fetchInitialData} />
          ) : (
            <>
              <div className="direct-sale-picker-card">
                <h4>Selection du produit</h4>
                <p>Recherchez d'abord le produit avec react-select, puis renseignez les details d'entree.</p>
                <Select
                  classNamePrefix="pharma-select"
                  isSearchable
                  options={productOptions}
                  value={selectedProductOption}
                  onChange={handleProductChange}
                  placeholder="Rechercher un produit..."
                  noOptionsMessage={() => 'Aucun produit trouve'}
                />
                {errors.product && <span className="text-danger">{errors.product}</span>}
              </div>

              {selectedProductOption ? (
                <div className="insurance-trace-card">
                  <h5>Caracteristiques du produit selectionne</h5>
                  {selectedProductOption.product?.product_lots?.length > 0 ? (
                    <div className="entry-cart-empty" style={{ marginBottom: '12px' }}>
                      Lots existants: {selectedProductOption.product.product_lots.map((lot) => `${lot.batch_number} (exp: ${lot.expiry_date}, qte: ${lot.available_quantity})`).join(' | ')}
                    </div>
                  ) : null}
                  <div className="row">
                    <div className="col-75">
                      <label>Produit</label>
                      <input type="text" value={selectedProductOption.label} readOnly />
                    </div>
                    <div className="col-75">
                      <label htmlFor="entry_quantity">Quantite *</label>
                      <input
                        id="entry_quantity"
                        type="number"
                        min="1"
                        value={entryForm.quantity}
                        onChange={(e) => handleEntryFormChange('quantity', e.target.value)}
                      />
                      {errors.quantity && <span className="text-danger">{errors.quantity}</span>}
                    </div>

                    <div className="col-75">
                      <label htmlFor="entry_price">Prix d'achat *</label>
                      <input
                        id="entry_price"
                        type="number"
                        min="1"
                        value={entryForm.purchasePrice}
                        onChange={(e) => handleEntryFormChange('purchasePrice', e.target.value)}
                      />
                      {errors.purchase_price && <span className="text-danger">{errors.purchase_price}</span>}
                    </div>

                    <div className="col-75">
                      <label htmlFor="entry_batch">Lot</label>
                      <input
                        id="entry_batch"
                        type="text"
                        value={entryForm.batchNumber}
                        onChange={(e) => handleEntryFormChange('batchNumber', e.target.value)}
                      />
                      {errors.batch_number && <span className="text-danger">{errors.batch_number}</span>}
                    </div>

                    <div className="col-75">
                      <label htmlFor="entry_expiry">Date de peremption</label>
                      <input
                        id="entry_expiry"
                        type="date"
                        value={entryForm.expiryDate}
                        onChange={(e) => handleEntryFormChange('expiryDate', e.target.value)}
                      />
                      {errors.expiry_date && <span className="text-danger">{errors.expiry_date}</span>}
                    </div>

                    <div className="col-75">
                      <label htmlFor="entry_manufacture">Date de fabrication</label>
                      <input
                        id="entry_manufacture"
                        type="date"
                        value={entryForm.manufactureDate}
                        onChange={(e) => handleEntryFormChange('manufactureDate', e.target.value)}
                      />
                    </div>

                    <div className="col-75 link-login">
                      <button type="button" className="login" onClick={handleAddToCart}>
                        Ajouter au panier
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}              

              <div className="insurance-trace-card">
                <h5>Informations generales</h5>
                {errors.connection ? (
                  <Alert className={'alert-warning'} type="Warning" message={errors.connection} />
                ) : null}
                <div className="row">
                  <div className="col-75">
                    <label htmlFor="entry_provider">Infos Fournisseur *</label>
                    <select
                      id="entry_provider"
                      value={entryForm.providerType}
                      onChange={handleSelectChangeName}
                    >
                      <option value=""> </option>
                      <option value="AUTRE">Creer Nouveau</option>
                      {providers.map((provider) => (
                        <option key={provider.provider_id || provider.provider_name} value={provider.provider_name}>
                          {provider.provider_name}
                        </option>
                      ))}
                    </select>
                    {errors.customer && <span className="text-danger">{errors.customer}</span>}
                  </div>

                  {showNameField ? (
                    <>
                      <div className="col-75">
                        <label htmlFor="provider_name">Noms *</label>
                        <input
                          id="provider_name"
                          type="text"
                          value={entryForm.providerName}
                          onChange={(e) => handleEntryFormChange('providerName', e.target.value)}
                        />
                        {errors.namecustomer && <span className="text-danger">{errors.namecustomer}</span>}
                      </div>
                      <div className="col-75">
                        <label htmlFor="provider_email">Email</label>
                        <input
                          id="provider_email"
                          type="text"
                          value={entryForm.providerEmail}
                          onChange={(e) => handleEntryFormChange('providerEmail', e.target.value)}
                        />
                      </div>
                      <div className="col-75">
                        <label htmlFor="provider_phone">Tel</label>
                        <input
                          id="provider_phone"
                          type="text"
                          value={entryForm.providerPhone}
                          onChange={(e) => handleEntryFormChange('providerPhone', e.target.value)}
                        />
                      </div>
                      <div className="col-75">
                        <label htmlFor="provider_location">Localisation</label>
                        <input
                          id="provider_location"
                          type="text"
                          value={entryForm.providerLocation}
                          onChange={(e) => handleEntryFormChange('providerLocation', e.target.value)}
                        />
                      </div>
                    </>
                  ) : null}

                  <div className="col-75">
                    <label htmlFor="entry_invoice">N o Facture *</label>
                    <input
                      id="entry_invoice"
                      type="text"
                      value={entryForm.invoiceNumber}
                      onChange={(e) => handleEntryFormChange('invoiceNumber', e.target.value)}
                    />
                    {errors.invoice_number && <span className="text-danger">{errors.invoice_number}</span>}
                  </div>
                </div>
              </div>

              <div className="entry-cart-board">
                <div className="entry-cart-head">
                  <div>
                    <h4>Panier d'entree</h4>
                    <p> preparer plusieurs produits avant validation.</p>
                  </div>
                  <div className="entry-cart-badge">{entryCart.length} produit(s)</div>
                </div>

                {entryCart.length === 0 ? (
                  <div className="entry-cart-empty">Aucun produit dans le panier.</div>
                ) : (
                  <div className="entry-cart-items">
                    {entryCart.map((item) => (
                      <div className="entry-cart-item" key={item.key}>
                        <div>
                          <strong>{item.product_reference} - {item.product_name}</strong>
                          <div className="entry-cart-item-meta">
                            <span>Fournisseur: {item.provider_name}</span>
                            <span>Lot: {item.batch_number}</span>
                            <span>Peremption: {item.expiry_date}</span>
                            <span>Fabrication: {item.manufacture_date || '-'}</span>
                            <span>Qte: {item.quantity}</span>
                            <span>PU: {item.entry_purchase_price} XAF</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="entry-cart-remove"
                          onClick={() => handleRemoveCartItem(item.key)}
                          title="Supprimer"
                        >
                          <Trash2 size={15} color={'white'} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {errors.cart && <span className="text-danger">{errors.cart}</span>}

                <div className="entry-cart-footer">
                  <div className="entry-cart-total">Total: {totalCartAmount} XAF</div>
                  <button type="button" className="entry-cart-submit" disabled={loadingsubmitbutton} onClick={handleAddEntry}>
                    {loadingsubmitbutton ? <div className="spinner"></div> : 'Finaliser l\'entree'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
