import { useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';

function Register() {
    const [errorMessage,setErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [roleName, setRoleName] = useState('');

    const handleRegister = async () => {
      try {
      const fetchUrl = 'http://localhost:3000/user/register';
      const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email: email, name: name, password: password, role_name: roleName}),
    });

    const data = await response.json(); 
    setErrorMessage(data.message)

  } catch (error) {
    console.error("Error during register:", error);
  }
    };

    return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh'}}>
    <Form method='POST'>
    <Form.Select className="mb-3" aria-label="Choose account role" value={roleName} onChange={e => setRoleName(e.target.value)}>
      <option>Choose account role</option>
      <option value="staff">Staff</option>
      <option value="customer">Customer</option>
    </Form.Select>
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
      <p>{errorMessage}</p>
      <Button variant="primary" onClick={handleRegister}>Register</Button>
      <Link to="/login" className="ms-3">Login</Link>
    </Form>
    </Container>
    );
}

export default Register;