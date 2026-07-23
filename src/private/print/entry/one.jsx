import React from "react";
import { ArrowLeft, Printer } from 'lucide-react';

export default function PrintEntry({ entry, onBack }) {
  const handlePrint = () => window.print();

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

  const totalAmount = entry.entryproducts?.reduce(
    (sum, ep) => sum + ep.entry_purchase_price * ep.entry_product_quantity,
    0
  ) ?? 0;

  const providerName     = entry.provider?.provider_name     ?? '-';
  const providerEmail    = entry.provider?.provider_email    ?? '';
  const providerPhone    = entry.provider?.provider_phone    ?? '';
  const providerLocation = entry.provider?.provider_location ?? '';
  const userName = `${entry.user?.user_first_name ?? ''} ${entry.user?.user_second_name ?? ''}`.trim();

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
        maxWidth: '950px',
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
              Bon d'Entrée
            </div>
            <div style={{ fontSize: '16px', color: '#10518E', fontWeight: '700', marginTop: '6px' }}>
              {entry.invoice_number}
            </div>
            <div style={{ fontSize: '12px', color: '#667085', marginTop: '4px' }}>
              Date : {formatDate(entry.date_entry)}
            </div>
          </div>
        </div>

        {/* Fournisseur + Détails */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
          <div style={{
            flex: 1, backgroundColor: '#f8fafc', borderRadius: '10px',
            padding: '18px 22px', border: '1px solid #e2e8f0',
          }}>
            <div style={{
              fontSize: '10px', fontWeight: '700', color: '#10518E',
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px',
            }}>
              Fournisseur
            </div>
            <div style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a2e', marginBottom: '6px' }}>
              {providerName}
            </div>
            {providerPhone && (
              <div style={{ fontSize: '13px', color: '#475569', marginBottom: '3px' }}>
                Tél : {providerPhone}
              </div>
            )}
            {providerEmail && (
              <div style={{ fontSize: '13px', color: '#475569', marginBottom: '3px' }}>
                Email : {providerEmail}
              </div>
            )}
            {providerLocation && (
              <div style={{ fontSize: '13px', color: '#475569' }}>
                Adresse : {providerLocation}
              </div>
            )}
          </div>

          <div style={{
            flex: 1, backgroundColor: '#f8fafc', borderRadius: '10px',
            padding: '18px 22px', border: '1px solid #e2e8f0',
          }}>
            <div style={{
              fontSize: '10px', fontWeight: '700', color: '#10518E',
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px',
            }}>
              Détails
            </div>
            {[
              ['N° Facture',      entry.invoice_number],
              ['Date d\'entrée',  formatDate(entry.date_entry)],
              ['Enregistré par',  userName || '-'],
            ].map(([label, value]) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between',
                marginBottom: '6px', gap: '8px',
              }}>
                <span style={{ fontSize: '13px', color: '#667085' }}>{label}</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e', textAlign: 'right' }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tableau produits */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{
            fontSize: '10px', fontWeight: '700', color: '#10518E',
            textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px',
          }}>
            Produits réceptionnés
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#10518E' }}>
                {['Désignation', 'N° Lot', 'Péremption', 'Fabrication', 'Qté', 'P.U (XAF)', 'Total (XAF)'].map((col, i, arr) => (
                  <th key={col} style={{
                    padding: '11px 13px',
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
                      <td style={{ padding: '11px 13px', fontSize: '13px', fontWeight: '500', color: '#1a1a2e' }}>
                        {productName}
                      </td>
                      <td style={{ padding: '11px 13px', textAlign: 'center', fontSize: '13px', color: '#475569' }}>
                        {ep.batch_number ?? '-'}
                      </td>
                      <td style={{ padding: '11px 13px', textAlign: 'center', fontSize: '13px',
                        color: expired ? '#dc2626' : '#475569',
                        fontWeight: expired ? '600' : 'normal',
                      }}>
                        {formatDate(ep.expiry_date)}
                      </td>
                      <td style={{ padding: '11px 13px', textAlign: 'center', fontSize: '13px', color: '#475569' }}>
                        {formatDate(ep.manufacture_date)}
                      </td>
                      <td style={{ padding: '11px 13px', textAlign: 'right', fontSize: '13px', fontWeight: '700', color: '#1a1a2e' }}>
                        {ep.entry_product_quantity}
                      </td>
                      <td style={{ padding: '11px 13px', textAlign: 'right', fontSize: '13px', color: '#475569' }}>
                        {Number(ep.entry_purchase_price).toLocaleString('fr-FR')}
                      </td>
                      <td style={{ padding: '11px 13px', textAlign: 'right', fontSize: '13px', fontWeight: '700', color: '#10518E' }}>
                        {lineTotal.toLocaleString('fr-FR')}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '14px' }}>
                    Aucun produit
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
          <div style={{
            backgroundColor: '#10518E', borderRadius: '10px',
            padding: '16px 28px', minWidth: '260px', textAlign: 'right',
          }}>
            <div style={{
              fontSize: '11px', color: 'rgba(255,255,255,0.75)',
              marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.8px',
            }}>
              Montant Total
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>
              {totalAmount.toLocaleString('fr-FR')} XAF
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', gap: '48px',
          borderTop: '1.5px solid #e2e8f0', paddingTop: '28px',
        }}>
          {[
            { label: 'Signature du Fournisseur', name: providerName },
            { label: 'Signature du Réceptionniste', name: userName || '-' },
          ].map(({ label, name }) => (
            <div key={label} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#667085', marginBottom: '52px' }}>{label}</div>
              <div style={{
                borderTop: '1.5px solid #cbd5e1', paddingTop: '8px',
                fontSize: '13px', fontWeight: '600', color: '#1a1a2e',
              }}>
                {name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
