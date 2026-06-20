const axios = require('axios');

// Sends an email using a Google Apps Script relay to bypass hosting SMTP restrictions
const sendEmail = async (to, subject, text) => {
    try {
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbx7qx8LWONy3rm9LDEHjrkqCJNVJle1QQYvo-OZZQO2_XacFq5vWHVGFtTgrzrmeWZzqQ/exec';
        
        await axios.post(scriptUrl, { to, subject, text });
        console.log('Email sent successfully via Google Relay');
    } catch (error) {
        console.error('Critical Error sending email via Google Relay:', error.message);
    }
};

module.exports = sendEmail;