import React from "react";
import { ArrowLeft, Printer } from 'lucide-react';

export default function PrintInventory({ products, onBack }) {

    const handlePrint = () => {
        window.print();
    };

    const groupProductsByCategory = () => {
        const grouped = {};
        products.forEach(product => {
            const categoryName = product.category?.category_name || 'Sans catégorie';
            if (!grouped[categoryName]) {
                grouped[categoryName] = [];
            }
            grouped[categoryName].push(product);
        });
        return grouped;
    };

    const generatedAt = new Date().toLocaleString('fr-FR');
    const groupedProducts = groupProductsByCategory();
    const totalProducts = products.length;

    return (
        <div className="container-fluid pharma-print-report">

            {/* Barre d'actions — masquée à l'impression */}
            <div className="print-hidden">
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 20px', backgroundColor: '#fff', borderRadius: '10px',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.08)', marginBottom: '18px',
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
                        border: 'none', backgroundColor: '#10518E',
                        color: '#fff', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                    }}>
                        <Printer size={16} /> Imprimer la fiche
                    </button>
                </div>
            </div>

            {/* En-tête du document */}
            <div style={{
                border: '2px solid #000', borderRadius: '4px',
                padding: '16px 20px', marginBottom: '18px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                flexWrap: 'wrap', gap: '12px',
            }}>
                <div>
                    <p style={{ margin: '0 0 2px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#555' }}>
                        Document interne
                    </p>
                    <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '800', color: '#000' }}>
                        FICHE D'INVENTAIRE
                    </h2>
                    <p style={{ margin: '0', fontSize: '12px', color: '#444' }}>
                        {totalProducts} produit{totalProducts > 1 ? 's' : ''} &bull; Edite le {generatedAt}
                    </p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', lineHeight: '1.8' }}>
                    <p style={{ margin: '0', fontWeight: '700' }}>Date d'inventaire&nbsp;: ____________________</p>
                    <p style={{ margin: '0' }}>Responsable&nbsp;: ____________________</p>
                    <p style={{ margin: '0' }}>Controleur&nbsp;: ____________________</p>
                </div>
            </div>

            {/* Instruction */}
            <p style={{
                fontSize: '11px', fontStyle: 'italic', color: '#555',
                marginBottom: '14px', paddingLeft: '4px',
            }}>
                Verifiez physiquement chaque produit et inscrivez la quantite reellement comptee dans la colonne <strong>"Qte inventoriee"</strong>. Notez tout ecart dans la colonne <strong>"Observations"</strong>.
            </p>

            {/* Tableaux par categorie */}
            {Object.entries(groupedProducts).map(([categoryName, categoryProducts], categoryIndex) => (
                <div key={categoryIndex} style={{ marginBottom: '28px', pageBreakInside: 'avoid' }}>
                    <div style={{
                        backgroundColor: '#000', color: '#fff',
                        padding: '6px 12px', borderRadius: '3px 3px 0 0',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <span style={{ fontWeight: '700', fontSize: '13px', textTransform: 'uppercase' }}>
                            {categoryName}
                        </span>
                        <span style={{ fontSize: '11px' }}>
                            {categoryProducts.length} article{categoryProducts.length > 1 ? 's' : ''}
                        </span>
                    </div>

                    <table style={{
                        width: '100%', borderCollapse: 'collapse',
                        fontSize: '12px', border: '1px solid #000',
                    }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f0f0f0' }}>
                                <th style={thStyle({ width: '30px' })}>#</th>
                                <th style={thStyle({ width: '110px' })}>Reference</th>
                                <th style={thStyle({})}>Nom du produit</th>
                                <th style={thStyle({ width: '80px', textAlign: 'center' })}>Qte systeme</th>
                                <th style={thStyle({ width: '110px', textAlign: 'center', backgroundColor: '#fffde7' })}>Qte inventoriee</th>
                                <th style={thStyle({ width: '80px', textAlign: 'center' })}>Ecart</th>
                                <th style={thStyle({ width: '160px' })}>Observations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categoryProducts.map((product, index) => (
                                <tr key={product.id || index} style={{
                                    backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa',
                                }}>
                                    <td style={tdStyle({ textAlign: 'center', color: '#888', fontSize: '11px' })}>
                                        {index + 1}
                                    </td>
                                    <td style={tdStyle({ fontFamily: 'monospace', fontSize: '11px' })}>
                                        {product.reference || '-'}
                                    </td>
                                    <td style={tdStyle({ fontWeight: '600' })}>
                                        {product.name}
                                    </td>
                                    <td style={tdStyle({ textAlign: 'center', fontWeight: '700' })}>
                                        {product.quantity}
                                    </td>
                                    {/* Colonne a remplir a la main */}
                                    <td style={tdStyle({
                                        textAlign: 'center', backgroundColor: '#fffde7',
                                        borderLeft: '2px solid #f0c000', borderRight: '2px solid #f0c000',
                                        height: '32px',
                                    })}>
                                        &nbsp;
                                    </td>
                                    {/* Ecart */}
                                    <td style={tdStyle({ textAlign: 'center' })}>
                                        &nbsp;
                                    </td>
                                    {/* Observations */}
                                    <td style={tdStyle({})}>
                                        &nbsp;
                                    </td>
                                </tr>
                            ))}
                            {/* Ligne sous-total */}
                            <tr style={{ backgroundColor: '#e8e8e8', fontWeight: '700', fontSize: '12px' }}>
                                <td colSpan="3" style={tdStyle({ textAlign: 'right', paddingRight: '10px' })}>
                                    Total {categoryName}
                                </td>
                                <td style={tdStyle({ textAlign: 'center' })}>
                                    {categoryProducts.reduce((s, p) => s + (parseInt(p.quantity) || 0), 0)}
                                </td>
                                <td style={tdStyle({ backgroundColor: '#fffde7', borderLeft: '2px solid #f0c000', borderRight: '2px solid #f0c000' })}>
                                    &nbsp;
                                </td>
                                <td style={tdStyle({})}>&nbsp;</td>
                                <td style={tdStyle({})}>&nbsp;</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ))}

            {/* Pied de page — signatures */}
            <div style={{
                marginTop: '30px', border: '1px solid #000', borderRadius: '4px',
                padding: '16px 20px', pageBreakInside: 'avoid',
            }}>
                <p style={{ margin: '0 0 16px', fontWeight: '700', fontSize: '13px', textAlign: 'center', textTransform: 'uppercase' }}>
                    Validation de l'inventaire
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                    {['Responsable inventaire', 'Controleur', 'Direction'].map((role) => (
                        <div key={role} style={{ textAlign: 'center', fontSize: '12px' }}>
                            <p style={{ margin: '0 0 40px', fontWeight: '600' }}>{role}</p>
                            <div style={{ borderTop: '1px solid #000', paddingTop: '4px', color: '#555' }}>
                                Nom &amp; Signature
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Total general */}
            <div style={{
                marginTop: '16px', textAlign: 'right', fontSize: '13px',
                fontWeight: '700', color: '#10518E',
            }} className="print-hidden">
                Total general (systeme)&nbsp;: {products.reduce((s, p) => s + (parseInt(p.quantity) || 0), 0)} articles
            </div>
        </div>
    );
}

const thStyle = (extra = {}) => ({
    padding: '7px 10px', border: '1px solid #ccc',
    fontWeight: '700', fontSize: '11px', textAlign: 'left',
    textTransform: 'uppercase', letterSpacing: '0.03em',
    ...extra,
});

const tdStyle = (extra = {}) => ({
    padding: '6px 10px', border: '1px solid #ddd',
    verticalAlign: 'middle',
    ...extra,
});
