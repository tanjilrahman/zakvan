import * as admin from 'firebase-admin';
import path from 'path';
const nodemailer = require('nodemailer');

export default async (req, res) => {
  const { tran_id, status, value_a } = req.body;
  if (status !== 'VALID') return res.status(400).redirect('/cart');

  // Secure a connection to firebase from the backend
  const serviceAccount = require('../../../permissions.json');
  const app = !admin.apps.length
    ? admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      })
    : admin.app();

  app
    .firestore()
    .collection('orders')
    .doc(tran_id)
    .update({
      paymentStatus: 'Complete',
    })
    .then(() => {
      console.log(`SUCCESS: Order ${tran_id} had been added to the DB`);
    });

  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  transporter.sendMail({
    from: `"Zakvan Dacca" <${process.env.EMAIL_SERVER_USER}>`, // sender address
    to: value_a,
    subject: 'Zakvan order confirmation', // Subject line
    html: {
      path: path.join(__dirname, '../../../../public/paymentSuccessMail.html'),
    }, // html body
  });
  res.status(301).get('/success');
};
