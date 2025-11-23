import { useState, useEffect } from 'react';
import { Container, Card, Button, Badge, Row, Col, ListGroup, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Status({ user }) {
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});

  const isStaff = user.permissions && user.permissions.includes('update_order_status');
  const canPurchase = user.permissions && user.permissions.includes('purchase_items');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // If staff, fetch all orders; otherwise fetch user's orders
        const url = isStaff 
          ? `http://localhost:3000/orders/all`
          : `http://localhost:3000/orders/user/${user.id}`;
        
        const response = await fetch(url, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        console.log(data);
        setOrders(data);

        // Fetch details for each order
        const details = {};
        for (const order of data) {
          try {
            const detailResponse = await fetch(`http://localhost:3000/orders/details/${order.id}`, {
              credentials: 'include'
            });
            
            if (detailResponse.ok) {
              const detailData = await detailResponse.json();
              details[order.id] = detailData.items;
            }
          } catch (err) {
            console.error(`Error fetching details for order ${order.id}:`, err);
          }
        }
        setOrderDetails(details);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (user.id) {
      fetchOrders();
    }
  }, [user.id, isStaff]);

  // Customer: Cancel order (only pending/preparing)
  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      const response = await fetch(`http://localhost:3000/orders/${orderId}/cancel`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, order_status: 'cancelled' } : order
        ));
        alert('Order cancelled successfully');
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order');
    }
  };

  // Staff: Update order status (pending -> preparing -> delivering -> completed)
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ order_status: newStatus }),
      });

      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, order_status: newStatus } : order
        ));
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      preparing: 'info',
      delivering: 'primary',
      completed: 'success',
      cancelled: 'danger'
    };
    return <Badge bg={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const canCustomerCancel = (status) => status === 'pending' || status === 'preparing';

  // Security: Check if user has permission to view orders
  if (!canPurchase && !isStaff) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Access Denied</Alert.Heading>
          <p>You don't have permission to view orders.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Button variant="outline-secondary" as={Link} to="/" className="mb-3">
        ← Back to Home
      </Button>

      <h1 className="mb-4">{isStaff ? 'All Orders' : 'My Orders'}</h1>

      {orders.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <h4 className="text-muted">No orders found</h4>
            {!isStaff && <Button variant="primary" as={Link} to="/order">Start Ordering</Button>}
          </Card.Body>
        </Card>
      ) : (
        orders.map(order => (
          <Card key={order.id} className="mb-3">
            <Card.Body>
              <Row>
                <Col md={8}>
                  <h5>Order #{order.id}</h5>
                  <p className="text-muted mb-2">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                  
                  <ListGroup variant="flush" className="mb-3">
                    {orderDetails[order.id] ? (
                      orderDetails[order.id].map((item, idx) => (
                        <ListGroup.Item key={idx}>
                          <Row>
                            <Col>
                              {item.item_name} × {item.quantity}
                            </Col>
                            <Col xs="auto">
                              ${parseFloat(item.subtotal).toFixed(2)}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <ListGroup.Item>Loading items...</ListGroup.Item>
                    )}
                  </ListGroup>

                  <p className="mb-1">
                    <strong>Total:</strong> ${parseFloat(order.final_price).toFixed(2)}
                  </p>
                  <p className="mb-1">
                    <strong>Payment:</strong> {order.payment_method.toUpperCase()}
                  </p>
                  <p className="mb-1">
                    <strong>Points Earned:</strong> {order.points_earned}
                  </p>
                  {isStaff && (
                    <p className="mb-0">
                      <strong>Customer ID:</strong> {order.customer_id}
                    </p>
                  )}
                </Col>

                <Col md={4} className="text-end">
                  <div className="mb-3">
                    {getStatusBadge(order.order_status)}
                  </div>

                  {!isStaff && canCustomerCancel(order.order_status) && (
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleCancel(order.id)}
                    >
                      Cancel Order
                    </Button>
                  )}

                  {!isStaff && !canCustomerCancel(order.order_status) && (
                    <p className="text-muted small mb-0">
                      {order.order_status === 'delivering' && '🚚 Your order is on the way!'}
                      {order.order_status === 'completed' && '✅ Order completed'}
                      {order.order_status === 'cancelled' && '❌ Order was cancelled'}
                    </p>
                  )}

                  {isStaff && (
                    <div className="d-grid gap-2">
                      {order.order_status === 'pending' && (
                        <Button 
                          variant="info" 
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, 'preparing')}
                        >
                          Start Preparing
                        </Button>
                      )}
                      {order.order_status === 'preparing' && (
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, 'delivering')}
                        >
                          Out for Delivery
                        </Button>
                      )}
                      {order.order_status === 'delivering' && (
                        <Button 
                          variant="success" 
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, 'completed')}
                        >
                          Mark Complete
                        </Button>
                      )}
                      {(order.order_status === 'completed' || order.order_status === 'cancelled') && (
                        <Badge bg="secondary">No Actions Available</Badge>
                      )}
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}

export default Status;