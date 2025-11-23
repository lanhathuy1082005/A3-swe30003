import { useState } from 'react';
import { Container, Card, Form, Button, Alert, ListGroup, Badge } from 'react-bootstrap';

function Feedback() {
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [recentFeedback] = useState([
    { id: 1, content: 'Great service!', date: '2024-11-20' },
    { id: 2, content: 'Food was delicious', date: '2024-11-19' },
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Send to backend
    console.log('Feedback submitted:', feedbackText);
    setSubmitted(true);
    setFeedbackText('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Feedback</h1>

      {submitted && (
        <Alert variant="success" dismissible>
          Thank you for your feedback!
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Share Your Experience</Card.Title>
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

      <Card>
        <Card.Body>
          <Card.Title>Recent Feedback</Card.Title>
          <ListGroup variant="flush">
            {recentFeedback.map((fb) => (
              <ListGroup.Item key={fb.id}>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="mb-1">{fb.content}</p>
                    <small className="text-muted">{fb.date}</small>
                  </div>
                  <Badge bg="info">New</Badge>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Feedback;