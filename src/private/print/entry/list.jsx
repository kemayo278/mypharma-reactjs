import React from "react";
import { ArrowLeft, Printer } from 'lucide-react';

export default function PrintEntries({ entries, onBack, message, titled }) {
  const handlePrint = () => window.print();

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('fr-FR');

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    if (String(dateStr).length === 8 && !String(dateStr).includes('-')) {
      const s = String(dateStr);
      return `${s.slice(6, 8)}/${s.slice(4, 6)}/${s.slice(0, 4)}`;
    }
    const d = new Date(dateStr);
    if (isNaN(d)) return String(dateStr);
    return d.toLocaleDateString('fr-FR');
  };

  const isExpired = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  };

  const grandTotal = entries.reduce((sum, entry) =>
    sum + (entry.entryproducts?.reduce(
      (s, ep) => s + ep.entry_purchase_price * ep.entry_product_quantity, 0
    ) ?? 0), 0
  );

  const periodLabel = message && message !== '' ? message : `Du ${formattedDate}`;

  return (
    <div className="container-fluid">
      <div className="print-hidden">
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', backgroundColor: '#fff', borderRadius: '10px',
          boxShadow: '0 1px 6px rgba(0,0,0,0.08)', marginBottom: '20px',
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
            <Printer size={16} /> Imprimer
          </button>
        </div>
      </div>

      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
        padding: '40px 48px',
        maxWidth: '1050px',
        margin: '0 auto',
        fontFamily: "'Segoe UI', Arial, sans-serif",
        color: '#1a1a2e',
      }}>
        {/* En-tête */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          marginBottom: '32px', borderBottom: '3px solid #10518E', paddingBottom: '24px',
        }}>
          <div>
            <div style={{ fontWeight: '800', fontSize: '28px', color: '#10518E', letterSpacing: '-0.5px' }}>
              MyPharma
            </div>
            <div style={{ color: '#667085', fontSize: '13px', marginTop: '4px' }}>
              Gestion Pharmaceutique
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {titled || 'Journal des Entrées'}
            </div>
            <div style={{ fontSize: '13px', color: '#667085', marginTop: '6px' }}>
              {periodLabel}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              Imprimé le {formattedDate}
            </div>
          </div>
        </div>

        {/* Résumé global */}
        <div style={{
          display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap',
        }}>
          {[
            { label: 'Nombre de factures', value: entries.length },
            { label: 'Lignes de produits', value: entries.reduce((s, e) => s + (e.entryproducts?.length ?? 0), 0) },
            { label: 'Montant total (XAF)', value: grandTotal.toLocaleString('fr-FR') },
          ].map(({ label, value }) => (
            <div key={label} style={{
              flex: 1, minWidth: '160px',
              backgroundColor: '#f8fafc', borderRadius: '10px',
              padding: '16px 20px', border: '1px solid #e2e8f0',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '11px', color: '#667085', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                {label}
              </div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#10518E' }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Une section par facture */}
        {entries.map((entry, entryIndex) => {
          const entryTotal = entry.entryproducts?.reduce(
            (s, ep) => s + ep.entry_purchase_price * ep.entry_product_quantity, 0
          ) ?? 0;

          return (
            <div key={entry.entry_id ?? entryIndex} style={{
              marginBottom: entryIndex < entries.length - 1 ? '36px' : '0',
              borderBottom: entryIndex < entries.length - 1 ? '2px dashed #e2e8f0' : 'none',
              paddingBottom: entryIndex < entries.length - 1 ? '36px' : '0',
            }}>
              {/* Titre de la facture */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                backgroundColor: '#f0f6ff', borderRadius: '8px',
                padding: '12px 18px', marginBottom: '14px',
                border: '1px solid #d0e4f7',
              }}>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#10518E' }}>
                    {entry.invoice_number}
                  </span>
                  {entry.provider?.provider_name && (
                    <span style={{ fontSize: '13px', color: '#475569', marginLeft: '14px' }}>
                      Fournisseur : <strong>{entry.provider.provider_name}</strong>
                    </span>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '12px', color: '#667085', marginRight: '16px' }}>
                    {formatDate(entry.date_entry)}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#10518E' }}>
                    {entryTotal.toLocaleString('fr-FR')} XAF
                  </span>
                </div>
              </div>

              {/* Tableau des produits de cette facture */}
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#10518E' }}>
                    {['Désignation', 'N° Lot', 'Péremption', 'Fabrication', 'Qté', 'P.U (XAF)', 'Total (XAF)'].map((col, i, arr) => (
                      <th key={col} style={{
                        padding: '10px 12px',
                        textAlign: i === 0 ? 'left' : i >= 4 ? 'right' : 'center',
                        fontSize: '12px', fontWeight: '600', color: '#fff',
                        borderRadius: i === 0 ? '6px 0 0 0' : i === arr.length - 1 ? '0 6px 0 0' : '0',
                      }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entry.entryproducts?.length > 0 ? (
                    entry.entryproducts.map((ep, index) => {
                      const productName = ep.product?.name ?? ep.product?.product_name ?? '-';
                      const lineTotal   = ep.entry_purchase_price * ep.entry_product_quantity;
                      const expired     = isExpired(ep.expiry_date);

                      return (
                        <tr key={ep.entry_product_id ?? index} style={{
                          backgroundColor: index % 2 === 0 ? '#f8fafc' : '#fff',
                          borderBottom: '1px solid #e2e8f0',
                        }}>
                          <td style={{ padding: '10px 12px', fontSize: '13px', fontWeight: '500', color: '#1a1a2e' }}>
                            {productName}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center', fontSize: '13px', color: '#475569' }}>
                            {ep.batch_number ?? '-'}
                          </td>
                          <td style={{
                            padding: '10px 12px', textAlign: 'center', fontSize: '13px',
                            color: expired ? '#dc2626' : '#475569',
                            fontWeight: expired ? '600' : 'normal',
                          }}>
                            {formatDate(ep.expiry_date)}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center', fontSize: '13px', color: '#475569' }}>
                            {formatDate(ep.manufacture_date)}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '13px', fontWeight: '700', color: '#1a1a2e' }}>
                            {ep.entry_product_quantity}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '13px', color: '#475569' }}>
                            {Number(ep.entry_purchase_price).toLocaleString('fr-FR')}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '13px', fontWeight: '700', color: '#10518E' }}>
                            {lineTotal.toLocaleString('fr-FR')}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '18px', color: '#94a3b8', fontSize: '13px' }}>
                        Aucun produit
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          );
        })}

        {/* Total général */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px', marginBottom: '40px' }}>
          <div style={{
            backgroundColor: '#10518E', borderRadius: '10px',
            padding: '16px 28px', minWidth: '280px', textAlign: 'right',
          }}>
            <div style={{
              fontSize: '11px', color: 'rgba(255,255,255,0.75)',
              marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.8px',
            }}>
              Total Général
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>
              {grandTotal.toLocaleString('fr-FR')} XAF
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', gap: '48px',
          borderTop: '1.5px solid #e2e8f0', paddingTop: '28px',
        }}>
          {['Responsable des Achats', 'Directeur / Gérant'].map((label) => (
            <div key={label} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#667085', marginBottom: '52px' }}>{label}</div>
              <div style={{
                borderTop: '1.5px solid #cbd5e1', paddingTop: '8px',
                fontSize: '13px', fontWeight: '600', color: '#1a1a2e',
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
