import * as admin from 'firebase-admin';

export default async (req, res) => {
  const { tran_id } = req.body;

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
    .delete()
    .then(() => {
      console.log(`SUCCESS: Order ${tran_id} had been removed from the DB`);
    });
  res.status(301).redirect('/cart');
};
