import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

//component
import Dashboard from "./Components/Dashboard";


function App() {

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App