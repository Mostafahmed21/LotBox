import nodemailer from 'nodemailer';

export const sendEmail = async ({
    to = [],
    cc = [],
    bcc = [],
    subject = 'Auctions',
    text = '',
    html = '',
} = {}) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: `"Auctions " <${process.env.EMAIL}>`,
        to,
        cc,
        bcc,
        subject,
        text,
        html,
    });
    console.log('Message sent: %s', info.messageId);
};
