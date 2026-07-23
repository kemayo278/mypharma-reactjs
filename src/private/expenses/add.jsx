import React, { useContext, useEffect, useState } from "react";
import AppLayout from '@layouts/appLayout'
import Header from '@components/header'
import axiosClient from "@/axios-client";
import Swal from "sweetalert2";
import ConnectionError from '@components/errorConnection'
import { AuthContext } from '@context/AuthContext';
import Alert from '@components/Alert';
import { useParams, useNavigate } from 'react-router-dom';

export default function AddEditExpense() {
  const { currentUser } = useContext(AuthContext);
  const { expenseId } = useParams();
  const navigate = useNavigate();
  
  const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(expenseId ? true : false);
  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);
  const [errorConnection, setErrorConnection] = useState(false);
  const [errors, setErrors] = useState({});
  const [expense, setExpense] = useState({
    expense_label: '',
    expense_category: '',
    expense_amount: '',
    expense_description: '',
  });

  const categories = ['Fournitures', 'Électricité', 'Loyer', 'Salaires', 'Maintenance', 'Transport', 'Autres'];

  useEffect(() => {
    if (expenseId) {
      fetchExpense();
    } else {
      setLoadingSkeletonButton(false);
    }
  }, [expenseId]);

  const fetchExpense = async () => {
    try {
      const response = await axiosClient.get(`/expense/${expenseId}`);
      setExpense(response.data.data);
      setErrorConnection(false);
    } catch (err) {
      setErrorConnection(true);
    } finally {
      setLoadingSkeletonButton(false);
    }
  };

  const handleFormChange = (field, value) => {
    setExpense((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const validationErrors = {};

    if (expense.expense_label.trim() === '') {
      validationErrors.expense_label = 'Libellé requis';
    }

    if (expense.expense_category.trim() === '') {
      validationErrors.expense_category = 'Catégorie requise';
    }

    const amountValue = parseFloat(expense.expense_amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      validationErrors.expense_amount = 'Montant invalide';
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoadingSubmitButton(true);

    try {
      if (expenseId) {
        await axiosClient.put(`/expense/${expenseId}`, expense);
        Swal.fire('Succès!', 'Dépense mise à jour.', 'success').then(() => {
          navigate('/expenses');
        });
      } else {
        await axiosClient.post('/expense', expense);
        Swal.fire('Succès!', 'Dépense créée.', 'success').then(() => {
          navigate('/expenses');
        });
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Une erreur s\'est produite';
      Swal.fire('Erreur!', message, 'error');
    } finally {
      setLoadingSubmitButton(false);
    }
  };

  if (errorConnection) {
    return (
      <AppLayout>
        <ConnectionError />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="content-wrapper mt-10 expense-page-shell">
        <Header title={expenseId ? 'Modifier la dépense' : 'Nouvelle dépense'} />

        <form onSubmit={handleSubmit}>
          <div className="row pharma-product-layout mt-3 expense-form-shell">
            <div className="col-75">
              <div className="container-form pharma-product-card expense-form-card">
              {loadingskeletonbutton && (
                <p className="text-muted mb-3">Chargement...</p>
              )}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label htmlFor="label" className="form-label">Libellé <span className="text-danger">*</span></label>
                <input
                  type="text"
                  id="label"
                  className="form-control"
                  value={expense.expense_label}
                  onChange={(e) => handleFormChange('expense_label', e.target.value)}
                  placeholder="Ex: Fournitures de pharmacie"
                />
                {errors.expense_label && (
                  <Alert variant="danger" message={errors.expense_label} />
                )}
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label htmlFor="category" className="form-label">Catégorie <span className="text-danger">*</span></label>
                <select
                  id="category"
                  className="form-select"
                  value={expense.expense_category}
                  onChange={(e) => handleFormChange('expense_category', e.target.value)}
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.expense_category && (
                  <Alert variant="danger" message={errors.expense_category} />
                )}
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label htmlFor="amount" className="form-label">Montant <span className="text-danger">*</span></label>
                <input
                  type="number"
                  id="amount"
                  className="form-control"
                  value={expense.expense_amount}
                  onChange={(e) => handleFormChange('expense_amount', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
                {errors.expense_amount && (
                  <Alert variant="danger" message={errors.expense_amount} />
                )}
              </div>

              <div className="form-group" style={{ marginBottom: '32px' }}>
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  className="form-control"
                  value={expense.expense_description}
                  onChange={(e) => handleFormChange('expense_description', e.target.value)}
                  placeholder="Description de la dépense (optionnel)"
                  rows="4"
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="expense-submit-btn"
                  disabled={loadingsubmitbutton || loadingskeletonbutton}
                >
                  {loadingsubmitbutton ? 'Traitement...' : 'Enregistrer la dépense'}
                </button>
                <br /><br />
                <button
                  type="button"
                  onClick={() => navigate('/expenses')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    padding: '9px 22px', borderRadius: '8px',
                    border: '1.5px solid #d0d5dd', backgroundColor: '#fff',
                    color: '#344054', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                  }}
                >
                  Annuler
                </button>
              </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
