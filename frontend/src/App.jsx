import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/Home.jsx'
import Order from './components/Order.jsx'
import Header from './components/Header.jsx'
import Login from './components/Login.jsx'
import Feedback from './components/Feedback.jsx'
import Register from './components/Register.jsx'
import Cart from './components/Cart.jsx'
import {useState} from 'react'

function App() {
  const [isStaff, setIsStaff] = useState(false);
  const [orderItems, setOrderItems] = useState([]); 
  const [isLoggedin, setIsLoggedin] = useState(false);

  return (
    <>   
      <Router>
        <Header isLoggedin={isLoggedin} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/order" element={<Order orderItems={orderItems} setOrderItems={setOrderItems} />} />
          <Route path="/login" element={<Login isStaff={isStaff} setIsStaff={setIsStaff} />} />
          <Route path="/feedback" element={<Feedback/>} />
          <Route path="/register" element={<Register isStaff={isStaff} setIsStaff={setIsStaff} />} />
          <Route path="/cart" element={<Cart orderItems={orderItems} setOrderItems={setOrderItems}/>} />
        </Routes>

      </Router>
    </>
  )
}

export default App
