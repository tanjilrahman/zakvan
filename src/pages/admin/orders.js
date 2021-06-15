import { getSession, useSession } from 'next-auth/client';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import db from '../../../firebase';
import AdminOrder from '../../components/AdminOrder';

const Orders = ({ orders }) => {
  const [session, loading] = useSession();
  const parsedOrders = session ? JSON.parse(orders) : [];
  const [admins] = useState([
    'tanjil.rahman10@gmail.com',
    'tanjil.rahman2020@gmail.com',
  ]);

  if (typeof window !== 'undefined' && loading)
    return (
      <div className='flex p-4'>
        <div className='mx-auto mt-10'>
          <Image
            height={600}
            width={1000}
            src='/permission-denied.jpg'
            alt='permission-denied'
          />
        </div>
      </div>
    );

  if (!admins.includes(session?.user.email))
    return (
      <div className='flex p-4'>
        <div className='mx-auto mt-10'>
          <Image
            height={600}
            width={1000}
            src='/permission-denied.jpg'
            alt='permission-denied'
          />
        </div>
      </div>
    );
  return (
    <div>
      <Head>
        <title>Zakvan | Admin-Orders</title>
      </Head>
      <main className='max-w-screen-2xl mx-auto text-gray-700 mt-4 mb-40'>
        <h1 className='text-3xl font-bold border-b pb-4'>
          Admin | Orders | total: {parsedOrders.length}
        </h1>
        <div className='mt-8 space-y-6'>
          {parsedOrders.map((order) => (
            <AdminOrder
              key={order.tran_id}
              tran_id={order.tran_id}
              name={order.name}
              email={order.email}
              items={order.cartlist}
              note={order.note}
              total={order.total}
              paymentStatus={order.paymentStatus}
              status={order.status}
              shippingAddress={order.shippingAddress}
              timestamp={order.timestamp}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Orders;

export async function getServerSideProps(context) {
  // Get the users logged in credentials
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  }
  const data = await db.collection('orders').orderBy('timestamp', 'desc').get();

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
