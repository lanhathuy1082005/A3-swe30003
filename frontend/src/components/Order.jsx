import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function Order({user, orderItems, setOrderItems, setWarningCounter}) {
    const [menuItems, setMenuItems] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [newItemName, setNewItemName] = useState('');
    const [newPrice, setNewPrice] = useState(null);
    const [newQuantity, setNewQuantity] = useState(null);
    const [loadingItems, setLoadingItems] = useState(new Set());
    const [isModalLoading, setIsModalLoading] = useState(false);
    const LOW_STOCK_THRESHOLD = 5;

  
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:3000/menu');
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (user.permissions && user.permissions.includes("edit_menu")) {
      const lowStockCount = menuItems.filter(item => item.quantity <= LOW_STOCK_THRESHOLD).length;
      setWarningCounter(lowStockCount);
      console.log('Warning counter updated:', lowStockCount);
    }
  }, [menuItems, user.permissions, setWarningCounter]);

  const addToOrder = (id, maxQuantity) => {
    console.log('addToOrder called:', id, maxQuantity);
    setOrderItems(prev => {
        const existing = prev.find(item => item.id === id);
        
        if (!existing) {
            const newItem = { 
              id, 
              item_name: menuItems.find(item => item.id === id)?.item_name || '', 
              price: menuItems.find(item => item.id === id)?.price || '',
              quantity: 1 
            };
            console.log('Adding new item:', newItem);
            return [...prev, newItem];
        }
        
        if (existing.quantity >= maxQuantity) {
            console.log('Max quantity reached for item:', id);
            return prev;
        }
        
        console.log('Incrementing quantity for item:', id);
        return prev.map(item => 
            item.id === id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
        );
    });
  };

  const removeFromOrder = (id) => {
    console.log('removeFromOrder called:', id);
    setOrderItems(prev => {
        const existing = prev.find(item => item.id === id);
        
        if (!existing) return prev;
        
        if (existing.quantity === 1) {
            console.log('Removing item completely:', id);
            return prev.filter(item => item.id !== id);
        }
        
        console.log('Decrementing quantity for item:', id);
        return prev.map(item => 
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
    });
  };

  const handleEditClick = (item) => {
    console.log('Edit clicked for item:', item);
    setEditingItem(item);
    setNewItemName(item.item_name);
    setNewPrice(parseFloat(item.price));
    setNewQuantity(parseInt(item.quantity));
    setShowEdit(true);
  };

  const handleEditClose = () => {
    setShowEdit(false);
    setEditingItem(null);
    setNewItemName('');
    setNewPrice(null);
    setNewQuantity(null);
  };

  const handleAddClose = () => {
    setShowAdd(false);
    setNewItemName('');
    setNewPrice(null);
    setNewQuantity(null);
  };

  const updateItem = async () => {
    if (isModalLoading || !editingItem) return;
    setIsModalLoading(true);
    console.log('Updating item:', editingItem.id);
    try {
      const response = await fetch(`http://localhost:3000/menu/update/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          item_name: newItemName,
          price: newPrice,
          quantity: newQuantity
        }),
      });

      if (response.ok) {
        console.log('Item updated successfully');
        const updatedResponse = await fetch('http://localhost:3000/menu');
        const updatedData = await updatedResponse.json();
        setMenuItems(updatedData);
        setShowEdit(false);
        setEditingItem(null);
      } else {
        console.error('Update failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setIsModalLoading(false);
    }
  };

  const addItem = async () => {
    if (isModalLoading) return;
    setIsModalLoading(true);
    console.log('Adding new item:', { newItemName, newPrice, newQuantity });
    try {
      const response = await fetch('http://localhost:3000/menu/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          item_name: newItemName,
          price: newPrice,
          quantity: newQuantity
        }),
      });

      if (response.ok) {
        console.log('Item added successfully');
        const updatedResponse = await fetch('http://localhost:3000/menu');
        const updatedData = await updatedResponse.json();
        setMenuItems(updatedData);
        setShowAdd(false);
        setNewItemName('');
        setNewPrice(null);
        setNewQuantity(null);
      } else {
        console.error('Add failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setIsModalLoading(false);
    }
  };

  const removeItem = async (id) => {
    if (loadingItems.has(id)) return;
    
    if (!window.confirm('Are you sure you want to remove this item from the menu?')) {
      return;
    }
    
    setLoadingItems(prev => new Set([...prev, id]));
    console.log('Removing item:', id);
    try {
      const response = await fetch(`http://localhost:3000/menu/remove/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Item removed successfully');
        const updatedResponse = await fetch('http://localhost:3000/menu');
        const updatedData = await updatedResponse.json();
        setMenuItems(updatedData);
        alert('Item removed successfully!');
      } else {
        const errorData = await response.json();
        console.error('Remove failed with status:', response.status);
        alert(errorData.message || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Error removing item. Please try again.');
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  return (
    <Container>
      <Row>

      {/* Add Item Modal */}
      <Modal show={showAdd} onHide={handleAddClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a new item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Item name:</Form.Label>
              <Form.Control
                type="text"
                placeholder='Enter a new item name'
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price:</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="Enter a new price"
                value={newPrice === null ? '' : newPrice}
                onChange={e => {
                  const value = e.target.value;
                  setNewPrice(value === '' ? null : parseFloat(value));
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity:</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter a new quantity"
                value={newQuantity || ''}
                onChange={e => setNewQuantity(parseInt(e.target.value))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="primary" 
            onClick={addItem} 
            disabled={isModalLoading || !newItemName || newPrice === null || newQuantity === null}
          >
            {isModalLoading ? 'Adding...' : 'Add Item'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Item Modal */}
      <Modal show={showEdit} onHide={handleEditClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit item {editingItem?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Item name:</Form.Label>
              <Form.Control
                type="text"
                placeholder='Enter a new item name'
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price:</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="Enter a new price"
                value={newPrice === null ? '' : newPrice}
                onChange={e => {
                  const value = e.target.value;
                  setNewPrice(value === '' ? null : parseFloat(value));
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity:</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter a new quantity"
                value={newQuantity || ''}
                onChange={e => setNewQuantity(parseInt(e.target.value))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="primary" 
            onClick={updateItem} 
            disabled={isModalLoading || !editingItem || !newItemName || newPrice === null || newQuantity === null}
          >
            {isModalLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Customer View - Purchase Items */}
      {user.permissions && user.permissions.includes("purchase_items") && menuItems.map((item) => (
        <Col key={item.id} sm={12} md={6} lg={3}>
          <Card className="mt-3">
            <Card.Body>
              <Card.Title>{item.item_name}</Card.Title>
              <Card.Text>Price: ${item.price}</Card.Text>
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

      {/* Staff View - Edit Menu */}
      {user.permissions && user.permissions.includes("edit_menu") && (
        <>
          {menuItems.map((item) => (
            <Col key={item.id} sm={12} md={6} lg={3}>
              <Card 
                className="mt-3" 
                style={{height:"150px"}}
              >
                <Card.Body>
                  <Card.Title>{item.item_name}</Card.Title>
                  <Card.Text className="mt-0 mb-0">Price: ${item.price}</Card.Text>
                  <Card.Text className="mt-0 mb-1">
                    Available stock: {item.quantity}
                    {item.quantity <= LOW_STOCK_THRESHOLD && " ⚠️"}
                  </Card.Text>
                  <Button 
                    className='me-2' 
                    size="sm" 
                    onClick={() => handleEditClick(item)} 
                    disabled={loadingItems.has(item.id)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="danger" 
                    onClick={() => removeItem(item.id)} 
                    disabled={loadingItems.has(item.id)}
                  >
                    {loadingItems.has(item.id) ? 'Removing...' : 'Remove'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
          
          {/* Add New Item Card */}
          <Col sm={12} md={6} lg={3}>
            <Card
              className="mt-3 d-flex justify-content-center align-items-center text-center"
              style={{
                height: "150px",
                backgroundColor: "#f0f0f0",
                border: "2px dashed #ccc",
                color: "#555",
                fontSize: "3rem",
                cursor: "pointer",
              }}
              onClick={() => setShowAdd(true)}
            >
              <Card.Body className="d-flex justify-content-center align-items-center p-0">
                <Card.Text className="m-0">+</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </>
      )}

      </Row>
      
      {/* Cart Button */}
      {user.permissions && user.permissions.includes("purchase_items") && orderItems.length > 0 && (
        <Button
          variant="primary"
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            padding: "15px 25px",
            borderRadius: "6px",
            fontSize: "22px",
            boxShadow: "0 4px 4px rgba(0,0,0,0.3)",
            width: "80%",
            maxWidth: "500px",
          }}
          as={Link} 
          to="/cart"
        >
          Cart ({orderItems.length} items)
        </Button>
      )}
    </Container>
  );
}

export default Order;