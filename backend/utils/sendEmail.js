const sendEmail = async (to, subject, text) => {
    try {
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbx7qx8LWONy3rm9LDEHjrkqCJNVJle1QQYvo-OZZQO2_XacFq5vWHVGFtTgrzrmeWZzqQ/exec';
        
        const response = await fetch(scriptUrl, {
            method: 'POST',
            body: JSON.stringify({ to, subject, text })
        });
        
        const result = await response.text();
        console.log('Google Apps Script response:', result);
    } catch (error) {
        console.error('Critical Error sending email via Google Relay:', error);
    }
};

module.exports = sendEmail;