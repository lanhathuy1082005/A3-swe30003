import { useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Login({setUser, setIsLoggedin}) {
  
    const [errorMessage, setErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleName, setRoleName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);
      setErrorMessage('');
      
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
        setErrorMessage(data.message);

        if(data.message === "Logged in successfully"){
          setIsLoggedin(true);
          setUser(data);
          navigate("/");
        }
      } catch (err){
        console.error("Error during login:", err);
        setErrorMessage("Connection error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh'}}>
        <Card style={{ width: '100%', maxWidth: '400px' }}>
          <Card.Body className="p-4">
            <h2 className="text-center mb-4">Login</h2>
            
            {errorMessage && (
              <Alert variant={errorMessage === "Logged in successfully" ? "success" : "danger"}>
                {errorMessage}
              </Alert>
            )}

            <Form onSubmit={handleLogin}>
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
                />
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 mb-3"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>

              <div className="text-center">
                <span className="text-muted">Don't have an account? </span>
                <Link to="/register">Register here</Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    );
}

export default Login;