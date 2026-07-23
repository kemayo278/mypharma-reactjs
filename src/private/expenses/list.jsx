import React, { useEffect, useState } from 'react'
import AppLayout from '@layouts/appLayout'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, RefreshCw, SquarePen, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '@components/header'
import EmptyFetch from '@components/Empty'

const STATIC_EXPENSES = [
  { expense_id: 1, expense_label: 'Approvisionnement Doliprane 500mg', expense_category: 'Achat', expense_amount: 125000, expense_created_at: '2026-03-31 09:18:00' },
  { expense_id: 2, expense_label: 'Paiement facture electricite', expense_category: 'Charge', expense_amount: 68000, expense_created_at: '2026-03-31 11:42:00' },
  { expense_id: 3, expense_label: 'Reparation frigo vaccins', expense_category: 'Maintenance', expense_amount: 45000, expense_created_at: '2026-03-30 16:12:00' },
  { expense_id: 4, expense_label: 'Commande gants steriles', expense_category: 'Achat', expense_amount: 53000, expense_created_at: '2026-03-30 10:04:00' },
  { expense_id: 5, expense_label: 'Livraison urgente antipaludiques', expense_category: 'Transport', expense_amount: 22000, expense_created_at: '2026-03-29 14:35:00' },
  { expense_id: 6, expense_label: 'Renouvellement internet boutique', expense_category: 'Charge', expense_amount: 18000, expense_created_at: '2026-03-29 08:21:00' },
  { expense_id: 7, expense_label: 'Acquisition tests glycemie', expense_category: 'Achat', expense_amount: 76000, expense_created_at: '2026-03-28 12:10:00' },
  { expense_id: 8, expense_label: 'Eau et assainissement', expense_category: 'Charge', expense_amount: 15000, expense_created_at: '2026-03-28 18:00:00' },
  { expense_id: 9, expense_label: 'Stock antibiotique pediatrique', expense_category: 'Achat', expense_amount: 98000, expense_created_at: '2026-03-27 09:43:00' },
  { expense_id: 10, expense_label: 'Entretien imprimante caisse', expense_category: 'Maintenance', expense_amount: 17000, expense_created_at: '2026-03-27 15:20:00' },
  { expense_id: 11, expense_label: 'Nettoyage et desinfection', expense_category: 'Charge', expense_amount: 12000, expense_created_at: '2026-03-26 07:55:00' },
  { expense_id: 12, expense_label: 'Commande serum physiologique', expense_category: 'Achat', expense_amount: 64000, expense_created_at: '2026-03-26 13:08:00' },
  { expense_id: 13, expense_label: 'Carburant navette livraison', expense_category: 'Transport', expense_amount: 30000, expense_created_at: '2026-03-25 17:19:00' },
  { expense_id: 14, expense_label: 'Achat emballages pharmacie', expense_category: 'Charge', expense_amount: 21000, expense_created_at: '2026-03-25 10:26:00' },
  { expense_id: 15, expense_label: 'Reapprovisionnement antiseptiques', expense_category: 'Achat', expense_amount: 87000, expense_created_at: '2026-03-24 11:05:00' },
];

