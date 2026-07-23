import React, { useEffect, useState } from 'react'
import AppLayout from '@layouts/appLayout'
import { ArrowLeftRight, SquarePen, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '@components/header'
import user from '@assets/imgs/user.jpg'
import axiosClient from "@/axios-client";
import Swal from "sweetalert2";

export default function Post() {
  const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(false);

  const [posts, setPosts] = useState([]);

  const [filteredPosts, setFilteredPosts] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const filtered = posts.filter((post) =>{
        const searchString = `${post.post_name.toLowerCase()} ${post.post_created_at.toLowerCase()}`;
        return searchString.includes(searchTerm.toLowerCase());
    });
    setFilteredPosts(filtered);
  }, [posts, searchTerm]);


  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    getPosts();
  }, []);

  const getPostsss = async () => {
    setLoadingSkeletonButton(true);
    axiosClient.get('/posts').then( ({data})=> {
      setPosts(data.data);
      setLoadingSkeletonButton(false);
    }).catch(err => {
      setLoadingSkeletonButton(false);
    });
  };

  const getPosts = async () => {
    setLoadingSkeletonButton(true);
    axiosClient.get('/posts')
    .then(({ data }) => {
      setPosts(data.data);
      setTotalPages(Math.ceil(data.data.length / postsPerPage)); // Calcul du nombre de pages
      setLoadingSkeletonButton(false);
    })
    .catch(err => {
      setLoadingSkeletonButton(false);
    });
  };

  const handleDelete = async(id) => {
    Swal.fire({
      title: 'Suppression', text: 'Voulez-vous supprimer ce poste ?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#10518E', cancelButtonColor: '#d33', confirmButtonText: 'Supprimer', cancelButtonText: 'Fermer'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('_method', 'DELETE');
        axiosClient.post(`/posts/${id}`,formData).then( () => {
          Swal.fire({position: 'top-right',icon: 'success',title: 'Thanks you!',text: 'poste supprimée avec succès',showConfirmButton: true});
          getPosts()
        }).catch(err => {
          const response = err.response;
          if (response.data.message) {
            Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: `${response.data.message}` ,showConfirmButton: true,confirmButtonColor: '#10518E',})
          }
        });
      }
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(13);
  const [totalPages, setTotalPages] = useState(1);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

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
  
  return (
    <AppLayout onSearch={handleSearch}>
      <div class="content-wrapper mt-10">
        <Header title={'Tous les Postes'} />
        {loadingskeletonbutton ? <p className="text-center" style={{ textAlign:"center" }}> <i class="fa fa-refresh fa-spin text-3xl mr-2 text-black"></i> </p> :
          <>
            <table id="customers">
                <thead>
                    <tr>
                        <th style={{ borderTopLeftRadius:"5px",borderBottomLeftRadius:"5px" }}>#</th>
                        <th>Nom</th>
                        <th>Departement</th>
                        <th>Cree le</th>
                        <th style={{ borderTopRightRadius:"5px",borderBottomRightRadius:"5px" }}>Actions</th>
                    </tr>                
                </thead>
                <tbody>
                  {currentPosts && currentPosts.map((post,index) => {                               
                      const descendingIndex = posts.length - index - (currentPage - 1) * postsPerPage;
                      return (    
                          <tr key={index}>
                              <td>
                                  {descendingIndex}
                              </td>
                              <td>
                                  {post.post_name}
                              </td>   
                              <td>
                                  {post.department.department_name}
                              </td>                             
                              <td>
                                  {post.post_created_at}
                              </td>                                        
                              <td style={{ display:"flex", width:"100%",height:"70px",alignItems:"center" }}>
                                  <div style={{ width:"40px" }}>
                                      <Link to={`/posts/edit/${post.post_id}`} class="btn-update" title={"Modifier le poste"}>
                                          <SquarePen size={15} color={'white'}/>
                                      </Link>  
                                  </div>
                                  <div style={{ width:"40px" }}>
                                      <button class="btn-delete" onClick={() => handleDelete(post.post_id)} title={"Supprimer le poste"}>
                                          <Trash2 size={15} color={'white'}/>
                                      </button> 
                                  </div>                                                                                     
                              </td>                         
                          </tr>
                      );
                  })}                                
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
          </>
        }             
      </div>
    </AppLayout>
  )
}
