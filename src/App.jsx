import { useState } from 'react'
import './App.css'
import {BrowserRouter, Routes, Route }from 'react-router-dom'

function App() {

  return (
    <>
    <div>
      <BrowserRouter>
        <Routes>
          <Route path = "/"/>
          <Route path = "/"/>
        </Routes>
      </BrowserRouter>
    </div>  
    </>
  )
}

export default App