export default function Expenses() {

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

  const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(false);

  const [expenses, setExpenses] = useState([]);

  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [message, setMessage] = useState('');

  const [startDate, setStartDate] = useState(formattedDate);

  const [endDate, setEndDate] = useState(formattedDate);

  useEffect(() => {
    const filtered = expenses.filter((expense) =>{
        const searchString = `${expense.expense_label?.toLowerCase() || ''} ${expense.expense_category?.toLowerCase() || ''} ${expense.expense_created_at?.toLowerCase() || ''}`;
        return searchString.includes(searchTerm.toLowerCase());
    });
    setFilteredExpenses(filtered);
  }, [expenses, searchTerm]);


  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    getExpenses('','');
  }, []);

  const getExpenses = async (startDate, endDate) => {
    if (startDate === '' || endDate === '') {
      startDate = formattedDate;
      endDate = formattedDate;
    }
    setLoadingSkeletonButton(true);

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`);

    const filteredByDate = STATIC_EXPENSES.filter((expense) => {
      const createdAt = new Date(expense.expense_created_at.replace(' ', 'T'));
      return createdAt >= start && createdAt <= end;
    });

    setExpenses(filteredByDate);
    setCurrentPage(1);
    setTotalPages(Math.max(1, Math.ceil(filteredByDate.length / expensesPerPage)));
    setLoadingSkeletonButton(false);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [expensesPerPage] = useState(13);
  const [totalPages, setTotalPages] = useState(1);
  const indexOfLastExpense = currentPage * expensesPerPage;
  const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
  const currentExpenses = filteredExpenses.slice(indexOfFirstExpense, indexOfLastExpense);

  const handleFetchExpenseDate = () => {
    const formattedStartDate = startDate + 'T00:00:00';
    const formattedEndDate = endDate + 'T23:59:59';

    if (startDate === formattedDate && endDate === formattedDate) {
      setMessage('');
    } else {
      const start = new Date(startDate).toLocaleDateString();
      const end = new Date(endDate).toLocaleDateString();
      setMessage(`${start} - ${end}`);
    }

    getExpenses(formattedStartDate.split('T')[0], formattedEndDate.split('T')[0]);
  };

  const handleDeleteExpense = (expenseId) => {
    if (!window.confirm('Voulez-vous supprimer cette depense fictive ?')) {
      return;
    }

    setExpenses((prev) => {
      const next = prev.filter((expense) => expense.expense_id !== expenseId);
      const nextTotalPages = Math.max(1, Math.ceil(next.length / expensesPerPage));
      setTotalPages(nextTotalPages);
      if (currentPage > nextTotalPages) {
        setCurrentPage(nextTotalPages);
      }
      return next;
    });
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (filteredExpenses.length === 0) {
    return (
      <AppLayout>
        <div className="orders--list expense-page-shell expense-list-shell">
          <Header title="Dépenses" />
          <div className="d-flex gap-3 expense-top-actions">
            <Link to="/expense/new" className="expense-new-btn">Nouvelle dépense</Link>
          </div>
          <EmptyFetch />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="orders--list expense-page-shell expense-list-shell">
        <Header title="Dépenses" />

        <div className="d-flex gap-3 expense-top-actions">
          <Link to="/expense/new" className="expense-new-btn">Nouvelle dépense</Link>
        </div>

        <div className="dashboard-filters-row">
          <div className="dashboard-date-filter-form">
            <div className="dashboard-date-group">
              <label htmlFor="startDate" className="form-label">Du :</label>
              <input
                className="form-control"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                id="startDate"
              />
            </div>
            <div className="dashboard-date-group">
              <label htmlFor="endDate" className="form-label">Au :</label>
              <input
                className="form-control"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                id="endDate"
              />
            </div>
          </div>
          <button
            className="dashboard-filter-btn"
            onClick={handleFetchExpenseDate}
            disabled={loadingskeletonbutton}
          >
            Filtrer
          </button>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="form-control search-input"
          />
        </div>

        <div className="dashboard-refresh-btn">
          <RefreshCw size={20} />
          <span>{message || 'Aujourd\'hui'}</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table table-striped">
            <thead className="table-dark">
              <tr>
                <th>Libellé</th>
                <th>Catégorie</th>
                <th>Montant</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentExpenses.map((expense) => (
                <tr key={expense.expense_id}>
                  <td>{expense.expense_label}</td>
                  <td>{expense.expense_category}</td>
                  <td>{expense.expense_amount}</td>
                  <td>{expense.expense_created_at}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/expense/edit/${expense.expense_id}`} className="btn btn-sm btn-warning">
                        <SquarePen size={16} />
                      </Link>
                      <button onClick={() => handleDeleteExpense(expense.expense_id)} className="btn btn-sm btn-danger">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex align-items-center justify-content-between mt-4">
          <div>
            Page {currentPage} sur {totalPages}
          </div>
          <div className="d-flex gap-2">
            <button onClick={goToFirstPage} className="btn btn-sm btn-outline-secondary" disabled={currentPage === 1}>
              <ChevronsLeft size={16} />
            </button>
            <button onClick={goToPreviousPage} className="btn btn-sm btn-outline-secondary" disabled={currentPage === 1}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={goToNextPage} className="btn btn-sm btn-outline-secondary" disabled={currentPage === totalPages}>
              <ChevronRight size={16} />
            </button>
            <button onClick={goToLastPage} className="btn btn-sm btn-outline-secondary" disabled={currentPage === totalPages}>
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
