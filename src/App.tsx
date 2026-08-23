import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import ECommerce from './pages/Dashboard/ECommerce';
import Tables from './pages/Tables';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Users from './pages/Users';
import Coupons from './pages/Coupons';
import DefaultLayout from './layout/DefaultLayout';
import { Provider } from 'react-redux';
import store from './store/store';
import SingleOrder from './pages/SingleOrder';
import ProtectedRoute from './components/ProtectedRoute';
import {io} from 'socket.io-client'

export const socket = io("http://localhost:5000",{
  auth : {
    token : localStorage.getItem('token')
  }
})

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (

     <Provider store={store}>
     <Routes>

        <Route
          index
          element={
            <ProtectedRoute>
              <PageTitle title="eCommerce Dashboard | Admin" />
              <DefaultLayout>

              <ECommerce />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <PageTitle title="Products | Admin" />
              <DefaultLayout>
                <Products />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <PageTitle title="Categories | Admin" />
              <DefaultLayout>
                <Categories />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <PageTitle title="Orders | Admin" />
              <DefaultLayout>
                <Orders />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <PageTitle title="Users | Admin" />
              <DefaultLayout>
                <Users />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/coupons"
          element={
            <ProtectedRoute>
              <PageTitle title="Coupons | Admin" />
              <DefaultLayout>
                <Coupons />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tables"
          element={
            <ProtectedRoute>
              <PageTitle title="Orders | Admin" />
              <DefaultLayout>

              <Tables />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/order/:id"
          element={
            <ProtectedRoute>
              <PageTitle title="Order Detail | Admin" />
              <DefaultLayout>

             <SingleOrder />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <PageTitle title="login" />
              <SignIn />
            </>
          }
        />

      </Routes>
     </Provider>

  );
}

export default App;
