import db from '../../firebase';
import firebase from 'firebase';
import shortUUID from 'short-uuid';
import { ArrowLeftIcon } from '@heroicons/react/solid';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const Payment = ({
  setPayment,
  name,
  email,
  shippingAddress,
  cartlist,
  total,
}) => {
  const router = useRouter();
  const [note, setNote] = useState('');
  const [warn, setWarn] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const createCheckoutSession = async () => {
    if (cartlist.length === 0) {
      return setWarn('You have no item in the cart!');
    }
    const generate = () => {
      var d = new Date();
      return String(d.valueOf());
    };
    const tran_id = generate();
    if (paymentMethod) {
      db.collection('orders')
        .doc(tran_id)
        .set({
          name,
          email,
          shippingAddress,
          total,
          cartlist,
          note,
          paymentStatus: paymentMethod === 'Digital' ? 'Processing' : 'COD',
          status: 'Pending',
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });

      cartlist.map(({ id }) => {
        db.collection('users').doc(email).collection('cart').doc(id).delete();
      });

      if (paymentMethod === 'Digital') {
        const checkoutSession = await axios.post('/api/create-ssl-session', {
          name,
          email,
          tran_id,
          shippingAddress,
          total,
        });
        if (checkoutSession.data.session.status === 'SUCCESS') {
          router.push(checkoutSession.data.session.GatewayPageURL);
        }
      } else {
        axios.post('/api/orderMail', {
          name,
          email,
        });
        router.push('/success');
      }
    } else {
      setWarn('Please sellect a payment method.');
    }
  };

  useEffect(() => {
    if (paymentMethod) {
      setWarn('');
    }
  }, [paymentMethod]);
  return (
    <div>
      <div className='space-y-4 mr-6'>
        <div
          className={`p-6 ring-2 ring-gray-300 rounded-3xl ${
            shippingAddress.shipping === 'Inside Dhaka' &&
            'hover:ring-zakvan_red-dark cursor-pointer'
          } transition duration-200 ${
            shippingAddress.shipping === 'Inside Dhaka' &&
            paymentMethod === 'COD' &&
            'ring-zakvan_red-dark'
          } ${shippingAddress.shipping === 'Outside Dhaka' && 'bg-gray-200'}`}
          onClick={() =>
            shippingAddress.shipping === 'Inside Dhaka' &&
            setPaymentMethod('COD')
          }
        >
          <h4 className='text-lg font-semibold'>Cash on Delivery (COD)</h4>
          <p>Cash On Delivery is only active inside Dhaka.</p>
        </div>
        <div
          className={`p-6 ring-2 ring-gray-300 rounded-3xl cursor-pointer hover:ring-zakvan_red-dark transition duration-200 ${
            paymentMethod === 'Digital' && 'ring-zakvan_red-dark'
          }`}
          onClick={() => setPaymentMethod('Digital')}
        >
          <h4 className='text-lg font-semibold'>Digital payment</h4>
          <p>
            After clicking “Complete order”, you will be redirected to
            SSLCOMMERZ to complete your purchase securely.
          </p>
        </div>
        <div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            type='text'
            name='note'
            id='note'
            rows='4'
            placeholder='Add a note to your order'
            className='mt-1 py-3 px-4 ring-1 ring-gray-300 transition duration-300 focus:ring-zakvan_red-dark focus:border-zakvan_red-dark block w-full shadow-sm sm:text-sm border-gray-300 rounded-3xl'
          />
        </div>
      </div>
      <div className='mt-10 text-right sm:pr-6 flex items-center justify-between'>
        <div
          className='link hover:text-zakvan_red-dark text-lg font-medium flex items-center'
          onClick={() => setPayment(false)}
        >
          <ArrowLeftIcon className='h-6 mr-1' /> Go back
        </div>
        <button
          onClick={createCheckoutSession}
          className={`button border bg-white text-zakvan_red-dark border-zakvan_red-dark hover:bg-white ${
            paymentMethod && 'bg-zakvan_red-dark text-gray-50'
          }`}
        >
          Complete order
        </button>
      </div>
      <p className='text-yellow-500 text-right sm:pr-6 mt-3'>{warn}</p>
    </div>
  );
};

export default Payment;
