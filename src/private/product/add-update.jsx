import React, { useEffect, useMemo, useRef, useState } from "react";
import AppLayout from "@layouts/appLayout";
import { Trash2, Upload } from "lucide-react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import Header from "@components/header";
import { uploadFile } from "@services/uploadFile";
import Alert from "@components/Alert";
import axiosClient from "@/axios-client";
import Swal from "sweetalert2";
import ConnectionError from "@components/errorConnection";
import { formatDateDisplay, isProductExpired, isExpiringSoon } from "@services/productHelpers";

const initialFormValues = {
  reference: "",
  name: "",
  category_id: "",
  quantity: "0",
  quantity_alert: "0",
  purchase_price: "0",
  sale_price: "0",
  batch_number: "",
  expiry_date: "",
  manufacture_date: "",
  active_ingredient: "",
  dosage: "",
  pharmaceutical_form: "",
  laboratory: "",
  barcode: "",
  therapeutic_class: "",
  storage_condition: "",
};

const normalizeDateInput = (value) => {
  if (!value) return "";
  return String(value).slice(0, 10);
};

const formDataToObject = (formData) => {
  const entries = {};
  formData.forEach((value, key) => {
    entries[key] = value;
  });
  return entries;
};

export default function AddUpdateProduct() {
  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);
  const [loadinginput, setLoadingInput] = useState(false);
  const [errorConnection, setErrorConnection] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSucces] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [productLots, setProductLots] = useState([]);

  const formRef = useRef();
  const { productId } = useParams();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
    } else {
      Swal.fire({
        position: "Center",
        icon: "warning",
        title: "Oops!",
        text: "Veuillez selectionner un fichier image valide.",
        showConfirmButton: true,
      });
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    const inputElement = document.getElementById("uploadImage");
    if (inputElement) {
      inputElement.value = "";
    }
  };

  useEffect(() => {
    if (!selectedImage) {
      setPreviewImageUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewImageUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedImage]);

  const handleInputChange = (field) => (event) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const getCategories = async () => {
    try {
      const { data } = await axiosClient.get("/categories");
      setCategories(data.data || []);
      setErrorConnection(false);
    } catch (error) {
      setErrorConnection(true);
    }
  };

  const getProductById = async () => {
    setLoadingInput(true);
    try {
      const { data } = await axiosClient.get(`/products/${productId}`);
      const list = data.data || {};

      setFormValues({
        reference: list.product_reference || list.reference || "",
        name: list.product_name || list.name || "",
        category_id: list.category_id ? String(list.category_id) : list.product_category_id ? String(list.product_category_id) : "",
        quantity: list.product_quantity != null ? String(list.product_quantity) : list.quantity != null ? String(list.quantity) : "0",
        quantity_alert: list.product_quantity_alert != null ? String(list.product_quantity_alert) : list.quantity_alert != null ? String(list.quantity_alert) : "0",
        purchase_price: list.product_purchase_price != null ? String(list.product_purchase_price) : list.purchase_price != null ? String(list.purchase_price) : "0",
        sale_price: list.product_sale_price != null ? String(list.product_sale_price) : list.sale_price != null ? String(list.sale_price) : "0",
        batch_number: list.batch_number || list.product_batch_number || "",
        expiry_date: normalizeDateInput(list.expiry_date || list.product_expiry_date),
        manufacture_date: normalizeDateInput(list.manufacture_date || list.product_manufacture_date),
        active_ingredient: list.active_ingredient || list.product_active_ingredient || "",
        dosage: list.dosage || list.product_dosage || "",
        pharmaceutical_form: list.pharmaceutical_form || list.product_form || "",
        laboratory: list.laboratory || list.product_laboratory || "",
        barcode: list.barcode || list.product_barcode || "",
        therapeutic_class: list.therapeutic_class || list.product_therapeutic_class || "",
        storage_condition: list.storage_condition || list.product_storage_condition || "",
      });
      setProductLots(Array.isArray(list.product_lots) ? list.product_lots : []);
      setErrorConnection(false);
    } catch (err) {
      const response = err.response;
      if (response && response.status === 404) {
        window.history.back();
      } else {
        setErrorConnection(true);
      }
    } finally {
      setLoadingInput(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (productId) {
      getProductById();
    }
  }, [productId]);

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: String(category.category_id),
        label: category.category_name,
      })),
    [categories]
  );

  const selectedCategoryOption = useMemo(
    () =>
      categoryOptions.find((option) => option.value === String(formValues.category_id)) || null,
    [categoryOptions, formValues.category_id]
  );

  const handleCategoryChange = (option) => {
    setFormValues((prev) => ({
      ...prev,
      category_id: option ? option.value : "",
    }));
  };

  const validate = () => {
    const validationErrors = {};

    if (formValues.name.trim() === "") {
      validationErrors.name = "Le nom est requis";
    }
    if (formValues.category_id.trim() === "") {
      validationErrors.category = "La categorie est requise";
    }
    if (!productId && formValues.quantity.trim() === "") {
      validationErrors.quantity = "La quantite est requise";
    }
    if (formValues.sale_price.trim() === "") {
      validationErrors.price = "Le prix de vente est requis";
    }

    return validationErrors;
  };

  const buildProductFormData = async () => {
    const formData = new FormData();

    if (selectedImage) {
      const result = await uploadFile(selectedImage, "product");
      formData.append("picture", result.name);
    }

    formData.append("reference", formValues.reference.trim());
    formData.append("name", formValues.name.trim());
    formData.append("category_id", formValues.category_id.trim());
    formData.append("quantity", parseInt(formValues.quantity || "0", 10));
    formData.append("quantity_alert", formValues.quantity_alert.trim());
    formData.append("purchase_price", formValues.purchase_price.trim());
    formData.append("sale_price", formValues.sale_price.trim());

    formData.append("batch_number", formValues.batch_number.trim());
    formData.append("expiry_date", formValues.expiry_date.trim());
    formData.append("manufacture_date", formValues.manufacture_date.trim());

    formData.append("active_ingredient", formValues.active_ingredient.trim());
    formData.append("dosage", formValues.dosage.trim());
    formData.append("form", formValues.pharmaceutical_form.trim());
    formData.append("laboratory", formValues.laboratory.trim());
    formData.append("barcode", formValues.barcode.trim());
    formData.append("therapeutic_class", formValues.therapeutic_class.trim());
    formData.append("storage_condition", formValues.storage_condition.trim());

    return formData;
  };

  const handleAddUpdateProduct = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoadingSubmitButton(true);

    try {
      const formData = await buildProductFormData();

      // Logging FormData directly is misleading in devtools; convert to plain object.
      console.log("FormData payload:", formDataToObject(formData));

      if (productId) {
        formData.append("_method", "PUT");
        await axiosClient.post(`/product/${productId}`, formData);
        setSucces("Produit modifie avec succes !");
      } else {
        await axiosClient.post("/product", formData);
        setSucces("Produit ajoute avec succes !");
        setFormValues(initialFormValues);
        setSelectedImage(null);
        if (formRef.current) {
          formRef.current.reset();
        }
      }

      setTimeout(() => {
        setSucces("");
      }, 15000);
    } catch (err) {
      const response = err.response;
      console.error("Error response:", response);
      const serverErrors = {};

      if (response && response.status === 422) {
        if (response.data.errors?.name) {
          serverErrors.name = response.data.errors.name;
        }
        if (response.data.errors?.category_id) {
          serverErrors.category = response.data.errors.category_id;
        }
        if (response.data.errors?.batch_number) {
          serverErrors.batch_number = response.data.errors.batch_number;
        }
        if (response.data.errors?.expiry_date) {
          serverErrors.expiry_date = response.data.errors.expiry_date;
        }
      } else {
        serverErrors.connection = "Verifier votre connexion au reseau puis reessayer";
      }

      setErrors(serverErrors);
    } finally {
      setLoadingSubmitButton(false);
    }
  };

  return (
    <AppLayout>
      <div className="content-wrapper mt-10 dashboard-page-theme">
        <Header title={productId ? "Modifier ce produit" : "Ajouter un produit"} />
        {errorConnection ? (
          <ConnectionError onRetry={productId ? getProductById : getCategories} />
        ) : (
          <div className="row pharma-product-layout">
            <div className="col-75">
              <form ref={formRef}>
                <div className="container-form pharma-product-card">
                  {success ? <Alert className="alert-success" type="Success" message={success} /> : null}
                  {errors.connection ? <Alert className="alert-warning" type="Warning" message={errors.connection} /> : null}

                  <div className="pharma-form-section-title">Identification du medicament</div>
                  <div className="row">
                    <div className="col-50">
                      <label htmlFor="reference">Reference</label>
                      <input id="reference" type="text" disabled={loadinginput} value={formValues.reference} onChange={handleInputChange("reference")} />
                      {errors.reference && <span className="text-red-500">{errors.reference}</span>}
                      <br />
                      <br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="name">Nom commercial *</label>
                      <input id="name" type="text" disabled={loadinginput} value={formValues.name} onChange={handleInputChange("name")} />
                      {errors.name && <span className="text-red-500">{errors.name}</span>}
                      <br />
                      <br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="category_id">Categorie *</label>
                      <Select
                        inputId="category_id"
                        classNamePrefix="pharma-select"
                        isDisabled={loadinginput}
                        isClearable
                        isSearchable
                        options={categoryOptions}
                        value={selectedCategoryOption}
                        onChange={handleCategoryChange}
                        placeholder="Rechercher et choisir une categorie..."
                        noOptionsMessage={() => "Aucune categorie trouvee"}
                      />
                      {errors.category && <span className="text-danger">{errors.category}</span>}
                      <br />
                      <br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="active_ingredient">Principe actif</label>
                      <input id="active_ingredient" type="text" disabled={loadinginput} value={formValues.active_ingredient} onChange={handleInputChange("active_ingredient")} />
                      {errors.active_ingredient && <span className="text-danger">{errors.active_ingredient}</span>}
                      <br />
                      <br />
                    </div>
                  </div>

                  <div className="pharma-form-section-title">Caracteristiques pharmaceutiques</div>
                  <div className="row">
                    <div className="col-50">
                      <label htmlFor="dosage">Dosage</label>
                      <input id="dosage" type="text" disabled={loadinginput} value={formValues.dosage} onChange={handleInputChange("dosage")} placeholder="Ex: 500 mg" />
                      {errors.dosage && <span className="text-danger">{errors.dosage}</span>}
                      <br />
                      <br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="pharmaceutical_form">Forme pharmaceutique</label>
                      <input id="pharmaceutical_form" type="text" disabled={loadinginput} value={formValues.pharmaceutical_form} onChange={handleInputChange("pharmaceutical_form")} placeholder="Comprime, sirop, gelule..." />
                      {errors.pharmaceutical_form && <span className="text-danger">{errors.pharmaceutical_form}</span>}
                      <br />
                      <br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="laboratory">Laboratoire</label>
                      <input id="laboratory" type="text" disabled={loadinginput} value={formValues.laboratory} onChange={handleInputChange("laboratory")} />
                      <br />
                      <br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="barcode">Code-barres</label>
                      <input id="barcode" type="text" disabled={loadinginput} value={formValues.barcode} onChange={handleInputChange("barcode")} />
                      <br />
                      <br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="therapeutic_class">Classe therapeutique</label>
                      <input id="therapeutic_class" type="text" disabled={loadinginput} value={formValues.therapeutic_class} onChange={handleInputChange("therapeutic_class")} />
                      <br />
                      <br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="storage_condition">Condition de conservation</label>
                      <input id="storage_condition" type="text" disabled={loadinginput} value={formValues.storage_condition} onChange={handleInputChange("storage_condition")} placeholder="Ex: entre 2 degres C et 8 degres C" />
                      <br />
                      <br />
                    </div>
                  </div>

                  <div className="pharma-form-section-title">Stock, lot et peremption</div>
                  <div className="row">
                    <div className="col-50">
                      <label htmlFor="batch_number">Numero de lot</label>
                      <input id="batch_number" type="text" disabled={loadinginput} value={formValues.batch_number} onChange={handleInputChange("batch_number")} />
                      {errors.batch_number && <span className="text-danger">{errors.batch_number}</span>}
                      <br />
                      <br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="expiry_date">Date de peremption *</label>
                      <input id="expiry_date" type="date" disabled={loadinginput} value={formValues.expiry_date} onChange={handleInputChange("expiry_date")} />
                      {errors.expiry_date && <span className="text-danger">{errors.expiry_date}</span>}
                      <br />
                      <br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="manufacture_date">Date de fabrication</label>
                      <input id="manufacture_date" type="date" disabled={loadinginput} value={formValues.manufacture_date} onChange={handleInputChange("manufacture_date")} />
                      <br />
                      <br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="quantity">Quantite {productId ? "" : "*"}</label>
                      <input id="quantity" type="number" disabled={loadinginput} value={formValues.quantity} onChange={handleInputChange("quantity")} />
                      {errors.quantity && <span className="text-red-500">{errors.quantity}</span>}
                      <br />
                      <br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="quantity_alert">Quantite seuil</label>
                      <input id="quantity_alert" type="number" disabled={loadinginput} value={formValues.quantity_alert} onChange={handleInputChange("quantity_alert")} />
                      {errors.quantity_s && <span className="text-red-500">{errors.quantity_s}</span>}
                      <br />
                      <br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="purchase_price">Prix d'achat</label>
                      <input id="purchase_price" type="number" disabled={loadinginput} value={formValues.purchase_price} onChange={handleInputChange("purchase_price")} />
                      {errors.purchase_price && <span className="text-red-500">{errors.purchase_price}</span>}
                      <br />
                      <br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="sale_price">Prix de vente *</label>
                      <input id="sale_price" type="number" disabled={loadinginput} value={formValues.sale_price} onChange={handleInputChange("sale_price")} />
                      {errors.price && <span className="text-red-500">{errors.price}</span>}
                      <br />
                      <br />
                    </div>
                    <div className="col-75 link-login">
                      <button type="button" className="login" onClick={loadingsubmitbutton ? null : handleAddUpdateProduct}>
                        {loadingsubmitbutton ? <div className="spinner"></div> : "Valider"}
                      </button>
                    </div>

                    {productId && productLots.length > 0 ? (
                      <div className="col-75">
                        <label>Historique des lots (Suivi FIFO)</label>
                        <div style={{ 
                          marginTop: "8px",
                          border: '1px solid #e0e0e0',
                          borderRadius: '4px',
                          padding: '12px',
                          backgroundColor: '#f9f9f9',
                          maxHeight: '300px',
                          overflowY: 'auto'
                        }}>
                          <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                              <tr>
                                <th style={{ padding: '6px', textAlign: 'left' }}>Lot</th>
                                <th style={{ padding: '6px', textAlign: 'left' }}>Expiration</th>
                                <th style={{ padding: '6px', textAlign: 'right' }}>Quantité</th>
                                <th style={{ padding: '6px', textAlign: 'center' }}>État</th>
                              </tr>
                            </thead>
                            <tbody>
                              {productLots.map((lot, idx) => {
                                const isExpired = isProductExpired(lot.expiry_date);
                                const expiringSoon = isExpiringSoon(lot.expiry_date);
                                let statusColor = '#067647';
                                let statusLabel = 'Valide';
                                
                                if (isExpired) {
                                  statusColor = '#b42318';
                                  statusLabel = 'Expiré';
                                } else if (expiringSoon) {
                                  statusColor = '#b54708';
                                  statusLabel = 'Expire bientôt';
                                }
                                
                                return (
                                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '6px', fontWeight: 'bold' }}>
                                      {lot.batch_number}
                                    </td>
                                    <td style={{ padding: '6px' }}>
                                      {formatDateDisplay(lot.expiry_date)}
                                    </td>
                                    <td style={{ padding: '6px', textAlign: 'right', fontWeight: 'bold', color: lot.available_quantity > 0 ? '#10518E' : '#999' }}>
                                      {lot.available_quantity}
                                    </td>
                                    <td style={{ 
                                      padding: '6px', 
                                      textAlign: 'center',
                                      color: statusColor,
                                      fontWeight: 'bold',
                                      fontSize: '11px'
                                    }}>
                                      {statusLabel}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          <div style={{ marginTop: '8px', fontSize: '11px', color: '#666' }}>
                            <strong>Total en stock:</strong> {productLots.reduce((sum, lot) => sum + (lot.available_quantity || 0), 0)} unités
                          </div>
                        </div>
                        <br />
                      </div>
                    ) : null}
                  </div>
                </div>
              </form>
            </div>

            <div className="col-25">
              <div className="container pharma-product-sidecard">
                <div className="row">
                  {previewImageUrl ? (
                    <div className="pharma-product-illustration-wrap">
                      <img
                        src={previewImageUrl}
                        alt="Apercu du produit"
                        className="pharma-product-preview"
                      />
                    </div>
                  ) : (
                    <div className="pharma-product-illustration-wrap" aria-hidden="true">
                      <svg className="pharma-product-illustration" viewBox="0 0 240 180" role="img">
                        <defs>
                          <linearGradient id="pharmaBg" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#0f5f9b" />
                            <stop offset="100%" stopColor="#0b8b74" />
                          </linearGradient>
                        </defs>
                        <rect x="10" y="10" width="220" height="160" rx="14" fill="#f4fbf9" stroke="#d4e7e3" />
                        <circle cx="62" cy="72" r="28" fill="url(#pharmaBg)" opacity="0.15" />
                        <rect x="42" y="56" width="40" height="8" rx="4" fill="#0b8b74" />
                        <rect x="58" y="40" width="8" height="40" rx="4" fill="#0b8b74" />
                        <rect x="106" y="46" width="92" height="14" rx="7" fill="#d8ece9" />
                        <rect x="106" y="70" width="76" height="10" rx="5" fill="#e4f3f0" />
                        <rect x="106" y="88" width="84" height="10" rx="5" fill="#e4f3f0" />
                        <rect x="106" y="106" width="56" height="10" rx="5" fill="#e4f3f0" />
                        <rect x="34" y="116" width="56" height="34" rx="8" fill="#ffffff" stroke="#cfe2df" />
                        <rect x="44" y="126" width="36" height="5" rx="2.5" fill="#c8dcda" />
                        <rect x="44" y="134" width="24" height="5" rx="2.5" fill="#d7e9e6" />
                      </svg>
                    </div>
                  )}
                </div>
                <br />
                <div className="row">
                  <div className="col-50">
                    <label htmlFor="uploadImage" className="btn-btn-primary" title="Televerser une image du medicament">
                      <Upload className="text-white" />
                      <input type="file" id="uploadImage" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                    </label>
                  </div>
                  <div className="col-50">
                    {selectedImage && (
                      <label htmlFor="uploadImage" onClick={handleImageRemove} className="btn-btn-danger" title="Supprimer l'image selectionnee">
                        <Trash2 className="text-white" />
                      </label>
                    )}
                  </div>
                </div>
                <div className="pharma-side-hint">
                  Completer lot, peremption et dosage pour une tracabilite fiable des medicaments en stock.
                </div>
                <div className="pharma-side-status">
                  {selectedImage ? "Image selectionnee" : "Aucune image selectionnee"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
