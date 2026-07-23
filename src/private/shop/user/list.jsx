import React, { useContext, useEffect, useState } from 'react'
import AppLayout from '@layouts/appLayout'
import { ArrowLeftRight, SquarePen, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '@components/header'
import axiosClient from "@/axios-client";
import Swal from "sweetalert2";
import ConnectionError from '@components/errorConnection'
import EmptyFetch from '@components/Empty'
import shopEmpty from '@assets/imgs/shop.png'
import { AuthContext } from '@context/AuthContext';
import { saveCurrentShopToLocalStorage,getCurrentShopFromLocalStorage,resetCurrentShopInLocalStorage } from '@local/Shop.js';

export default function CurrentUserShops() {

  const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(false);

  const currentShop = getCurrentShopFromLocalStorage();

  const { currentUser, token } = useContext(AuthContext);

  const [shops, setShops] = useState([]);

  const [filteredShops, setFilteredShops] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [errorConnection, setErrorConnection] = useState(false);

  useEffect(() => {
    const filtered = shops.filter((shop) =>{
        const searchString = `${shop.name.toLowerCase()} ${shop.address.toLowerCase()} ${shop.phone.toLowerCase()}`;
        return searchString.includes(searchTerm.toLowerCase());
    });
    setFilteredShops(filtered);
  }, [shops, searchTerm]);


  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    getShops();
  }, []);

  const getShops = async () => {
    setLoadingSkeletonButton(true);
    let url = '';
    if (currentUser.type === 'admin' || currentUser.type === 'comptable_s') {
        url = `/shops`;
    }else{
        url = `/shops/user/${currentUser.id}`;
    }
    axiosClient.get(url).then(({ data }) => {
      setShops(data.data);
      setLoadingSkeletonButton(false);
      setErrorConnection(false);
    })
    .catch(err => {
      setLoadingSkeletonButton(false);
      setErrorConnection(true);
    });
  };

  const saveShop = async(shop) => {
    saveCurrentShopToLocalStorage(shop);
    getShops();
    Swal.fire({position: 'Center',icon: 'success',title: 'Success',text: 'Connexion effectuée avec succès.',showConfirmButton: true,confirmButtonColor: '#094b88'});
  }

  const renitializeShop = async() => {
    resetCurrentShopInLocalStorage();
    getShops();
  }
    
  return (
    <AppLayout onSearch={handleSearch}>
      <div class="content-wrapper">
        {loadingskeletonbutton ? <p className="text-center" style={{ textAlign:"center" }}> <i class="fa fa-refresh fa-spin text-3xl mr-2 text-black"></i> </p> :
          <>
            {errorConnection ? 
                <ConnectionError onRetry={getShops} /> :
                <>
                    {filteredShops.length > 0 ?
                        <>
                            <div class="video-list">
                              {filteredShops && filteredShops.map((shop,index) => {                               
                                  return (                                
                                    <a class="video-card">
                                      <div class="thumbnail-container">
                                        <img src={shop.img == "" || shop.img == null ? shopEmpty : shop.img} alt="Video Thumbnail" class="thumbnail" />
                                        {shops.length == 1 ? 
                                            <p class="duration">Connecté</p>
                                        : <>
                                            { currentShop.shopId && currentShop.shopId == shop.id ? <p class="duration">Connecté</p> : '' }
                                        </> }
                                      </div>
                                      <div class="video-info">
                                        <div class="video-details" style={{ textAlign:"center"}}>
                                          <h2 class="title text-center">
                                            {shop.name}
                                          </h2>
                                          <p style={{ fontSize:"20px" }}> {shop.address} </p>
                                          <p style={{ fontSize:"17px",textAlign:"center" }}> {shop.phone} </p>
                                          {shops.length == 1 ? null
                                          : <div class="link-login mt-10">
                                                { currentShop.shopId && currentShop.shopId == shop.id ? 
                                                <button onClick={() => renitializeShop()} type="button" class="login-bad" style={{ padding:"2px",width:"100%" }}>
                                                    Deconnecter 
                                                </button>
                                                : 
                                                <button onClick={() => saveShop(shop)} type="button" class="login" style={{ padding:"2px",width:"100%" }}>
                                                    Connecter
                                                </button>
                                                }
                                          </div> }    
                                        </div>
                                      </div>
                                    </a>
                                  );
                              })}                                  
                            </div>
                        </> :
                        <EmptyFetch onRetry={getShops} title={'Aucune Boutique'} />
                    }
                </>   
             }      
          </>
        }  


      </div>
    </AppLayout>
  );
}
