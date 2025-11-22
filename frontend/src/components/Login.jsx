import { useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Login({setUser, setIsLoggedin}) {
  
    const [errorMessage,setErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleName, setRoleName] = useState('');
    const navigate = useNavigate()

    const handleLogin = async () => {
      try {
      const fetchUrl = 'http://localhost:3000/user/login';
      const response = await fetch(fetchUrl, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email: email, password: password, role_name: roleName}),
    });
      const data = await response.json();
      setErrorMessage(data.message)

      if(data.message === "Logged in successfully"){
        setIsLoggedin(true);
        setUser(data);
        navigate("/")
      }
      
      } catch (err){
        console.error("Error during login:", err);
      }
    };

    return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh'}}>
    <Form>
    <Form.Select className="mb-3" aria-label="Choose account role" value={roleName} onChange={e => setRoleName(e.target.value)}>
      <option>Choose account role</option>
      <option value="staff">Staff</option>
      <option value="customer">Customer</option>
    </Form.Select>
      <Form.Group className="mb-3" controlId="formGroupEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formGroupPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Enter Password" value={password} onChange={e => setPassword(e.target.value)} />
      </Form.Group>
      <p>{errorMessage}</p>
      <Button variant="primary" onClick={handleLogin}>Login</Button>
      <Link to="/register" className="ms-3">Register</Link>
    </Form>
    </Container>
    );
}

export default Login;