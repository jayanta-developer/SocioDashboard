import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";


//component
import Dashboard from "./Components/Dashboard";


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App