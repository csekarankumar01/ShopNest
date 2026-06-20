import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiUrl } from '../utils/api';
import '../styles/auth.css';

const Register = () => {
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.requiresOtp) {
      setEmail(location.state.email);
      setStep(2);
    }
  }, [location]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetch(apiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      setIsProcessing(false);
      if (res.ok && data.requiresOtp) {
        alert(data.message);
        setStep(2);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetch(apiUrl('/api/auth/verify-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      setIsProcessing(false);
      if (res.ok) {
        alert('Email verified successfully!');
        login(data);
        navigate('/');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      {step === 1 ? (
        <form onSubmit={handleRegister} className="auth-form">
          <h2>Register</h2>
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn" disabled={isProcessing}>{isProcessing ? 'Registering...' : 'Register'}</button>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="auth-form">
          <h2>Verify Email</h2>
          <p style={{ color: '#a1a1aa', marginBottom: '15px' }}>Enter the 6-digit OTP sent to {email}</p>
          <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength="6" style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.2rem' }} />
          <button type="submit" className="btn" disabled={isProcessing}>{isProcessing ? 'Verifying...' : 'Verify & Login'}</button>
        </form>
      )}
    </div>
  );
};

export default Register;
