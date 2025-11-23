import { useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const [errorMessage, setErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [roleName, setRoleName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
      e.preventDefault();
      
      if (password !== confirmPassword) {
        setErrorMessage("Passwords don't match!");
        return;
      }

      setLoading(true);
      setErrorMessage('');

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
        setErrorMessage(data.message);

        if (response.ok && data.message === "User registered successfully") {
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (error) {
        console.error("Error during register:", error);
        setErrorMessage("Connection error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh'}}>
        <Card style={{ width: '100%', maxWidth: '400px' }}>
          <Card.Body className="p-4">
            <h2 className="text-center mb-4">Register</h2>
            
            {errorMessage && (
              <Alert variant={errorMessage === "User registered successfully" ? "success" : "danger"}>
                {errorMessage}
              </Alert>
            )}

            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3">
                <Form.Label>Account Role</Form.Label>
                <Form.Select 
                  value={roleName} 
                  onChange={e => setRoleName(e.target.value)}
                  required
                >
                  <option value="">Choose account role</option>
                  <option value="staff">Staff</option>
                  <option value="customer">Customer</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter name" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Enter email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Enter password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <Form.Text className="text-muted">
                  Must be at least 6 characters
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Confirm password" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 mb-3"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>

              <div className="text-center">
                <span className="text-muted">Already have an account? </span>
                <Link to="/login">Login here</Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    );
}

export default Register;