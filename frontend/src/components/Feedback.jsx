import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, ListGroup, Badge, Row, Col } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

function Feedback({ user }) {
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [error, setError] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId || null;

  const isStaff = user.permissions && user.permissions.includes('update_order_status');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const url = isStaff 
          ? 'http://localhost:3000/feedback/all'
          : 'http://localhost:3000/feedback/my';
        
        const response = await fetch(url, {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setFeedbackList(data);
        }
      } catch (err) {
        console.error('Error fetching feedback:', err);
      }
    };

    fetchFeedback();
  }, [isStaff, refreshTrigger]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          content: feedbackText,
          order_id: orderId
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFeedbackText('');
        setRefreshTrigger(prev => prev + 1); // Trigger refresh by updating state
        setTimeout(() => {
          setSubmitted(false);
          if (orderId) {
            navigate('/status'); // Redirect to status page after feedback
          }
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to submit feedback');
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('An error occurred while submitting feedback');
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">{isStaff ? 'Customer Feedback' : 'Feedback'}</h1>

      {submitted && (
        <Alert variant="success" dismissible>
          Thank you for your feedback!
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Show feedback form only for non-staff */}
      {!isStaff && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>
              {orderId ? `Feedback for Order #${orderId}` : 'Share Your Experience'}
            </Card.Title>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Your Feedback</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Tell us about your experience..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" disabled={!feedbackText.trim()}>
                Submit Feedback
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Feedback list */}
      <Card>
        <Card.Body>
          <Card.Title>
            {isStaff ? 'All Customer Feedback' : 'My Feedback History'}
          </Card.Title>
          {feedbackList.length === 0 ? (
            <Alert variant="info">No feedback yet.</Alert>
          ) : (
            <ListGroup variant="flush">
              {feedbackList.map((fb) => (
                <ListGroup.Item key={fb.id}>
                  <Row>
                    <Col>
                      <p className="mb-2">{fb.content}</p>
                      <div className="d-flex gap-3 flex-wrap">
                        <small className="text-muted">
                          {new Date(fb.created_at).toLocaleString()}
                        </small>
                        {fb.order_number && (
                          <small className="text-muted">
                            <strong>Order #{fb.order_number}</strong>
                          </small>
                        )}
                        {isStaff && (
                          <small className="text-muted">
                            <strong>Customer:</strong> {fb.username} ({fb.email})
                          </small>
                        )}
                      </div>
                    </Col>
                    <Col xs="auto">
                      <Badge bg="info">Feedback</Badge>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Feedback;