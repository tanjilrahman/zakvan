import path from 'path';

const nodemailer = require('nodemailer');

export default async (req, res) => {
  const { name, email } = req.body;

  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    secure: process.env.SECURE_TRANSPORTER, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  transporter.use();

  const info = await transporter.sendMail({
    from: `"Zakvan Dacca" <${process.env.EMAIL_SERVER_USER}>`, // sender address
    to: email, // list of receivers
    subject: 'Zakvan order confirmation', // Subject line
    html: { path: path.join(__dirname, '../../../../public/orderMail.html') }, // html body
  });

  res.status(200).json({
    message: `Message sent: ${info.messageId}`,
  });
};
