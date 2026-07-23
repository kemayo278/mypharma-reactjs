/**
 * Component to display lot allocation history for a sale
 * Shows which product lots were consumed by a specific sale (FIFO allocation tracking)
 */

import React, { useEffect, useState } from 'react';
import { formatDateDisplay } from '@services/productHelpers';

export default function LotAllocationHistory({ saleId, sale }) {
    const [allocations, setAllocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (sale && sale.lotAllocations) {
            // If lot allocations are already included in the sale object
            setAllocations(Array.isArray(sale.lotAllocations) ? sale.lotAllocations : []);
        }
    }, [sale]);

    if (loading) {
        return <div className="text-center"><span className="loader"></span></div>;
    }

    if (error) {
        return <div style={{ color: '#d33', padding: '10px', backgroundColor: '#fee4e2', borderRadius: '4px' }}>
            Erreur lors du chargement des allocations: {error}
        </div>;
    }

    if (!allocations || allocations.length === 0) {
        return <div style={{ color: '#999', fontSize: '12px', padding: '10px' }}>
            Aucune allocation de lot trouvée
        </div>;
    }

    return (
        <div style={{ 
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            padding: '12px',
            backgroundColor: '#fafafa',
            fontSize: '12px'
        }}>
            <h5 style={{ margin: '0 0 10px 0' }}>Allocation des Lots (FIFO)</h5>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #ddd', backgroundColor: '#f0f0f0' }}>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Lot</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Expiration</th>
                        <th style={{ padding: '8px', textAlign: 'right' }}>Quantité Consommée</th>
                    </tr>
                </thead>
                <tbody>
                    {allocations.map((allocation, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '8px' }}>
                                <strong>{allocation.productLot?.batch_number || allocation.batch_number || 'N/A'}</strong>
                            </td>
                            <td style={{ padding: '8px' }}>
                                {allocation.productLot?.expiry_date 
                                    ? formatDateDisplay(allocation.productLot.expiry_date)
                                    : allocation.expiry_date 
                                    ? formatDateDisplay(allocation.expiry_date)
                                    : 'N/A'
                                }
                            </td>
                            <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold', color: '#10518E' }}>
                                {allocation.quantity}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ marginTop: '10px', fontSize: '11px', color: '#666' }}>
                <strong>Total prélevé:</strong> {allocations.reduce((sum, a) => sum + (a.quantity || 0), 0)} unités
            </div>
        </div>
    );
}
