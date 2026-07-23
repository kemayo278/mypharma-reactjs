import React from "react";
import { ArrowLeft, Printer } from 'lucide-react';

export default function PrintRecapOrders({
  institution, product_recap, total_amount,
  order_references, user_names, order_titled, order_date, onBack,
}) {
  const handlePrint = () => window.print();

  const sales = product_recap;

  const totalComputed = sales?.reduce(
    (sum, sale) => sum + sale.product_details.product_sale_price * sale.quantity, 0
  ) ?? 0;

  const displayTotal = total_amount ?? totalComputed;

  return (
    <div className="container-fluid">
      <style>{`
        @media print {
          .print-doc-recap { font-size: 17px !important; }
          .print-doc-recap table th { font-size: 16px !important; padding: 14px 16px !important; }
          .print-doc-recap table td { font-size: 17px !important; padding: 14px 16px !important; }
          .print-doc-recap .print-total-amount { font-size: 30px !important; }
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

      {/* Document */}
      <div className="print-doc-recap" style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
        padding: '40px 48px',
        maxWidth: '900px',
        margin: '0 auto',
        fontFamily: "'Segoe UI', Arial, sans-serif",
        color: '#1a1a2e',
        fontSize: '16px',
      }}>
        {/* En-tête */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          marginBottom: '28px', borderBottom: '3px solid #10518E', paddingBottom: '20px',
        }}>
          <div>
            <div style={{ fontWeight: '800', fontSize: '26px', color: '#10518E', letterSpacing: '-0.5px' }}>
              {institution?.Institution_name ?? 'MyPharma'}
            </div>
            {institution?.Institution_state && (
              <div style={{ fontSize: '14px', color: '#667085', marginTop: '4px' }}>
                {institution.Institution_state}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Facture Récap
            </div>
            <div style={{ fontSize: '15px', color: '#10518E', fontWeight: '600', marginTop: '6px' }}>
              {order_references}
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
              {order_date}
            </div>
          </div>
        </div>

        {/* Institution + Détails */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
          <div style={{
            flex: 1, backgroundColor: '#f8fafc', borderRadius: '10px',
            padding: '18px 22px', border: '1px solid #e2e8f0',
          }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#10518E', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
              Établissement
            </div>
            <div style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a2e', marginBottom: '6px' }}>
              {institution?.Institution_name ?? '-'}
            </div>
            {institution?.Institution_matriculation && (
              <div style={{ fontSize: '14px', color: '#475569', marginBottom: '3px' }}>
                Mat : {institution.Institution_matriculation}
              </div>
            )}
            {institution?.Institution_num_declaration && (
              <div style={{ fontSize: '14px', color: '#475569', marginBottom: '3px' }}>
                N° Déc : {institution.Institution_num_declaration}
              </div>
            )}
            {institution?.Institution_number_register && (
              <div style={{ fontSize: '14px', color: '#475569' }}>
                Registre : {institution.Institution_number_register}
              </div>
            )}
          </div>

          <div style={{
            flex: 1, backgroundColor: '#f8fafc', borderRadius: '10px',
            padding: '18px 22px', border: '1px solid #e2e8f0',
          }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#10518E', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
              Détails
            </div>
            {[
              ['Date',      order_date],
              ['Référence', order_references],
              ['Intitulé',  order_titled],
              ['Caisse',    user_names],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                <span style={{ fontSize: '15px', color: '#667085' }}>{label}</span>
                <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a2e' }}>{value ?? '-'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tableau */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#10518E', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
            Produits
          </div>
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
              {sales?.map((sale, index) => (
                <tr key={index} style={{
                  backgroundColor: index % 2 === 0 ? '#f8fafc' : '#fff',
                  borderBottom: '1px solid #e2e8f0',
                }}>
                  <td style={{ padding: '13px 15px', fontSize: '16px', fontWeight: '500', color: '#1a1a2e' }}>
                    {sale.product_details.product_name}
                  </td>
                  <td style={{ padding: '13px 15px', textAlign: 'center', fontSize: '16px', fontWeight: '700', color: '#1a1a2e' }}>
                    {sale.quantity}
                  </td>
                  <td style={{ padding: '13px 15px', textAlign: 'right', fontSize: '16px', color: '#475569' }}>
                    {Number(sale.product_details.product_sale_price).toLocaleString('fr-FR')}
                  </td>
                  <td style={{ padding: '13px 15px', textAlign: 'right', fontSize: '16px', fontWeight: '700', color: '#10518E' }}>
                    {(sale.product_details.product_sale_price * sale.quantity).toLocaleString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '24px 0' }}>
          <div style={{
            backgroundColor: '#10518E', borderRadius: '10px',
            padding: '16px 30px', minWidth: '260px', textAlign: 'right',
          }}>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Total à Payer
            </div>
            <div className="print-total-amount" style={{ fontSize: '28px', fontWeight: '800', color: '#fff' }}>
              {Number(displayTotal).toLocaleString('fr-FR')} XAF
            </div>
          </div>
        </div>

        {/* Mode + Merci */}
        <div style={{
          textAlign: 'center', padding: '12px 18px',
          backgroundColor: '#f0f6ff', borderRadius: '8px',
          border: '1px solid #d0e4f7', marginBottom: '20px',
        }}>
          <span style={{ fontSize: '16px', color: '#10518E', fontWeight: '600' }}>
            Mode de Paiement : CASH
          </span>
        </div>

        <div style={{ textAlign: 'center', color: '#667085', fontSize: '16px', fontStyle: 'italic', marginBottom: '16px' }}>
          Merci et à Bientôt.
        </div>

        <div style={{ textAlign: 'right', fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>
          MyLounge : Your Business Partner
        </div>
      </div>
    </div>
  );
}
