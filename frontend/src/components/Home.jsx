import { useState } from 'react';
import { Container, Carousel, Card, Row, Col, Badge } from 'react-bootstrap';

function Home() {
  const [promotions] = useState([
    {
      id: 1,
      type: 'percentage',
      amount: 20,
      title: '20% Off All Drinks!',
      description: 'Enjoy a refreshing discount on all beverages',
      end_date: '2024-12-31',
      image: 'https://via.placeholder.com/800x400/4299e1/ffffff?text=20%25+OFF+DRINKS'
    },
    {
      id: 2,
      type: 'bogo',
      title: 'Buy 2 Get 1 Free!',
      description: 'Order 2 items and get the 3rd one absolutely free',
      end_date: '2024-12-25',
      image: 'https://via.placeholder.com/800x400/48bb78/ffffff?text=BOGO+SPECIAL'
    },
    {
      id: 3,
      type: 'fixed',
      amount: 5,
      title: '$5 Off Your Order',
      description: 'Save $5 on orders above $20',
      end_date: '2024-12-20',
      image: 'https://via.placeholder.com/800x400/ed8936/ffffff?text=$5+OFF'
    }
  ]);

  const [stats] = useState({
    totalOrders: 1247,
    activePromotions: 3,
    loyaltyPoints: 450
  });

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Welcome to Our Restaurant</h1>

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h2 className="text-primary">{stats.totalOrders}</h2>
              <Card.Text className="text-muted">Total Orders</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h2 className="text-success">{stats.activePromotions}</h2>
              <Card.Text className="text-muted">Active Promotions</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h2 className="text-warning">{stats.loyaltyPoints}</h2>
              <Card.Text className="text-muted">Your Loyalty Points</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Featured Promotions */}
      <h3 className="mb-3">Current Promotions</h3>
      <Row>
        {promotions.map(promo => (
          <Col md={4} key={promo.id} className="mb-3">
            <Card>
              <Card.Body>
                <Badge bg="info" className="mb-2">{promo.type.toUpperCase()}</Badge>
                <Card.Title>{promo.title}</Card.Title>
                <Card.Text>{promo.description}</Card.Text>
                <small className="text-muted">Expires: {promo.end_date}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Home;