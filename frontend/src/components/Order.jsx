import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function Order({orderItems, setOrderItems}) {
    const [menuItems, setMenuItems] = useState([]);

  
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:3000/menu'); // Adjust the URL as needed
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

const addToOrder = (id, maxQuantity) => {
    setOrderItems(prev => {
        const existing = prev.find(item => item.id === id);
        
        // New item
        if (!existing) {
            return [...prev, { id, item_name: menuItems.find(item => item.id === id)?.item_name || '', quantity: 1 }];
        }
        
        // Max quantity reached
        if (existing.quantity >= maxQuantity) {
            console.log('Max quantity reached');
            return prev;
        }
        
        // Increment quantity
        return prev.map(item => 
            item.id === id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
        );
    });
};

const removeFromOrder = (id) => {
    setOrderItems(prev => {
        const existing = prev.find(item => item.id === id);
        
        if (!existing) return prev;
        
        if (existing.quantity === 1) {
            return prev.filter(item => item.id !== id);
        }
        
        return prev.map(item => 
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
    });
};

    
  return (
    <Container>
      <Row>
        {menuItems.map((item) => (
          <Col key={item.id} sm={12} md={6} lg={3}>
            <Card className="mt-3">
              <Card.Body>
                <Card.Title>{item.item_name}</Card.Title>
                <Card.Text>Price: {item.price}</Card.Text>
                <InputGroup size="sm" className="mb-3" style={{ width: "120px" }}>
                <Button
                  variant="primary"
                  onClick={() => addToOrder(item.id, item.quantity)}
                  disabled={orderItems.find(orderItem => orderItem.id === item.id)?.quantity >= item.quantity}
                >
                  +
                </Button>
                
                <Form.Control
                  type="text" 
                  readOnly
                  min={0}
                  value={orderItems.find(orderItem => orderItem.id === item.id)?.quantity || 0}
                  style={{ textAlign: "center" }}
                />

                <Button
                  variant="primary"
                  onClick={() => removeFromOrder(item.id)}
                  disabled={!orderItems.find(orderItem => orderItem.id === item.id)}
                >
                  -
                </Button>
              </InputGroup>
              </Card.Body>
            </Card>
          </Col>          
        ))}
      </Row>
      {orderItems.length > 0 && <Button
      variant="primary"
      style={{
        position: "fixed",
        bottom: "20px",
        zIndex: 9999,
        padding: "15px 25px",
        borderRadius: "6px",
        fontSize: "22px",
        boxShadow: "0 4px 4px rgba(0,0,0,0.3)",
        width: "80%",
      }}
      as={Link} to="/cart"
      >
        Cart
      </Button>}
    </Container>
  );
}

export default Order;