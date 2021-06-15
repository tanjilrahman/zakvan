import { signIn, useSession } from 'next-auth/client';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import db from '../../firebase';
import { selectCartItems } from '../slices/cartSlice';
import { useSelector } from 'react-redux';
import CartProduct from '../components/CartProduct';

const Cart = () => {
  const router = useRouter();
  const [session] = useSession();

  const [cartlist, setCartlist] = useState([]);

  const localCart = useSelector(selectCartItems);

  useEffect(() => {
    if (session) {
      setCartlist([]);
      const cart = db
        .collection('users')
        .doc(session?.user.email)
        .collection('cart')
        .onSnapshot((snapshot) => {
          const cart = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCartlist(cart);
        });
      return () => cart();
    } else {
      setCartlist(localCart);
    }
  }, [session, localCart]);

  return (
    <main className='max-w-screen-2xl mx-auto text-gray-700 mt-4'>
      <h1 className='text-3xl font-bold border-b pb-6'>Your Shopping Cart</h1>
      <div className='flex flex-col space-y-10 bg-white mt-8'>
        {cartlist?.length === 0 && (
          <div className='lg:flex items-center'>
            <div className='flex-grow'>
              <Image
                src='/No Item.svg'
                height={500}
                width={1000}
                objectFit='cover'
              />
            </div>

            <div className='p-10 bg-gray-100 rounded-3xl flex flex-col h-64 w-1/3'>
              <h4 className='text-xl font-bold mb-2'>
                Your cart feels lonely.
              </h4>
              <p className='flex-grow'>
                Your shopping cart lives to serve. Give it purpose - fill it
                with amazing merchandises. and make it happy.
              </p>
              <button className='button' onClick={() => router.push('/')}>
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        <div className='lg:flex items-center'>
          <div>
            {cartlist?.map((item) => (
              <CartProduct
                key={item.id}
                id={item.id}
                prodId={item.prodId}
                title={item.title}
                price={item.price}
                quantity={item.quantity}
                selectedColor={item.selectedColor}
                selectedSize={item.selectedSize}
                category={item.category}
                images={item.images}
              />
            ))}
          </div>

          {cartlist?.length > 0 && (
            <div className='p-10 bg-gray-100 rounded-3xl flex flex-col h-64 w-1/3'>
              <p className='whitespace-nowrap text-2xl'>
                Subtotal ({cartlist?.length} items):{' '}
                <span className='font-bold'>
                  {cartlist?.reduce(
                    (total, item) => total + Number(item.price * item.quantity),
                    0
                  )}{' '}
                  BDT
                </span>
              </p>
              <p className='flex-grow'>
                Your shopping cart lives to serve. Give it purpose - fill it
                with amazing merchandises. and make it happy.
              </p>
              <button
                role='link'
                onClick={session ? () => router.push('/checkout') : signIn}
                className='button mt-2 border border-zakvan_red-dark'
              >
                {!session ? 'Sign in to checkout' : 'Checkout'}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Cart;
