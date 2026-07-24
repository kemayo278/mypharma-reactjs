import React, { useEffect, useState } from "react";
import { ArrowLeft, Filter, Printer } from 'lucide-react';
import * as XLSX from "xlsx";

const groupAndSumQuantities = (allSales) => {
  const grouped = allSales.reduce((acc, sale) => {
    const productId = sale.product?.id ?? sale.product?.product_id ?? sale.product_id;
    if (!acc[productId]) {
      acc[productId] = { ...sale, sale_quantity: 0 };
    }
    acc[productId].sale_quantity += sale.sale_quantity;
    return acc;
  }, {});
  return Object.values(grouped);
};

export default function PrintOrders({ orders, onBack, message, titled }) {
  const [sourceFilter,   setSourceFilter]   = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [userFilter,     setUserFilter]     = useState('all');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableSources,    setAvailableSources]    = useState([]);
  const [availableUsers,      setAvailableUsers]      = useState([]);
  const [showFilters,    setShowFilters]    = useState(false);
  const [filteredSales,  setFilteredSales]  = useState([]);

  const getActiveFiltersCount = () =>
    [sourceFilter, categoryFilter, userFilter].filter(f => f !== 'all').length;

  const clearFilters = () => {
    setSourceFilter('all');
    setCategoryFilter('all');
    setUserFilter('all');
  };

  const extractAvailableUsers = (orders) => {
    const map = new Map();
    orders.forEach(order => {
      if (order.user) {
        const key = order.user.user_id.toString();
        if (!map.has(key)) {
          map.set(key, {
            id: order.user.user_id,
            name: `${order.user.user_first_name} ${order.user.user_second_name}`,
            pseudo: order.user.user_pseudo || '',
          });
        }
      }
    });
    return Array.from(map.values());
  };

  const extractAvailableSources = (sales) => {
    const set = new Set();
    sales.forEach(sale => {
      const src = sale.product?.source ?? sale.product?.product_source;
      if (src) set.add(src);
    });
    return Array.from(set).map(source => ({
      value: source.toLowerCase(),
      label: source,
      emoji: source.toLowerCase() === 'bar' ? '🍹' : '🍽️',
    }));
  };

  const extractAvailableCategories = (sales) => {
    const map = new Map();
    sales.forEach(sale => {
      if (sale.product?.category_id) {
        const key = sale.product.category_id.toString();
        if (!map.has(key)) {
          map.set(key, {
            id: sale.product.category_id,
            name: sale.product.category?.category_name ?? `Catégorie ${sale.product.category_id}`,
          });
        }
      }
    });
    return Array.from(map.values());
  };

  const getSalesCountBySource = (source, sales) => {
    if (source === 'all') return sales.length;
    return sales.filter(sale => {
      const s = sale.product?.source ?? sale.product?.product_source;
      if (!s) return false;
      const n = s.toLowerCase().trim();
      const f = source.toLowerCase().trim();
      return n === f ||
        (f === 'kitchen' && (n === 'cuisine' || n === 'kitchen')) ||
        (f === 'bar' && n === 'bar');
    }).length;
  };

  const getSalesCountByCategory = (categoryId, sales) => {
    if (categoryId === 'all') return sales.length;
    return sales.filter(s =>
      s.product?.category_id?.toString() === categoryId
    ).length;
  };

  const getSalesCountByUser = (userId) => {
    if (userId === 'all') return orders.length;
    return orders.filter(o => o.user?.user_id.toString() === userId).length;
  };

  const handlePrint = () => window.print();

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('fr-FR');

  function getYesterday() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toLocaleDateString('fr-FR');
  }
  const YesterdayformattedDate = getYesterday();

  const handleExportExcel = () => {
    const data = filteredSales.map((sale) => ({
      Designation: sale.product.name,
      Source: sale.product?.source ?? sale.product?.product_source ?? 'Non spécifiée',
      Catégorie: sale.product.category?.category_name || `Catégorie ${sale.product.category_id}` || 'Non spécifiée',
      Utilisateur: sale.order_user_name || 'Non spécifié',
      Quantité: sale.sale_quantity,
      'Prix Unitaire (XAF)': sale.sell_price,
      'Total (XAF)': sale.sell_price * sale.sale_quantity,
    }));
    const filteredTotal = filteredSales.reduce((s, sale) => s + sale.sell_price * sale.sale_quantity, 0);
    data.push({ Designation: 'TOTAL', Source: '', Catégorie: '', Utilisateur: '', Quantité: '', 'Prix Unitaire (XAF)': '', 'Total (XAF)': filteredTotal });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook  = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, titled);

    let suffix = '';
    if (sourceFilter   !== 'all') suffix += `_${availableSources.find(s => s.value === sourceFilter)?.label || sourceFilter}`;
    if (categoryFilter !== 'all') suffix += `_${availableCategories.find(c => c.id.toString() === categoryFilter)?.name || `Cat${categoryFilter}`}`;
    if (userFilter     !== 'all') suffix += `_${(availableUsers.find(u => u.id.toString() === userFilter)?.name || `User${userFilter}`).replace(' ', '_')}`;

    const period = message === '' ? ` du ${YesterdayformattedDate} 00h00 Au ${formattedDate} 23h59` : message;
    XLSX.writeFile(workbook, `${titled}${period}${suffix}.xlsx`);
  };

  // Filtrer par utilisateur en premier
  const filteredOrders = userFilter !== 'all'
    ? orders.filter(o => o.user?.user_id.toString() === userFilter)
    : orders;

  const allSales = filteredOrders.flatMap(order =>
    (order.falsesales ?? []).map(sale => ({
      ...sale,
      order_user_name: order.user ? `${order.user.user_first_name} ${order.user.user_second_name}` : 'N/A',
      order_user_id: order.user?.user_id ?? null,
    }))
  );

  const groupedSales = groupAndSumQuantities(allSales);

  useEffect(() => {
    const filtered = groupedSales.filter(sale => {
      let matchesSource = true;
      if (sourceFilter !== 'all') {
        const s = sale.product?.source ?? sale.product?.product_source;
        if (s) {
          const n = s.toLowerCase().trim();
          const f = sourceFilter.toLowerCase().trim();
          matchesSource = n === f ||
            (f === 'kitchen' && (n === 'cuisine' || n === 'kitchen')) ||
            (f === 'bar' && n === 'bar');
        } else {
          matchesSource = false;
        }
      }
      const matchesCategory = categoryFilter === 'all' ||
        (sale.product?.category_id?.toString() === categoryFilter);
      return matchesSource && matchesCategory;
    });
    setFilteredSales(filtered);
  }, [groupedSales.length, sourceFilter, categoryFilter]);

  useEffect(() => {
    setAvailableCategories(extractAvailableCategories(groupedSales));
    setAvailableSources(extractAvailableSources(groupedSales));
    setAvailableUsers(extractAvailableUsers(orders));
  }, [groupedSales.length, orders.length]);

  const totalAmount     = filteredSales.reduce((s, sale) => s + sale.sell_price * sale.sale_quantity, 0);
  const totalQuantity   = filteredSales.reduce((s, sale) => s + sale.sale_quantity, 0);
  const periodLabel     = message && message !== '' ? message : `Du ${YesterdayformattedDate} 00h00 Au ${formattedDate} 23h59`;

  const activeFilterLabels = [
    userFilter     !== 'all' && availableUsers.find(u => u.id.toString() === userFilter)?.name,
    sourceFilter   !== 'all' && availableSources.find(s => s.value === sourceFilter)?.label,
    categoryFilter !== 'all' && availableCategories.find(c => c.id.toString() === categoryFilter)?.name,
  ].filter(Boolean);

  return (
    <div className="container-fluid" style={{ padding: '20px', backgroundColor: '#f9fafb' }}>
      <style>{`
        @media print {
          .print-doc-orders { font-size: 17px !important; }
          .print-doc-orders table th { font-size: 15px !important; padding: 13px 14px !important; }
          .print-doc-orders table td { font-size: 16px !important; padding: 13px 14px !important; }
          .print-doc-orders .print-total-row td { font-size: 17px !important; }
        }
      `}</style>

      {/* ── Barre d'actions ─────────────────────────────────────────────── */}
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
              <Printer size={16} /> Exporter Excel
            </button>
          </div>
        </div>
      </div>

      {/* ── Filtres ─────────────────────────────────────────────────────── */}
      <div className="print-hidden" style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setShowFilters(!showFilters)} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '8px',
            border: '1.5px solid #10518E',
            backgroundColor: showFilters ? '#10518E' : '#fff',
            color: showFilters ? '#fff' : '#10518E',
            fontWeight: '600', fontSize: '13px', cursor: 'pointer',
          }}>
            <Filter size={15} />
            Filtres {getActiveFiltersCount() > 0 && (
              <span style={{
                backgroundColor: showFilters ? '#fff' : '#10518E',
                color: showFilters ? '#10518E' : '#fff',
                borderRadius: '50%', width: '18px', height: '18px',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: '700',
              }}>{getActiveFiltersCount()}</span>
            )}
          </button>
          {getActiveFiltersCount() > 0 && (
            <button onClick={clearFilters} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '8px',
              border: '1.5px solid #f04438', backgroundColor: '#fff',
              color: '#f04438', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
            }}>
              Effacer les filtres
            </button>
          )}
        </div>

        {showFilters && (
          <div style={{
            marginTop: '12px', backgroundColor: '#f9fafb',
            padding: '18px 20px', borderRadius: '10px', border: '1px solid #e4e7ec',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#344054', marginBottom: '6px', fontSize: '13px' }}>
                  Utilisateur
                </label>
                <select value={userFilter} onChange={e => setUserFilter(e.target.value)} style={{
                  width: '100%', padding: '9px 12px', border: '1.5px solid #d0d5dd',
                  borderRadius: '8px', fontSize: '13px', backgroundColor: '#fff', cursor: 'pointer', outline: 'none',
                }}>
                  <option value="all">Tous les utilisateurs ({getSalesCountByUser('all')})</option>
                  {availableUsers.map(u => (
                    <option key={u.id} value={u.id.toString()}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#344054', marginBottom: '6px', fontSize: '13px' }}>
                  Catégorie
                </label>
                <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{
                  width: '100%', padding: '9px 12px', border: '1.5px solid #d0d5dd',
                  borderRadius: '8px', fontSize: '13px', backgroundColor: '#fff', cursor: 'pointer', outline: 'none',
                }}>
                  <option value="all">Toutes les catégories ({getSalesCountByCategory('all', groupedSales)})</option>
                  {availableCategories.map(c => (
                    <option key={c.id} value={c.id.toString()}>
                      {c.name} ({getSalesCountByCategory(c.id.toString(), groupedSales)})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Document imprimable ─────────────────────────────────────────── */}
      <div className="print-doc-orders" style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
        padding: '40px 48px',
        maxWidth: '1050px',
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
            <div style={{ fontWeight: '800', fontSize: '28px', color: '#10518E', letterSpacing: '-0.5px' }}>
              MyPharma
            </div>
            <div style={{ color: '#667085', fontSize: '14px', marginTop: '4px' }}>
              Gestion Pharmaceutique
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {titled || 'Journal des Ventes'}
            </div>
            <div style={{ fontSize: '14px', color: '#667085', marginTop: '6px' }}>
              {periodLabel}
            </div>
            {activeFilterLabels.length > 0 && (
              <div style={{ fontSize: '13px', color: '#10518E', fontStyle: 'italic', marginTop: '4px' }}>
                Filtré : {activeFilterLabels.join(' · ')}
              </div>
            )}
            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
              Imprimé le {formattedDate}
            </div>
          </div>
        </div>

        {/* Résumé */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {[
            { label: 'Références produits', value: filteredSales.length },
            { label: 'Quantité totale vendue', value: totalQuantity.toLocaleString('fr-FR') },
            { label: 'Chiffre d\'affaires (XAF)', value: totalAmount.toLocaleString('fr-FR') },
          ].map(({ label, value }) => (
            <div key={label} style={{
              flex: 1, minWidth: '160px',
              backgroundColor: '#f8fafc', borderRadius: '10px',
              padding: '16px 20px', border: '1px solid #e2e8f0', textAlign: 'center',
            }}>
              <div style={{ fontSize: '12px', color: '#667085', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                {label}
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#10518E' }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Tableau */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#10518E' }}>
              {[
                ['Désignation', 'left',   true,  false],
                ['Utilisateur', 'center', false, false],
                ['Catégorie',   'center', false, false],
                ['Qté',         'center', false, false],
                ['P.U (XAF)',   'right',  false, false],
                ['Total (XAF)', 'right',  false, true ],
              ].map(([col, align, first, last]) => (
                <th key={col} style={{
                  padding: '13px 14px', textAlign: align,
                  fontSize: '15px', fontWeight: '700', color: '#fff',
                  borderRadius: first ? '6px 0 0 0' : last ? '0 6px 0 0' : '0',
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale, index) => (
              <tr key={index} style={{
                backgroundColor: index % 2 === 0 ? '#f8fafc' : '#fff',
                borderBottom: '1px solid #e2e8f0',
              }}>
                <td style={{ padding: '12px 14px', fontSize: '16px', fontWeight: '500', color: '#1a1a2e' }}>
                  {sale.product.name}
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                  <span style={{
                    display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
                    fontSize: '13px', fontWeight: '600',
                    backgroundColor: '#dae6ed', color: '#10518E',
                  }}>
                    {sale.order_user_name || 'N/A'}
                  </span>
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                  <span style={{
                    display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
                    fontSize: '13px', fontWeight: '600',
                    backgroundColor: '#e8f4e8', color: '#2d6a2d',
                  }}>
                    {sale.product.category?.category_name || `Cat ${sale.product.category_id}` || 'N/A'}
                  </span>
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'center', fontSize: '16px', fontWeight: '700', color: '#1a1a2e' }}>
                  {sale.sale_quantity}
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontSize: '16px', color: '#475569' }}>
                  {Number(sale.sell_price).toLocaleString('fr-FR')}
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontSize: '16px', fontWeight: '700', color: '#10518E' }}>
                  {(sale.sell_price * sale.sale_quantity).toLocaleString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total général */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '24px 0 40px' }}>
          <div style={{
            backgroundColor: '#10518E', borderRadius: '10px',
            padding: '16px 30px', minWidth: '280px', textAlign: 'right',
          }}>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Chiffre d'Affaires Total
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff' }}>
              {totalAmount.toLocaleString('fr-FR')} XAF
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <div style={{
          borderTop: '1.5px solid #e2e8f0', paddingTop: '20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>
            MyPharma : Your Best Partner
          </div>
          <div style={{ fontSize: '13px', color: '#94a3b8' }}>
            {filteredSales.length} produit(s) · {totalQuantity.toLocaleString('fr-FR')} unité(s)
          </div>
        </div>
      </div>
    </div>
  );
}
