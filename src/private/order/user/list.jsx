import React, { useEffect, useRef, useState } from 'react'
import AppLayout from '@layouts/appLayout'
import { Link, useNavigate } from 'react-router-dom'
import Header from '@components/header'
import axiosClient from "@/axios-client";
import Swal from "sweetalert2";
import ConnectionError from '@components/errorConnection'
import EmptyFetch from '@components/Empty'
import Alert from '@components/Alert';
import userIcon from '@assets/imgs/user-profile.png'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, Printer, RefreshCw } from 'lucide-react';

export default function UsersOrders() {

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

  function getYesterdayWithCurrentTime() {
    const now = new Date();
    now.setDate(now.getDate() - 1); // soustrait 1 jour

    // format: YYYY-MM-DD HH:mm:ss
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

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

  const YesterdayformattedDate = getYesterdayWithCurrentTime();

  // const formattedDateTimeDay = formatDate(new Date());

  const navigate = useNavigate();

  const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(true);

  const [users, setUsers] = useState([]);

  const [filteredUsers, setFilteredUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [amountTotal, setAmountTotal] = useState(0);

  const [message, setMessage] = useState('');

  const [startDate, setStartDate] = useState(YesterdayformattedDate);

  const [endDate, setEndDate] = useState(formattedDate);

  const [errorConnection, setErrorConnection] = useState(false);

  useEffect(() => {
    const filtered = users.filter((user) => {
      const searchString = `${user.user_first_name.toLowerCase()} ${user.user_second_name.toLowerCase()} ${user.user_email.toLowerCase()}`;
      return searchString.includes(searchTerm.toLowerCase());
    });
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  useEffect(() => {
    inputusers.current = [];
    getUsers('', '');
  }, []);

  const getUsers = async (startDate, endDate) => {
    if (startDate === '' || endDate === '') {
      startDate = formattedDate;
      endDate = formattedDate;
    }
    setLoadingSkeletonButton(true);
    let data = { start_date: startDate, end_date: endDate };
    await axiosClient.post('/list/user/orders-unpaid/between', data).then(({ data }) => {
      setUsers(data.data);
      setAmountTotal(data.total_amount);
      setTotalPages(Math.ceil(data.data.length / usersPerPage));
      setLoadingSkeletonButton(false);
      setErrorConnection(false);
    }).catch(err => {
      setLoadingSkeletonButton(false);
      setErrorConnection(true);
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(40);
  const [totalPages, setTotalPages] = useState(1);
  const indexOfLastOrder = currentPage * usersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - usersPerPage;
  const userorders = filteredUsers.slice(indexOfFirstOrder, indexOfLastOrder);

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

  const inputusers = useRef([]);

  const inputorders = useRef([]);

  const addInputsOrder = el => {
    if (el && !inputorders.current.includes(el)) {
      inputorders.current.push(el)
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFetchOrderDate = async (e) => {
    e.preventDefault();
    if (startDate === '') {
      return;
    }
    if (endDate === '') {
      return;
    }

    let message = startDate + ' à ' + endDate;
    if (startDate == formattedDate && endDate == formattedDate) {
      setMessage('');
      setStartDate(startDate);
      setEndDate(endDate);
    } else {
      setMessage(message);
      setStartDate(startDate);
      setEndDate(endDate);
    }
    getUsers(startDate, endDate)

  }

  return (
    <>
      <AppLayout onSearch={handleSearch}>
        <div className="content-wrapper mt-10 dashboard-page-theme">
          <Header title={'Toutes les Commandes des Utilisateurs'} />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
            <Link
              to="/order/new"
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '9px 18px', borderRadius: '8px',
                border: 'none', backgroundColor: '#10518E',
                color: '#fff', fontWeight: '600', fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              <Plus size={16} color='white' /> Nouvelle commande
            </Link>
          </div><br />

          <div style={{ display: "flex", width: "100%", alignItems: "center", marginTop: "4px" }}>
            <div style={{ width: "50%" }}>
              <form action="" method="post">
                Du : <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /> Au : <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
                <button onClick={loadingskeletonbutton ? null : handleFetchOrderDate} type="submit" style={{ width: "40px", padding: "2px", cursor: "pointer" }}>
                  OK
                </button>
              </form>
            </div>
            <div style={{ width: "50%" }}>
              <p style={{ float: "right", marginTop: "-10px" }}>
                <span>
                  <button title='Actualiser' onClick={(e) => { e.preventDefault(); getUsers(startDate, endDate); }} style={{ padding: "2px", cursor: "pointer" }}>
                    <span className="text-primary" style={{ fontSize: "21px" }}> {message === '' ? 'Hier et Aujourd\'hui' : message} </span> <RefreshCw size={21} />
                  </button>
                </span>
              </p>
            </div>
          </div>

          <div style={{ height: "44px" }}></div>
          {loadingskeletonbutton ? <p className="text-center"><span className="loader"></span></p> :
            <>
              {errorConnection ?
                <ConnectionError onRetry={getUsers(startDate, endDate)} /> :
                <>
                  {filteredUsers.length > 0 ?
                    <>
                      <div className="dashboard-table-wrap" style={{ overflowY: "scroll", scrollBehavior: "inherit" }}>
                        <div className="video-list">
                          {userorders.map((user, index) => {
                            let userName = user.user_first_name + " " + user.user_second_name;
                            if (userName.length > 19) {
                              userName = userName.substr(0, 17) + "..";
                            }
                            return (
                              <>
                                <a key={index} className="video-card">
                                  <div className="wrapper-cardreport">
                                    <div className="img-area">
                                      <div className="inner-area">
                                        <img src={user.user_img === "" || user.user_img == null ? userIcon : user.user_img} alt="" />
                                      </div>
                                    </div>
                                    <div className="name text-primary" title={user.user_first_name + " " + user.user_second_name}>{userName}</div><br />
                                    <div className="buttons">
                                      <button onClick={() => { navigate(`/orders/${user.user_id}`); }}>
                                        Ses Commandes
                                      </button>
                                    </div>
                                  </div>
                                </a>
                              </>
                            );
                          })}
                        </div>
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
                    <EmptyFetch onRetry={getUsers} title={'Aucun enregistement trouvé'} />
                  }
                </>
              }
            </>
          }
        </div>
      </AppLayout>
    </>
  )
}
