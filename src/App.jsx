import { useCallback, useContext, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import SignIn from './auth/sign-in';
import '@assets/css/custom-ngprogress.css';
import '@assets/css/dashboard.css';
import '@assets/css/login.css';
import '@assets/css/form.css';
import '@assets/css/expense-pages.css';
import '@assets/css/badge.css';
import '@assets/css/collapse.css';
import '@assets/css/radio.css';
import '@assets/css/start.css';
import '@assets/css/newcardreport.css';
import '@assets/css/alert.css';
import '@assets/css/checkbox.css';
import '@assets/css/checkbcustom.css';
import '@assets/css/print.css';
import Register from './auth/register';
import { AuthContext } from '@context/AuthContext';
import Help from '@private/settings/help';
import ChangePassword from '@private/settings/change-password';
import Profile from '@private/settings/profile';
import Category from '@private/category/list';
import AddUpdateCategory from '@private/category/add-update';
import Dashboard from '@private/dashboard';
import ForgetPassword from '@auth/forget-password/forget-password';
import Products from '@private/product/list';
import AddUpdateProduct from '@private/product/add-update';
import CurrentEntries from '@private/entry/list';
import AddEntry from '@private/entry/add';
import Orders from '@private/order/list';
import AddOrder from '@private/order/add';
import PrintOrder from '@private/print/order/order'
import PrintOrders from '@private/print/order/orders'
import UsersOrders from '@private/order/user/list';
import Caisse from '@private/order/caisse/list';
import Creance from '@private/order/creance/list';
import Users from '@private/user/list';
import UpdateUser from '@private/user/update';
import AddUser from '@private/user/add';
import ApiUrlUpdater from './ApiUrlUpdater';
import Statistics from '@private/stats/list';
import Expenses from '@private/expenses/list';
import AddEditExpense from '@private/expenses/add';
import Reactivation from '@private/settings/reactivation';
import Customers from '@private/customers/list';
import { getDelayFromLocalStorage, resetDelayInLocalStorage, saveDelayToLocalStorage } from '@local/Delay';
import { resetUserProfileInLocalStorage, saveUserProfileToLocalStorage } from '@local/User';
import { isSubscriptionExpired } from '@services/subscription';
import axiosClient from './axios-client';
import USAGE from './USAGE';

function App() {
  const location = useLocation();

  useEffect(() => {
    nprogress.start();
    nprogress.done();
  }, [location]);

  const { currentUser, token, dispatch } = useContext(AuthContext);

  const [delaySnapshot, setDelaySnapshot] = useState(() => getDelayFromLocalStorage());

  useEffect(() => {
    const syncDelaySnapshot = () => {
      const nextSnapshot = getDelayFromLocalStorage();

      setDelaySnapshot((prevSnapshot) => {
        const isSameSnapshot =
          prevSnapshot?.dateEnd === nextSnapshot?.dateEnd &&
          prevSnapshot?.message === nextSnapshot?.message &&
          prevSnapshot?.nbDelay === nextSnapshot?.nbDelay;

        return isSameSnapshot ? prevSnapshot : nextSnapshot;
      });
    };

    const handleDelayUpdated = () => {
      syncDelaySnapshot();
    };

    const handleStorage = (event) => {
      // Ignore unrelated localStorage updates to avoid unnecessary re-renders.
      if (event.storageArea !== localStorage) {
        return;
      }

      if (event.key && !['dateEnd', 'message', 'nbDelay'].includes(event.key)) {
        return;
      }

      syncDelaySnapshot();
    };

    window.addEventListener('delay-updated', handleDelayUpdated);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('delay-updated', handleDelayUpdated);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const getCurrentUser = useCallback(async () => {
    if (!currentUser?.id) {
      return;
    }

    try {
      const { data } = await axiosClient.get(`/user/${currentUser.id}`);
      const userData = data?.data;

      saveDelayToLocalStorage(data?.dateEnd, data?.message, data?.nbDelay);
      if (userData) {
        saveUserProfileToLocalStorage(userData);
      }
    } catch (err) {
      const response = err?.response;
      if (response?.status === 404) {
        resetUserProfileInLocalStorage();
        resetDelayInLocalStorage();
        dispatch({ type: 'LOGOUT' });
      }
    }
  }, [currentUser?.id, dispatch]);

  useEffect(() => {
    if (currentUser?.id) {
      getCurrentUser();
    }
  }, [currentUser?.id, getCurrentUser]);

  const subscriptionLocked = Boolean(currentUser) && isSubscriptionExpired(delaySnapshot?.nbDelay);

  const RequireAuth = ({ children }) => {
    const isAuthenticated = currentUser && token;

    if (!isAuthenticated) {
      return <Navigate to="/sign-in" replace />;
    }

    if (subscriptionLocked && location.pathname !== '/reactivation') {
      return <Navigate to="/reactivation" replace />;
    }

    return children;
  };

  return (
    <>
      <Routes>

        <Route path="/home" element={<RequireAuth><Dashboard/></RequireAuth>} />
        <Route path="/usage" element={<RequireAuth><USAGE/></RequireAuth>} />

        <Route path="/categories" element={<RequireAuth><Category/></RequireAuth>} />
        <Route path="/category/edit/:categoryId/" element={<RequireAuth><AddUpdateCategory/></RequireAuth>} />
        <Route path="/category/new" element={<RequireAuth><AddUpdateCategory/></RequireAuth>} /> 

        <Route path="/products" element={<RequireAuth><Products/></RequireAuth>} />
        <Route path="/product/edit/:productId/" element={<RequireAuth><AddUpdateProduct/></RequireAuth>} />
        <Route path="/product/new" element={<RequireAuth><AddUpdateProduct/></RequireAuth>} />

        <Route path="/stats" element={<RequireAuth><Statistics/></RequireAuth>} />

        <Route path="/users" element={<RequireAuth><Users/></RequireAuth>} />
        <Route path="/user/new" element={<RequireAuth><AddUser/></RequireAuth>} />   
        <Route path="/users/edit/:userId/" element={<RequireAuth><UpdateUser/></RequireAuth>} />

        <Route path="/entries" element={<RequireAuth><CurrentEntries/></RequireAuth>} />
        <Route path="/entry/new" element={<RequireAuth><AddEntry/></RequireAuth>} />   

        <Route path="/expenses" element={<RequireAuth><Expenses/></RequireAuth>} />
        <Route path="/expense/new" element={<RequireAuth><AddEditExpense/></RequireAuth>} />
        <Route path="/expense/edit/:expenseId/" element={<RequireAuth><AddEditExpense/></RequireAuth>} />   

        <Route path="/user-orders" element={<RequireAuth><UsersOrders/></RequireAuth>} />
        <Route path="/caisse" element={<RequireAuth><Caisse/></RequireAuth>} />
        <Route path="/creance" element={<RequireAuth><Creance/></RequireAuth>} />
        <Route path="/orders/:userId/" element={<RequireAuth><Orders/></RequireAuth>} />

        {/* <Route path="/orders" element={<RequireAuth><Orders/></RequireAuth>} /> */}
        <Route path="/order/new" element={<RequireAuth><AddOrder/></RequireAuth>} />
        <Route path="/print-order" element={<RequireAuth><PrintOrder/></RequireAuth>} />
        <Route path="/print-orders" element={<RequireAuth><PrintOrders/></RequireAuth>} />

        <Route path="/customers" element={<RequireAuth><Customers/></RequireAuth>} />

        <Route path="/help" element={<Help/>} />
        <Route path="/reactivation" element={<RequireAuth><Reactivation /></RequireAuth>} />

        <Route path="/password/edit" element={<RequireAuth><ChangePassword/></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile/></RequireAuth>} />

        <Route path="/forget-password" element={<ForgetPassword/>} />
        <Route path="/sign-in" element={<SignIn/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={currentUser ? <Navigate to={subscriptionLocked ? '/reactivation' : '/home'} /> : <SignIn/>} />

        <Route path="/config" element={<ApiUrlUpdater/>} />
      </Routes>
    </>
  );
}

export default App
