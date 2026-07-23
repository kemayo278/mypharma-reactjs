import React, { useEffect, useRef, useState } from 'react'
import AppLayout from '@layouts/appLayout'
import { ArrowLeftRight, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, Plus, Printer, RefreshCw, SquarePen, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '@components/header'
import axiosClient from "@/axios-client";
import Swal from "sweetalert2";
import ConnectionError from '@components/errorConnection'
import EmptyFetch from '@components/Empty'
import PrintEntries from '@private/print/entry/list'
import PrintEntry from '@private/print/entry/one'

export default function CurrentEntries() {

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

  const getMinuteDifference = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffInMs = Math.abs(d2 - d1);
    return Math.floor(diffInMs / (1000 * 60));
  };

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

  const formattedDateTimeDay = formatDate(new Date());

  const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(false);

  const [entries, setEntries] = useState([]);

  const [filteredEntries, setFilteredEntries] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [message, setMessage] = useState('');

  const [errorConnection, setErrorConnection] = useState(false);

  const [startDate, setStartDate] = useState(formattedDate);

  const [endDate, setEndDate] = useState(formattedDate);

  useEffect(() => {
    const filtered = entries.filter((entry) =>{
        const searchString = `${entry.invoice_number.toLowerCase()} ${entry.provider.provider_name.toLowerCase()} ${entry.user.user_first_name.toLowerCase()} ${entry.user.user_second_name.toLowerCase()} ${entry.entry_created_at.toLowerCase()}`;
        return searchString.includes(searchTerm.toLowerCase());
    });
    setFilteredEntries(filtered);
  }, [entries, searchTerm]);


  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    inputentries.current = [];
    getEntries('','');
  }, []);

  const getEntries = async (startDate,endDate) => {
    if (startDate === '' || endDate === '') {
      startDate = formattedDate;
      endDate = formattedDate;
    }
    setLoadingSkeletonButton(true);
    let data = {start_date : startDate, end_date : endDate};
    await axiosClient.post('/entries/dates/between',data).then(({data})  => {
      setEntries(data.data);
      setTotalPages(Math.ceil(data.data.length / entriesPerPage));
      setLoadingSkeletonButton(false);
      setErrorConnection(false);
    }).catch(err => {
      setLoadingSkeletonButton(false);
      setErrorConnection(true);
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(13);
  const [totalPages, setTotalPages] = useState(1);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEntries.slice(indexOfFirstEntry, indexOfLastEntry);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const inputentries = useRef([]);

  const addInputsEntry = el => {
    if (el && !inputentries.current.includes(el)) {
        inputentries.current.push(el)
    }
  }

  const handleFetchEntryDate = async(e) => {
    e.preventDefault();
    if (startDate === '') {
      return;
    } 
    if (endDate === '') {
      return;
    }

    let message = startDate + ' à ' + endDate;
    if (startDate == formattedDate &&  endDate == formattedDate) {
      setMessage('');
      setStartDate(startDate);
      setEndDate(endDate);
    }else{
      setMessage(message);
      setStartDate(startDate);
      setEndDate(endDate);
    }
    getEntries(startDate,endDate)
  }

  const [selectedEntries, setSelectedEntries] = useState([]);
  
  const [isPrintingEntries, setIsPrintingEntries] = useState(false);

  const [selectedEntry, setSelectedEntry] = useState({});
  
  const [isPrintingEntry, setIsPrintingEntry] = useState(false);  

  const handlePrintClickEntries = () => {
    setSelectedEntries(filteredEntries);
    setIsPrintingEntries(true);
  };

  const handleBackClickEntries = () => {
    setIsPrintingEntries(false);
    setSelectedEntries([]);
  };

  const handlePrintClickEntry = (entry) => {
    setSelectedEntry(entry);
    setIsPrintingEntry(true);
  };

  const handleBackClickEntry = () => {
    setIsPrintingEntry(false);
    setSelectedEntry({});
  };
  
  return (
    <>
      {isPrintingEntries ? (
        <PrintEntries entries={selectedEntries} onBack={handleBackClickEntries} message={message} titled={'Etat des Entrées en Stock'} />
      ) : isPrintingEntry ? (
        <PrintEntry entry={selectedEntry} onBack={handleBackClickEntry} />
      ) : (
        <AppLayout onSearch={handleSearch}>
          <div className="content-wrapper mt-10 dashboard-page-theme">
            <Header title={'Toutes les Entrées'} />
            <div className="dashboard-filters-row">
              <form action="" method="post" className="dashboard-date-filter-form">
                <label className="dashboard-date-group">
                  <span>Du</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                  />
                </label>

                <label className="dashboard-date-group">
                  <span>Au</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                  />
                </label>

                <button
                  className="dashboard-filter-btn"
                  onClick={loadingskeletonbutton ? null : handleFetchEntryDate}
                  type="submit"
                >
                  Filtrer
                </button>
              </form>

              <button
                className="dashboard-refresh-btn"
                title='Actualiser'
                onClick={(e) => { e.preventDefault(); getEntries(startDate, endDate); }}
              >
                <span>{message === '' ? "Aujourd'hui" : message}</span>
                <RefreshCw size={18} />
              </button>
            </div>

            <div style={{ height:"14px" }}></div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              {filteredEntries.length > 0 && (
                <a title={'Imprimer Le Resultat'} style={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); handlePrintClickEntries(); }}>
                  <Printer size={25} color={'#08447c'} />
                </a>
              )}
              <Link
                to="/entry/new"
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '9px 18px', borderRadius: '8px',
                  border: 'none', backgroundColor: '#10518E',
                  color: '#fff', fontWeight: '600', fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                <Plus size={16} color='white' /> Nouvelle entrée
              </Link>
            </div>

            {loadingskeletonbutton ? <p className="text-center"><span className="loader"></span></p> :
              <>
                {errorConnection ? 
                  <ConnectionError onRetry={getEntries} /> :
                  <>
                    {filteredEntries.length > 0 ?
                      <>
                        <div className="dashboard-table-wrap" style={{ overflowY : "scroll", scrollBehavior: "inherit" }}>
                            <table id="customers" className="dashboard-orders-table">
                                <thead>
                                    <tr>
                                        <th style={{ borderTopLeftRadius:"5px",borderBottomLeftRadius:"5px" }}>#</th>
                                        <th>Numero Facture</th>
                                        <th>Fournisseur</th>
                                        <th>Effectuée par</th>
                                        <th>Date</th>
                                        <th style={{ borderTopRightRadius:"5px",borderBottomRightRadius:"5px" }}> Actions</th>
                                    </tr>                
                                </thead>
                                <tbody>
                                {currentEntries && currentEntries.map((entry,index) => {                               
                                    const descendingIndex = entries.length - index - (currentPage - 1) * entriesPerPage;
                                    return (
                                        <>
                                            <tr key={index}>
                                                <td> {entry.entry_id} </td>   
                                                <td className='font-bold txt-17'> {entry.invoice_number} </td>                              
                                                <td> {entry.provider.provider_name} </td> 
                                                <td> {entry.user.user_second_name+ ' '+entry.user.user_first_name} </td>   
                                                <td> {entry.entry_created_at} </td>       
                                                <td>
                                                  <a onClick={(e) => { e.preventDefault(); handlePrintClickEntry(entry); }} title={'Voir'}>
                                                    <button className='text-primary' style={{ padding:"4px", cursor:"pointer" }}>
                                                      Voir
                                                    </button>
                                                  </a>                                                   
                                                </td>          
                                            </tr>
                                        </> 
                                    );
                                })}
                                </tbody>
                            </table> 
                            <div className="container-pagination">
                              <button className="button-pagination" id="startBtn" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
                                <ChevronsLeft color='grey' />
                              </button>                            
                              <button className="button-pagination prevNext" id="prev" disabled={currentPage === 1} onClick={handlePrevPage}>
                                <ChevronLeft color='grey' />
                              </button>
                              <div className="links-pagination">
                                  {[...Array(totalPages)].map((_, pageIndex) => (
                                  <a key={pageIndex} className={`link-pagination ${currentPage === pageIndex + 1 ? 'active' : ''}`} onClick={() => goToPage(pageIndex + 1)}>
                                      {pageIndex + 1}
                                  </a>
                                  ))}
                              </div>
                              <button className="button-pagination prevNext" id="next" disabled={currentPage === totalPages} onClick={handleNextPage}>
                                <ChevronRight color='grey' />
                              </button>
                              <button className="button-pagination" id="endBtn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
                                <ChevronsRight color='grey' />
                              </button>
                            </div> 
                        </div>
                      </> :
                      <EmptyFetch onRetry={getEntries} title={'Aucun enregistement trouvé'} />
                    }
                  </>   
                }      
              </>
            }             
          </div>
        </AppLayout>
      )}
    </>
  )
}
