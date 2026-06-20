const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    try {
        const emailUser = process.env.EMAIL_USER || 'homelanderislive@gmail.com';
        const emailPass = process.env.EMAIL_PASS || 'qkohsedvopeaeisq';

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // TLS
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        });

        const mailOptions = {
            from: emailUser,
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;