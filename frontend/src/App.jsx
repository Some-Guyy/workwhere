import {Route, createBrowserRouter, createRoutesFromElements, RouterProvider} from 'react-router-dom';
import HomePage from './pages/HomePage';
import MainLayout from './layouts/MainLayout';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      <Route path='/' element={<MainLayout />} >
        <Route index element={<HomePage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />}/>
      </>

    )
  );
  return <RouterProvider router={router} />
}

export default App