import React from "react";
import { ArrowLeft, Image, Printer, FileSpreadsheet } from 'lucide-react'
import * as XLSX from "xlsx";
import { getProductLots, formatDateDisplay } from '@services/productHelpers';

export default function PrintProducts({products , onBack , titled}) {

    const LOW_STOCK_THRESHOLD = 5;

    const handlePrint = () => {
        window.print();
    };

    // Grouper les produits par catégorie
    const groupProductsByCategory = () => {
        const grouped = {};
        products.forEach(product => {
            const categoryName = product.category.category_name;
            if (!grouped[categoryName]) {
                grouped[categoryName] = [];
            }
            grouped[categoryName].push(product);
        });
        return grouped;
    };

    // Calculer le total en stock
    const calculateTotalStock = () => {
        return products.reduce((total, product) => total + parseInt(product.quantity), 0);
    };

    // Calculer le montant total général
    const calculateTotalAmount = () => {
        return products.reduce((total, product) => {
            return total + (parseInt(product.quantity) * parseFloat(product.sale_price));
        }, 0);
    };

    // Calculer le total en stock par catégorie
    const calculateCategoryStock = (categoryProducts) => {
        return categoryProducts.reduce((total, product) => total + parseInt(product.quantity), 0);
    };

    // Calculer le montant total par catégorie
    const calculateCategoryAmount = (categoryProducts) => {
        return categoryProducts.reduce((total, product) => {
            return total + (parseInt(product.quantity) * parseFloat(product.sale_price));
        }, 0);
    };

    // Formater les montants
    const formatAmount = (amount) => {
        return new Intl.NumberFormat('fr-FR').format(amount);
    };

    const getStockState = (quantity) => {
        const qty = Number(quantity) || 0;
        if (qty <= 0) {
            return {
                label: 'Rupture',
                textColor: '#b42318',
                bgColor: '#fee4e2',
                borderColor: '#fecdca',
            };
        }
        if (qty <= LOW_STOCK_THRESHOLD) {
            return {
                label: 'Stock faible',
                textColor: '#b54708',
                bgColor: '#fffaeb',
                borderColor: '#fedf89',
            };
        }
        return {
            label: 'Disponible',
            textColor: '#067647',
            bgColor: '#ecfdf3',
            borderColor: '#abefc6',
        };
    };

    const getExpiryValue = (product) => {
        return (
            product.expiry_date ||
            product.product_expiry_date ||
            product.expiration_date ||
            product.date_expiration ||
            product.date_peremption ||
            ''
        );
    };

    const getExpiryState = (product) => {
        const rawDate = getExpiryValue(product);
        if (!rawDate) {
            return {
                label: 'Date non renseignee',
                textColor: '#344054',
                bgColor: '#f2f4f7',
                borderColor: '#d0d5dd',
            };
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiryDate = new Date(rawDate);

        if (Number.isNaN(expiryDate.getTime())) {
            return {
                label: 'Date invalide',
                textColor: '#344054',
                bgColor: '#f2f4f7',
                borderColor: '#d0d5dd',
            };
        }

        expiryDate.setHours(0, 0, 0, 0);
        const dayDiff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

        if (dayDiff < 0) {
            return {
                label: 'Perime',
                textColor: '#b42318',
                bgColor: '#fee4e2',
                borderColor: '#fecdca',
            };
        }

        if (dayDiff <= 30) {
            return {
                label: 'Peremption proche',
                textColor: '#b54708',
                bgColor: '#fffaeb',
                borderColor: '#fedf89',
            };
        }

        return {
            label: 'Valide',
            textColor: '#067647',
            bgColor: '#ecfdf3',
            borderColor: '#abefc6',
        };
    };

    const handleExportExcel = () => {
        const data = products.map((product) => ({
          "Reference": product.reference,
          "Nom": product.name,
          "Quantité": product.quantity,
          "Prix Unitaire (XAF)": product.sale_price,
          "Montant Total (XAF)": parseInt(product.quantity) * parseFloat(product.sale_price),
          "Catégorie": product.category.category_name,
        }));
    
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, titled);

        XLSX.writeFile(workbook, titled+`.xlsx`);
    };

    const groupedProducts = groupProductsByCategory();
    const totalStock = calculateTotalStock();
    const totalAmount = calculateTotalAmount();
    const generatedAt = new Date().toLocaleString('fr-FR');
    const stockSummary = products.reduce((acc, product) => {
        const stockState = getStockState(product.quantity);
        if (stockState.label === 'Rupture') acc.outOfStock += 1;
        if (stockState.label === 'Stock faible') acc.lowStock += 1;
        if (stockState.label === 'Disponible') acc.available += 1;

        const expiryState = getExpiryState(product);
        if (expiryState.label === 'Perime') acc.expired += 1;
        if (expiryState.label === 'Peremption proche') acc.nearExpiry += 1;

        return acc;
    }, {
        outOfStock: 0,
        lowStock: 0,
        available: 0,
        expired: 0,
        nearExpiry: 0,
    });

    // Helper to render product lots in print view
    const renderProductLotsForPrint = (product) => {
        const lots = getProductLots(product);
        if (!lots || lots.length === 0) return null;
        
        return (
            <tr key={`lots-${product.id}`} style={{ backgroundColor: '#f5f5f5' }}>
                <td colSpan="8" style={{ paddingLeft: '40px', paddingTop: '4px', paddingBottom: '4px' }}>
                    <strong style={{ fontSize: '11px', color: '#666' }}>Lots détail: </strong>
                    {lots.map((lot, idx) => (
                        <span key={idx} style={{ fontSize: '10px', marginRight: '12px' }}>
                            <strong>{lot.batch_number}</strong> (Exp: {formatDateDisplay(lot.expiry_date)}, Qte: {lot.available_quantity})
                            {idx < lots.length - 1 ? ' | ' : ''}
                        </span>
                    ))}
                </td>
            </tr>
        );
    };

  return (
    <div className="container-fluid pharma-print-report">
        <div className="print-hidden">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                backgroundColor: '#fff',
                borderRadius: '10px',
                boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
                marginBottom: '18px',
                gap: '12px',
                flexWrap: 'wrap',
            }}>
                <button type="button" onClick={onBack} style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    padding: '9px 18px', borderRadius: '8px',
                    border: '1.5px solid #d0d5dd', backgroundColor: '#fff',
                    color: '#344054', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                }}>
                    <ArrowLeft size={16} /> Retour
                </button>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button type="button" onClick={handlePrint} style={{
                        display: 'flex', alignItems: 'center', gap: '7px',
                        padding: '9px 18px', borderRadius: '8px',
                        border: 'none', backgroundColor: '#10518E',
                        color: '#fff', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                    }}>
                        <Printer size={16} /> Imprimer
                    </button>
                    <button type="button" onClick={handleExportExcel} style={{
                        display: 'flex', alignItems: 'center', gap: '7px',
                        padding: '9px 18px', borderRadius: '8px',
                        border: '1.5px solid #10518E', backgroundColor: '#fff',
                        color: '#10518E', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                    }}>
                        <FileSpreadsheet size={16} /> Excel
                    </button>
                </div>
            </div>
        </div>

        <div className="pharma-header-card">
            <div className="pharma-header-top">
                <div>
                    <p className="pharma-kicker">
                        Rapport pharmacie
                    </p>
                    <h2 className="pharma-report-title">{titled}</h2>
                </div>
                <div className="pharma-generated-at">
                    <p>Edité le</p>
                    <p>{generatedAt}</p>
                </div>
            </div>

            <div className="pharma-kpi-grid">
                <div className="pharma-kpi-card pharma-kpi-stock">
                    <p className="pharma-kpi-label">Articles en stock</p>
                    <p className="pharma-kpi-value">{totalStock}</p>
                </div>
                <div className="pharma-kpi-card pharma-kpi-available">
                    <p className="pharma-kpi-label">Produits disponibles</p>
                    <p className="pharma-kpi-value">{stockSummary.available}</p>
                </div>
                <div className="pharma-kpi-card pharma-kpi-low">
                    <p className="pharma-kpi-label">Stock faible</p>
                    <p className="pharma-kpi-value">{stockSummary.lowStock}</p>
                </div>
                <div className="pharma-kpi-card pharma-kpi-out">
                    <p className="pharma-kpi-label">Ruptures</p>
                    <p className="pharma-kpi-value">{stockSummary.outOfStock}</p>
                </div>
                <div className="pharma-kpi-card pharma-kpi-expiry">
                    <p className="pharma-kpi-label">Peremption proche / Perimes</p>
                    <p className="pharma-kpi-value">
                        {stockSummary.nearExpiry} / {stockSummary.expired}
                    </p>
                </div>
            </div>

            <div className="pharma-total-value-wrap">
                <p className="pharma-total-value">
                    Valeur totale du stock: <span>{formatAmount(totalAmount)} XAF</span>
                </p>
            </div>
        </div>

        {Object.entries(groupedProducts).map(([categoryName, categoryProducts], categoryIndex) => {
            const categoryStock = calculateCategoryStock(categoryProducts);
            const categoryAmount = calculateCategoryAmount(categoryProducts);

            return (
                <div key={categoryIndex} className="pharma-category-card">
                    <div className="pharma-category-header">
                        <h3>{categoryName}</h3>
                        <div className="pharma-category-meta">
                            <span>Stock: <strong>{categoryStock}</strong> articles</span>
                            <span>Valeur: <strong>{formatAmount(categoryAmount)} XAF</strong></span>
                        </div>
                    </div>

                    <div className="pharma-table-wrap">
                        <table id="customers" className="pharma-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Reference</th>
                                    <th>Nom</th>
                                    <th>Quantite</th>
                                    <th>Etat stock</th>
                                    <th>Peremption</th>
                                    <th>Prix U.</th>
                                    <th>Montant</th>
                                </tr>
                            </thead>
                            <tbody>
                            {categoryProducts.map((product, index) => {
                                const productTotal = parseInt(product.quantity) * parseFloat(product.sale_price);
                                const stockState = getStockState(product.quantity);
                                const expiryState = getExpiryState(product);

                                return (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td className="is-center">
                                                {product.picture == "" || product.picture == null ?
                                                <div className="pharma-image-placeholder">
                                                    <Image size={18} />
                                                </div>
                                                :
                                                <a href={product.picture} target="_blank" rel="noreferrer">
                                                    <img src={product.picture} className="pharma-product-image" alt="" />
                                                </a>}
                                            </td>
                                            <td className="cell-ref">{product.reference}</td>
                                            <td>{product.name}</td>
                                            <td className={product.quantity <= 0 ? 'is-center qty-critical' : 'is-center qty-normal'}>
                                                {product.quantity}
                                            </td>
                                            <td className="is-center">
                                                <span
                                                    className="pharma-badge"
                                                    style={{
                                                        '--badge-border': stockState.borderColor,
                                                        '--badge-text': stockState.textColor,
                                                        '--badge-bg': stockState.bgColor,
                                                    }}
                                                >
                                                    {stockState.label}
                                                </span>
                                            </td>
                                            <td className="is-center">
                                                <span
                                                    className="pharma-badge"
                                                    style={{
                                                        '--badge-border': expiryState.borderColor,
                                                        '--badge-text': expiryState.textColor,
                                                        '--badge-bg': expiryState.bgColor,
                                                    }}
                                                >
                                                    {expiryState.label}
                                                </span>
                                            </td>
                                            <td className="is-right money-cell">
                                                {formatAmount(product.sale_price)} XAF
                                            </td>
                                            <td className="is-right money-cell total-money-cell">
                                                {formatAmount(productTotal)} XAF
                                            </td>
                                        </tr>
                                        {renderProductLotsForPrint(product)}
                                    </React.Fragment>
                                );
                            })}
                            <tr className="pharma-subtotal-row">
                                <td colSpan="6" className="is-right subtotal-label">
                                    Sous-total {categoryName}
                                </td>
                                <td className="is-right subtotal-stock">
                                    {categoryStock} articles
                                </td>
                                <td className="is-right subtotal-amount">
                                    {formatAmount(categoryAmount)} XAF
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        })}

        <div className="pharma-grand-total">
            <div className="pharma-grand-total-row">
                <h2>TOTAL GENERAL</h2>
                <h3>Articles: <span>{totalStock}</span></h3>
                <h3>Valeur: <span>{formatAmount(totalAmount)} XAF</span></h3>
            </div>
        </div>
    </div>
  )
}