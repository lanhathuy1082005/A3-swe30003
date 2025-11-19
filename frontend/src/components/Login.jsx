import {useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';

function Login({isStaff, setIsStaff}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log('Email:', email, 'Password:', password);
    };

    return (
    <Container>
    <Form>
      <div className="d-flex align-items-center gap-2">
      <span><strong>YOU ARE A:</strong> </span>
      {isStaff && <span>Customer</span>}{!isStaff && <span><strong>Customer</strong></span>}
      <Form.Check 
        type="switch" 
        id="role-switch" 
        checked={isStaff} 
        onChange={() => {setIsStaff(prev => !prev);}}
      />
      {!isStaff &&<span>Staff</span>}{isStaff && <span><strong>Staff</strong></span>}
    </div>
      <Form.Group className="mb-3" controlId="formGroupEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formGroupPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Enter Password" value={password} onChange={e => setPassword(e.target.value)} />
      </Form.Group>
      <Button variant="primary" onClick={handleLogin}>Login</Button>
      <Link to="/register" className="ms-3">Register</Link>
    </Form>
    </Container>
    );
}

export default Login;