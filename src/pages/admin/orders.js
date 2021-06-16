import { getSession, useSession } from 'next-auth/client';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import db from '../../../firebase';
import AdminOrder from '../../components/AdminOrder';

const Orders = ({ orders }) => {
  const router = useRouter();
  const [session, loading] = useSession();
  const parsedOrders = session ? JSON.parse(orders) : [];
  const [admins] = useState([
    'tanjil.rahman10@gmail.com',
    'tanjil.rahman2020@gmail.com',
  ]);

  if (typeof window !== 'undefined' && loading)
    return (
      <div className='max-w-screen-2xl mx-auto text-gray-700'>
        <div className='lg:flex justify-between items-center mt-4 sm:mt-12 sm:mb-20 mx-5 sm:mx-0'>
          <div className='hidden sm:block space-y-7 w-1/3 text-left '>
            <h4 className='text-4xl font-semibold mb-2'>Access Denied!</h4>
            <p className='text-2xl leading-relaxed'>
              You're not supposed to be here.
            </p>
            <div>
              <button
                className='button font-semibold text-2xl'
                onClick={() => router.push('/')}
              >
                Back where you came from
              </button>
            </div>
          </div>
          <div className='sm:w-[55%]'>
            <Image
              src='/undraw_access_denied_re_awnf.svg'
              alt='Access Denied'
              height={1500}
              width={2000}
              objectFit='contain'
            />
          </div>
          <div className='sm:hidden text-center space-y-4 mt-6'>
            <h4 className='text-lg leading-none text-zakvan_red-dark'>
              Access Denied!
            </h4>
            <p className='text-sm'>You're not supposed to be here.</p>
            <button className='button-alt' onClick={() => router.push('/')}>
              Back where you came from
            </button>
          </div>
        </div>
      </div>
    );

  if (!admins.includes(session?.user.email))
    return (
      <div className='max-w-screen-2xl mx-auto text-gray-700'>
        <div className='lg:flex justify-between items-center mt-4 sm:mt-12 sm:mb-20 mx-5 sm:mx-0'>
          <div className='hidden sm:block space-y-7 w-1/3 text-left '>
            <h4 className='text-4xl font-semibold mb-2'>Access Denied!</h4>
            <p className='text-2xl leading-relaxed'>
              You're not supposed to be here.
            </p>
            <div>
              <button
                className='button font-semibold text-2xl'
                onClick={() => router.push('/')}
              >
                Back where you came from
              </button>
            </div>
          </div>
          <div className='sm:w-[55%]'>
            <Image
              src='/undraw_access_denied_re_awnf.svg'
              alt='Access Denied'
              height={1500}
              width={2000}
              objectFit='contain'
            />
          </div>
          <div className='sm:hidden text-center space-y-4 mt-6'>
            <h4 className='text-lg leading-none text-zakvan_red-dark'>
              Access Denied!
            </h4>
            <p className='text-sm'>You're not supposed to be here.</p>
            <button className='button-alt' onClick={() => router.push('/')}>
              Back where you came from
            </button>
          </div>
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
