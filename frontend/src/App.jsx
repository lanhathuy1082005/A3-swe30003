import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/Home.jsx'
import Create from './components/Create.jsx'
import Header from './components/Header.jsx'
import Login from './components/Login.jsx'
import {useState} from 'react'

function App() {
  const [isLoggedin, setisLoggedin] = useState(false);

  return (
    <>   
      <Router>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/login" element={<Login />} />
        </Routes>

      </Router>
    </>
  )
}

export default App
