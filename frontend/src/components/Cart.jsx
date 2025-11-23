import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/esm/Container';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';

function Cart({orderItems, setOrderItems}) {

const calculateTotal = () => {
  return orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2);
};

const handleCancelOrder = () => {
  if (window.confirm('Are you sure you want to cancel your order?')) {
    setOrderItems([]);
  }
};

return (
  <Container className="mt-4" style={{ paddingBottom: '100px' }}>
    {/* Back Button */}
    <Button 
      variant="outline-secondary" 
      as={Link} 
      to="/order" 
      className="mb-3"
    >
      ← Back to Menu
    </Button>

    <h2 className="mb-4">Your Cart</h2>
    
    {orderItems.length === 0 ? (
      <Card className="text-center p-5">
        <Card.Body>
          <h4 className="text-muted">Your cart is empty</h4>
          <p className="text-muted">Add some items to get started!</p>
          <Button variant="primary" as={Link} to="/order">Browse Menu</Button>
        </Card.Body>
      </Card>
    ) : (
      <>
        <Card className="mb-4">
          <ListGroup variant="flush">
            {orderItems.map((item) => (
              <ListGroup.Item key={item.id}>
                <Row className="align-items-center">
                  <Col xs={7}>
                    <h5 className="mb-1">{item.item_name}</h5>
                    <small className="text-muted">Qty: {item.quantity}</small>
                  </Col>
                  <Col xs={5} className="text-end">
                    <Badge bg="secondary" pill className="fs-6">
                      ${(item.quantity * item.price).toFixed(2)}
                    </Badge>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
          
          <Card.Footer className="bg-light">
            <Row>
              <Col><strong>Total:</strong></Col>
              <Col className="text-end"><strong className="fs-4">${calculateTotal()}</strong></Col>
            </Row>
          </Card.Footer>
        </Card>

        {/* Action Buttons */}
        <div className="d-grid gap-2">
          <Button
            variant="success"
            size="lg"
            as={Link} 
            to="/payment"
          >
            Proceed to Payment
          </Button>
          
          <Button
            variant="outline-danger"
            size="lg"
            onClick={handleCancelOrder}
          >
            Cancel Order
          </Button>
        </div>
      </>
    )}
  </Container>
);
}

export default Cart;