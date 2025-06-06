import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import Home from './pages/Home'
import GlobalAlert from './components/GlobalMessage'
import Loader from './components/Loader'
import { useAppSelector } from './redux/hooks'

function App() {
  const {loading} = useAppSelector((state)=>state.root);
  return (
    
    <>
      <BrowserRouter>
        <GlobalAlert />
        {loading && <Loader />}
        <Routes>
          <Route path='/' element={<Login />} />
           <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path="/dashboard" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
