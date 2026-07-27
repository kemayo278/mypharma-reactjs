import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import user from '@assets/imgs/user-profile.png'
import { ChartBarStacked, ChartColumnStacked, ChevronDown, CircleDollarSign, CircleHelp, ClipboardList, House, Lock, Menu, Moon, Search, Settings, ShoppingBasket, SquareUserRound, Sun, TriangleAlert, Users, X, Plus, Bell, Zap, Sparkles, RefreshCcw, Wallet } from 'lucide-react';
import { AuthContext } from '@context/AuthContext';
import { saveUserProfileToLocalStorage,getUserProfileFromLocalStorage,resetUserProfileInLocalStorage } from '@local/User.js';
import { saveDelayToLocalStorage,getDelayFromLocalStorage,resetDelayInLocalStorage } from '@local/Delay.js';
import { saveInstitutionToLocalStorage } from '@local/Institution.js';
import axiosClient from "@/axios-client";
import Swal from 'sweetalert2';
import DynamicDateTime from '@components/DynamicDateTime';
import '@assets/css/ultra-modern-layout.css';
import { parseNbDelay } from '@services/subscription.js';

const AppLayout = ({ children, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('darkMode') === 'enabled');
  const [showNewYearModal, setShowNewYearModal] = useState(false);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(() => new Date());
  const headerRef = useRef(null);
  const navigationRef = useRef(null);
  const secondaryMenuRef = useRef(null);
  const sectionRefs = useRef({});

    const handleSearch = (event) => {
      const term = event.target.value;
      setSearchTerm(term);
      if (onSearch && typeof onSearch === 'function') {
        onSearch(term);
      }
    };

    const localuserProfile = getUserProfileFromLocalStorage() || {};
    const currentDelay = getDelayFromLocalStorage() || {};
    const profileDegree = Number(localuserProfile.profileDegree);
    const canManageProducts = profileDegree === 1 || profileDegree === 2;
    const isAdmin = profileDegree === 1;
    const isAuthenticated = Boolean(
      localuserProfile.profileEmail &&
      localuserProfile.profileEmail !== 'null'
    );
    const displayName = [localuserProfile.profileFirstName, localuserProfile.profileSecondName]
      .filter(Boolean)
      .join(' ') || 'Utilisateur';
    const avatarSource = localuserProfile.profileImg === '' || localuserProfile.profileImg === null || localuserProfile.profileImg === 'null'
      ? user
      : localuserProfile.profileImg;
    const profileEmail = localuserProfile.profileEmail && localuserProfile.profileEmail !== 'null'
      ? localuserProfile.profileEmail
      : currentUser?.email || 'Email indisponible';
    const profileRole = profileDegree === 1
      ? 'Administrateur'
      : profileDegree === 2
        ? 'Gestionnaire'
        : 'Utilisateur';
    const formattedHeaderDate = currentDateTime.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const formattedHeaderTime = currentDateTime.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    const headerDateTimeLabel = `${formattedHeaderDate} | ${formattedHeaderTime}`;

    // Vérifier si on doit afficher le modal de bonne année
    useEffect(() => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth(); // 0 = janvier
      const currentYear = currentDate.getFullYear();
      const modalShownKey = `newYearModal_${currentYear}`;
      
      // Vérifier si on est en janvier et si le modal n'a pas été affiché cette année
      if (currentMonth === 0 && !localStorage.getItem(modalShownKey)) {
        setShowNewYearModal(true);
        localStorage.setItem(modalShownKey, 'true');
      }
    }, []);

    const closeNewYearModal = () => {
      setShowNewYearModal(false);
    };

    const navigate = useNavigate();

    const location = useLocation();

    useEffect(() => {
      const rafId = window.requestAnimationFrame(() => {
        setIsLayoutReady(true);
      });

      return () => window.cancelAnimationFrame(rafId);
    }, []);

    useEffect(() => {
      const timer = window.setInterval(() => {
        setCurrentDateTime(new Date());
      }, 1000);

      return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
      axiosClient.get('/institutions')
        .then(({ data }) => {
          const inst = data.data[0];
          if (inst) saveInstitutionToLocalStorage(inst);
        })
        .catch(() => {});
    }, []);

    useEffect(() => {
      setIsMobileNavOpen(false);
      setOpenDropdown(null);
    }, [location.pathname]);

    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth >= 1024) {
          setIsMobileNavOpen(false);
        }
      };

      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
      const handlePointerDown = (event) => {
        const isInsideHeader = headerRef.current?.contains(event.target);
        const isInsideSecondaryNav = navigationRef.current?.contains(event.target);

        if (!isInsideHeader && !isInsideSecondaryNav) {
          setOpenDropdown(null);
          setIsMobileNavOpen(false);
        }
      };

      document.addEventListener('mousedown', handlePointerDown);

      return () => document.removeEventListener('mousedown', handlePointerDown);
    }, []);
    
    useEffect(() => {
      if (isDarkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }, [isDarkMode]);

    const toggleMobileNav = () => {
      setIsMobileNavOpen((currentValue) => !currentValue);
    };

    const toggleDropdown = (key) => {
      setOpenDropdown((currentValue) => {
        const nextValue = currentValue === key ? null : key;

        if (nextValue && window.innerWidth <= 1024) {
          window.requestAnimationFrame(() => {
            const dropdownSection = sectionRefs.current[key];
            const mobileMenu = secondaryMenuRef.current;

            if (dropdownSection && mobileMenu) {
              const sectionTop = dropdownSection.offsetTop;
              const sectionBottom = sectionTop + dropdownSection.offsetHeight;
              const viewportTop = mobileMenu.scrollTop;
              const viewportBottom = viewportTop + mobileMenu.clientHeight;

              if (sectionTop < viewportTop || sectionBottom > viewportBottom) {
                dropdownSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }
          });
        }

        return nextValue;
      });
    };

    const handleNavigation = (href) => {
      setOpenDropdown(null);
      setIsMobileNavOpen(false);
      navigate(href);
    };
    
    const toggleDarkMode = () => {
      const newDarkMode = !isDarkMode;
      setIsDarkMode(newDarkMode);
      localStorage.setItem('darkMode', newDarkMode ? 'enabled' : 'disabled');
    };

    const getButtonAttributes = () => {
      const pathSegments = location.pathname.split('/');
    
      if (pathSegments[1] === 'categories') {
        return { title: 'Ajouter une catégorie', href: '/category/new' };
      }

      if (pathSegments[1] === 'products') {
        return { title: 'Ajouter un produit', href: '/product/new' };
      }

      if (pathSegments[1] === 'current-entries') {
        return { title: 'Ajouter un entrée en Stock', href: '/entry/new' };
      }
    
      if (pathSegments[1] === 'users') {
        return { title: 'Ajouter un Utilisateur', href: '/user/new' };
      }

      if (pathSegments[1] === 'orders') {
        return { title: 'Nouvelle Commande', href: '/order/new' };
      }

      if (pathSegments[1] === 'entries') {
        return { title: 'Nouvelle Entrée en Stock', href: '/entry/new' };
      }

      if (pathSegments[1] === 'user-orders') {
        return { title: 'Nouvelle Commande', href: '/order/new' };
      }

      return { title: 'Aucune Action', href: '' };
    };
  
    const { title, href } = getButtonAttributes();

    const isActiveMenuItem = (paths) => {
      return paths.some((path) => location.pathname.includes(path));
    };

    const { currentUser, dispatch } = useContext(AuthContext);

    const handleLogout = async () => {
      const result = await Swal.fire({
        title: 'Confirmation de déconnexion',
        text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Oui, déconnecter',
        cancelButtonText: 'Annuler',
        reverseButtons: true
      });
      
      if (result.isConfirmed) {
        try {
          resetUserProfileInLocalStorage();   
          resetDelayInLocalStorage();
          dispatch({ type: "LOGOUT" });
          
          Swal.fire({
            title: 'Déconnecté!',
            text: 'Vous avez été déconnecté avec succès.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
          
          navigate("/sign-in");
        } catch (error) {
          console.log(error);
          navigate("/sign-in");
        }
      }
    };

    useEffect(() => {
      if (currentUser?.id) {
        getCurrentUser();
      }
    }, [currentUser?.id]);
  
    const getCurrentUser = async () => {
      axiosClient.get(`/user/${currentUser.id}`).then( ({data})=> {
        let list = data.data;
        saveDelayToLocalStorage(data.dateEnd,data.message,data.nbDelay);
        saveUserProfileToLocalStorage(list);
      }).catch(err => {
        const response = err.response;
        if (response?.status === 404) {
          resetUserProfileInLocalStorage();
          resetDelayInLocalStorage();
          dispatch({ type: "LOGOUT" });
        }
      });
    };

    const remainingDays = parseNbDelay(currentDelay?.nbDelay);
    const subscriptionLabel = remainingDays >= 0 && remainingDays < 10
      ? remainingDays === 0
        ? "Forfait expire aujourd'hui"
        : `${remainingDays} jour${remainingDays > 1 ? 's' : ''} restant${remainingDays > 1 ? 's' : ''}`
      : `${remainingDays} jours restants`;

    const navigationSections = [
      {
        key: 'home',
        label: 'Accueil',
        icon: House,
        href: '/home',
        activePaths: ['/home']
      },
      canManageProducts ? {
        key: 'products',
        label: 'Produits',
        icon: ShoppingBasket,
        items: [
          {
            label: 'Catégories',
            href: '/categories',
            icon: ChartColumnStacked,
            activePaths: ['/categories', '/category/edit', '/category/new']
          },
          {
            label: 'Inventaire',
            href: '/products',
            icon: ShoppingBasket,
            activePaths: ['/products', '/product/edit', '/product/new']
          }
        ]
      } : null,
      {
        key: 'orders',
        label: 'Commandes',
        icon: ClipboardList,
        href: '/user-orders',
        activePaths: ['/orders', '/order/new', '/user-orders']
      },
      {
        key: 'cashier',
        label: 'Caisse',
        icon: CircleDollarSign,
        href: '/caisse',
        activePaths: ['/caisse']
      },
      canManageProducts ? {
        key: 'statistics',
        label: 'Statistiques',
        icon: ChartBarStacked,
        href: '/stats',
        activePaths: ['/stats']
      } : null,
      canManageProducts ? {
        key: 'management',
        label: 'Gestion',
        icon: ClipboardList,
        items: [
          {
            label: 'Entrées Stock',
            href: '/entries',
            icon: ClipboardList,
            activePaths: ['/entries', '/entry/new']
          },
          {
            label: 'Créances',
            href: '/creance',
            icon: ClipboardList,
            activePaths: ['/creance']
          },
          // {
          //   label: 'Dépenses',
          //   href: '/expenses',
          //   icon: Wallet,
          //   activePaths: ['/expenses', '/expense/new', '/expense/edit']
          // },
          {
            label: 'Clients',
            href: '/customers',
            icon: Users,
            activePaths: ['/customers']
          }
        ]
      } : null,
      isAdmin ? {
        key: 'admin',
        label: 'Administration',
        icon: Users,
        items: [
          {
            label: 'Utilisateurs',
            href: '/users',
            icon: Users,
            activePaths: ['/users', '/user/new']
          }
        ]
      } : null,
      {
        key: 'account',
        label: 'Compte',
        icon: SquareUserRound,
        items: [
          {
            label: 'Profil',
            href: '/profile',
            icon: SquareUserRound,
            activePaths: ['/profile']
          },
          {
            label: 'Paramètres',
            href: '/password/edit',
            icon: Settings,
            activePaths: ['/password/edit']
          },
          {
            label: "Centre d'aide",
            href: '/help',
            icon: CircleHelp,
            activePaths: ['/help']
          }
        ]
      },
      {
        key: 'subscription',
        label: 'Forfait',
        icon: RefreshCcw,
        href: '/reactivation',
        activePaths: ['/reactivation'],
        critical: true
      }
    ].filter(Boolean);

    const headerShortcuts = [
      {
        title: 'Nouvelle commande',
        href: '/order/new',
        icon: ClipboardList,
        activePaths: ['/orders', '/order/new', '/user-orders']
      },
      {
        title: 'Entrée en stock',
        href: '/entry/new',
        icon: ShoppingBasket,
        activePaths: ['/entries', '/entry/new']
      },
      // {
      //   title: 'Caisse',
      //   href: '/caisse',
      //   icon: CircleDollarSign,
      //   activePaths: ['/caisse']
      // },
      {
        title: "Aide pharmacienne",
        href: '/help',
        icon: CircleHelp,
        activePaths: ['/help']
      }
    ];
    
  return (
    <div className={`ultra-modern-app ${isLayoutReady ? 'layout-ready' : 'layout-initializing'}`}>
      <header className="glass-header" ref={headerRef}>
        <div className="header-container">
          <nav className="main-nav">
            <div className="nav-left">
              <button className="sidebar-trigger" onClick={toggleMobileNav} aria-label="Toggle Navigation">
                <Menu size={22} />
              </button>
              <div className="brand-identity">
                <div className="logo-container">
                  <div className="logo-badge">
                    <span className="logo-letter">M</span>
                    <div className="logo-pulse"></div>
                  </div>
                  <div className="brand-info">
                    <h1 className="brand-name">MyPharma</h1>
                    <span className="brand-tagline">Admin Panel</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="nav-center">
              <div className="search-zone">
                <div className="search-container">
                  <Search className="search-icon" size={18} />
                  <input 
                    type="search" 
                    placeholder="Rechercher dans l'application..." 
                    value={searchTerm} 
                    onChange={handleSearch} 
                    className="search-field"
                  />
                  <div className="search-suggestions">
                    <kbd className="kbd">⌘</kbd><kbd className="kbd">K</kbd>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="nav-right">
              <div className="action-bar">
                <div className="header-datetime" aria-live="polite">
                  <span className="header-datetime-dot"></span>
                  <span className="header-datetime-value">{headerDateTimeLabel}</span>
                </div>

                <div className="header-shortcuts" role="navigation" aria-label="Raccourcis pharmacie">
                  {headerShortcuts.map((shortcut) => {
                    const ShortcutIcon = shortcut.icon;

                    return (
                      <Link
                        key={shortcut.href}
                        to={shortcut.href}
                        className={`header-shortcut ${isActiveMenuItem(shortcut.activePaths) ? 'active' : ''}`}
                        title={shortcut.title}
                        aria-label={shortcut.title}
                      >
                        <ShortcutIcon size={17} />
                      </Link>
                    );
                  })}
                </div>

                <button className="mobile-search-trigger" aria-label="Search">
                  <Search size={20} />
                </button>
                
                <button style={{ display : "none" }} className="notification-bell" aria-label="Notifications">
                  <Bell size={20} />
                  <span className="notification-badge">
                    {/* 3 */}
                  </span>
                </button>
                
                {href && (
                  <Link to={href} className="quick-action-btn" title={title}>
                    <Plus size={20} color='white' />
                    <span className="action-label">Nouveau</span>
                  </Link>
                )}
                
                <button style={{ display : "none" }} className="theme-switcher" onClick={toggleDarkMode} aria-label="Toggle Theme">
                  <div className="theme-icon-wrapper">
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                  </div>
                </button>
                
                <div className="user-section">
                  {isAuthenticated ? (
                    <div className="user-profile-menu">
                      <button
                        className={`profile-trigger ${openDropdown === 'profile-menu' ? 'active' : ''}`}
                        onClick={() => toggleDropdown('profile-menu')}
                        aria-expanded={openDropdown === 'profile-menu'}
                        type="button"
                      >
                        <div className="avatar-container">
                          <img 
                            src={avatarSource}
                            alt="Profile" 
                            className="user-avatar"
                          />
                          <div className="online-indicator"></div>
                        </div>
                        <div className="user-info">
                          <span className="user-name">{displayName}</span>
                          <span className="user-role">{profileRole}</span>
                        </div>
                        <ChevronDown className="profile-chevron" size={16} />
                      </button>

                      <div className={`profile-dropdown ${openDropdown === 'profile-menu' ? 'open' : ''}`}>
                        <div className="profile-dropdown-header">
                          <span className="profile-dropdown-name">{displayName}</span>
                          <span className="profile-dropdown-email">{profileEmail}</span>
                        </div>
                        <button className="profile-dropdown-item" onClick={() => handleNavigation('/profile')} type="button">
                          <SquareUserRound size={16} />
                          <span>Mon profil</span>
                        </button>
                        <button className="profile-dropdown-item" onClick={() => handleNavigation('/password/edit')} type="button">
                          <Settings size={16} />
                          <span>Paramètres</span>
                        </button>
                        <button className="profile-dropdown-item danger" onClick={handleLogout} type="button">
                          <Lock size={16} />
                          <span>Déconnexion</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link to="/sign-in" className="login-prompt">
                      <TriangleAlert size={20} />
                      <span>Connexion</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>
      <div className="secondary-navbar" ref={navigationRef}>
        <div className="secondary-navbar-container">
          <div className="secondary-navbar-top">
            <div className="secondary-navbar-meta">
              <div className="meta-card datetime-card" style={{ display:"none" }}>
                <DynamicDateTime />
              </div>
              {isAuthenticated && (
                <div className="meta-card greeting-card">
                  <span className="meta-label">Bonjour</span>
                  <span className="meta-value">{displayName}</span>
                </div>
              )}
            </div>

            <div className={`navbar-status-pill ${remainingDays < 10 ? 'warning-state' : 'active-state'} ${remainingDays < 0 ? 'expired-state' : ''}`}>
              <div className="status-indicator">
                {remainingDays < 10 ? (
                  <Zap className="warning-icon" size={16} />
                ) : (
                  <div className="success-dot"></div>
                )}
              </div>

              <div className="status-content">
                <span className="status-caption">Abonnement</span>
                <span className={remainingDays < 10 ? 'status-warning' : 'status-active'}>
                  {subscriptionLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="secondary-navbar-bottom">
            <button className="mobile-nav-toggle" onClick={toggleMobileNav} type="button">
              {isMobileNavOpen ? <X size={18} /> : <Menu size={18} />}
              <span>{isMobileNavOpen ? 'Fermer' : 'Menu'}</span>
            </button>

            <nav ref={secondaryMenuRef} className={`secondary-menu ${isMobileNavOpen ? 'is-open' : ''}`}>
              {navigationSections.map((section) => {
                const Icon = section.icon;
                const isGroup = Array.isArray(section.items);
                const isActive = isGroup
                  ? section.items.some((item) => isActiveMenuItem(item.activePaths))
                  : isActiveMenuItem(section.activePaths);
                const isOpen = openDropdown === section.key;

                if (!isGroup) {
                  return (
                    <button
                      key={section.key}
                      className={`secondary-menu-link ${isActive ? 'active' : ''} ${section.critical ? 'critical' : ''} ${section.critical && remainingDays < 0 ? 'expired' : ''} ${section.critical && remainingDays >= 0 && remainingDays < 10 ? 'warning' : ''}`}
                      onClick={() => handleNavigation(section.href)}
                      type="button"
                    >
                      <span className="menu-icon"><Icon size={17} /></span>
                      <span className="menu-label">{section.label}</span>
                      {section.critical && remainingDays < 10 && <span className="menu-attention-dot"></span>}
                    </button>
                  );
                }

                return (
                  <div
                    key={section.key}
                    ref={(element) => {
                      if (element) {
                        sectionRefs.current[section.key] = element;
                      } else {
                        delete sectionRefs.current[section.key];
                      }
                    }}
                    className={`secondary-menu-group ${isOpen ? 'open' : ''}`}
                  >
                    <button
                      className={`secondary-menu-trigger ${isActive ? 'active' : ''}`}
                      onClick={() => toggleDropdown(section.key)}
                      aria-expanded={isOpen}
                      type="button"
                    >
                      <span className="menu-trigger-content">
                        <span className="menu-icon"><Icon size={17} /></span>
                        <span className="menu-label">{section.label}</span>
                      </span>
                      <ChevronDown className="menu-chevron" size={16} />
                    </button>

                    <div className="secondary-menu-dropdown">
                      {section.items.map((item) => {
                        const ItemIcon = item.icon;

                        return (
                          <button
                            key={item.href}
                            className={`secondary-dropdown-item ${isActiveMenuItem(item.activePaths) ? 'active' : ''}`}
                            onClick={() => handleNavigation(item.href)}
                            type="button"
                          >
                            <ItemIcon size={16} />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className={`backdrop-overlay ${isMobileNavOpen ? 'visible' : ''}`} onClick={toggleMobileNav}></div>
        
      <div className="app-body">
        <main className="content-area" style={{ padding:"7px", overflowY: "auto", height: "100%" }}>
          {children}
        </main>
      </div>
      
      {/* Modal de bonne année */}
      {showNewYearModal && (
        <div className="new-year-modal-overlay" onClick={closeNewYearModal}>
          <div className="new-year-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeNewYearModal}>
              <X size={24} />
            </button>
            
            <div className="modal-content">
              <div className="celebration-header">
                <div className="sparkles-container">
                  <Sparkles className="sparkle sparkle-1" size={32} />
                  <Sparkles className="sparkle sparkle-2" size={24} />
                  <Sparkles className="sparkle sparkle-3" size={28} />
                  <Sparkles className="sparkle sparkle-4" size={20} />
                  <Sparkles className="sparkle sparkle-5" size={26} />
                </div>
                <h1 className="modal-title">🎉 Bonne Année 2026 ! 🎉</h1>
              </div>
              
              <div className="modal-body">
                <div className="company-logo">
                  <div className="logo-circle">
                    <span className="logo-text">KG</span>
                  </div>
                </div>
                
                <div className="message-content">
                  <h2 className="company-name">Kokitech Group</h2>
                  <p className="wishes-text">
                    Nous vous souhaitons une année pleine de succès, d'innovations 
                    et de réalisations extraordinaires !
                  </p>
                  <p className="gratitude-text">
                    Merci de votre confiance et de votre fidélité.
                    Ensemble, construisons un avenir brillant ! ✨
                  </p>
                </div>
                
                <button className="celebrate-btn" onClick={closeNewYearModal}>
                  <Sparkles size={20} />
                  <span>Commencer l'année en beauté !</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;