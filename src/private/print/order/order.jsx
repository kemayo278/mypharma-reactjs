import React from "react";
import { ArrowLeft, Printer } from 'lucide-react';

export default function PrintOrder({ order, label, institution, onBack }) {
  const handlePrint = () => window.print();

  const sales = order.falsesales;

  const cuisineProducts = sales?.filter(s =>
    s.product.product_source?.toLowerCase() === 'cuisine'
  ) ?? [];
  const barProducts = sales?.filter(s =>
    s.product.product_source?.toLowerCase() === 'bar'
  ) ?? [];
  const cuisineTotal = cuisineProducts.reduce((t, s) => t + s.sell_price * s.sale_quantity, 0);
  const barTotal     = barProducts.reduce((t, s) => t + s.sell_price * s.sale_quantity, 0);

  const titleMap = {
    'unpaid and not cleared': 'Bon de Commande',
    'unpaid and destocked':   'Facture',
    'debt':                   'Facture Dette',
  };
  const title = titleMap[order.order_state] ?? 'Facture';

  const footerMap = {
    'paid':             'Espèce',
    'paid OM':          'Orange Money',
    'paid MOMO':        'Mobile Money',
    'paid OFFRE':       'Offre',
    'paid OM ESPECE':   'OM & Espèce',
    'paid MOMO ESPECE': 'MOMO & Espèce',
  };
  const footerTitle = footerMap[order.order_state] ?? 'Inconnu';

  const userName = order.user
    ? `${order.user.user_first_name} ${order.user.user_second_name}`
    : 'N/A';

  const isNotUnpaidCleared = order.order_state !== 'unpaid and not cleared';

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
    padding: '40px 48px',
    maxWidth: '960px',
    margin: '0 auto',
    fontFamily: "'Segoe UI', Arial, sans-serif",
    color: '#1a1a2e',
    fontSize: '16px',
  };

  const renderHeader = (docTitle, badge = null) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      marginBottom: '28px', borderBottom: '3px solid #10518E', paddingBottom: '20px',
    }}>
      <img src="/logo.png" alt="Logo" style={{ height: '72px', objectFit: 'contain' }} />
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '26px', fontWeight: '700', color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {docTitle}
        </div>
        {badge && (
          <span style={{
            display: 'inline-block', marginTop: '6px',
            backgroundColor: '#10518E', color: '#fff',
            borderRadius: '20px', padding: '4px 16px',
            fontSize: '15px', fontWeight: '600',
          }}>
            {badge}
          </span>
        )}
        <div style={{ fontSize: '15px', color: '#94a3b8', marginTop: '6px' }}>
          {order.order_reference}
        </div>
      </div>
    </div>
  );

  const renderInfoRow = (label, value, highlight = false) => (
    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <span style={{ fontSize: '16px', color: '#667085' }}>{label}</span>
      <span style={{ fontSize: '16px', fontWeight: '600', color: highlight ? '#10518E' : '#1a1a2e' }}>
        {value ?? '-'}
      </span>
    </div>
  );

  const renderProductTable = (productList) => (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: '#10518E' }}>
          {[['Désignation', 'left', true, false], ['Qté', 'center', false, false], ['P.U (XAF)', 'right', false, false], ['Total (XAF)', 'right', false, true]].map(([col, align, first, last]) => (
            <th key={col} style={{
              padding: '13px 15px', textAlign: align,
              fontSize: '15px', fontWeight: '700', color: '#fff',
              borderRadius: first ? '6px 0 0 0' : last ? '0 6px 0 0' : '0',
            }}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {productList?.map((sale, index) => (
          <tr key={index} style={{
            backgroundColor: index % 2 === 0 ? '#f8fafc' : '#fff',
            borderBottom: '1px solid #e2e8f0',
          }}>
            <td style={{ padding: '13px 15px', fontSize: '16px', fontWeight: '500', color: '#1a1a2e' }}>
              {sale.product.name}
            </td>
            <td style={{ padding: '13px 15px', textAlign: 'center', fontSize: '16px', fontWeight: '700', color: '#1a1a2e' }}>
              {sale.sale_quantity}
            </td>
            <td style={{ padding: '13px 15px', textAlign: 'right', fontSize: '16px', color: '#475569' }}>
              {Number(sale.sell_price).toLocaleString('fr-FR')}
            </td>
            <td style={{ padding: '13px 15px', textAlign: 'right', fontSize: '16px', fontWeight: '700', color: '#10518E' }}>
              {(sale.sell_price * sale.sale_quantity).toLocaleString('fr-FR')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderTotal = (amount, label = 'Total à Payer') => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '24px 0' }}>
      <div style={{
        backgroundColor: '#10518E', borderRadius: '10px',
        padding: '16px 30px', minWidth: '260px', textAlign: 'right',
      }}>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          {label}
        </div>
        <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff' }}>
          {Number(amount).toLocaleString('fr-FR')} XAF
        </div>
      </div>
    </div>
  );

  const renderFooterText = (extra = null) => (
    <div style={{ marginTop: '8px' }}>
      {extra && (
        <div style={{
          textAlign: 'center', padding: '12px 18px',
          backgroundColor: '#f0f6ff', borderRadius: '8px',
          border: '1px solid #d0e4f7', marginBottom: '16px',
        }}>
          <span style={{ fontSize: '16px', color: '#10518E', fontWeight: '600' }}>{extra}</span>
        </div>
      )}
      <div style={{ textAlign: 'center', color: '#667085', fontSize: '16px', fontStyle: 'italic' }}>
        Merci et à Bientôt.
      </div>
    </div>
  );

  // ── Bon de commande section (Cuisine / Bar) ───────────────────────────────
  const renderBonCommandeSection = (products, sectionTitle, sectionTotal) => {
    if (products.length === 0) return null;

    return (
      <div style={{ ...cardStyle, pageBreakAfter: 'always', marginBottom: '32px' }}>
        {renderHeader('Bon de Commande', sectionTitle)}

        <div style={{
          backgroundColor: '#f8fafc', borderRadius: '10px',
          padding: '18px 22px', border: '1px solid #e2e8f0', marginBottom: '24px',
        }}>
          {renderInfoRow('Intitulé',  order.order_titled)}
          {renderInfoRow('Référence', order.order_reference)}
          {renderInfoRow('Date',      order.order_created_at)}
          {renderInfoRow('Par',       userName)}
          {renderInfoRow('Section',   sectionTitle, true)}
        </div>

        {renderProductTable(products)}
        {renderTotal(sectionTotal, `Total ${sectionTitle}`)}
        {renderFooterText()}
      </div>
    );
  };

  return (
    <div className="container-fluid">
      <style>{`
        @media print {
          .print-doc { font-size: 18px !important; }
          .print-doc table th { font-size: 16px !important; padding: 14px 16px !important; }
          .print-doc table td { font-size: 17px !important; padding: 14px 16px !important; }
          .print-doc .print-info-label { font-size: 17px !important; }
          .print-doc .print-info-value { font-size: 17px !important; }
          .print-doc .print-total-amount { font-size: 30px !important; }
          .print-doc .print-footer-text { font-size: 17px !important; }
          .print-doc .print-title { font-size: 28px !important; }
        }
      `}</style>

      {/* Barre d'action */}
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

      {label === 'bon_commande' ? (
        <>
          {renderBonCommandeSection(cuisineProducts, 'Cuisine', cuisineTotal)}
          {renderBonCommandeSection(barProducts,    'Bar',     barTotal)}

          {/* Fallback : aucun produit cuisine ni bar */}
          {cuisineProducts.length === 0 && barProducts.length === 0 && (
            <div className="print-doc" style={cardStyle}>
              {renderHeader('Bon de Commande')}

              <div style={{
                backgroundColor: '#f8fafc', borderRadius: '10px',
                padding: '18px 22px', border: '1px solid #e2e8f0', marginBottom: '24px',
              }}>
                {renderInfoRow('Intitulé',  order.order_titled)}
                {renderInfoRow('Référence', order.order_reference)}
                {renderInfoRow('Date',      order.order_created_at)}
                {renderInfoRow('Par',       userName)}
              </div>

              {renderProductTable(sales)}
              {renderTotal(order.order_price)}
              {renderFooterText()}
            </div>
          )}
        </>
      ) : (
        // ── Facture / autres documents ─────────────────────────────────────
        <div className="print-doc" style={cardStyle}>
          {/* En-tête avec logo + institution */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            marginBottom: '28px', borderBottom: '3px solid #10518E', paddingBottom: '20px',
          }}>
            <div>
              <img src="/logo.png" alt="Logo" style={{ height: '72px', objectFit: 'contain', marginBottom: '6px', display: 'block' }} />
              {isNotUnpaidCleared && institution && (
                <>
                  <div style={{ fontWeight: '700', fontSize: '18px', color: '#1a1a2e' }}>
                    {institution.Institution_name}
                  </div>
                  <div style={{ fontSize: '15px', color: '#667085' }}>
                    {institution.Institution_state}
                  </div>
                </>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="print-title" style={{ fontSize: '26px', fontWeight: '700', color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {title}
              </div>
              <div style={{ fontSize: '15px', color: '#667085', marginTop: '6px' }}>
                {order.order_reference}
              </div>
              <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '2px' }}>
                {order.order_created_at}
              </div>
            </div>
          </div>

          {/* Infos institution (matricule, déclaration, registre) */}
          {isNotUnpaidCleared && institution && (
            <div style={{
              backgroundColor: '#f8fafc', borderRadius: '8px',
              padding: '12px 18px', border: '1px solid #e2e8f0',
              marginBottom: '20px', textAlign: 'center',
              fontSize: '15px', color: '#475569',
              display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap',
            }}>
              {institution.Institution_matriculation   && <span>{institution.Institution_matriculation}</span>}
              {institution.Institution_num_declaration && <span>{institution.Institution_num_declaration}</span>}
              {institution.Institution_number_register && <span>{institution.Institution_number_register}</span>}
            </div>
          )}

          {/* Client + détails commande */}
          {isNotUnpaidCleared && (
            <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
              <div style={{
                flex: 1, backgroundColor: '#f8fafc', borderRadius: '10px',
                padding: '18px 22px', border: '1px solid #e2e8f0',
              }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#10518E', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                  Client
                </div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e' }}>
                  {!order.customerName || order.customerName === '' ? 'Client Divers' : order.customerName}
                </div>
              </div>

              <div style={{
                flex: 2, backgroundColor: '#f8fafc', borderRadius: '10px',
                padding: '18px 22px', border: '1px solid #e2e8f0',
              }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#10518E', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                  Détails
                </div>
                {renderInfoRow('Date',      order.order_created_at)}
                {renderInfoRow('Référence', order.order_reference)}
                {renderInfoRow('Intitulé',  order.order_titled)}
                {renderInfoRow('Caisse',    userName)}
              </div>
            </div>
          )}

          {renderProductTable(sales)}
          {renderTotal(order.order_price)}
          {renderFooterText(`Mode de Paiement : ${footerTitle}`)}

          {isNotUnpaidCleared && (
            <div style={{ textAlign: 'right', fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', marginTop: '16px' }}>
              MyPharma : Your Best Partner
            </div>
          )}
        </div>
      )}
    </div>
  );
}
