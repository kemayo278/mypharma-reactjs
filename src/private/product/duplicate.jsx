import React, { useEffect, useMemo, useRef, useState } from "react";
import AppLayout from "@layouts/appLayout";
import { Trash2, Upload, Copy } from "lucide-react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import Header from "@components/header";
import { uploadFile } from "@services/uploadFile";
import Alert from "@components/Alert";
import axiosClient from "@/axios-client";
import Swal from "sweetalert2";
import ConnectionError from "@components/errorConnection";

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

export default function DuplicateProduct() {
  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);
  const [loadinginput, setLoadingInput] = useState(false);
  const [errorConnection, setErrorConnection] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSucces] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [originalProductName, setOriginalProductName] = useState("");

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
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const handleInputChange = (field) => (event) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const getCategories = async () => {
    try {
      const { data } = await axiosClient.get("/categories");
      setCategories(data.data || []);
      setErrorConnection(false);
    } catch {
      setErrorConnection(true);
    }
  };

  const getProductById = async () => {
    setLoadingInput(true);
    try {
      const { data } = await axiosClient.get(`/products/${productId}`);
      const list = data.data || {};
      let name = list.product_name || list.name || "";
      name = name.includes("duplicate") ? name : `${name} (copie)`;
      setOriginalProductName(name);

      setFormValues({
        reference: "",
        name,
        category_id: list.category_id
          ? String(list.category_id)
          : list.product_category_id
          ? String(list.product_category_id)
          : "",
        quantity: "0",
        quantity_alert:
          list.product_quantity_alert != null
            ? String(list.product_quantity_alert)
            : list.quantity_alert != null
            ? String(list.quantity_alert)
            : "0",
        purchase_price:
          list.product_purchase_price != null
            ? String(list.product_purchase_price)
            : list.purchase_price != null
            ? String(list.purchase_price)
            : "0",
        sale_price:
          list.product_sale_price != null
            ? String(list.product_sale_price)
            : list.sale_price != null
            ? String(list.sale_price)
            : "0",
        batch_number: "",
        expiry_date: "",
        manufacture_date: "",
        active_ingredient: list.active_ingredient || list.product_active_ingredient || "",
        dosage: list.dosage || list.product_dosage || "",
        pharmaceutical_form: list.pharmaceutical_form || list.product_form || "",
        laboratory: list.laboratory || list.product_laboratory || "",
        barcode: "",
        therapeutic_class: list.therapeutic_class || list.product_therapeutic_class || "",
        storage_condition: list.storage_condition || list.product_storage_condition || "",
      });
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
    if (formValues.quantity.trim() === "") {
      validationErrors.quantity = "La quantite est requise";
    }
    if (formValues.sale_price.trim() === "") {
      validationErrors.price = "Le prix de vente est requis";
    }
    if (formValues.expiry_date.trim() === "") {
      validationErrors.expiry_date = "La date de peremption est requise";
    }
    return validationErrors;
  };

  const buildProductFormData = async () => {
    const formData = new FormData();

    if (selectedImage) {
      const result = await uploadFile(selectedImage, "product");
      formData.append("picture", result.name);
    }

    // reference et barcode ont une contrainte unique — on ne les envoie que si renseignés
    if (formValues.reference.trim()) formData.append("reference", formValues.reference.trim());
    if (formValues.barcode.trim())   formData.append("barcode",    formValues.barcode.trim());

    formData.append("name",             formValues.name.trim());
    formData.append("category_id",      formValues.category_id.trim());
    formData.append("quantity",         parseInt(formValues.quantity || "0", 10));
    formData.append("quantity_alert",   formValues.quantity_alert.trim());
    formData.append("purchase_price",   formValues.purchase_price.trim());
    formData.append("sale_price",       formValues.sale_price.trim());
    formData.append("batch_number",     formValues.batch_number.trim());
    formData.append("expiry_date",      formValues.expiry_date.trim());
    formData.append("manufacture_date", formValues.manufacture_date.trim());
    formData.append("active_ingredient",formValues.active_ingredient.trim());
    formData.append("dosage",           formValues.dosage.trim());
    formData.append("form",             formValues.pharmaceutical_form.trim());
    formData.append("laboratory",       formValues.laboratory.trim());
    formData.append("therapeutic_class",formValues.therapeutic_class.trim());
    formData.append("storage_condition",formValues.storage_condition.trim());

    return formData;
  };

  const handleDuplicateProduct = async (e) => {
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
      await axiosClient.post("/product", formData);
      setSucces("Produit duplique avec succes !");
      setFormValues({ ...initialFormValues, name: formValues.name, category_id: formValues.category_id });
      setSelectedImage(null);
      if (formRef.current) {
        formRef.current.reset();
      }
      Swal.fire({ position: "top-right", icon: "success", title: "Produit duplique avec succes !", showConfirmButton: false, timer: 3000 });
      setTimeout(() => setSucces(""), 15000);
    } catch (err) {
      const response = err.response;
      console.error("Erreur lors de la duplication du produit :", response);
      const serverErrors = {};

      if (response && response.status === 422) {
        if (response.data.errors?.name) serverErrors.name = response.data.errors.name;
        if (response.data.errors?.category_id) serverErrors.category = response.data.errors.category_id;
        if (response.data.errors?.batch_number) serverErrors.batch_number = response.data.errors.batch_number;
        if (response.data.errors?.expiry_date) serverErrors.expiry_date = response.data.errors.expiry_date;
        if (response.data.errors?.barcode) serverErrors.barcode = response.data.errors.barcode;
        if (response.data.errors?.reference) serverErrors.reference = response.data.errors.reference;
        if (!Object.keys(serverErrors).length) {
          serverErrors.connection = "Erreur de validation. Verifier les champs et reessayer.";
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
        <Header title="Dupliquer un produit" />
        {originalProductName ? (
          <div style={{ marginBottom: "16px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "4px 12px", borderRadius: "20px",
              backgroundColor: "#e8f0fb", color: "#10518E",
              fontSize: "13px", fontWeight: "600",
            }}>
              <Copy size={13} />
              Copie de : {originalProductName}
            </span>
          </div>
        ) : null}
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
                      <br /><br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="name">Nom commercial *</label>
                      <input id="name" type="text" disabled={loadinginput} value={formValues.name} onChange={handleInputChange("name")} />
                      {errors.name && <span className="text-red-500">{errors.name}</span>}
                      <br /><br />
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
                      <br /><br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="active_ingredient">Principe actif</label>
                      <input id="active_ingredient" type="text" disabled={loadinginput} value={formValues.active_ingredient} onChange={handleInputChange("active_ingredient")} />
                      <br /><br />
                    </div>
                  </div>

                  <div className="pharma-form-section-title">Caracteristiques pharmaceutiques</div>
                  <div className="row">
                    <div className="col-50">
                      <label htmlFor="dosage">Dosage</label>
                      <input id="dosage" type="text" disabled={loadinginput} value={formValues.dosage} onChange={handleInputChange("dosage")} placeholder="Ex: 500 mg" />
                      <br /><br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="pharmaceutical_form">Forme pharmaceutique</label>
                      <input id="pharmaceutical_form" type="text" disabled={loadinginput} value={formValues.pharmaceutical_form} onChange={handleInputChange("pharmaceutical_form")} placeholder="Comprime, sirop, gelule..." />
                      <br /><br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="laboratory">Laboratoire</label>
                      <input id="laboratory" type="text" disabled={loadinginput} value={formValues.laboratory} onChange={handleInputChange("laboratory")} />
                      <br /><br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="barcode">Code-barres</label>
                      <input id="barcode" type="text" disabled={loadinginput} value={formValues.barcode} onChange={handleInputChange("barcode")} />
                      <br /><br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="therapeutic_class">Classe therapeutique</label>
                      <input id="therapeutic_class" type="text" disabled={loadinginput} value={formValues.therapeutic_class} onChange={handleInputChange("therapeutic_class")} />
                      <br /><br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="storage_condition">Condition de conservation</label>
                      <input id="storage_condition" type="text" disabled={loadinginput} value={formValues.storage_condition} onChange={handleInputChange("storage_condition")} placeholder="Ex: entre 2 degres C et 8 degres C" />
                      <br /><br />
                    </div>
                  </div>

                  <div className="pharma-form-section-title">
                    Nouveau lot
                    <span style={{
                      marginLeft: "10px", fontSize: "11px", fontWeight: "normal",
                      color: "#b54708", backgroundColor: "#fffbeb",
                      padding: "2px 8px", borderRadius: "10px", border: "1px solid #fde68a"
                    }}>
                      Renseigner le nouveau lot
                    </span>
                  </div>
                  <div className="row">
                    <div className="col-50">
                      <label htmlFor="batch_number">Numero de lot</label>
                      <input
                        id="batch_number"
                        type="text"
                        disabled={loadinginput}
                        value={formValues.batch_number}
                        onChange={handleInputChange("batch_number")}
                        placeholder="Entrer le nouveau numero de lot"
                        style={{ borderColor: errors.batch_number ? "#dc2626" : undefined }}
                      />
                      {errors.batch_number && <span className="text-danger">{errors.batch_number}</span>}
                      <br /><br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="expiry_date">Date de peremption *</label>
                      <input
                        id="expiry_date"
                        type="date"
                        disabled={loadinginput}
                        value={formValues.expiry_date}
                        onChange={handleInputChange("expiry_date")}
                        style={{ borderColor: errors.expiry_date ? "#dc2626" : undefined }}
                      />
                      {errors.expiry_date && <span className="text-danger">{errors.expiry_date}</span>}
                      <br /><br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="manufacture_date">Date de fabrication</label>
                      <input id="manufacture_date" type="date" disabled={loadinginput} value={formValues.manufacture_date} onChange={handleInputChange("manufacture_date")} />
                      <br /><br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="quantity">Quantite *</label>
                      <input id="quantity" type="number" disabled={loadinginput} value={formValues.quantity} onChange={handleInputChange("quantity")} />
                      {errors.quantity && <span className="text-red-500">{errors.quantity}</span>}
                      <br /><br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="quantity_alert">Quantite seuil</label>
                      <input id="quantity_alert" type="number" disabled={loadinginput} value={formValues.quantity_alert} onChange={handleInputChange("quantity_alert")} />
                      <br /><br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="purchase_price">Prix d'achat</label>
                      <input id="purchase_price" type="number" disabled={loadinginput} value={formValues.purchase_price} onChange={handleInputChange("purchase_price")} />
                      <br /><br />
                    </div>
                    <div className="col-50">
                      <label htmlFor="sale_price">Prix de vente *</label>
                      <input id="sale_price" type="number" disabled={loadinginput} value={formValues.sale_price} onChange={handleInputChange("sale_price")} />
                      {errors.price && <span className="text-red-500">{errors.price}</span>}
                      <br /><br />
                    </div>
                    <div className="col-75 link-login">
                      <button type="button" className="login" onClick={loadingsubmitbutton ? null : handleDuplicateProduct}>
                        {loadingsubmitbutton ? <div className="spinner"></div> : "Enregistrer la duplicata"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="col-25">
              <div className="container pharma-product-sidecard">
                <div className="row">
                  {previewImageUrl ? (
                    <div className="pharma-product-illustration-wrap">
                      <img src={previewImageUrl} alt="Apercu du produit" className="pharma-product-preview" />
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
                  Renseigner le nouveau numero de lot, la date de peremption et la quantite pour cette duplicata.
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
