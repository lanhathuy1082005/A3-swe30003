import { useState, useEffect } from 'react';
import { Container, Card, Button, Modal, ListGroup, Row, Col, Alert, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function Payment({ orderItems, setOrderItems, user }) {
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const navigate = useNavigate();

  const canPurchase = user.permissions && user.permissions.includes('purchase_items');

  useEffect(() => {
    const getPromotions = async () => {
      try {
        const response = await fetch('http://localhost:3000/promotion', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          
          // Filter only active promotions that are currently valid
          const now = new Date();
          const activePromos = data.filter(promo => {
            if (!promo.active) return false;
            
            const startDate = new Date(promo.start_date);
            const endDate = new Date(promo.end_date);
            
            return now >= startDate && now <= endDate;
          });
          
          setPromotions(activePromos);
        }
      } catch (error) {
        console.error("Couldn't get promotions:", error);
      }
    };

    getPromotions();
  }, []);

  const calculateDiscount = (promo) => {
    if (!promo) return 0;

    const subtotal = orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    switch (promo.type) {
      case 'percentage':
        if (promo.menu_id) {
          // Discount specific item
          const targetItem = orderItems.find(item => item.id === promo.menu_id);
          if (targetItem) {
            const itemSubtotal = targetItem.quantity * targetItem.price;
            return itemSubtotal * (promo.amount / 100);
          }
          return 0;
        } else {
          // Discount entire order
          return subtotal * (promo.amount / 100);
        }

      case 'fixed':
        if (promo.menu_id) {
          // Fixed discount on specific item
          const targetItem = orderItems.find(item => item.id === promo.menu_id);
          if (targetItem) {
            const itemSubtotal = targetItem.quantity * targetItem.price;
            return Math.min(promo.amount, itemSubtotal);
          }
          return 0;
        } else {
          // Fixed discount on entire order
          return Math.min(promo.amount, subtotal);
        }

      case 'bogo':
        if (promo.menu_id) {
          const targetItem = orderItems.find(item => item.id === promo.menu_id);
          if (targetItem && targetItem.quantity >= promo.min_quantity) {
            return promo.free_quantity * targetItem.price;
          }
        }
        return 0;

      default:
        return 0;
    }
  };

  const getBogoFreeQuantity = (promo) => {
    if (!promo || promo.type !== 'bogo' || !promo.menu_id) return 0;
    
    const targetItem = orderItems.find(item => item.id === promo.menu_id);
    if (targetItem && targetItem.quantity >= promo.min_quantity) {
      return promo.free_quantity;
    }
    return 0;
  };

  const handleConfirmPayment = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          customer_id: user.id,
          items: orderItems.map(item => ({
            id: item.id,
            quantity: item.quantity
          })),
          payment_method: paymentMethod,
          promotion_id: selectedPromotion?.id || null
        }),
      });

      const data = await response.json(); 
      
      if (response.ok) {   
        console.log("Checkout success:", data);
        const orderId = data.order.orderId;
        setOrderItems([]);
        setShowModal(false);
        setPaymentMethod(null);
        setSelectedPromotion(null);
        
        // Show success message and ask for feedback
        if (window.confirm(`Payment successful! Order #${orderId}\nTotal: ${data.order.final_price}\nPoints earned: ${data.order.points_earned}\n\nWould you like to leave feedback?`)) {
          navigate('/feedback', { state: { orderId } });
        } else {
          navigate('/status');
        }
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

  const getPromotionDescription = (promo) => {
    switch (promo.type) {
      case 'percentage':
        return `${promo.amount}% off${promo.menu_id ? ' on selected item' : ' entire order'}`;
      case 'fixed':
        return `$${promo.amount} off${promo.menu_id ? ' on selected item' : ' entire order'}`;
      case 'bogo':
        return `Buy ${promo.min_quantity}, Get ${promo.free_quantity} Free`;
      default:
        return promo.description || 'Special Offer';
    }
  };

  const subtotal = orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const discount = calculateDiscount(selectedPromotion);
  const subtotalAfterDiscount = Math.max(0, subtotal - discount);
  const tax = subtotalAfterDiscount * 0.1;
  const total = subtotalAfterDiscount + tax;

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

      {/* Promotions Section */}
      {promotions.length > 0 && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Apply Promotion</Card.Title>
            <Form.Group>
              <Form.Select 
                value={selectedPromotion?.id || ''} 
                onChange={(e) => {
                  const promoId = parseInt(e.target.value);
                  const promo = promotions.find(p => p.id === promoId);
                  setSelectedPromotion(promo || null);
                }}
                size="lg"
              >
                <option value="">No Promotion</option>
                {promotions.map(promo => (
                  <option key={promo.id} value={promo.id}>
                    {promo.name} - {getPromotionDescription(promo)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {selectedPromotion && (
              <Alert variant="success" className="mt-3 mb-0">
                <strong>✓ {selectedPromotion.name}</strong> applied!
              </Alert>
            )}
          </Card.Body>
        </Card>
      )}

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Order Summary</Card.Title>
          <ListGroup variant="flush">
            {orderItems.map(item => {
              const isBogoBonusItem = selectedPromotion?.type === 'bogo' && 
                                      selectedPromotion?.menu_id === item.id;
              const freeQty = isBogoBonusItem ? getBogoFreeQuantity(selectedPromotion) : 0;
              const displayQty = item.quantity + freeQty;
              
              return (
                <ListGroup.Item key={item.id}>
                  <Row>
                    <Col>
                      <strong>{item.item_name}</strong>
                      <div className="text-muted small">
                        Qty: {item.quantity}
                        {freeQty > 0 && (
                          <span className="text-success fw-bold"> + {freeQty} FREE</span>
                        )}
                        {freeQty > 0 && (
                          <span> = {displayQty} total</span>
                        )}
                      </div>
                    </Col>
                    <Col xs="auto">
                      <strong>${(item.quantity * item.price).toFixed(2)}</strong>
                      {freeQty > 0 && (
                        <div className="text-success small">
                          (${(displayQty * item.price).toFixed(2)} value)
                        </div>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
          <hr />
          <Row className="mb-2">
            <Col>Subtotal</Col>
            <Col xs="auto">${subtotal.toFixed(2)}</Col>
          </Row>
          
          {selectedPromotion && discount > 0 && (
            <Row className="mb-2 text-success">
              <Col>
                <strong>Discount ({selectedPromotion.name})</strong>
              </Col>
              <Col xs="auto">
                <strong>-${discount.toFixed(2)}</strong>
              </Col>
            </Row>
          )}
          
          <Row className="mb-2">
            <Col>Tax (10%)</Col>
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
              Cash 💵
            </Button>
            <Button
              variant={paymentMethod === 'card' ? 'primary' : 'outline-primary'}
              size="lg"
              onClick={() => setPaymentMethod('card')}
            >
              Card 💳
            </Button>
          </div>
          <div className="mt-4 p-3 bg-light rounded">
            {selectedPromotion && discount > 0 && (
              <div className="mb-2 text-success">
                <small>✓ {selectedPromotion.name} applied</small>
              </div>
            )}
            <Row>
              <Col>Total Amount:</Col>
              <Col xs="auto" className="fw-bold fs-4">${total.toFixed(2)}</Col>
            </Row>
            {discount > 0 && (
              <Row className="text-muted">
                <Col><small>You saved:</small></Col>
                <Col xs="auto"><small className="text-success fw-bold">${discount.toFixed(2)}</small></Col>
              </Row>
            )}
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