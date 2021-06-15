import { getSession, useSession } from 'next-auth/client';
import Head from 'next/head';
import db from '../../firebase';
import Order from '../components/Order';

const Orders = ({ orders }) => {
  const [session] = useSession();

  const parsedOrders = session ? JSON.parse(orders) : [];

  return (
    <div>
      <Head>
        <title>Zakvan | Orders</title>
      </Head>
      <main className='max-w-screen-2xl mx-auto text-gray-700 mt-4 pb-40'>
        <h1 className='text-3xl font-bold border-b pb-4'>Orders</h1>
        {session ? (
          <div>
            <div className='grid grid-cols-9 gap-8 py-4 border-b font-medium'>
              <p>Date</p>
              <p>Status</p>
              <p className='col-span-3'>Item(s)</p>
              <p>Payment</p>
              <p className='col-span-2'>Address</p>
              <p>Order Id</p>
            </div>
            <div>
              {parsedOrders?.map((order) => (
                <Order
                  key={order.tran_id}
                  tran_id={order.tran_id}
                  items={order.cartlist}
                  total={order.total}
                  paymentStatus={order.paymentStatus}
                  status={order.status}
                  shippingAddress={order.shippingAddress}
                  timestamp={order.timestamp}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h4>Log in to view the orders.</h4>
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;

export async function getServerSideProps(context) {
  // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  // Get the users logged in credentials
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  }

  const data = await db
    .collection('orders')
    .orderBy('timestamp', 'desc')
    .where('email', '==', session.user.email)
    .get();

  const orders = data.docs.map((doc) => ({
    tran_id: doc.id,
    ...doc.data(),
  }));
  return {
    props: {
      orders: JSON.stringify(orders),
      session,
    },
  };
}
