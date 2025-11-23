import { useState } from 'react';
import { Container, Card, Button, Modal, ListGroup, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function Payment({ orderItems, setOrderItems, user }) {
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const navigate = useNavigate();

  const canPurchase = user.permissions && user.permissions.includes('purchase_items');

  // Calculate totals from cart using actual prices
  const subtotal = orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleConfirmPayment = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    
    
    try {
      const response = await fetch('http://localhost:3000/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          customer_id: user.id,  // Use actual user ID
          items: orderItems.map(item => ({
            id: item.id,  // Backend expects 'id', not 'item_id'
            quantity: item.quantity
          })),
          payment_method: paymentMethod,
          promotion_id: null  // Add promotion selection later if needed
        }),
      });

      const data = await response.json(); 
      
      if (response.ok) {   
        console.log("Checkout success:", data);
        setOrderItems([]); // Clear cart
        alert(`Payment successful! Order #${data.order.orderId}\nTotal: $${data.order.final_price}\nPoints earned: ${data.order.points_earned}`);
        setShowModal(false);
        setPaymentMethod(null);
        navigate('/status');  // Go to order status page
      } else {
        alert('Checkout failed: ' + data.message);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert('An error occurred during checkout');
    }
  };

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel your order and return home?')) {
      setOrderItems([]);
      navigate('/');
    }
  };

  if (!canPurchase) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Access Denied</Alert.Heading>
          <p>You don't have permission to make purchases.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Button 
        variant="outline-secondary" 
        as={Link} 
        to="/cart" 
        className="mb-3"
      >
        ← Back to Cart
      </Button>

      <h1 className="mb-4">Payment</h1>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Order Summary</Card.Title>
          <ListGroup variant="flush">
            {orderItems.map(item => (
              <ListGroup.Item key={item.id}>
                <Row>
                  <Col>
                    <strong>{item.item_name}</strong>
                    <div className="text-muted small">Qty: {item.quantity}</div>
                  </Col>
                  <Col xs="auto">
                    <strong>${(item.quantity * item.price).toFixed(2)}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <hr />
          <Row className="mb-2">
            <Col>Subtotal</Col>
            <Col xs="auto">${subtotal.toFixed(2)}</Col>
          </Row>
          <Row className="mb-2">
            <Col>Tax</Col>
            <Col xs="auto">${tax.toFixed(2)}</Col>
          </Row>
          <Row className="fw-bold fs-5">
            <Col>Total</Col>
            <Col xs="auto">${total.toFixed(2)}</Col>
          </Row>
        </Card.Body>
      </Card>

      <div className="d-grid gap-2">
        <Button 
          variant="primary" 
          size="lg" 
          onClick={() => setShowModal(true)}
        >
          Select Payment Method
        </Button>

        <Button 
          variant="outline-danger" 
          size="lg" 
          onClick={handleCancelOrder}
        >
          Cancel Order
        </Button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Payment Method</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-grid gap-3">
            <Button
              variant={paymentMethod === 'cash' ? 'primary' : 'outline-primary'}
              size="lg"
              onClick={() => setPaymentMethod('cash')}
            >
              Cash 
            </Button>
            <Button
              variant={paymentMethod === 'card' ? 'primary' : 'outline-primary'}
              size="lg"
              onClick={() => setPaymentMethod('card')}
            >
              Card
            </Button>
          </div>
          <div className="mt-4 p-3 bg-light rounded">
            <Row>
              <Col>Total Amount:</Col>
              <Col xs="auto" className="fw-bold fs-4">${total.toFixed(2)}</Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleConfirmPayment} disabled={!paymentMethod} className="w-100">
            Confirm Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Payment;