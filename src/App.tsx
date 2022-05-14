import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import SigninPage from './pages/SigninPage';
import SignupPage from './pages/SignupPage';
import './styles/App.css';

const App = () => {
  const fetchApiData = async () => {
    const headers = new Headers({
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0NGNmOTZkMi01OGZjLTRlMGMtOTZkOS05YWM0MjhkNGQ0OTUiLCJsb2dpbiI6InVzZXIwMDEiLCJpYXQiOjE2NTIwMDMyMTF9.EUlvrrs0Hl7wq1o-vkW5eh710CeNmhTfivk8aYkO43I', 
    })
    const options = {
      method: 'GET',
      headers,
      // mode: 'no-cors' as RequestMode,
    }

    const apiData = await fetch('https://still-earth-24890.herokuapp.com/users', options);

    console.log('apiData', apiData);
    const parsedApiData = await apiData.json();
    console.log('API users', parsedApiData);
  };

  useEffect(() => {
    fetchApiData();
  });
  
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup"element={<SignupPage />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
};

export default App;
