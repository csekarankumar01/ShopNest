import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  // Clear cart just in case it wasn't cleared
  useEffect(() => {
    localStorage.removeItem('cartItems');
  }, []);

  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="order-success-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '20px' }}>
      <div className="order-success-card" style={{
        background: 'linear-gradient(145deg, #18181b 0%, #09090b 100%)',
        padding: '50px 40px',
        borderRadius: '24px',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 40px rgba(16, 185, 129, 0.1)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
        animation: 'fadeInUp 0.6s ease-out'
      }}>
        
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h2 style={{ fontSize: '2.2rem', marginBottom: '10px', color: '#fff', fontWeight: '700' }}>Payment Successful!</h2>
        <p style={{ color: '#10b981', fontSize: '1.1rem', marginBottom: '25px', fontWeight: '500' }}>Transaction Completed</p>
        
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
          <p style={{ color: '#a1a1aa', fontSize: '1rem', marginBottom: '10px', lineHeight: '1.6' }}>
            Thank you for your purchase. Your order has been securely processed and is now being prepared for shipment.
          </p>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '15px 0' }}></div>
          <p style={{ color: '#e4e4e7', fontSize: '0.95rem' }}>
            Order ID: <strong style={{ color: '#fff', letterSpacing: '1px' }}>{orderId}</strong>
          </p>
        </div>

        <Link to="/shop" style={{
          display: 'inline-block',
          background: 'linear-gradient(90deg, #f97316 0%, #ea580c 100%)',
          color: '#fff',
          padding: '14px 32px',
          borderRadius: '50px',
          fontWeight: '600',
          textDecoration: 'none',
          fontSize: '1.1rem',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)'
        }}
        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Continue Shopping
        </Link>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;
