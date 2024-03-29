import { getSession, signIn, useSession } from 'next-auth/client';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import db from '../../firebase';
import Order from '../components/Order';

const Orders = ({ orders }) => {
  const router = useRouter();
  const [session] = useSession();

  const parsedOrders = session ? JSON.parse(orders) : [];

  if (parsedOrders.length === 0)
    return (
      <div className='max-w-screen-2xl mx-auto text-gray-700'>
        <div className='lg:flex justify-between items-center mt-4 sm:mt-12 sm:mb-20 mx-5 sm:mx-0'>
          <div className='hidden sm:block space-y-7 w-1/3 text-left '>
            <h4 className='text-4xl font-semibold mb-2'>No orders.</h4>
            <p className='text-2xl leading-relaxed'>
              You haven't ordered anything. Check out our amazing merchandises
              and order today!
            </p>
            <div>
              <button
                className='button font-semibold text-2xl'
                onClick={() => router.push('/')}
              >
                Go shopping
              </button>
            </div>
          </div>
          <div className='sm:w-[55%]'>
            <Image
              src='/undraw_empty_xct9.svg'
              alt='Access Denied'
              height={1500}
              width={2000}
              objectFit='contain'
            />
          </div>
          <div className='sm:hidden text-center space-y-4 mt-6'>
            <h4 className='text-lg leading-none text-zakvan_red-dark'>
              No orders.
            </h4>
            <p className='text-sm'>
              You haven't ordered anything. Check out our amazing merchandises
              and order today!
            </p>
            <button className='button-alt' onClick={() => router.push('/')}>
              Go shopping
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div>
      <Head>
        <title>Zakvan | Orders</title>
      </Head>
      <main className='max-w-screen-2xl mx-auto text-gray-700 sm:mt-4 pb-20 sm:pb-40 p-4 sm:p-0'>
        {session && (
          <h1 className='text-xl sm:text-4xl font-semibold pb-2'>Orders</h1>
        )}
        {session ? (
          <div>
            <div className='hidden sm:grid grid-cols-9 gap-8 py-4 border-b font-medium'>
              <p>Date</p>
              <p>Status</p>
              <p className='col-span-3'>Item(s)</p>
              <p>Payment</p>
              <p className='col-span-2'>Address</p>
              <p>Order Id</p>
            </div>
            <div className='space-y-4 sm:space-y-0'>
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
          <div className='lg:flex justify-between items-center mt-4 sm:mt-12 sm:mb-20 mx-5 sm:mx-0'>
            <div className='hidden sm:block space-y-7 w-1/3 text-left '>
              <h4 className='text-4xl font-semibold mb-2'>
                Please Login to view your orders.
              </h4>
              {/* <p className='text-2xl leading-relaxed'>
                It helps you keep track of your orders.
              </p> */}
              <div>
                <button
                  className='button font-semibold text-2xl'
                  onClick={signIn}
                >
                  Sign in or Sign up
                </button>
              </div>
            </div>
            <div className='sm:w-[55%]'>
              <Image
                src='/undraw_Login_re_4vu2.svg'
                alt='Please Login'
                height={1500}
                width={2000}
                objectFit='contain'
              />
            </div>
            <div className='sm:hidden text-center space-y-4 mt-6'>
              <h4 className='text-lg leading-none text-zakvan_red-dark'>
                Please Login to view your orders.
              </h4>
              {/* <p className='text-sm'>It helps you keep track of your orders.</p> */}
              <button className='button-alt' onClick={signIn}>
                Sign in or Sign up
              </button>
            </div>
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
