import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { State, City } from 'country-state-city';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';
import { apiUrl } from '../utils/api';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '', street: '', city: '', state: '', country: 'India'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedStateIso, setSelectedStateIso] = useState('');

  useEffect(() => {
    const indianStates = State.getStatesOfCountry('IN');
    setStates(indianStates);
  }, []);

  useEffect(() => {
    if (selectedStateIso) {
      const stateCities = City.getCitiesOfState('IN', selectedStateIso);
      setCities(stateCities);
    } else {
      setCities([]);
    }
  }, [selectedStateIso]);

  const handleStateChange = (e) => {
    const iso = e.target.value;
    setSelectedStateIso(iso);
    const stateName = states.find(s => s.isoCode === iso)?.name || '';
    setAddress({...address, state: stateName, city: ''});
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const orderItems = cartItems.map((item) => ({
    product: item.productId,
    name: item.name,
    price: item.price,
    quantity: item.qty,
  }));

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const orderRes = await fetch(apiUrl('/api/payments/order'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice })
      });
      
      let orderData;
      try {
        orderData = await orderRes.json();
      } catch (err) {
        setIsProcessing(false);
        return alert("Failed to read server response. The backend might be unreachable or returned invalid data.");
      }

      if (!orderRes.ok) {
        setIsProcessing(false);
        const fallback = window.confirm(`${orderData.message || 'Payment failed to initialize'}. Use test order mode instead?`);
        if (fallback) {
          return bypassPayment();
        } else {
          return alert("Payment failed to initialize");
        }
      }

      if (!window.Razorpay) {
        setIsProcessing(false);
        const fallback = window.confirm("Razorpay checkout script is unavailable. Use test order mode?");
        if (fallback) {
          return bypassPayment();
        }
        return alert("Payment failed to initialize");
      }

      if (!orderData.key) {
        setIsProcessing(false);
        const fallback = window.confirm("Razorpay key is missing from the backend response. Use test order mode instead?");
        if (fallback) {
          return bypassPayment();
        }
        return alert("Payment failed to initialize");
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ShopNest',
        description: 'Test Transaction',
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(apiUrl('/api/payments/verify'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response)
            });
            if (verifyRes.ok) {
              const saveOrderRes = await fetch(apiUrl('/api/orders'), {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({
                  items: orderItems,
                  totalAmount: totalPrice,
                  address,
                  paymentId: response.razorpay_payment_id
                })
              });

              if (saveOrderRes.ok) {
                dispatch(clearCart());
                window.location.href = '/ordersuccess';
              } else {
                setIsProcessing(false);
                alert('Order saving failed');
              }
            } else {
              setIsProcessing(false);
              alert('Payment verification failed');
            }
          } catch (err) {
            console.error(err);
            setIsProcessing(false);
            alert('Payment verification error');
          }
        },
        prefill: {
          name: address.fullName,
          email: user?.email,
          contact: '9999999999'
        },
        theme: {
          color: '#f97316'
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            console.log('Razorpay checkout closed');
          }
        }
      };
      
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        setIsProcessing(false);
        alert(response.error.description);
      });
      rzp1.open();
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      alert('Network or server error: ' + error.message);
    }
  };

  const bypassPayment = async () => {
    setIsProcessing(true);
    try {
      const saveOrderRes = await fetch(apiUrl('/api/orders'), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          items: orderItems,
          totalAmount: totalPrice,
          address,
          paymentId: 'bypass_txn_' + Date.now()
        })
      });
      if (saveOrderRes.ok) {
        dispatch(clearCart());
        window.location.href = '/ordersuccess';
      } else {
        setIsProcessing(false);
        alert('Order saving failed');
      }
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      alert('Network or server error: ' + error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first");
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      navigate('/shop');
      return;
    }
    handlePayment();
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="shipping-form">
          <h3>Shipping Address</h3>
          <input type="text" placeholder="Full Name" required value={address.fullName} onChange={(e) => setAddress({...address, fullName: e.target.value})} />
          <input type="text" placeholder="Street" required value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} />
          <select required value={selectedStateIso} onChange={handleStateChange}>
            <option value="">Select State</option>
            {states.map(state => (
              <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
            ))}
          </select>
          <select required value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} disabled={!selectedStateIso}>
            <option value="">Select City</option>
            {cities.map(city => (
              <option key={city.name} value={city.name}>{city.name}</option>
            ))}
          </select>
          <input type="text" placeholder="Country" required value="India" disabled style={{ opacity: 0.7 }} />
          <div className="checkout-summary">
            <h4>Total to Pay: ₹{totalPrice.toFixed(2)}</h4>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '15px' }}>
              <button type="button" className="btn" style={{ background: '#3f3f46' }} onClick={bypassPayment} disabled={isProcessing}>
                Bypass (Test)
              </button>
              <button type="submit" className="btn" disabled={isProcessing}>
                {isProcessing ? 'Processing Payment...' : 'Pay Now'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
