import React, { useEffect, useRef, useState } from 'react'
import AppLayout from '@layouts/appLayout'
import { ArrowLeftRight, SquarePen, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '@components/header'
import ConnectionError from '@components/errorConnection'
import EmptyFetch from '@components/Empty'

const STATIC_EXPENSES = [
  { id: 1, type: 'Achat', pattern: 'Approvisionnement Doliprane 500mg', amount: 125000, createdAt: '2026-03-31 09:18:00', user: { lastname: 'Menga', firstname: 'Claire' } },
  { id: 2, type: 'Charge', pattern: 'Paiement facture electricite', amount: 68000, createdAt: '2026-03-31 11:42:00', user: { lastname: 'Ngono', firstname: 'Junior' } },
  { id: 3, type: 'Maintenance', pattern: 'Reparation frigo vaccins', amount: 45000, createdAt: '2026-03-30 16:12:00', user: { lastname: 'Mboa', firstname: 'Kevin' } },
  { id: 4, type: 'Achat', pattern: 'Commande gants steriles', amount: 53000, createdAt: '2026-03-30 10:04:00', user: { lastname: 'Ewane', firstname: 'Alice' } },
  { id: 5, type: 'Transport', pattern: 'Livraison urgente antipaludiques', amount: 22000, createdAt: '2026-03-29 14:35:00', user: { lastname: 'Menga', firstname: 'Claire' } },
  { id: 6, type: 'Charge', pattern: 'Renouvellement internet boutique', amount: 18000, createdAt: '2026-03-29 08:21:00', user: { lastname: 'Ngono', firstname: 'Junior' } },
  { id: 7, type: 'Achat', pattern: 'Acquisition tests glycemie', amount: 76000, createdAt: '2026-03-28 12:10:00', user: { lastname: 'Mboa', firstname: 'Kevin' } },
  { id: 8, type: 'Charge', pattern: 'Eau et assainissement', amount: 15000, createdAt: '2026-03-28 18:00:00', user: { lastname: 'Ewane', firstname: 'Alice' } },
  { id: 9, type: 'Achat', pattern: 'Stock antibiotique pediatrique', amount: 98000, createdAt: '2026-03-27 09:43:00', user: { lastname: 'Menga', firstname: 'Claire' } },
  { id: 10, type: 'Maintenance', pattern: 'Entretien imprimante caisse', amount: 17000, createdAt: '2026-03-27 15:20:00', user: { lastname: 'Ngono', firstname: 'Junior' } },
  { id: 11, type: 'Charge', pattern: 'Nettoyage et desinfection', amount: 12000, createdAt: '2026-03-26 07:55:00', user: { lastname: 'Mboa', firstname: 'Kevin' } },
  { id: 12, type: 'Achat', pattern: 'Commande serum physiologique', amount: 64000, createdAt: '2026-03-26 13:08:00', user: { lastname: 'Ewane', firstname: 'Alice' } },
  { id: 13, type: 'Transport', pattern: 'Carburant navette livraison', amount: 30000, createdAt: '2026-03-25 17:19:00', user: { lastname: 'Menga', firstname: 'Claire' } },
  { id: 14, type: 'Charge', pattern: 'Achat emballages pharmacie', amount: 21000, createdAt: '2026-03-25 10:26:00', user: { lastname: 'Ngono', firstname: 'Junior' } },
  { id: 15, type: 'Achat', pattern: 'Reapprovisionnement antiseptiques', amount: 87000, createdAt: '2026-03-24 11:05:00', user: { lastname: 'Mboa', firstname: 'Kevin' } },
  { id: 16, type: 'Maintenance', pattern: 'Revision climatiseur salle stock', amount: 39000, createdAt: '2026-03-24 16:47:00', user: { lastname: 'Ewane', firstname: 'Alice' } },
  { id: 17, type: 'Achat', pattern: 'Commande vitamines et mineraux', amount: 72000, createdAt: '2026-03-23 09:14:00', user: { lastname: 'Menga', firstname: 'Claire' } },
  { id: 18, type: 'Charge', pattern: 'Frais bancaires mensuels', amount: 9000, createdAt: '2026-03-23 13:57:00', user: { lastname: 'Ngono', firstname: 'Junior' } },
  { id: 19, type: 'Transport', pattern: 'Collecte commande depot central', amount: 26000, createdAt: '2026-03-22 12:33:00', user: { lastname: 'Mboa', firstname: 'Kevin' } },
  { id: 20, type: 'Achat', pattern: 'Achat thermometres medicaux', amount: 48000, createdAt: '2026-03-22 18:25:00', user: { lastname: 'Ewane', firstname: 'Alice' } },
];

export default function CurrentExpenses() {

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Mois en 2 chiffres
    const day = String(d.getDate()).padStart(2, '0'); // Jour en 2 chiffres
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

  const [expenses, setExpenses] = useState([]);

  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [message, setMessage] = useState('');

  const [errorConnection, setErrorConnection] = useState(false);

  useEffect(() => {
    const filtered = expenses.filter((expense) =>{
        const searchString = `${expense.type.toLowerCase()} ${expense.pattern.toLowerCase()}  ${expense.user.lastname.toLowerCase()} ${expense.user.firstname.toLowerCase()} ${expense.createdAt.toLowerCase()}`;
        return searchString.includes(searchTerm.toLowerCase());
    });
    setFilteredExpenses(filtered);
  }, [expenses, searchTerm]);


  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    inputexpenses.current = [];
    getExpenses('','');
  }, []);

  const getExpenses = async (startDate,endDate) => {
    if (startDate === '' || endDate === '') {
      startDate = formattedDate;
      endDate = formattedDate;
    }

    setLoadingSkeletonButton(true);

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`);

    const data = STATIC_EXPENSES.filter((expense) => {
      const createdAt = new Date(expense.createdAt.replace(' ', 'T'));
      return createdAt >= start && createdAt <= end;
    });

    setExpenses(data);
    setTotalPages(Math.max(1, Math.ceil(data.length / expensesPerPage)));
    setLoadingSkeletonButton(false);
    setErrorConnection(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Voulez-vous supprimer cette depense fictive ?')) {
      return;
    }

    setExpenses((prev) => {
      const next = prev.filter((expense) => expense.id !== id);
      const nextTotalPages = Math.max(1, Math.ceil(next.length / expensesPerPage));
      setTotalPages(nextTotalPages);
      if (currentPage > nextTotalPages) {
        setCurrentPage(nextTotalPages);
      }
      return next;
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [expensesPerPage] = useState(13);
  const [totalPages, setTotalPages] = useState(1);
  const indexOfLastExpense = currentPage * expensesPerPage;
  const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
  const currentExpenses = filteredExpenses.slice(indexOfFirstExpense, indexOfLastExpense);

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

  const inputexpenses = useRef([]);

  const addInputsExpense = el => {
    if (el && !inputexpenses.current.includes(el)) {
        inputexpenses.current.push(el)
    }
  }

  const handleFetchExpenseDate = async(e) => {
    e.preventDefault();
    if (inputexpenses.current[0].value.trim() === '') {
        console.log(formattedDate);
        return;
    } 
    if (inputexpenses.current[1].value.trim() === '') {
        console.log(formattedDate);
        return;
    }
    let message = inputexpenses.current[0].value.trim() + ' à ' + inputexpenses.current[1].value.trim();
    if (inputexpenses.current[0].value.trim() == formattedDate &&  inputexpenses.current[1].value.trim() == formattedDate) {
        setMessage('');
    }else{
        setMessage(message);
    }
       
    getExpenses(inputexpenses.current[0].value.trim(),inputexpenses.current[1].value.trim())
  }
  
  return (
    <AppLayout onSearch={handleSearch}>
      <div class="content-wrapper mt-10">
        <Header title={'Toutes les Dépenses'} />
        <div style={{ display:"flex", width:"100%",alignItems:"center",marginTop:"4px" }}>
            <div style={{ width:"50%" }}>
                <form action="" method="post">
                    Du : <input type="date" defaultValue={formattedDate} min="2024-01-01" ref={addInputsExpense}/> Au : <input type="date" defaultValue={formattedDate} ref={addInputsExpense}/>
                    <button onClick={loadingskeletonbutton ? null : handleFetchExpenseDate} type="submit" style={{ width:"40px",padding:"2px",cursor:"pointer" }}>
                        OK
                    </button>
                </form> 
            </div>
            <div style={{ width:"50%" }}>
                <p style={{ float:"right",marginTop:"-10px" }}>
                    <span class="text-primary txt-24"> {message === '' ? 'Aujourd\'hui' : message } </span>
                </p>                
            </div>            
        </div>
        <div style={{ height:"34px" }}></div>
        {loadingskeletonbutton ? <p className="text-center" style={{ textAlign:"center" }}> <i class="fa fa-refresh fa-spin text-3xl mr-2 text-black"></i> </p> :
          <>
            {errorConnection ? 
                <ConnectionError onRetry={getExpenses} /> :
                <>
                    {filteredExpenses.length > 0 ?
                        <>
                            <div style={{ overflowY : "scroll", scrollBehavior: "inherit" }}>
                                <table id="customers">
                                    <thead>
                                        <tr>
                                            <th style={{ borderTopLeftRadius:"5px",borderBottomLeftRadius:"5px" }}>#</th>
                                            <th>Type</th>
                                            <th>Nom</th>
                                            <th>Motif</th>
                                            <th>Montant</th>
                                            <th style={{ borderTopRightRadius:"5px",borderBottomRightRadius:"5px" }}>Effectuée le</th>
                                        </tr>                
                                    </thead>
                                    <tbody>
                                    {currentExpenses && currentExpenses.map((expense,index) => {                               
                                        const descendingIndex = expenses.length - index - (currentPage - 1) * expensesPerPage;
                                        let pattern = expense.pattern;
                                        if (pattern.length > 20 ) {
                                            pattern = pattern.substr(0, 18)+"..";
                                        }
                                        let diffMinutes = getMinuteDifference(formattedDateTimeDay, expense.createdAt);
                                        return (
                                            <>
                                                <tr key={index}>
                                                    <td> {descendingIndex} </td>  
                                                    <td> {expense.type} </td>   
                                                    <td> {expense.user.lastname+ ' '+expense.user.firstname } </td>                              
                                                    <td title={expense.pattern} > {pattern} </td>   
                                                    <td className='font-bold txt-17'> {expense.amount} XAF </td> 
                                                    <td> {expense.createdAt} </td>
                                                    {diffMinutes <= 10 ?
                                                    <td style={{ display:"flex", width:"100%",height:"70px",alignItems:"center" }}>
                                                        <button class="btn-delete" onClick={() => handleDelete(expense.id)} title={"Supprimer"}>
                                                            <Trash2 size={15} color={'white'}/>
                                                        </button>                                                                            
                                                    </td> : null }                        
                                                </tr>
                                            </> 
                                        );
                                    })}  
                                    {/* <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td> 
                                        <td>20000 XFA</td>
                                    </tr>                               */}
                                    </tbody>
                                </table> 
                                <div className="container-pagination">
                                <button className="button-pagination" id="startBtn" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
                                    <i className="fa-solid fa-angles-left"></i>
                                </button>
                                
                                <button className="button-pagination prevNext" id="prev" disabled={currentPage === 1} onClick={handlePrevPage}>
                                    <i className="fa-solid fa-angle-left"></i>
                                </button>

                                <div className="links-pagination">
                                    {[...Array(totalPages)].map((_, pageIndex) => (
                                    <a key={pageIndex} className={`link-pagination ${currentPage === pageIndex + 1 ? 'active' : ''}`} onClick={() => goToPage(pageIndex + 1)}>
                                        {pageIndex + 1}
                                    </a>
                                    ))}
                                </div>

                                <button className="button-pagination prevNext" id="next" disabled={currentPage === totalPages} onClick={handleNextPage}>
                                    <i className="fa-solid fa-angle-right"></i>
                                </button>

                                <button className="button-pagination" id="endBtn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
                                    <i className="fa-solid fa-angles-right"></i>
                                </button>
                                </div> 
                            </div>
                        </> :
                        <EmptyFetch onRetry={getExpenses} title={'Aucune Dépense'} />
                    }
                </>   
             }      
          </>
        }             
      </div>
    </AppLayout>
  )
}
