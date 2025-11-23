import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/Home.jsx'
import Order from './components/Order.jsx'
import Header from './components/Header.jsx'
import Login from './components/Login.jsx'
import Feedback from './components/Feedback.jsx'
import Register from './components/Register.jsx'
import Cart from './components/Cart.jsx'
import Payment from './components/Payment.jsx'
import Promotion from './components/Promotion.jsx'
import Status from './components/Status.jsx'
import {useState,useEffect} from 'react'

function App() {

  const [user,setUser] = useState({id:null,email:"",name:"",permissions:[]});
  const [promotions, setPromotions] = useState([]);
  const [orderItems, setOrderItems] = useState([]); 
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [warningCounter,setWarningCounter] = useState(0);
  const [menuItems, setMenuItems] = useState([]);

useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const res = await fetch("http://localhost:3000/user/session", {
          credentials: "include"
        });

        if (!mounted) return;

        const data = await res.json();

        if (res.ok) {
          setIsLoggedin(true);
          setUser(data);
          console.log(data);
        } else {
          console.log("No active session");
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };

    checkSession();

    return () => { mounted = false };
  }, []);

  return (
    <>   
      <Router>
        <Header isLoggedin={isLoggedin}  setIsLoggedin={setIsLoggedin} user={user} setUser={setUser} warningCounter={warningCounter}/>

        <Routes>
          <Route path="/" element={<Home user={user} promotions={promotions}/>} />
          <Route path="/payment" element={<Payment orderItems={orderItems} setOrderItems={setOrderItems} user={user}/>} />
          <Route path="/promotion" element={user.permissions.includes("edit_menu") 
          && <Promotion menuItems={menuItems} setMenuItems={setMenuItems} promotions={promotions} setPromotions={setPromotions}/>} />
          <Route path="/order" element={<Order user={user} orderItems={orderItems} 
            setOrderItems={setOrderItems} menuItems={menuItems} setMenuItems={setMenuItems} setWarningCounter={setWarningCounter}/>} />
          <Route path="/login" element={!isLoggedin && <Login setUser={setUser} setIsLoggedin={setIsLoggedin}/>} />
          <Route path="/feedback" element={<Feedback user={user}/>} />
          <Route path="/register" element={!isLoggedin && <Register/>} />
          <Route path="/cart" element={<Cart orderItems={orderItems} setOrderItems={setOrderItems}/>} />
          <Route path="/status" element={
            (user.permissions?.includes('purchase_items') || user.permissions?.includes('update_order_status')) 
              ? <Status user={user} /> 
              : <Home />
          } />
        </Routes>

      </Router>
    </>
  )
}

export default App
