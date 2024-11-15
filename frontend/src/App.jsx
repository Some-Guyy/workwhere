import {Route, createBrowserRouter, createRoutesFromElements, RouterProvider} from 'react-router-dom';
import HomePage from './pages/HomePage';
import MainLayout from './layouts/MainLayout';
import NotFoundPage from './pages/NotFoundPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import ManageOthersApplicationPage from './pages/ManageOthersApplicationPage';
import LoginPage from './pages/LoginPage';

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      <Route path='/' element={<LoginPage/>}/> 
      <Route path='/' element={<MainLayout />} >
        <Route path='/home' element={<HomePage />} />
        <Route path='/my' element={<MyApplicationsPage />}/>
        <Route path='/other' element={<ManageOthersApplicationPage />}/>
      </Route>
      <Route path="*" element={<NotFoundPage />}/>
      </>

    )
  );
  return <RouterProvider router={router} />
}

export default App