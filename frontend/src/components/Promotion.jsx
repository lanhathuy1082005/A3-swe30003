import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Promotion() {
  const [promotions, setPromotions] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'percentage',
    amount: '',
    menu_id: '',
    min_quantity: '',
    free_quantity: '',
    start_date: '',
    end_date: '',
    active: true,
    is_global: true
  });

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch('http://localhost:3000/promotion');
        const data = await response.json();
        setPromotions(data);
      } catch (error) {
        console.error('Error fetching promotions:', error);
      }
    };

    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:3000/menu');
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchPromotions();
    fetchMenuItems();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = value;

    if (type === "checkbox") {
      newValue = checked;
    }

    // Force boolean for is_global
    if (name === "is_global") {
      newValue = value === "true";
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Build base promotion object
    const newPromotion = {
      type: formData.type,
      menu_id: (formData.is_global || !formData.menu_id) ? null : parseInt(formData.menu_id),
      start_date: formData.start_date,
      end_date: formData.end_date,
      active: formData.active
    };

    // Add fields based on type - NO null/undefined values
    if (formData.type === "percentage" || formData.type === "fixed") {
      newPromotion.amount = parseFloat(formData.amount);
    }

    if (formData.type === "bogo") {
      newPromotion.min_quantity = parseInt(formData.min_quantity);
      newPromotion.free_quantity = parseInt(formData.free_quantity);
    }

    try {
      const response = await fetch("http://localhost:3000/promotion", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newPromotion)
      });

      if (response.ok) {
        const data = await response.json();
        
        setPromotions([data.promotion, ...promotions]);
        
        setFormData({
          type: 'percentage',
          amount: '',
          menu_id: '',
          min_quantity: '',
          free_quantity: '',
          start_date: '',
          end_date: '',
          active: true,
          is_global: true
        });
        
        setShowForm(false);
        alert('Promotion created successfully!');
      } else {
        const error = await response.json();
        alert('Failed to create promotion: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating promotion:', error);
      alert('An error occurred while creating promotion');
    }
  };

  const toggleActive = async (id) => {
    const promo = promotions.find(p => p.id === id);
    try {
      const response = await fetch(`http://localhost:3000/promotion/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ active: !promo.active })
      });

      if (response.ok) {
        setPromotions(promotions.map(p => 
          p.id === id ? { ...p, active: !p.active } : p
        ));
      }
    } catch (error) {
      console.error('Error toggling promotion:', error);
    }
  };

  const deletePromotion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this promotion?')) return;
    
    try {
      const response = await fetch(`http://localhost:3000/promotion/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setPromotions(promotions.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
  };

  const getMenuItemName = (menuId) => {
    const item = menuItems.find(m => m.id === menuId);
    return item ? item.item_name : `Item #${menuId}`;
  };

  return (
    <Container className="mt-4">
      <Button 
        variant="outline-secondary" 
        as={Link} 
        to="/" 
        className="mb-3"
      >
        ← Back to Home
      </Button>

      <Row className="mb-4">
        <Col><h1>Promotion Management</h1></Col>
        <Col xs="auto">
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Create Promotion'}
          </Button>
        </Col>
      </Row>

      {showForm && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Create New Promotion</Card.Title>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Promotion Type</Form.Label>
                    <Form.Select name="type" value={formData.type} onChange={handleChange}>
                      <option value="percentage">Percentage Discount</option>
                      <option value="fixed">Fixed Amount Discount</option>
                      <option value="bogo">BOGO</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Scope</Form.Label>
                    <Form.Select 
                      name="is_global" 
                      value={String(formData.is_global)}
                      onChange={handleChange}
                    >
                      <option value="true">Global (All Items)</option>
                      <option value="false">Specific Item</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* Show menu item selector if not global */}
                {!formData.is_global && (
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Select Menu Item</Form.Label>
                      <Form.Select 
                        name="menu_id" 
                        value={formData.menu_id} 
                        onChange={handleChange}
                        required
                      >
                        <option value="">Choose an item...</option>
                        {menuItems.map(item => (
                          <option key={item.id} value={item.id}>
                            {item.item_name} - ${item.price}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                )}

                {(formData.type === 'percentage' || formData.type === 'fixed') && (
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>{formData.type === 'percentage' ? 'Discount %' : 'Amount $'}</Form.Label>
                      <Form.Control 
                        type="number" 
                        name="amount" 
                        value={formData.amount} 
                        onChange={handleChange}
                        step="0.01"
                        required
                      />
                    </Form.Group>
                  </Col>
                )}

                {formData.type === 'bogo' && (
                  <>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Min Quantity to Buy</Form.Label>
                        <Form.Control 
                          type="number" 
                          name="min_quantity" 
                          value={formData.min_quantity} 
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Free Quantity</Form.Label>
                        <Form.Control 
                          type="number" 
                          name="free_quantity" 
                          value={formData.free_quantity} 
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </>
                )}

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control 
                      type="date" 
                      name="start_date" 
                      value={formData.start_date} 
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control 
                      type="date" 
                      name="end_date" 
                      value={formData.end_date} 
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Check 
                    type="checkbox" 
                    name="active" 
                    label="Active" 
                    checked={formData.active} 
                    onChange={handleChange} 
                  />
                </Col>
              </Row>
              <Button variant="success" type="submit">Create Promotion</Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      <Card>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Type</th>
                <th>Scope</th>
                <th>Details</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {promotions.length === 0 ? (
                <tr><td colSpan="6" className="text-center">No promotions yet</td></tr>
              ) : (
                promotions.map(p => (
                  <tr key={p.id}>
                    <td><Badge bg="primary">{p.type.toUpperCase()}</Badge></td>
                    <td>
                      {p.menu_id ? (
                        <Badge bg="info">{getMenuItemName(p.menu_id)}</Badge>
                      ) : (
                        <Badge bg="secondary">Global</Badge>
                      )}
                    </td>
                    <td>
                      {p.type === 'percentage' && `${p.amount}% off`}
                      {p.type === 'fixed' && `$${p.amount} off`}
                      {p.type === 'bogo' && `Buy ${p.min_quantity} Get ${p.free_quantity} free`}
                    </td>
                    <td className="text-muted small">
                      {new Date(p.start_date).toLocaleDateString()} - {new Date(p.end_date).toLocaleDateString()}
                    </td>
                    <td><Badge bg={p.active ? 'success' : 'danger'}>{p.active ? 'Active' : 'Inactive'}</Badge></td>
                    <td>
                      <Button 
                        size="sm" 
                        variant="link" 
                        onClick={() => toggleActive(p.id)}
                      >
                        {p.active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="link" 
                        className="text-danger" 
                        onClick={() => deletePromotion(p.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Promotion;