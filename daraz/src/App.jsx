import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Home from './pages/Home'
import Becomeseller from './pages/Becomeseller'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Becomeseller" element={<Becomeseller />} />
      </Routes>
      <Footer />

    </>
  )
}

export default App
