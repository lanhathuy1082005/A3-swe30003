import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/esm/Container';
import Card from 'react-bootstrap/Card';  
function Cart({orderItems, setOrderItems}) {

const confirmCheckout = async () => {
  try {
    setOrderItems([]);
    const response = await fetch('http://localhost:3000/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customer_id: 1, items: orderItems, payment_method: 'card' }),
    });

    const data = await response.json(); 
    if (response.ok) {   
    console.log("Checkout success:", data.message);
    } else {
    console.error("Checkout failed:", data.message);
    }

  } catch (error) {
    console.error("Error during checkout:", error);
  }
};

    return (
      <>
    <Container>
      <h2>Your Cart</h2>
        {orderItems.map((item) => (<Card>
          <Card.Body key={item.id}>
            <Card.Title>Item Name: {item.item_name}</Card.Title>
            <Card.Text>Quantity: {item.quantity}</Card.Text>
          </Card.Body>
        </Card>))}  
        {orderItems.length > 0 ? (<Button
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
        as={Link} to="/"
        onClick={()=> confirmCheckout()}
        >
            Confirm
        </Button>) : <p>Your cart is empty. Refreshing the page causes data loss</p>}
    </Container>
    </>
  );
}

export default Cart;