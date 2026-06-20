const { Resend } = require('resend');

const resend = new Resend('re_as5pw2Kv_5sVnjjm1sHDkXjBogMkyXTa6');

const sendEmail = async (to, subject, text) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'ShopNest <onboarding@resend.dev>',
            to: [to],
            subject: subject,
            text: text,
        });

        if (error) {
            console.error('Resend API Error (Are you sending to your verified email?):', error);
            return;
        }

        console.log('Email sent successfully via Resend API! ID:', data.id);
    } catch (error) {
        console.error('Critical Error sending email via Resend:', error);
    }
};

module.exports = sendEmail;