import React, { useEffect, useState } from "react";
import { ArrowLeft, Printer, Tag } from 'lucide-react';
import Barcode from 'react-barcode';
import { getProductLots, formatDateDisplay } from '@services/productHelpers';
import axiosClient from '@/axios-client';

export default function PrintLabels({ products, onBack }) {

    const [institutionName, setInstitutionName] = useState('');
    const [copies, setCopies] = useState(1);

    useEffect(() => {
        axiosClient.get('/institutions')
            .then(({ data }) => {
                const inst = data.data[0];
                if (inst?.Institution_name) {
                    setInstitutionName(inst.Institution_name);
                }
            })
            .catch(() => {});
    }, []);

    const handleInstitutionChange = (v) => {
        setInstitutionName(v);
    };

    const handlePrint = () => window.print();

    const formatAmount = (v) =>
        new Intl.NumberFormat('fr-FR').format(Number(v) || 0);

    const todayLabel = () => {
        const d = new Date();
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yy = String(d.getFullYear()).slice(2);
        return `${dd}/${mm}/${yy}`;
    };

    const getExpiry = (product) => {
        const lots = getProductLots(product);
        if (lots.length > 0 && lots[0].expiry_date) return lots[0].expiry_date;
        return product.expiry_date || product.product_expiry_date || '';
    };

    // Format peremption court: "03/2029"
    const formatExpiryShort = (raw) => {
        if (!raw) return null;
        const d = new Date(raw);
        if (isNaN(d.getTime())) return null;
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${mm}/${yyyy}`;
    };

    const getBarcodeValue = (product) => {
        // Préfère le code-barres, sinon la référence, sinon l'id
        return product.barcode || product.reference || product.product_reference || String(product.id || '0');
    };

    const labelItems = products.flatMap(p =>
        Array.from({ length: copies }, (_, i) => ({ ...p, _key: `${p.id}-${i}` }))
    );

    const institution = institutionName.trim() || '—';

    return (
        <div className="container-fluid pharma-print-report">

            {/* Barre d'actions — masquée à l'impression */}
            <div className="print-hidden">
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 20px', backgroundColor: '#fff', borderRadius: '10px',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.08)', marginBottom: '16px',
                    gap: '12px', flexWrap: 'wrap',
                }}>
                    <button type="button" onClick={onBack} style={{
                        display: 'flex', alignItems: 'center', gap: '7px',
                        padding: '9px 18px', borderRadius: '8px',
                        border: '1.5px solid #d0d5dd', backgroundColor: '#fff',
                        color: '#344054', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                    }}>
                        <ArrowLeft size={16} /> Retour
                    </button>
                    <button type="button" onClick={handlePrint} style={{
                        display: 'flex', alignItems: 'center', gap: '7px',
                        padding: '9px 18px', borderRadius: '8px',
                        border: 'none', backgroundColor: '#7c3aed',
                        color: '#fff', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                    }}>
                        <Printer size={16} /> Imprimer les étiquettes
                    </button>
                </div>

                {/* Paramètres */}
                <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: '16px',
                    padding: '16px 20px', backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb', borderRadius: '10px', marginBottom: '20px',
                    alignItems: 'flex-end',
                }}>
                    {/* Nom de l'institution */}
                    <div style={{ flex: '1 1 260px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Nom de l'institution / Pharmacie
                        </label>
                        <input
                            type="text"
                            value={institutionName}
                            onChange={e => handleInstitutionChange(e.target.value)}
                            placeholder="Ex : PHARMACIE NSAM"
                            style={{
                                width: '100%', padding: '9px 12px', borderRadius: '8px',
                                border: '1.5px solid #d1d5db', fontSize: '14px',
                                fontWeight: '700', textTransform: 'uppercase', boxSizing: 'border-box',
                            }}
                        />
                        <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#9ca3af' }}>
                            Sauvegardé automatiquement pour les prochaines impressions.
                        </p>
                    </div>

                    {/* Exemplaires */}
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Exemplaires / produit
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={50}
                            value={copies}
                            onChange={e => setCopies(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                            style={{
                                width: '80px', padding: '9px 12px', borderRadius: '8px',
                                border: '1.5px solid #d1d5db', fontSize: '16px',
                                fontWeight: '700', textAlign: 'center',
                            }}
                        />
                    </div>

                    {/* Résumé */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', borderRadius: '8px', backgroundColor: '#ede9fe', border: '1px solid #c4b5fd' }}>
                        <Tag size={14} color="#7c3aed" />
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#5b21b6' }}>
                            {labelItems.length} étiquette{labelItems.length > 1 ? 's' : ''} au total
                        </span>
                    </div>
                </div>

                <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '16px', paddingLeft: '4px' }}>
                    Aperçu ci-dessous — imprimez sur papier adhésif A4 (format 3 étiquettes par ligne recommandé).
                </p>
            </div>

            {/* Grille d'étiquettes */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 8.5cm)',
                gap: '3mm',
                justifyContent: 'start',
            }}>
                {labelItems.map((product) => {
                    const expiry     = getExpiry(product);
                    const expiryShort = formatExpiryShort(expiry);
                    const price      = product.sale_price ?? product.product_sale_price ?? 0;
                    const name       = product.name ?? product.product_name ?? '-';
                    const ref        = product.reference ?? product.product_reference ?? '';
                    const barcodeVal = getBarcodeValue(product);
                    const saleDate   = todayLabel();

                    return (
                        <div
                            key={product._key}
                            style={{
                                width: '8.5cm',
                                boxSizing: 'border-box',
                                border: '1px solid #333',
                                borderRadius: '3px',
                                overflow: 'hidden',
                                pageBreakInside: 'avoid',
                                breakInside: 'avoid',
                                fontFamily: 'Arial, sans-serif',
                                backgroundColor: '#fff',
                            }}
                        >
                            {/* Nom institution */}
                            <div style={{
                                backgroundColor: '#10518E',
                                padding: '4px 8px',
                                textAlign: 'center',
                            }}>
                                <span style={{
                                    color: '#fff', fontSize: '9px', fontWeight: '900',
                                    textTransform: 'uppercase', letterSpacing: '0.12em',
                                }}>
                                    {institution}
                                </span>
                            </div>

                            {/* Code-barres */}
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 0', backgroundColor: '#fff' }}>
                                <Barcode
                                    value={barcodeVal || '0000000000000'}
                                    width={1.2}
                                    height={36}
                                    fontSize={8}
                                    margin={0}
                                    displayValue={true}
                                    background="#fff"
                                    lineColor="#000"
                                />
                            </div>

                            {/* Référence */}
                            {ref && (
                                <div style={{ textAlign: 'center', fontSize: '8px', color: '#555', padding: '1px 6px 3px', fontFamily: 'monospace' }}>
                                    Réf : {ref}
                                </div>
                            )}

                            {/* Dates */}
                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                padding: '3px 8px', borderTop: '1px dashed #ddd', borderBottom: '1px dashed #ddd',
                                backgroundColor: '#f9fafb',
                            }}>
                                <span style={{ fontSize: '8px', color: '#444' }}>
                                    Vente : <strong>{saleDate}</strong>
                                </span>
                                {expiryShort ? (
                                    <span style={{ fontSize: '8px', color: '#444' }}>
                                        Pér : <strong>{expiryShort}</strong>
                                    </span>
                                ) : (
                                    <span style={{ fontSize: '8px', color: '#bbb' }}>Pér : —</span>
                                )}
                            </div>

                            {/* Nom produit */}
                            <div style={{ padding: '4px 8px 2px' }}>
                                <p style={{
                                    margin: 0, fontSize: '9.5px', fontWeight: '700',
                                    color: '#111', lineHeight: '1.3',
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    textTransform: 'uppercase',
                                }}>
                                    {name}
                                </p>
                            </div>

                            {/* Prix */}
                            <div style={{
                                padding: '4px 8px 6px',
                                textAlign: 'center',
                                borderTop: '1px solid #e5e7eb',
                            }}>
                                <span style={{
                                    fontSize: '18px', fontWeight: '900', color: '#10518E',
                                    letterSpacing: '-0.02em',
                                }}>
                                    {formatAmount(price)}
                                </span>
                                <span style={{ fontSize: '10px', fontWeight: '700', color: '#555', marginLeft: '4px' }}>
                                    FCFA
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
