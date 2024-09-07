import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/antd.css'; 
import EMICalculator from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      
    <>
      <EMICalculator/>
      <ToastContainer/>
    </>
);


