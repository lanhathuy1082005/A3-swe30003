import { useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';

function Register({isStaff, setIsStaff}) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
      try {
      console.log('Email:', email, 'Name:', name, 'Password:', password);
      const fetchUrl = isStaff ? 'http://localhost:3000/staff' : 'http://localhost:3000/customers';
      const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email: email, name: name, password: password}),
    });

    console.log({ email: email, name: name, password: password })
    const data = await response.json(); 
    if (response.ok) {   
    console.log("Register success:", data.message);
    } else {
    console.error("Register failed:", data.message);
    }

  } catch (error) {
    console.error("Error during register:", error);
  }
    };

    return (
    <Container>
    <Form method='POST'>
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
        <Form.Group className="mb-3" controlId="formGroupName">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="Enter name" value={name} onChange={e => setName(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formGroupPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
      </Form.Group>
      <Button variant="primary" onClick={handleRegister}>Register</Button>
      <Link to="/login" className="ms-3">Login</Link>
    </Form>
    </Container>
    );
}

export default Register;