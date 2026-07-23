import React, { useEffect, useMemo, useState } from "react";
import AppLayout from "@layouts/appLayout";
import Header from "@components/header";
import axiosClient from "@/axios-client";
import Swal from "sweetalert2";
import ConnectionError from "@components/errorConnection";
import EmptyFetch from "@components/Empty";
import CustomModal from "@components/CustomModal";
import Alert from "@components/Alert";
import { Plus, SquarePen } from "lucide-react";

const EMPTY_FORM = {
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    status: 'active',
    country_of_origin: 'Cameroun',
    profession: '',
    notes: '',
};

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [errorConnection, setErrorConnection] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});

    useEffect(() => { fetchCustomers(); }, []);

    const fetchCustomers = () => {
        setLoading(true);
        axiosClient.get('/customers')
            .then(({ data }) => {
                setCustomers(data.data);
                setErrorConnection(false);
            })
            .catch(() => setErrorConnection(true))
            .finally(() => setLoading(false));
    };

    const handleSearch = (term) => setSearchTerm(term);

    const filtered = useMemo(() =>
        customers.filter((c) => {
            const s = `${c.name ?? ''} ${c.phone ?? ''} ${c.email ?? ''} ${c.matricule ?? ''}`.toLowerCase();
            return s.includes(searchTerm.toLowerCase());
        }),
        [customers, searchTerm]
    );

    const openAdd = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setErrors({});
        setShowModal(true);
    };

    const openEdit = (customer) => {
        setEditingId(customer.id);
        setForm({
            first_name: customer.firstName ?? '',
            last_name: customer.lastName ?? '',
            phone: customer.phone ?? '',
            email: customer.email ?? '',
            status: customer.status ?? 'active',
            country_of_origin: customer.countryOfOrigin ?? 'Cameroun',
            profession: customer.profession ?? '',
            notes: customer.notes ?? '',
        });
        setErrors({});
        setShowModal(true);
    };

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const validate = () => {
        const e = {};
        if (!form.first_name.trim()) e.first_name = 'Nom requis';
        return e;
    };

    const handleSubmit = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setSubmitting(true);
        try {
            if (editingId) {
                await axiosClient.put(`/customers/${editingId}`, form);
                Swal.fire({ icon: 'success', title: 'Succès', text: 'Client mis à jour.', confirmButtonColor: '#10518E' });
            } else {
                await axiosClient.post('/customers', form);
                Swal.fire({ icon: 'success', title: 'Succès', text: 'Client ajouté.', confirmButtonColor: '#10518E' });
            }
            setShowModal(false);
            fetchCustomers();
        } catch (err) {
            const msg = err.response?.data?.message || 'Une erreur s\'est produite';
            Swal.fire({ icon: 'error', title: 'Erreur', text: msg, confirmButtonColor: '#10518E' });
        } finally {
            setSubmitting(false);
        }
    };

    const statusBadge = (status) => {
        const map = {
            active: { label: 'Actif', color: '#067647', bg: '#ecfdf3', border: '#abefc6' },
            inactive: { label: 'Inactif', color: '#b42318', bg: '#fee4e2', border: '#fecdca' },
        };
        const s = map[status] ?? { label: status, color: '#344054', bg: '#f2f4f7', border: '#d0d5dd' };
        return (
            <span style={{
                padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
                color: s.color, backgroundColor: s.bg, border: `1px solid ${s.border}`,
            }}>
                {s.label}
            </span>
        );
    };

    return (
        <AppLayout onSearch={handleSearch}>
            <div className="content-wrapper mt-10 dashboard-page-theme">
                <Header title="Clients" />

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
                    <button
                        type="button"
                        onClick={openAdd}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '7px',
                            padding: '9px 18px', borderRadius: '8px',
                            border: 'none', backgroundColor: '#10518E',
                            color: '#fff', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                        }}
                    >
                        <Plus size={16} color="white" /> Nouveau client
                    </button>
                </div>

                <CustomModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title={editingId ? 'Modifier le client' : 'Nouveau client'}
                >
                    {errors.connection && <Alert type="Warning" message={errors.connection} />}
                    <div className="row">
                        <div className="col-75">
                            <label>Nom <span className="text-danger">*</span></label>
                            <input type="text" value={form.first_name} onChange={(e) => handleChange('first_name', e.target.value)} placeholder="Nom" />
                            {errors.first_name && <span className="text-danger">{errors.first_name}</span>}
                            <br /><br />
                        </div>
                        <div className="col-75">
                            <label>Prénom</label>
                            <input type="text" value={form.last_name} onChange={(e) => handleChange('last_name', e.target.value)} placeholder="Prénom" />
                            <br /><br />
                        </div>
                        <div className="col-75">
                            <label>Téléphone</label>
                            <input type="text" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+237 ..." />
                            <br /><br />
                        </div>
                        <div className="col-75">
                            <label>Email</label>
                            <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="email@..." />
                            <br /><br />
                        </div>
                        <div className="col-75">
                            <label>Statut</label>
                            <select value={form.status} onChange={(e) => handleChange('status', e.target.value)}>
                                <option value="active">Actif</option>
                                <option value="inactive">Inactif</option>
                            </select>
                            <br /><br />
                        </div>
                        <div className="col-75">
                            <label>Pays d'origine</label>
                            <input type="text" value={form.country_of_origin} onChange={(e) => handleChange('country_of_origin', e.target.value)} />
                            <br /><br />
                        </div>
                        <div className="col-75">
                            <label>Profession</label>
                            <input type="text" value={form.profession} onChange={(e) => handleChange('profession', e.target.value)} />
                            <br /><br />
                        </div>
                        <div className="col-75">
                            <label>Notes</label>
                            <textarea rows="3" value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} placeholder="Remarques..." style={{ width: '100%' }} />
                            <br /><br />
                        </div>
                        <div className="col-75 link-login">
                            <button type="button" className="login" onClick={submitting ? null : handleSubmit}>
                                {submitting ? <div className="spinner"></div> : (editingId ? 'Mettre à jour' : 'Enregistrer')}
                            </button>
                        </div>
                    </div>
                </CustomModal>

                {loading ? (
                    <p className="text-center"><span className="loader"></span></p>
                ) : errorConnection ? (
                    <ConnectionError onRetry={fetchCustomers} />
                ) : filtered.length === 0 ? (
                    <EmptyFetch title="Aucun client" onRetry={fetchCustomers} />
                ) : (
                    <div className="dashboard-table-wrap">
                        <table id="customers" className="dashboard-orders-table">
                            <thead>
                                <tr>
                                    <th>Matricule</th>
                                    <th>Nom complet</th>
                                    <th>Téléphone</th>
                                    <th>Email</th>
                                    <th>Statut</th>
                                    <th>Pays</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((customer) => (
                                    <tr key={customer.id}>
                                        <td style={{ fontSize: '12px', color: '#667085' }}>{customer.matricule}</td>
                                        <td style={{ fontWeight: '600' }}>{customer.name}</td>
                                        <td>{customer.phone ?? '—'}</td>
                                        <td>{customer.email ?? '—'}</td>
                                        <td>{statusBadge(customer.status)}</td>
                                        <td>{customer.countryOfOrigin ?? '—'}</td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => openEdit(customer)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '5px',
                                                    padding: '6px 12px', borderRadius: '6px',
                                                    border: '1.5px solid #d0d5dd', backgroundColor: '#fff',
                                                    color: '#344054', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
                                                }}
                                            >
                                                <SquarePen size={14} /> Modifier
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
